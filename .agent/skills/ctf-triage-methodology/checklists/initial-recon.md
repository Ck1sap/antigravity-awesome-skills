# Initial Reconnaissance Checklist

> Use this to ensure no fundamental step is skipped during the first interaction with a CTF artifact.

## 1. Static Artifacts (Files, Binaries, Images)
- [ ] Read challenge description and document explicit constraints.
- [ ] Verify file hash (MD5/SHA256) to ensure integrity if a known artifact.
- [ ] Check true file type (`file <target>`).
- [ ] Extract human-readable strings (`strings -n 8 <target>`).
- [ ] Inspect file metadata (`exiftool <target>`).
- [ ] Check for embedded files (`binwalk <target>`).

## 2. Network/Web Targets
- [ ] Test connectivity (ping, curl header inspection).
- [ ] Map open ports and service versions.
- [ ] Inspect `robots.txt`, `sitemap.xml`, and security headers (Web only).
- [ ] Review page source code and referenced JavaScript files (Web only).

## 3. Pedagogical Checkpoint
- [ ] Did I explain the output of the reconnaissance tools to the student?
- [ ] Did we formulate at least one hypothesis on the attack vector before proceeding?