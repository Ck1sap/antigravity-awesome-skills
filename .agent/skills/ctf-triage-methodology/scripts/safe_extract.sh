#!/bin/bash
# Skill: ctf-triage-methodology
# Purpose: Safely extract static information from an artifact. Flags missing tools for AI intervention.

TARGET=$1

if [ -z "$TARGET" ]; then
    echo "Usage: ./safe_extract.sh <artifact>"
    exit 1
fi

if [ ! -f "$TARGET" ]; then
    echo "Error: File $TARGET not found."
    exit 1
fi

echo "================================================================"
echo "🔍 SAFE EXTRACTION & TRIAGE: $TARGET"
echo "================================================================"

echo -e "\n---> 1. MAGIC BYTES (file)"
if command -v file &> /dev/null; then
    file "$TARGET"
else
    echo "[MISSING_TOOL] 'file' is missing. Agent: Halt and guide the user to install it."
fi

echo -e "\n---> 2. METADATA (exiftool)"
if command -v exiftool &> /dev/null; then
    exiftool "$TARGET" | egrep -i "File Type|MIME Type|Creator|Author|Warning" || echo "No significant metadata found."
else
    echo "[MISSING_TOOL] 'exiftool' is missing. Agent: Halt triage. Explain why metadata is important and provide installation instructions."
fi

echo -e "\n---> 3. EMBEDDED SIGNATURES (binwalk)"
if command -v binwalk &> /dev/null; then
    binwalk "$TARGET" | head -n 10
else
    echo "[MISSING_TOOL] 'binwalk' is missing. Agent: Halt triage. Explain why checking for embedded files is necessary and provide installation instructions."
fi

echo -e "\n---> 4. HUMAN READABLE STRINGS (strings)"
if command -v strings &> /dev/null; then
    strings -n 8 "$TARGET" | head -n 10
    echo "[...] Output truncated."
else
    echo "[MISSING_TOOL] 'strings' is missing. Agent: Halt and guide the user to install 'binutils' or equivalent."
fi

echo -e "\n================================================================"
echo "[?] Agent Instruction: If any [MISSING_TOOL] flags were triggered, stop and help the user install them now. If all tools ran successfully, ask the Socratic question: 'Based on the output above, what is your primary hypothesis about this file?'"