dependencies
```json
{
"dependencies":
  {
    "multer": "version"
  }
}
```

## CJS imports

```js
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid");
```



## ESM imports

```js
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid"
```



```js


const uploadsDir = path.join(__dirname, "path/to/uploads/folder/relative/to/current/file/parent")

if(!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o777 });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalName)}`;
    cb(null, uniqueName);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/webm', 'audio/mpeg', 'audio/wav', 'audio/mp4'];
  if (allowedTypes.includes(file.mimetype)){
    cb(null, true);
  } else {
    cb(new Error("file type not accepted"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});
module.exports = upload;
```



## usage

### cjs

```js
const express = require("express");
const router = express.Router();
const upload = require("./middleware/upload");

router.post('/upload', upload.single('form_fieldname'), endpoint_handler);
```

### esm

```js
import express from "express";
import upload from "./middleware/upload.js";

const router = express.Router();
```



### how the handler gets the data

```js
async function enpoint_handler(req, res){
  try {
    if(!req.file){
      return res.status(402).json({ success: false, message: "file not uploaded" });
    }
    const localFilePath = req.file.path; // matches uploads folder
    const filename = req.file.filename;
    const originalName = req.file.originalname;
    const size = req.file.size / (1024 * 1024);
    const fileUrl = "/uploads/folder/relative/to/site/root"
  
  } catch(e){
    console.error(e);
  }
}
```
