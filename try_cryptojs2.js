try {
const CryptoJS = require('crypto-js');
const fs = require('fs');

const b64_resp_data = fs.readFileSync('C:/Users/ydlpr/AppData/Local/Temp/ebb_api3.json', 'utf8').trim();

function tryCrypto(cipherStr, key) {
    try {
        let dec = CryptoJS.Rabbit.decrypt(cipherStr, key);
        let utf8 = dec.toString(CryptoJS.enc.Utf8);
        if (utf8.includes('{') || utf8.includes('"')) {
            console.log('SUCCESS Rabbit:', key, utf8.substring(0, 40));
        }
    } catch(e) {}
    try {
        let dec = CryptoJS.AES.decrypt(cipherStr, key);
        let utf8 = dec.toString(CryptoJS.enc.Utf8);
        if (utf8.includes('{') || utf8.includes('"')) {
            console.log('SUCCESS AES:', key, utf8.substring(0, 40));
        }
    } catch(e) {}
    try {
        let dec = CryptoJS.DES.decrypt(cipherStr, key);
        let utf8 = dec.toString(CryptoJS.enc.Utf8);
        if (utf8.includes('{') || utf8.includes('"')) {
            console.log('SUCCESS DES:', key, utf8.substring(0, 40));
        }
    } catch(e) {}
}

const keysToTry = [
    'esbplus', 'ebb56293', 'ebb56293.com', 'ZXNicGx1cw==', 
    'H7llhVv4Q6qs3ROX', '1234567812345678', 'z7QAchEmMB1d5327'
];

keysToTry.forEach(k => tryCrypto(b64_resp_data, k));
console.log('Done testing keys.');
} catch (e) {
    console.error('Fatal Error:', e);
}
