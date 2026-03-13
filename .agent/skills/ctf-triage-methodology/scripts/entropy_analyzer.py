#!/usr/bin/env python3
"""
Skill: ctf-triage-methodology
Script: entropy_analyzer.py
Purpose: Calculate Shannon entropy of a file to detect packing/encryption and explain the concept.
"""

import sys
import math
from collections import Counter

def calculate_entropy(data):
    if not data:
        return 0
    entropy = 0
    length = len(data)
    counts = Counter(data)
    for count in counts.values():
        probability = count / length
        entropy -= probability * math.log2(probability)
    return entropy

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 entropy_analyzer.py <artifact>")
        sys.exit(1)

    filename = sys.argv[1]
    try:
        with open(filename, "rb") as f:
            data = f.read()
    except FileNotFoundError:
        print(f"Error: File {filename} not found.")
        sys.exit(1)

    entropy = calculate_entropy(data)
    
    print("================================================================")
    print(f"📊 ENTROPY ANALYSIS: {filename}")
    print("================================================================")
    print(f"Calculated Shannon Entropy: {entropy:.2f} (Scale: 0.0 to 8.0)\n")
    
    print("--- Pedagogical Interpretation ---")
    print("[?] What is Entropy? It measures the randomness of data in the file.")
    
    if entropy > 7.5:
        print("[!] High Entropy (>7.5) detected.")
        print("    Conclusion: The file is likely ENCRYPTED, COMPRESSED, or PACKED (e.g., UPX).")
        print("    Next Step: Do not attempt standard disassembly yet. Look for unpacking methods or keys.")
    elif entropy > 6.0:
        print("[!] Moderate Entropy (6.0 - 7.5) detected.")
        print("    Conclusion: Standard executable file containing complex machine code or mixed assets.")
        print("    Next Step: Proceed with standard static analysis and disassembly.")
    else:
        print("[!] Low Entropy (<6.0) detected.")
        print("    Conclusion: The file likely contains plain text, uncompressed bitmaps, or highly repetitive data.")
        print("    Next Step: Inspect with text editors or hex editors. Disassembly may not be necessary.")

if __name__ == "__main__":
    main()