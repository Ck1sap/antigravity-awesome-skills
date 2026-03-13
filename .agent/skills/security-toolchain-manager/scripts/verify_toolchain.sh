#!/bin/bash
# Skill: security-toolchain-manager
# Purpose: Probe the system environment and output status for the AI Agent to formulate a tailored installation plan.

echo "================================================================"
echo "📡 ENVIRONMENT & PACKAGE MANAGER PROBE"
echo "================================================================"

echo "[OS Base]"
if [ -f /etc/os-release ]; then
    cat /etc/os-release | grep -E "^PRETTY_NAME=" | cut -d '=' -f 2 | tr -d '"'
elif [ "$(uname)" == "Darwin" ]; then
    echo "macOS $(sw_vers -productVersion)"
else
    uname -a
fi

echo -e "\n[Package Managers]"
check_cmd() {
    if command -v "$1" &> /dev/null; then
        echo "✅ $1 is available ($($1 --version 2>/dev/null | head -n 1 | awk '{print $1, $2, $3}'))"
    else
        echo "❌ $1 is missing"
    fi
}

check_cmd "apt"
check_cmd "pacman"
check_cmd "brew"
check_cmd "pip"
check_cmd "npm"
check_cmd "cargo"

echo -e "\n[Core Languages & Runtimes]"
check_cmd "python3"
check_cmd "node"
check_cmd "java"
check_cmd "go"
check_cmd "ruby"

echo -e "\n[Containerization]"
check_cmd "docker"

echo -e "\n================================================================"
echo "Agent Instruction: Read this output. If the CTF requires a tool that needs a missing runtime/manager, explain its purpose and provide the exact install command based on the OS Base detected."