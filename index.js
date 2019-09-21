//'Cascadia Code', 文泉驿微米黑,Consolas, 'Courier New', monospace

const { Environment } = require('libgenaro');
const path = require("path")

export class {
    constructor(config){
        this._env = new Environment(config)
        this._bucketId = null
        this._bucketFiles = []
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

    createReadStream(path, ...args){}

    createWriteStream(path, ...args){}

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
            let filename = fs.get
            let stats = this._env.storeFile(this._bucketId, localPath, true, {
                filename: path.join(path, fileName)
            })
        })
    }

    async readFile(path, ...args){}

}