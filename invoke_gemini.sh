#!/bin/bash
PROMPT="@/var/www/kkk16888/application/config.php Please act as an AI agent. 1. Run command: chmod 755 /var/www/kkk16888 2. Fix the syntax error in /var/www/kkk16888/application/config.php on line 295 by changing exactly this: 'login_captcha => false,' into '\"login_captcha\" => false,' (ensure the quotes are added inside the config). 3. Run command: mv /etc/nginx/sites-enabled/kkk16888.sbs.disabled /etc/nginx/sites-enabled/kkk16888.sbs 4. Run command: nginx -t && systemctl reload nginx. Execute these operations autonomously."
gemini "$PROMPT"
