const libgenaro = new Environment({
    bridgeUrl: 'http://111.111.111.111:8080',
    keyFile: `"version":3,"id":"8922125c-09ef-4281-9b4b-4d0100092440","address":"47fa7b263f5b97a964572cc91afb0f9a9b3a147c","crypto":{"ciphertext":"e7493eef01720079e32dc3b330624b075215d3de3ce7b069cd99a63ec6378b32","cipherparams":{"iv":"425b0220a635b19f369e8d84075359e5"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"bd8b5a65d51860a699949b975b2c00ff38b19eaf18a41ba4268bdc457f8ba527","n":262144,"r":8,"p":1},"mac":"dfd5069c74fdb43cb3c75d0a654887924bf471be9e7043daa58751029146734e"},"name":"邮件·附件"}`,
    passphrase: '123456',
});

let path = require("path")

console.log(path.join("12313/12313/123.123", "123.111"))