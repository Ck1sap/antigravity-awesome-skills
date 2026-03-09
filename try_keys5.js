const CryptoJS = require('crypto-js');
const fs = require('fs');

const b64_resp_data = fs.readFileSync('C:/Users/ydlpr/AppData/Local/Temp/ebb_api3.json', 'utf8').trim();
let i_val = CryptoJS.enc.Base64.parse(b64_resp_data);
let a_val = CryptoJS.enc.Utf8.stringify(i_val);

let keyHash = CryptoJS.MD5('ZXNicGx1cw==').toString(); // 32 hex chars

let key = CryptoJS.enc.Utf8.parse(keyHash);

try {
    let dec = CryptoJS.AES.decrypt(a_val, key, { mode: CryptoJS.mode.ECB });
    let decStr = dec.toString(CryptoJS.enc.Utf8);
    fs.writeFileSync('C:/Users/ydlpr/AppData/Local/Temp/ebb_api3_decrypted.json', decStr);
    console.log('Decrypted successfully to ebb_api3_decrypted.json');
} catch (e) {
    console.log('Decrypt failed', e);
}
