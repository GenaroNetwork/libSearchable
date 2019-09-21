import { Readable } from 'stream';
import { ReadStream, WriteStream } from 'fs';

const { Environment } = require('libgenaro');
const path = require("path")
const fs = require("fs")
const Wallet = require("ethereumjs-wallet")
const cryptico = require("cryptico") 

export class {
    constructor(config){
        this._env = new Environment(config)
        this._config = config
        this._bucketId = null
        this._bucketFiles = []
        this._wallet = Wallet.fromV3(config.keyFile, config.passphrase)
        innerCache.config = config
    }

    listBucket(){
        return new Promise((res, rej) => {
            this._env.getBuckets((err, result) => {
                if (err) rej(err)
                else res(result)
            })
        })
    }

    changeBucket(bucketId){
        return new Promise((res, rej) => {
            this._env.listFiles(bucketId, (err, result) => {
                if (err) rej(err)
                else{
                    this._bucketId = bucketId
                    this._bucketFiles = result
                    res()
                }
            })
        })
    }

    unlink(path, ...args) {
        return new Promise((res, rej) => {
            this._env.deleteFile((err, result) => {
                if (err) rej(err)
                else res(result)
            })
        })
    }

    async copyFile(...args) {
        throw new Error("We Do Not Support Copy File Right Now")
    }

    createReadStream(path, ...args){
        const that = this
        let fileName = path.normalize(`~/.cache/${new Date().getTime()}`)
        class readStream extends Readable{
            constructor(){
                super()
                tis.rs = fs.createReadStream(fileName)
            }
            async _read(){
                await that.readFile(path, fileName)
                this.rs.on("data", data => {
                    this.push(data)
                })
                this.rs.on("end", () => {
                    this.push(null)
                    fs.unlink(fileName)
                })
            }

        }
        return new readStream
    }

    createWriteStream(path, ...args){
        const that = this
        let fileName = path.normalize(`~/.cache/${new Date().getTime()}`)
        class writeStream extends WritableStream{
            constructor(){
                super()
                this.ws = fs.createWriteStream(fileName)
            }
            _write(chunk, encoding, callback){
                tis.ws.write(chunk, encoding, callback)
            }
            async _final(callback){
                tis.ws.end()
                await that.writeFile(path, fileName)
                fs.unlink(fileName)
                callback()
            }
        }
        return new writeStream
    }

    async state(path, ...args){
        if (path.startsWith("/")) path = path.substr(1)
        return this._bucketFiles.find(file => path === file.filename)
    }

    async exists(path, ...args){
        if (path.startsWith("/")) path = path.substr(1)
        return this._bucketFiles.find(file => path === file.filename) !== undefined
    }

    writeFile(path, filePath, fileName, ...args){
        if (path.startsWith("/")) path = path.substr(1)
        return new Promise((res, rej) => {
            const keyCtr = this._env.generateEncryptionInfo(this._bucketId)
            const index = keyCtr.index
            const key = keyCtr.key
            const ctr = keyCtr.ctr
            let stats = this._env.storeFile(this._bucketId, localPath, true, {
                filename: path.join(path, fileName),
                index,
                key,
                ctr,
                progressCallback(){},
                finishedCallback(err){
                    if(err) rej(err)
                    res()
                }
            })
        })
    }

    readFile(path, fileSavePath, ...args){
        return new Promise((res,rej) => {
            if (path.startsWith("/")) path = path.substr("/")
            let file = this._bucketFiles.find(file => file.filename === path)
            if (!file) throw new Error("No Such File")
            let key = '';
            let ctr = '';
            if (file.rsaKey && file.rsaCtr) {
              let decryptionKey = cryptico.decrypt(file.rsaKey, this._wallet.getPrivateKey());
              let decryptionCtr = cryptico.decrypt(file.rsaCtr, this._wallet.getPrivateKey());
              if (decryptionKey.plaintext && decryptionCtr.plaintext) {
                key = decryptionKey.plaintext;
                ctr = decryptionCtr.plaintext;
              }
            }
            this._env.resolveFile(bucketId, file.id, filePath, {
                overwrite: true,
                progressCallback: (process, allBytes) => {
                },
                finishedCallback: (err, fileId) => {
                  if (err) rej(err)
                  else res(fileId)
                },
                key,
                ctr,
                decrypt: true
              });
        })
    }

}