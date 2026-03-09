const CryptoJS = require('crypto-js');

let keyHash = CryptoJS.MD5('ZXNicGx1cw==').toString();
let key = CryptoJS.enc.Utf8.parse(keyHash);

function decryptRequest(reqB64) {
    let i_val = CryptoJS.enc.Base64.parse(reqB64);
    let a_val = CryptoJS.enc.Utf8.stringify(i_val);
    let dec = CryptoJS.AES.decrypt(a_val, key, { mode: CryptoJS.mode.ECB });
    return dec.toString(CryptoJS.enc.Utf8);
}

let req1 = 'SDdsbGhWdjRRNnFzM1JPWFF3eVlZK2ZMZmw0MDgzZXJqZnpPYkU5cGl3VElGKzhlMU95ZTVXdWtTYmduZDlPbS9MQUw3UEtxcXZGVXFwaSs4TWdMN0E9PQ==';
console.log('REQUEST 1:', decryptRequest(req1));

let req2 = 'SDdsbGhWdjRRNnFzM1JPWFF3eVlZMEpMTmlpOGVqb25XVmg0NkRjeVgrT1B5SzJXczJ0dTkrMGdmaW5relozdXZkSjdabE40dThkeDVWQUdwK1BsWDhoMHVOYUlqWXlQU0d0ckErS3FveVE9';
console.log('REQUEST 2:', decryptRequest(req2));

let req3 = 'Wllwdmtna1V0NGdEbk8zVUJiUisvczM1VFZ0Sk5mRythT0pZbk5Bd3NOSG1zRlZsYkE3MFAwS2FoWUxFbFF5ZzlaM3pSWDJRZTI2UGVkUW9peTdLTEE9PQ==';
console.log('REQUEST 3:', decryptRequest(req3));
