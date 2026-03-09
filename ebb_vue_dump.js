const puppeteer = require('puppeteer');
const CryptoJS = require('crypto-js');

const keyHash = CryptoJS.MD5('ZXNicGx1cw==').toString();
const key = CryptoJS.enc.Utf8.parse(keyHash);

function decrypt(b64Data) {
    try {
        let dec = CryptoJS.AES.decrypt(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(b64Data)), key, { mode: CryptoJS.mode.ECB });
        return dec.toString(CryptoJS.enc.Utf8);
    } catch (e) { return 'ERR'; }
}

(async () => {
    console.log('🚀 [DIRECTIVE 1 & 2] Launching Headless Operations...');
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();

    await page.evaluateOnNewDocument(() => {
        const originalSend = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.send = function (data) {
            if (data && typeof data === 'string' && data.includes('requestData=')) {
                let b64 = data.replace('requestData=', '');
                b64 = decodeURIComponent(b64);
                console.log('RAW_ENC_B64: ' + b64);
            }
            return originalSend.apply(this, arguments);
        };
    });

    page.on('console', msg => {
        let text = msg.text();
        if (text.startsWith('RAW_ENC_B64: ')) {
            let b64 = text.substring(13);
            let decrypted = decrypt(b64);
            console.log('\n[XHR INTERCEPT] =>', decrypted);
        }
    });

    console.log('[*] Navigating to base URL...');
    await page.goto('https://ebb56293.com:9900/web/#/registeragent', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Simulate user clicking or attempting to add an agent or view the form
    console.log('[*] Simulating actions and performing Vue Memory Dump...');

    const dumpScript = () => {
        const getVueInstances = () => {
            return Object.values(document.querySelectorAll('*'))
                .map(el => el.__vue__)
                .filter(Boolean);
        };

        let instances = getVueInstances();
        let dumped = [];
        let seen = new Set();

        function traverse(vm) {
            if (!vm || seen.has(vm)) return;
            seen.add(vm);

            let vData = null;
            try {
                vData = vm.$data;
                if (typeof vData === 'function') vData = vData();
            } catch (e) { }

            if (vData) {
                let dataStr = JSON.stringify(vData);
                if (dataStr && (dataStr.toLowerCase().includes('pass') || dataStr.toLowerCase().includes('account') || dataStr.toLowerCase().includes('confirm'))) {
                    dumped.push({
                        component: vm.$options ? (vm.$options._componentTag || vm.$options.name || "Anonymous") : 'Anonymous',
                        data: vData
                    });
                }
            }

            if (vm.$children) {
                vm.$children.forEach(traverse);
            }
        }

        instances.forEach(traverse);
        return dumped;
    };

    let vueDump1 = await page.evaluate(dumpScript);
    console.log('\n================================');
    console.log('[+] VUE COMPONENT DUMP (Route: /registeragent):');
    console.log(JSON.stringify(vueDump1, null, 2));

    await page.goto('https://ebb56293.com:9900/web/#/pwdforget', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    let vueDump2 = await page.evaluate(dumpScript);
    console.log('\n================================');
    console.log('[+] VUE COMPONENT DUMP (Route: /pwdforget):');
    console.log(JSON.stringify(vueDump2, null, 2));

    await browser.close();
    console.log('✅ [DIRECTIVE 1 & 2 COMPLETE]');
})();
