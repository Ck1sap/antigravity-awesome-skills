# Tool Selection Matrix

> Reference this matrix to ensure the correct tool is selected and the pedagogical explanation is accurate.

## 1. Forensics & Steganography
| Objective | Preferred Tool | Pedagogical Explanation |
| :--- | :--- | :--- |
| Extract files from images | `steghide` / `zsteg` | "Steghide uses a passphrase to extract data embedded in the least significant bits of image/audio files. Zsteg is specific for PNG/BMP LSB analysis." |
| PCAP Analysis | `wireshark` / `tshark` | "Wireshark visually reconstructs network streams, allowing us to see exactly what data was transmitted in the clear." |
| Memory Analysis | `volatility3` | "Volatility parses raw memory dumps based on OS profiles, reconstructing processes, network connections, and loaded DLLs from RAM." |

## 2. Binary Exploitation (Pwn) & Reversing
| Objective | Preferred Tool | Pedagogical Explanation |
| :--- | :--- | :--- |
| Dynamic Analysis / Debugging | `gdb` (with `pwndbg` or `GEF`) | "GDB allows us to pause execution, inspect CPU registers, and watch memory addresses to understand exactly how the binary handles our input." |
| Exploit Scripting | `pwntools` (Python) | "Pwntools provides abstractions for socket connections and payload packing, saving time when dealing with little-endian memory addresses." |
| Static Disassembly | `Ghidra` / `objdump` | "Disassemblers translate machine code back into Assembly or pseudo-C, showing us the program's logic without executing it." |

## 3. Cryptography
| Objective | Preferred Tool | Pedagogical Explanation |
| :--- | :--- | :--- |
| Rapid Data Transformation | `CyberChef` | "CyberChef is a 'swiss army knife' for chaining decoding operations (Base64, HEX, XOR) visually." |
| RSA/Math Attacks | `SageMath` / `RsaCtfTool` | "When cryptographic parameters are weak, we use specialized math frameworks to factorize moduli or calculate private keys." |