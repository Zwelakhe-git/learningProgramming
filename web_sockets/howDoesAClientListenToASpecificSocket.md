client side
```ts
// socket.ts
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private _isConnected = false;

  connect() {
    
    
    this.socket = io(WS_URL, {
      query: { 
         
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      this._isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      this._isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      this._isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this._isConnected = true;
    });

    this.socket.onAny((event, ...args) => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.forEach(callback => callback(...args));
      }
    });

    return this.socket;
  }

  disconnect() {
    console.log('🔌 SocketClient.disconnect()');
    if (this.socket) {
      
      this.socket.disconnect();
      this.socket = null;
      this._isConnected = false;
    }
    this.listeners.clear();
  }

  emit(event: string, data: any) {
    if (this.socket && this._isConnected) {
      console.log(`📤 Emitting ${event}:`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit ${event}, socket not connected`);
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback?: Function) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
    } else {
      this.listeners.delete(event);
    }
  }

  removeAllListeners() {
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this._isConnected && this.socket?.connected || false;
  }

  connected(): boolean {
    return this.isConnected();
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}
```

when the server emits an event the client's socket checks if there is a handler for that event and calls it. a handler can be set using 'on'. 'onAny' handles events not registered using 'on'. in this template the handler for all other events checks in the installed handlers, whether we have registered the event and its handler, and calls all the handlers for that event.
Its useful to collect events and their handlers so that we do not always have to run `socket.on` constantly.