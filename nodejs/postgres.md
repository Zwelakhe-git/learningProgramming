# for interacting with postgresql

```js
// Компактный клиент PostgreSQL на встроенных модулях Node.js (протокол v3).
// Поддерживает: SCRAM-SHA-256 / MD5 / пароль, TLS (sslmode), параметризованные запросы, пул соединений.
import net from 'node:net';
import tls from 'node:tls';
import crypto from 'node:crypto';

export class PgError extends Error {
  constructor(fields) {
    super(fields.M || 'PostgreSQL error');
    this.code = fields.C;
    this.detail = fields.D;
    this.severity = fields.S;
  }
}

export function parseUrl(url) {
  const u = new URL(url);
  return {
    host: decodeURIComponent(u.hostname),
    port: Number(u.port || 5432),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: decodeURIComponent(u.pathname.slice(1)) || decodeURIComponent(u.username),
    sslmode: u.searchParams.get('sslmode') || 'prefer',
  };
}

// ---------------------------------------------------------------- кодирование сообщений

function cstr(s) { return Buffer.concat([Buffer.from(s, 'utf8'), Buffer.from([0])]); }
function int16(n) { const b = Buffer.alloc(2); b.writeInt16BE(n); return b; }
function int32(n) { const b = Buffer.alloc(4); b.writeInt32BE(n); return b; }

function message(type, ...parts) {
  const body = Buffer.concat(parts);
  return Buffer.concat([Buffer.from(type, 'ascii'), int32(body.length + 4), body]);
}

function encodeParam(v) {
  if (v === null || v === undefined) return null;
  if (Buffer.isBuffer(v)) return Buffer.from('\\x' + v.toString('hex'), 'utf8');
  if (typeof v === 'boolean') return Buffer.from(v ? 'true' : 'false');
  if (typeof v === 'object') return Buffer.from(JSON.stringify(v), 'utf8');
  return Buffer.from(String(v), 'utf8');
}

const NUMERIC_OIDS = new Set([20, 21, 23, 26, 700, 701, 1700]);
function decodeValue(oid, buf) {
  if (buf === null) return null;
  const s = buf.toString('utf8');
  if (NUMERIC_OIDS.has(oid)) return Number(s);
  if (oid === 16) return s === 't';
  if (oid === 17) return s.startsWith('\\x') ? Buffer.from(s.slice(2), 'hex') : buf;
  if (oid === 114 || oid === 3802) return JSON.parse(s);
  return s;
}

// ---------------------------------------------------------------- соединение

class Connection {
  constructor(cfg) {
    this.cfg = cfg;
    this.buffer = Buffer.alloc(0);
    this.handler = null;
    this.queue = Promise.resolve();
    this.dead = false;
  }

  async connect() {
    const { host, port, sslmode } = this.cfg;
    let socket = await new Promise((resolve, reject) => {
      const s = net.connect({ host, port });
      s.once('connect', () => resolve(s));
      s.once('error', reject);
    });
    socket.setNoDelay(true);

    if (sslmode !== 'disable') {
      socket.write(Buffer.concat([int32(8), int32(80877103)])); // SSLRequest
      const answer = await new Promise((resolve, reject) => {
        socket.once('data', (d) => resolve(String.fromCharCode(d[0])));
        socket.once('error', reject);
      });
      if (answer === 'S') {
        const verify = sslmode === 'verify-full' || sslmode === 'verify-ca';
        socket = await new Promise((resolve, reject) => {
          const t = tls.connect({ socket, servername: net.isIP(host) ? undefined : host, rejectUnauthorized: verify });
          t.once('secureConnect', () => resolve(t));
          t.once('error', reject);
        });
      } else if (sslmode === 'require' || sslmode.startsWith('verify')) {
        socket.destroy();
        throw new Error('Сервер PostgreSQL не поддерживает SSL');
      }
    }

    this.socket = socket;
    socket.on('data', (chunk) => this.#onData(chunk));
    const onGone = (err) => {
      if (this.dead) return;
      this.dead = true;
      this.handler?.('__error', err || new Error('Соединение с PostgreSQL закрыто'));
    };
    socket.on('error', onGone);
    socket.on('close', () => onGone());

    await this.#startup();
  }

  #onData(chunk) {
    this.buffer = this.buffer.length ? Buffer.concat([this.buffer, chunk]) : chunk;
    while (this.buffer.length >= 5) {
      const len = this.buffer.readInt32BE(1);
      if (this.buffer.length < len + 1) return;
      const type = String.fromCharCode(this.buffer[0]);
      const body = this.buffer.subarray(5, len + 1);
      this.buffer = this.buffer.subarray(len + 1);
      if (type === 'N' || type === 'S' || type === 'K' || type === 'A') continue; // notice / параметры / ключ / notify
      this.handler?.(type, body);
    }
  }

  #write(buf) { this.socket.write(buf); }

  #startup() {
    const { user, database, password } = this.cfg;
    return new Promise((resolve, reject) => {
      let scram = null;
      this.handler = (type, body) => {
        try {
          if (type === '__error') return reject(body);
          if (type === 'E') return reject(new PgError(parseFields(body)));
          if (type === 'Z') { this.handler = null; return resolve(); }
          if (type !== 'R') return;
          const code = body.readInt32BE(0);
          if (code === 0) return; // AuthenticationOk
          if (code === 3) return this.#write(message('p', cstr(password)));
          if (code === 5) {
            const salt = body.subarray(4, 8);
            const inner = crypto.createHash('md5').update(password + user).digest('hex');
            const outer = crypto.createHash('md5').update(Buffer.concat([Buffer.from(inner), salt])).digest('hex');
            return this.#write(message('p', cstr('md5' + outer)));
          }
          if (code === 10) {
            const mechanisms = body.subarray(4).toString('utf8').split('\0');
            if (!mechanisms.includes('SCRAM-SHA-256')) throw new Error('Неподдерживаемый метод SASL: ' + mechanisms.join(', '));
            scram = { nonce: crypto.randomBytes(18).toString('base64') };
            scram.firstBare = `n=*,r=${scram.nonce}`;
            const data = Buffer.from('n,,' + scram.firstBare, 'utf8');
            return this.#write(message('p', cstr('SCRAM-SHA-256'), int32(data.length), data));
          }
          if (code === 11) {
            const serverFirst = body.subarray(4).toString('utf8');
            const attrs = Object.fromEntries(serverFirst.split(',').map((kv) => [kv[0], kv.slice(2)]));
            if (!attrs.r?.startsWith(scram.nonce)) throw new Error('SCRAM: неверный nonce сервера');
            const salted = crypto.pbkdf2Sync(password.normalize('NFKC'), Buffer.from(attrs.s, 'base64'), Number(attrs.i), 32, 'sha256');
            const hmac = (key, msg) => crypto.createHmac('sha256', key).update(msg).digest();
            const clientKey = hmac(salted, 'Client Key');
            const storedKey = crypto.createHash('sha256').update(clientKey).digest();
            const finalNoProof = `c=biws,r=${attrs.r}`;
            const authMessage = `${scram.firstBare},${serverFirst},${finalNoProof}`;
            const signature = hmac(storedKey, authMessage);
            const proof = Buffer.from(clientKey.map((b, i) => b ^ signature[i]));
            scram.serverSignature = hmac(hmac(salted, 'Server Key'), authMessage).toString('base64');
            return this.#write(message('p', Buffer.from(`${finalNoProof},p=${proof.toString('base64')}`, 'utf8')));
          }
          if (code === 12) {
            const v = body.subarray(4).toString('utf8').split(',').find((x) => x.startsWith('v='))?.slice(2);
            if (v !== scram.serverSignature) throw new Error('SCRAM: подпись сервера не совпала');
            return;
          }
          throw new Error(`Неподдерживаемый метод аутентификации (${code})`);
        } catch (err) {
          reject(err);
          this.socket.destroy();
        }
      };
      // StartupMessage: длина + версия протокола 3.0 + параметры
      const startup = Buffer.concat([
        int32(196608), cstr('user'), cstr(user), cstr('database'), cstr(database),
        cstr('client_encoding'), cstr('UTF8'), Buffer.from([0]),
      ]);
      this.socket.write(Buffer.concat([int32(startup.length + 4), startup]));
    });
  }

  /** Параметризованный запрос ($1, $2, …). Выполняется строго по очереди. */
  query(sql, params = []) {
    const run = () => new Promise((resolve, reject) => {
      if (this.dead) return reject(new Error('Соединение с PostgreSQL закрыто'));
      let fields = [];
      const rows = [];
      let rowCount = 0;
      let error = null;
      this.handler = (type, body) => {
        switch (type) {
          case '__error': this.handler = null; return reject(body);
          case 'T': fields = parseRowDescription(body); break;
          case 'D': rows.push(parseDataRow(body, fields)); break;
          case 'C': { const tag = body.toString('utf8', 0, body.length - 1).split(' '); rowCount = Number(tag[tag.length - 1]) || 0; break; }
          case 'E': error = new PgError(parseFields(body)); break;
          case 'Z': this.handler = null; return error ? reject(error) : resolve({ rows, rowCount });
        }
      };
      const encoded = params.map(encodeParam);
      const bindParams = encoded.map((p) => (p === null ? int32(-1) : Buffer.concat([int32(p.length), p])));
      this.#write(Buffer.concat([
        message('P', cstr(''), cstr(sql), int16(0)),
        message('B', cstr(''), cstr(''), int16(0), int16(encoded.length), ...bindParams, int16(0)),
        message('D', Buffer.from('P'), cstr('')),
        message('E', cstr(''), int32(0)),
        message('S'),
      ]));
    });
    const result = this.queue.then(run, run);
    this.queue = result.catch(() => {});
    return result;
  }

  /** Простой запрос: допускает несколько операторов (для схемы) */
  exec(sql) {
    const run = () => new Promise((resolve, reject) => {
      let error = null;
      this.handler = (type, body) => {
        if (type === '__error') { this.handler = null; return reject(body); }
        if (type === 'E') error = new PgError(parseFields(body));
        if (type === 'Z') { this.handler = null; return error ? reject(error) : resolve(); }
      };
      this.#write(message('Q', cstr(sql)));
    });
    const result = this.queue.then(run, run);
    this.queue = result.catch(() => {});
    return result;
  }

  close() {
    if (this.dead) return;
    this.dead = true;
    try { this.socket.end(message('X')); } catch {}
  }
}

function parseFields(body) {
  const fields = {};
  let i = 0;
  while (i < body.length && body[i] !== 0) {
    const code = String.fromCharCode(body[i]);
    const end = body.indexOf(0, i + 1);
    fields[code] = body.toString('utf8', i + 1, end);
    i = end + 1;
  }
  return fields;
}

function parseRowDescription(body) {
  const n = body.readInt16BE(0);
  const fields = [];
  let i = 2;
  for (let f = 0; f < n; f++) {
    const end = body.indexOf(0, i);
    const name = body.toString('utf8', i, end);
    i = end + 1;
    const oid = body.readInt32BE(i + 6);
    i += 18;
    fields.push({ name, oid });
  }
  return fields;
}

function parseDataRow(body, fields) {
  const n = body.readInt16BE(0);
  const row = {};
  let i = 2;
  for (let c = 0; c < n; c++) {
    const len = body.readInt32BE(i);
    i += 4;
    const value = len === -1 ? null : body.subarray(i, i + len);
    if (len > 0) i += len;
    row[fields[c].name] = decodeValue(fields[c].oid, value);
  }
  return row;
}

// ---------------------------------------------------------------- пул

export class Pool {
  constructor(url, { max = 5 } = {}) {
    this.cfg = parseUrl(url);
    this.max = max;
    this.idle = [];
    this.total = 0;
    this.waiters = [];
  }

  async acquire() {
    while (this.idle.length) {
      const c = this.idle.pop();
      if (!c.dead) return c;
      this.total--;
    }
    if (this.total < this.max) {
      this.total++;
      const c = new Connection(this.cfg);
      try { await c.connect(); return c; }
      catch (err) { this.total--; throw err; }
    }
    return new Promise((resolve) => this.waiters.push(resolve));
  }

  release(c) {
    if (c.dead) { this.total--; if (this.waiters.length) this.acquire().then(this.waiters.shift()); return; }
    const waiter = this.waiters.shift();
    if (waiter) waiter(c); else this.idle.push(c);
  }

  async query(sql, params) {
    const c = await this.acquire();
    try { return await c.query(sql, params); }
    finally { this.release(c); }
  }

  async exec(sql) {
    const c = await this.acquire();
    try { return await c.exec(sql); }
    finally { this.release(c); }
  }

  async end() {
    for (const c of this.idle) c.close();
    this.idle = [];
  }
}

```