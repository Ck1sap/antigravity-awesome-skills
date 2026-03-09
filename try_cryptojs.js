const CryptoJS = require('crypto-js');
const fs = require('fs');

const b64_resp_data = fs.readFileSync('C:/Users/ydlpr/AppData/Local/Temp/ebb_api3.json', 'utf8').trim();

// The original decrypt might just be parsing the base64 string directly with CryptoJS
// like: CryptoJS.Rabbit.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)

function tryCrypto(cipherStr, key) {
    try {
        let dec = CryptoJS.Rabbit.decrypt(cipherStr, key);
        let utf8 = dec.toString(CryptoJS.enc.Utf8);
        if (utf8.includes('{') || utf8.includes('"')) {
            console.log('SUCCESS Rabbit Key:', key, utf8.substring(0, 40));
        }
    } catch(e) {}
    
    try {
        let dec = CryptoJS.AES.decrypt(cipherStr, key);
        let utf8 = dec.toString(CryptoJS.enc.Utf8);
        if (utf8.includes('{') || utf8.includes('"')) {
            console.log('SUCCESS AES Key:', key, utf8.substring(0, 40));
        }
    } catch(e) {}
    
    try {
        let dec = CryptoJS.DES.decrypt(cipherStr, key);
        let utf8 = dec.toString(CryptoJS.enc.Utf8);
        if (utf8.includes('{') || utf8.includes('"')) {
            console.log('SUCCESS DES Key:', key, utf8.substring(0, 40));
        }
    } catch(e) {}
}

const keysToTry = [
    'esbplus', 'ebb56293', 'ebb56293.com', 'ZXNicGx1cw==', 
    'H7llhVv4Q6qs3ROX', '1234567812345678', 'z7QAchEmMB1d5327'
];

keysToTry.forEach(k => tryCrypto(b64_resp_data, k));
console.log('Done testing keys with CryptoJS wrapper.');
