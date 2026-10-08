/* =====================================================================
   The OmniSec Roadmap, Curriculum Data (DETAILED)
   Author: Muhammad Izaz Haider, lover of AI x Offensive Security
   LinkedIn: https://www.linkedin.com/in/muhammad-izaz-haider-091639314/
   ---------------------------------------------------------------------
   Every topic is a real mini-lesson, not just a card. Schema:
   node = {
     id, t:title, d:one-line, lv:1|2|3 (Beginner/Intermediate/Advanced),
     time:"~Xh", skip:bool, tip:"the thing people get wrong",
     learn:[ "concept you must understand", ... ],     // WHAT to learn
     do:   [ "concrete hands-on step / command", ... ], // WHAT to do
     tools:[ "tool", ... ],
     res:  [ {t:"label", u:"https://..."}, ... ]        // free resources
   }
   ===================================================================== */

const LEVELS = { 1:"Beginner", 2:"Intermediate", 3:"Advanced" };

const ROADMAP = [
/* ============================ PHASE 0 ============================ */
{
  id:"p0", phase:"Phase 0: Mindset, Ethics & Your Lab", icon:"🧭",
  blurb:"Before any tool: how to think like an attacker, how to stay legal, and how to build a safe practice lab. Do NOT skip this, it prevents legal trouble and wasted months.",
  stages:[
    { id:"s0a", title:"Hacker Mindset & Ethics", nodes:[
      { id:"n_ethics", t:"Ethics, Law & Scope", d:"The rules that keep hacking legal.", lv:1, time:"~2h", skip:false,
        learn:[
          "Difference between authorized and unauthorized access, and why intent doesn't protect you legally",
          "What a 'scope' is: the exact systems/IPs/domains you're allowed to test, and nothing else",
          "Key laws: US CFAA, UK Computer Misuse Act, and your own country's cyber law",
          "Responsible disclosure vs full disclosure vs selling exploits"],
        do:[
          "Read one real bug bounty program policy end-to-end (e.g. on HackerOne) and list what is IN and OUT of scope",
          "Write your personal rule: 'I only touch systems I own or have written permission for'",
          "Bookmark a Rules of Engagement template you'll reuse for every engagement"],
        tools:[],
        res:[{t:"HackerOne Disclosure Guidelines",u:"https://www.hackerone.com/disclosure-guidelines"},
             {t:"EFF: Coders' Rights",u:"https://www.eff.org/issues/coders"},{t:"HackerOne Hacktivity (real disclosures)",u:"https://hackerone.com/hacktivity"}] },

      { id:"n_method", t:"The Pentest Methodology", d:"The repeatable loop every engagement follows.", lv:1, time:"~3h", skip:false,
        learn:[
          "The 6 phases: Recon → Enumeration → Exploitation → Privilege Escalation → Post-Exploitation → Reporting",
          "Why ~70% of time is recon/enumeration, not 'hacking'",
          "Industry frameworks: PTES, OSSTMM, MITRE ATT&CK, and the Cyber Kill Chain",
          "How to keep a methodology checklist so you never forget a step"],
        do:[
          "Draw the 6-phase loop on paper from memory until it sticks",
          "Skim the MITRE ATT&CK matrix and pick 5 techniques that sound interesting",
          "Create a reusable engagement checklist (a simple markdown file)"],
        tools:["MITRE ATT&CK","PTES"],
        res:[{t:"MITRE ATT&CK Matrix",u:"https://attack.mitre.org/"},
             {t:"PTES Standard",u:"http://www.pentest-standard.org/"},{t:"OWASP Web Security Testing Guide",u:"https://owasp.org/www-project-web-security-testing-guide/"}] },

      { id:"n_notes", t:"Note-Taking & Documentation", d:"The #1 skill nobody teaches.", lv:1, time:"~2h", skip:true,
        tip:"Beginners 'remember it later', then lose a found vulnerability because they never wrote the request down. If it isn't written, it didn't happen.",
        learn:[
          "Why structured notes = faster reports + repeatable findings",
          "A folder-per-target structure: scope, recon, creds, screenshots, exploits, report",
          "Markdown basics for clean, portable notes",
          "How to log every command and its output as you go"],
        do:[
          "Install a note tool (Obsidian or CherryTree) and create a target template",
          "Practice logging a full terminal session with `script session.log` (Linux)",
          "Take 3 screenshots and embed them in a markdown note with captions"],
        tools:["Obsidian","CherryTree","Markdown"],
        res:[{t:"Obsidian (free)",u:"https://obsidian.md/"},
             {t:"Markdown Guide",u:"https://www.markdownguide.org/basic-syntax/"},{t:"Joplin (free, offline notes)",u:"https://joplinapp.org/"}] },

      { id:"n_growth", t:"Learning How to Learn & Googling", d:"Turn 'stuck' into 'solved' fast.", lv:1, time:"~1h", skip:true,
        tip:"Most 'I'm stuck' moments are really 'I asked the wrong question.' Read the error message, it usually tells you the fix.",
        learn:[
          "How to read man pages, --help, and error messages instead of guessing",
          "Search operators: exact phrases in quotes, site:, filetype:, minus to exclude",
          "When to use official docs vs forums vs HackTricks",
          "Building a personal cheat-sheet habit"],
        do:[
          "Use `man nmap` and `tldr nmap` on the same command, compare them",
          "Practice 5 Google dorks (e.g. `site:github.com nmap cheatsheet filetype:md`)",
          "Bookmark HackTricks and explainshell.com"],
        tools:["man","tldr","explainshell"],
        res:[{t:"explainshell.com",u:"https://explainshell.com/"},
             {t:"HackTricks",u:"https://book.hacktricks.xyz/"},{t:"Google Hacking Database",u:"https://www.exploit-db.com/google-hacking-database"}] }
    ]},
    { id:"s0b", title:"Build Your Practice Lab (Hands-On)", nodes:[
      { id:"n_vm", t:"Virtualization & Snapshots", d:"Run safe, disposable machines.", lv:1, time:"~2h", skip:false,
        learn:[
          "What a hypervisor is (VirtualBox/VMware) and why VMs isolate risk",
          "Snapshots: save a clean state and roll back after breaking something",
          "Allocating RAM/CPU sanely so your host stays usable"],
        do:[
          "Install VirtualBox (free) or VMware Workstation Player",
          "Create your first VM and take a snapshot named 'clean-install'",
          "Break something on purpose, then restore the snapshot to confirm it works"],
        tools:["VirtualBox","VMware"],
        res:[{t:"VirtualBox Downloads",u:"https://www.virtualbox.org/wiki/Downloads"},
             {t:"VirtualBox Manual: Snapshots",u:"https://www.virtualbox.org/manual/ch01.html#snapshots"},{t:"Proxmox VE (free hypervisor)",u:"https://www.proxmox.com/en/proxmox-ve"}] },

      { id:"n_kali", t:"Set Up Your Attacker VM", d:"Your hacking workstation.", lv:1, time:"~2h", skip:false,
        learn:[
          "Why Kali/Parrot ship with tools pre-installed",
          "Updating safely (apt update && apt full-upgrade) and what can break",
          "Taking a snapshot right after setup so you can always reset"],
        do:[
          "Download the Kali VirtualBox image (pre-built) and import it",
          "Login, run `sudo apt update`, then snapshot it as 'kali-fresh'",
          "Verify tools exist: run `nmap --version` and `msfconsole -v`"],
        tools:["Kali Linux","Parrot OS"],
        res:[{t:"Kali Pre-built VMs",u:"https://www.kali.org/get-kali/#kali-virtual-machines"},
             {t:"Parrot Security",u:"https://www.parrotsec.org/download/"},{t:"Kali Linux Docs",u:"https://www.kali.org/docs/"}] },

      { id:"n_victim", t:"Deploy Legal Targets to Attack", d:"Practice without breaking the law.", lv:1, time:"~3h", skip:false,
        learn:[
          "Why you need intentionally-vulnerable targets (never test real sites)",
          "Online platforms vs local vulnerable VMs",
          "Matching a target to a skill (web app vs network box)"],
        do:[
          "Make a free TryHackMe account and finish the 'Pre Security' intro room",
          "Deploy DVWA or OWASP Juice Shop locally in a VM",
          "Download one easy VulnHub box and import it into your lab network"],
        tools:["TryHackMe","DVWA","OWASP Juice Shop","VulnHub","HackTheBox"],
        res:[{t:"TryHackMe",u:"https://tryhackme.com/"},
             {t:"OWASP Juice Shop",u:"https://owasp.org/www-project-juice-shop/"},
             {t:"VulnHub",u:"https://www.vulnhub.com/"},{t:"Metasploitable 3",u:"https://github.com/rapid7/metasploitable3"}] },

      { id:"n_snapshot", t:"Network Isolation & Safety", d:"Keep malware off your real machine.", lv:1, time:"~1h", skip:true,
        tip:"Students leave the lab on 'Bridged' networking, then a malware sample or a vulnerable box touches their home network. Use Host-Only/Internal.",
        learn:[
          "VM network modes: NAT vs Bridged vs Host-Only vs Internal",
          "Why detonation/malware analysis needs an isolated Host-Only/Internal network",
          "Keeping the attacker + victim on the same private network only"],
        do:[
          "Set your victim VMs to Host-Only or Internal network",
          "Confirm the victim CANNOT reach the internet (ping fails) but the attacker CAN reach the victim",
          "Document your lab's IP plan in your notes"],
        tools:["VirtualBox","VMware"],
        res:[{t:"VirtualBox Networking Modes",u:"https://www.virtualbox.org/manual/ch06.html"}] }
    ]}
  ]
},

/* ============================ PHASE 1 ============================ */
{
  id:"p1", phase:"Phase 1: Core Fundamentals", icon:"🧱",
  blurb:"You can't exploit what you don't understand. Master networking, Linux, Windows and a scripting language. This phase is long on purpose, strong foundations make everything after it easy.",
  stages:[
    { id:"s1a", title:"Networking Core", nodes:[
      { id:"n_osi", t:"OSI & TCP/IP Models", d:"How data actually moves.", lv:1, time:"~3h", skip:false,
        learn:[
          "The 7 OSI layers + the 4 TCP/IP layers, and what lives at each",
          "Encapsulation: how a packet gets headers added at each layer",
          "Where common attacks map (L2 ARP spoof, L3 routing, L7 web)"],
        do:[
          "Memorize the layers with the mnemonic 'Please Do Not Throw Sausage Pizza Away'",
          "Watch one full Network+ video on the OSI model and take notes",
          "For 5 protocols (HTTP, DNS, TCP, IP, Ethernet) write which layer each is"],
        tools:[],
        res:[{t:"Professor Messer Network+ (free)",u:"https://www.professormesser.com/network-plus/n10-009/n10-009-training-course/"},
             {t:"Cloudflare: OSI model",u:"https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/"}] },

      { id:"n_ip", t:"IP Addressing, Subnetting & CIDR", d:"Read 10.0.0.0/24 instantly.", lv:1, time:"~4h", skip:true,
        tip:"Skipping subnetting feels fine, until you scan the wrong range and miss every host. Learn CIDR now, save weeks later.",
        learn:[
          "IPv4 structure, private vs public ranges, and what a subnet mask does",
          "CIDR notation: /24 = 256 addresses, /16, /8 etc.",
          "Calculating network/broadcast/usable host ranges",
          "Why scope is often given as a CIDR block"],
        do:[
          "Use `ipcalc 192.168.1.0/24` and read every field it outputs",
          "By hand, find the host range of 172.16.5.0/26",
          "Practice 10 subnetting questions on subnettingpractice.com"],
        tools:["ipcalc"],
        res:[{t:"Subnetting Practice",u:"https://subnettingpractice.com/"},
             {t:"Professor Messer: Subnetting",u:"https://www.professormesser.com/network-plus/n10-008/n10-008-video/ipv4-subnetting-n10-008/"},{t:"CIDR.xyz (visual subnetting)",u:"https://cidr.xyz/"}] },

      { id:"n_ports", t:"Ports, Protocols & Services", d:"The doors into a machine.", lv:1, time:"~3h", skip:false,
        learn:[
          "TCP vs UDP and the 3-way handshake (SYN, SYN-ACK, ACK)",
          "Default ports: 21 FTP, 22 SSH, 25 SMTP, 53 DNS, 80/443 HTTP(S), 139/445 SMB, 3389 RDP",
          "What 'a service' is and how a version maps to known exploits"],
        do:[
          "Make a flashcard deck of the top 20 ports and drill it",
          "On your Kali box run `cat /etc/services` and explore it",
          "Connect to a service manually with `nc <ip> 80` and type `GET / HTTP/1.0`"],
        tools:["netcat"],
        res:[{t:"IANA Port Numbers",u:"https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml"},{t:"SpeedGuide Ports Database",u:"https://www.speedguide.net/ports.php"}] },

      { id:"n_packets", t:"Packet Analysis (Wireshark)", d:"See the traffic with your own eyes.", lv:2, time:"~3h", skip:false,
        learn:[
          "Capturing traffic and reading a TCP handshake packet-by-packet",
          "Display filters (ip.addr==, tcp.port==80, http)",
          "Following a TCP stream to reconstruct a conversation"],
        do:[
          "Capture your own traffic while browsing a plain HTTP site",
          "Filter to `http` and find the GET request and credentials if any",
          "Right-click a packet → Follow → TCP Stream and read it"],
        tools:["Wireshark","tcpdump"],
        res:[{t:"Wireshark Sample Captures",u:"https://wiki.wireshark.org/SampleCaptures"},
             {t:"Wireshark Display Filters",u:"https://wiki.wireshark.org/DisplayFilters"}] },

      { id:"n_dns", t:"How DNS Really Works", d:"The internet's phone book, and a recon goldmine.", lv:1, time:"~2h", skip:true,
        tip:"People treat DNS as magic. Understanding records is what makes subdomain recon (Phase 2) actually click.",
        learn:[
          "Record types: A, AAAA, CNAME, MX, NS, TXT, and what each reveals",
          "The resolution flow: resolver → root → TLD → authoritative",
          "Why DNS leaks infrastructure (mail servers, subdomains, SPF/DMARC)"],
        do:[
          "Run `dig A example.com`, `dig MX example.com`, `dig TXT example.com`",
          "Use `nslookup` interactively to query a specific DNS server",
          "Map the records you found into your notes for one domain"],
        tools:["dig","nslookup","host"],
        res:[{t:"Cloudflare: DNS",u:"https://www.cloudflare.com/learning/dns/what-is-dns/"}] }
    ]},
    { id:"s1b", title:"Linux Mastery", nodes:[
      { id:"n_cli", t:"The Linux Command Line", d:"Your home for the rest of your career.", lv:1, time:"~6h", skip:false,
        learn:[
          "Filesystem layout (/etc, /var, /home, /tmp) and navigation (cd, ls, pwd)",
          "Files: cat, less, cp, mv, rm, find, locate",
          "Pipes `|` and redirection `>` `>>` `2>` to chain commands",
          "Package management with apt"],
        do:[
          "Complete OverTheWire 'Bandit' levels 0–15 (free, browser SSH)",
          "Find every .conf file under /etc with `find /etc -name '*.conf'`",
          "Chain commands: `cat /etc/passwd | grep bash | wc -l`"],
        tools:["bash","find","grep"],
        res:[{t:"OverTheWire: Bandit",u:"https://overthewire.org/wargames/bandit/"},
             {t:"Linux Journey",u:"https://linuxjourney.com/"},{t:"LinuxCommand.org",u:"https://linuxcommand.org/"}] },

      { id:"n_perms", t:"Permissions, Users & sudo", d:"The root of most privilege escalation.", lv:1, time:"~3h", skip:false,
        learn:[
          "rwx for user/group/other and numeric chmod (755, 644)",
          "Ownership with chown, and the meaning of SUID/SGID/sticky bits",
          "Users, groups, /etc/passwd, /etc/shadow, and the sudoers file"],
        do:[
          "Create a file, set it 600, then 755, and observe `ls -l` change",
          "Find all SUID binaries: `find / -perm -4000 2>/dev/null`",
          "Look up one of those binaries on GTFOBins to see why it matters"],
        tools:["chmod","chown","GTFOBins"],
        res:[{t:"GTFOBins",u:"https://gtfobins.github.io/"},
             {t:"Linux Permissions Explained",u:"https://linuxjourney.com/lesson/file-permissions"}] },

      { id:"n_grep", t:"Text Processing: grep, sed, awk, jq", d:"Slice huge output in seconds.", lv:2, time:"~3h", skip:true,
        tip:"Beginners scroll through 10,000 lines by hand. Pros pipe it through grep/awk and find the answer in one line. This skill compounds forever.",
        learn:[
          "grep with regex, -i, -r, -v, -o, and context flags",
          "Cut/awk to extract columns; sed to substitute text",
          "jq to query JSON from APIs"],
        do:[
          "From `cat /etc/passwd`, extract just usernames with `cut -d: -f1`",
          "Use awk to print column 1 and 7: `awk -F: '{print $1, $7}' /etc/passwd`",
          "Pipe a JSON API response through `jq '.'` to pretty-print it"],
        tools:["grep","sed","awk","jq","cut"],
        res:[{t:"RegexOne (learn regex)",u:"https://regexone.com/"},
             {t:"jq Manual",u:"https://jqlang.github.io/jq/manual/"}] },

      { id:"n_bash", t:"Bash Scripting", d:"Automate the boring parts.", lv:2, time:"~4h", skip:false,
        learn:[
          "Variables, quoting, command substitution $(...)",
          "Loops (for/while), conditionals (if/test), and exit codes",
          "Reading args ($1, $@) and writing a reusable script"],
        do:[
          "Write a script that pings a /24 and prints live hosts",
          "Write a loop that curls a list of URLs and saves status codes",
          "Make a script executable (chmod +x) and run it with ./"],
        tools:["bash"],
        res:[{t:"Bash scripting cheatsheet",u:"https://devhints.io/bash"},
             {t:"ShellCheck (lint your scripts)",u:"https://www.shellcheck.net/"},{t:"Bash Hackers Wiki",u:"https://wiki.bash-hackers.org/"}] },

      { id:"n_proc", t:"Processes, Services & systemd", d:"Know what's running and why.", lv:2, time:"~2h", skip:false,
        learn:[
          "ps, top/htop, and reading PID/PPID/owner",
          "systemctl to start/stop/enable services and read logs with journalctl",
          "Networking view: ss/netstat to map ports to processes"],
        do:[
          "List listening ports and their processes: `ss -tlnp`",
          "Inspect a service: `systemctl status ssh`",
          "Kill a process you started by PID"],
        tools:["ps","htop","systemctl","ss"],
        res:[{t:"systemd basics",u:"https://www.digitalocean.com/community/tutorials/systemd-essentials-working-with-services-units-and-the-journal"},{t:"systemd Documentation",u:"https://www.freedesktop.org/wiki/Software/systemd/"}] }
    ]},
    { id:"s1c", title:"Windows & A Scripting Language", nodes:[
      { id:"n_win", t:"Windows Internals Basics", d:"Most enterprises run Windows, so will your targets.", lv:2, time:"~4h", skip:false,
        learn:[
          "Registry, services, scheduled tasks, and the file system layout",
          "Users, groups, and the local SAM vs domain accounts",
          "NTFS permissions and UAC at a high level"],
        do:[
          "In a Windows VM, open Task Manager, Services.msc and regedit and explore",
          "List local users with `net user` in cmd",
          "Find scheduled tasks with `schtasks` "],
        tools:["cmd","regedit"],
        res:[{t:"Microsoft: Windows components",u:"https://learn.microsoft.com/en-us/windows/win32/"},{t:"LOLBAS (living-off-the-land)",u:"https://lolbas-project.github.io/"}] },

      { id:"n_ps", t:"PowerShell Fundamentals", d:"The attacker's power tool on Windows.", lv:2, time:"~3h", skip:true,
        tip:"Linux-only learners skip PowerShell, then freeze on their first Windows/AD box. Learn the verbs-nouns model early.",
        learn:[
          "Cmdlet Verb-Noun structure and the pipeline of objects (not text)",
          "Get-Help, Get-Command, Get-Member to explore anything",
          "Useful cmdlets: Get-Process, Get-Service, Get-ChildItem, Invoke-WebRequest"],
        do:[
          "Run `Get-Command -Verb Get` and skim what's available",
          "Pipe objects: `Get-Process | Sort-Object CPU -Descending | Select-Object -First 5`",
          "Download a file with `Invoke-WebRequest`"],
        tools:["PowerShell"],
        res:[{t:"Microsoft PowerShell Docs",u:"https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/00-introduction"}] },

      { id:"n_py", t:"Python for Hackers", d:"Write your own tools.", lv:2, time:"~8h", skip:false,
        learn:[
          "Core syntax: variables, lists/dicts, loops, functions, files",
          "The requests library for HTTP, and sockets for raw connections",
          "argparse to make real CLI tools; virtualenv/pip for packages"],
        do:[
          "Write a port scanner using the socket module",
          "Write a script that brute-forces a login form with requests",
          "Refactor one of your bash one-liners into a Python tool with argparse"],
        tools:["Python","requests"],
        res:[{t:"Automate the Boring Stuff (free)",u:"https://automatetheboringstuff.com/"},
             {t:"TryHackMe: Python Basics",u:"https://tryhackme.com/room/pythonbasics"},{t:"Official Python Tutorial",u:"https://docs.python.org/3/tutorial/"}] },

      { id:"n_web101", t:"How the Web Works", d:"The foundation of all web hacking.", lv:1, time:"~3h", skip:false,
        learn:[
          "HTTP request/response anatomy: methods, headers, status codes, body",
          "Cookies, sessions, and how login state is kept",
          "Client vs server, and where HTML/CSS/JS run"],
        do:[
          "Open browser DevTools → Network tab and inspect a real request",
          "Resend a request with curl and add a custom header (-H)",
          "Identify a Set-Cookie header and the session cookie it sets"],
        tools:["curl","DevTools"],
        res:[{t:"MDN: HTTP overview",u:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"},
             {t:"HTTP status codes",u:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"},{t:"web.dev Learn",u:"https://web.dev/learn"}] },

      { id:"n_git", t:"Git & Version Control", d:"Read code, grab tools, contribute back.", lv:1, time:"~2h", skip:true,
        tip:"Skipped until you urgently need to clone a tool or read a leaked repo. Learn it calmly now.",
        learn:[
          "clone, add, commit, push, pull, branch and what each does",
          "Reading a repo's history and finding secrets in old commits",
          "Why exposed .git folders on websites are a finding"],
        do:[
          "Clone a security tool from GitHub and read its README",
          "Make your own repo, commit notes, and push to GitHub",
          "Explore a repo's commit log with `git log --oneline`"],
        tools:["git"],
        res:[{t:"Git tutorial",u:"https://learngitbranching.js.org/"},{t:"Pro Git Book (free)",u:"https://git-scm.com/book/en/v2"}] }
    ]}
  ]
},

/* ============================ PHASE 2 ============================ */
{
  id:"p2", phase:"Phase 2: Reconnaissance & Enumeration", icon:"🔭",
  blurb:"Information gathering wins engagements. The more you map the attack surface, the more bugs you find. Be patient and thorough here.",
  stages:[
    { id:"s2a", title:"Passive Recon (OSINT)", nodes:[
      { id:"n_osint", t:"Open-Source Intelligence", d:"Learn the target without touching it.", lv:1, time:"~3h", skip:false,
        learn:[
          "Footprinting: employees, emails, tech stack, leaked creds, all from public data",
          "Google dorking with site:, inurl:, filetype:, intitle:",
          "Certificate transparency logs as a subdomain source"],
        do:[
          "Run `theHarvester -d example.com -b all` and review emails/hosts found",
          "Search crt.sh for a domain to list its certificates/subdomains",
          "Build 5 Google dorks targeting exposed files on a practice domain"],
        tools:["theHarvester","Google Dorks","crt.sh","Maltego"],
        res:[{t:"crt.sh",u:"https://crt.sh/"},
             {t:"Google Hacking Database",u:"https://www.exploit-db.com/google-hacking-database"},{t:"OSINT Framework",u:"https://osintframework.com/"}] },

      { id:"n_subs", t:"Subdomain Enumeration", d:"Find the real, full attack surface.", lv:2, time:"~3h", skip:true,
        tip:"Most beginners test the main domain and stop. The bugs live on forgotten subdomains (dev, staging, old apps). Go wide.",
        learn:[
          "Passive (APIs/CT logs) vs active (brute-force/DNS) enumeration",
          "Resolving which subdomains are alive and what's running on them",
          "Chaining: enumerate → resolve → probe HTTP → screenshot"],
        do:[
          "Run `subfinder -d example.com` then `amass enum -passive -d example.com`",
          "Resolve and probe live hosts with httpx",
          "Screenshot all live subdomains to triage interesting ones"],
        tools:["subfinder","amass","assetfinder","httpx"],
        res:[{t:"Subfinder",u:"https://github.com/projectdiscovery/subfinder"},
             {t:"OWASP Amass",u:"https://github.com/owasp-amass/amass"},{t:"Sublist3r",u:"https://github.com/aboul3la/Sublist3r"}] },

      { id:"n_metadata", t:"Metadata & Document Analysis", d:"Public files leak secrets.", lv:2, time:"~1h", skip:true,
        tip:"A company PDF can leak usernames, internal paths and software versions in its metadata. Free intel everyone ignores.",
        learn:[
          "EXIF/metadata in images and documents",
          "What usernames and software versions in metadata enable",
          "Automating doc discovery + extraction"],
        do:[
          "Run `exiftool` on an image and read every field",
          "Download a public PDF and extract its author/creator metadata",
          "Note any usernames found, they feed password attacks later"],
        tools:["exiftool","FOCA"],
        res:[{t:"ExifTool",u:"https://exiftool.org/"}] }
    ]},
    { id:"s2b", title:"Active Scanning & Enumeration", nodes:[
      { id:"n_nmap", t:"Port & Service Scanning with Nmap", d:"The single most important recon tool.", lv:2, time:"~5h", skip:false,
        learn:[
          "Host discovery, TCP SYN scan (-sS), and full port scan (-p-)",
          "Service/version detection (-sV), OS detection (-O), default scripts (-sC)",
          "Timing (-T), output formats (-oA), and the Nmap Scripting Engine (NSE)"],
        do:[
          "Scan a lab box: `nmap -sC -sV -oA scan <ip>` and read every line",
          "Run a full port scan `nmap -p- <ip>` and compare to the default top-1000",
          "Use one NSE script, e.g. `nmap --script http-title <ip>`"],
        tools:["nmap","masscan","rustscan"],
        res:[{t:"Nmap Reference Guide",u:"https://nmap.org/book/man.html"},
             {t:"TryHackMe: Nmap",u:"https://tryhackme.com/room/furthernmap"}] },

      { id:"n_enum", t:"Service Enumeration (SMB, FTP, HTTP, etc.)", d:"Dig into every open port you found.", lv:2, time:"~5h", skip:false,
        learn:[
          "Per-service enumeration: SMB shares, FTP anonymous login, HTTP tech & dirs",
          "Pulling banners and versions, then mapping to known CVEs",
          "Turning 'a port is open' into 'here's exactly what's running'"],
        do:[
          "Enumerate SMB: `enum4linux -a <ip>` and list shares with smbclient",
          "Check FTP for anonymous login, and grab the HTTP server header",
          "For every service version, search for a public exploit"],
        tools:["enum4linux","smbclient","whatweb","searchsploit"],
        res:[{t:"HackTricks: Pentesting ports",u:"https://book.hacktricks.xyz/network-services-pentesting/pentesting-network"}] },

      { id:"n_vuln", t:"Vulnerability Scanning", d:"Automated discovery, then verify by hand.", lv:2, time:"~2h", skip:false,
        learn:[
          "What scanners do well (coverage) and badly (false positives)",
          "Template-based scanning with nuclei",
          "Always manually confirming a finding before reporting"],
        do:[
          "Run `nuclei -u https://target` against a lab app",
          "Pick one finding and reproduce it manually to confirm it's real",
          "Note false positives you found to build judgment"],
        tools:["nuclei","Nessus","OpenVAS"],
        res:[{t:"Nuclei",u:"https://github.com/projectdiscovery/nuclei"},{t:"Nessus Essentials (free)",u:"https://www.tenable.com/products/nessus/nessus-essentials"}] },

      { id:"n_banner", t:"Banner Grabbing & Version Mapping", d:"A tiny detail with huge payoff.", lv:1, time:"~1h", skip:true,
        tip:"An exact version string (e.g. 'vsftpd 2.3.4') often maps directly to a public exploit. Beginners read 'open' and move on; pros read the version.",
        learn:[
          "Grabbing banners manually with netcat/curl",
          "Mapping version → CVE → public exploit",
          "Using searchsploit offline"],
        do:[
          "Grab a banner: `nc <ip> 21` or `curl -I http://<ip>`",
          "Search the version: `searchsploit vsftpd 2.3.4`",
          "Record version+CVE pairs in your notes"],
        tools:["netcat","curl","whatweb","searchsploit"],
        res:[{t:"Exploit-DB",u:"https://www.exploit-db.com/"},{t:"Shodan",u:"https://www.shodan.io/"}] }
    ]}
  ]
},

/* ============================ PHASE 3 ============================ */
{
  id:"p3", phase:"Phase 3: Web Application Security", icon:"🕸️",
  blurb:"The biggest attack surface on earth and the fastest path to bug bounty income. Learn the OWASP Top 10 by exploiting each one in a lab, not just reading about it.",
  stages:[
    { id:"s3a", title:"Set Up & Learn the Method", nodes:[
      { id:"n_burp", t:"Master Burp Suite", d:"Your web-hacking home base.", lv:2, time:"~5h", skip:false,
        learn:[
          "Proxy: intercept and modify requests between browser and server",
          "Repeater (replay/tweak requests), Intruder (automate), Decoder, Comparer",
          "Scoping the target so you only capture relevant traffic"],
        do:[
          "Install Burp Community, configure the browser proxy + CA cert",
          "Intercept a login request, send it to Repeater, change a value, resend",
          "Use Intruder to fuzz a parameter with a small wordlist"],
        tools:["Burp Suite","FoxyProxy"],
        res:[{t:"PortSwigger: Burp docs",u:"https://portswigger.net/burp/documentation/desktop/getting-started"}] },

      { id:"n_labs", t:"Deliberate Practice (PortSwigger Academy)", d:"Where web skills are actually built.", lv:2, time:"~ongoing", skip:false,
        learn:[
          "Working labs by vulnerability class until patterns are automatic",
          "Reading the 'why', not just copying the payload",
          "Tracking which classes you've mastered"],
        do:[
          "Create a free PortSwigger account and finish the 'SQL injection' track",
          "Then do XSS and Access Control tracks",
          "Log every solved lab in your notes with the key insight"],
        tools:["PortSwigger Academy","DVWA"],
        res:[{t:"PortSwigger Web Security Academy (free)",u:"https://portswigger.net/web-security"},
             {t:"PayloadsAllTheThings",u:"https://github.com/swisskyrepo/PayloadsAllTheThings"},{t:"OWASP Juice Shop",u:"https://owasp.org/www-project-juice-shop/"}] },

      { id:"n_dirb", t:"Content Discovery (Fuzzing)", d:"Find hidden endpoints & files.", lv:2, time:"~2h", skip:true,
        tip:"The admin panel, backup.zip, or /api/v1 you never see in the UI is found by fuzzing. Skipping this = missing half the attack surface.",
        learn:[
          "Directory/file brute-forcing with good wordlists",
          "Filtering by status code and response size",
          "Recursion and extensions (.php, .bak, .zip)"],
        do:[
          "Run `ffuf -u https://target/FUZZ -w wordlist.txt`",
          "Filter out noise by size/status and find a hidden path",
          "Try extension fuzzing for backups (.bak, .old, .zip)"],
        tools:["ffuf","gobuster","feroxbuster","SecLists"],
        res:[{t:"SecLists (wordlists)",u:"https://github.com/danielmiessler/SecLists"},
             {t:"ffuf",u:"https://github.com/ffuf/ffuf"}] }
    ]},
    { id:"s3b", title:"OWASP Top 10, Exploit Each One", nodes:[
      { id:"n_inj", t:"SQL Injection", d:"Make the database do what you want.", lv:2, time:"~5h", skip:false,
        learn:[
          "How user input reaches a SQL query unsafely",
          "Types: error-based, UNION-based, blind boolean, blind time-based",
          "Reading the DB: extracting tables, columns, credentials"],
        do:[
          "Solve PortSwigger's SQLi labs by hand before using tools",
          "Then automate one with `sqlmap -u '...' --batch --dump`",
          "Document the exact payload and why it worked"],
        tools:["sqlmap","Burp Suite"],
        res:[{t:"PortSwigger: SQL injection",u:"https://portswigger.net/web-security/sql-injection"},{t:"PayloadsAllTheThings",u:"https://github.com/swisskyrepo/PayloadsAllTheThings"}] },

      { id:"n_xss", t:"Cross-Site Scripting (XSS)", d:"Run your JavaScript in a victim's browser.", lv:2, time:"~4h", skip:false,
        learn:[
          "Reflected, stored, and DOM-based XSS, and the differences",
          "Output contexts (HTML, attribute, JS) and how they change the payload",
          "Real impact: session theft, account takeover, keylogging"],
        do:[
          "Solve PortSwigger reflected + stored + DOM XSS labs",
          "Craft a payload that calls `document.cookie`",
          "Try a context you struggled with until the payload fires"],
        tools:["Burp Suite"],
        res:[{t:"PortSwigger: XSS",u:"https://portswigger.net/web-security/cross-site-scripting"},{t:"OWASP XSS Prevention Cheat Sheet",u:"https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"}] },

      { id:"n_idor", t:"Broken Access Control / IDOR", d:"Change an ID, read someone else's data.", lv:1, time:"~3h", skip:true,
        tip:"IDOR is the easiest high-impact bug-bounty win and beginners overlook it. Always test: can I access object 1235 instead of my 1234?",
        learn:[
          "Horizontal vs vertical privilege escalation",
          "IDOR: directly referencing another user's object by id/uuid",
          "Forced browsing to admin-only functions"],
        do:[
          "Find a request with an id parameter and increment/decrement it",
          "Try accessing an admin endpoint as a normal user",
          "Test changing a UUID or swapping it for another account's"],
        tools:["Burp Suite"],
        res:[{t:"PortSwigger: Access control",u:"https://portswigger.net/web-security/access-control"}] },

      { id:"n_auth", t:"Authentication & Session Flaws", d:"Break the login.", lv:2, time:"~4h", skip:false,
        learn:[
          "Weak password reset, username enumeration, brute-force protection gaps",
          "Session fixation, predictable tokens, and JWT misconfigurations",
          "MFA bypass patterns"],
        do:[
          "Test a login for username enumeration (different error/timing)",
          "Decode a JWT on jwt.io and test the 'alg:none' / weak-secret issues in a lab",
          "Attempt a password-reset logic flaw on a practice app"],
        tools:["Burp Suite","jwt_tool","Hydra"],
        res:[{t:"PortSwigger: Authentication",u:"https://portswigger.net/web-security/authentication"},
             {t:"PortSwigger: JWT attacks",u:"https://portswigger.net/web-security/jwt"}] },

      { id:"n_ssrf", t:"SSRF, SSTI, XXE & Injection Cousins", d:"High-impact server-side classics.", lv:3, time:"~5h", skip:false,
        learn:[
          "SSRF: make the server request internal/cloud-metadata URLs",
          "SSTI: template injection leading to RCE",
          "XXE: abusing XML parsers to read files / SSRF"],
        do:[
          "Solve PortSwigger SSRF labs (incl. cloud metadata 169.254.169.254)",
          "Detect SSTI with `{{7*7}}` style probes and escalate in a lab",
          "Exploit an XXE to read /etc/passwd in a lab"],
        tools:["Burp Suite"],
        res:[{t:"PortSwigger: SSRF",u:"https://portswigger.net/web-security/ssrf"},
             {t:"PortSwigger: XXE",u:"https://portswigger.net/web-security/xxe"}] },

      { id:"n_misconfig", t:"Security Misconfiguration", d:"Free wins hiding in plain sight.", lv:1, time:"~2h", skip:true,
        tip:"Default credentials, exposed .git, open S3 buckets, verbose stack traces, unglamorous but they win real bounties constantly.",
        learn:[
          "Default/weak credentials on admin panels and devices",
          "Exposed sensitive files: .git, .env, backups, directory listing",
          "Verbose errors and debug modes that leak internals"],
        do:[
          "Check for /.git/ and try to dump it with git-dumper in a lab",
          "Test default creds (admin:admin) on a practice admin panel",
          "Trigger an error and read what the stack trace reveals"],
        tools:["git-dumper","nuclei"],
        res:[{t:"OWASP Top 10",u:"https://owasp.org/www-project-top-ten/"},{t:"OWASP Top 10: Misconfiguration",u:"https://owasp.org/Top10/A05_2021-Security_Misconfiguration/"}] }
    ]}
  ]
},

/* ============================ PHASE 4 ============================ */
{
  id:"p4", phase:"Phase 4: Exploitation & Post-Exploitation", icon:"💥",
  blurb:"Turn access into impact, responsibly and inside scope. This is where recon and web skills pay off on full machines.",
  stages:[
    { id:"s4a", title:"Gaining a Foothold", nodes:[
      { id:"n_msf", t:"The Metasploit Framework", d:"Understand it, don't just click 'exploit'.", lv:2, time:"~4h", skip:false,
        learn:[
          "Modules: exploits, payloads, auxiliary, post, and how they fit together",
          "Choosing a payload (staged vs stageless, reverse vs bind)",
          "Meterpreter basics and what each module actually does to the target"],
        do:[
          "Exploit a known-vulnerable lab box end-to-end with msfconsole",
          "Set LHOST/LPORT correctly and catch a meterpreter session",
          "Read the module source to understand the vulnerability it uses"],
        tools:["Metasploit","msfvenom"],
        res:[{t:"Metasploit Unleashed (free)",u:"https://www.offsec.com/metasploit-unleashed/"},{t:"Metasploit Docs",u:"https://docs.metasploit.com/"}] },

      { id:"n_shells", t:"Shells, Payloads & TTY Upgrade", d:"Get a shell, then make it usable.", lv:2, time:"~3h", skip:true,
        tip:"Everyone forgets to stabilize the shell, then loses it the moment they hit Ctrl-C. Learn the TTY upgrade trick once and never struggle again.",
        learn:[
          "Bind vs reverse shells and when each works (firewalls/NAT)",
          "Generating payloads with msfvenom for different targets",
          "Upgrading a dumb shell to a full interactive TTY"],
        do:[
          "Catch a reverse shell with `nc -lvnp 4444`",
          "Stabilize it: `python3 -c 'import pty;pty.spawn(\"/bin/bash\")'` then `stty raw -echo; fg`",
          "Generate a reverse-shell payload with msfvenom"],
        tools:["netcat","socat","msfvenom"],
        res:[{t:"PayloadsAllTheThings: Reverse Shell",u:"https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md"},
             {t:"revshells.com",u:"https://www.revshells.com/"}] },

      { id:"n_pwcrack", t:"Password Attacks & Cracking", d:"Online spraying and offline cracking.", lv:2, time:"~4h", skip:false,
        learn:[
          "Hash types and how to identify them",
          "Online (Hydra against a service) vs offline (hashcat/John on a hash file)",
          "Wordlists, rules, and password spraying vs brute-force (lockouts!)"],
        do:[
          "Identify a hash with hashid, then crack it: `hashcat -m 0 hash.txt rockyou.txt`",
          "Crack a Linux hash with John",
          "Brute one login carefully with Hydra in a lab"],
        tools:["hashcat","John the Ripper","Hydra","hashid"],
        res:[{t:"Hashcat wiki",u:"https://hashcat.net/wiki/"},
             {t:"CrackStation wordlists",u:"https://crackstation.net/"},{t:"Hashcat Example Hashes",u:"https://hashcat.net/wiki/doku.php?id=example_hashes"}] }
    ]},
    { id:"s4b", title:"After the Breach", nodes:[
      { id:"n_privesc", t:"Privilege Escalation (Linux & Windows)", d:"From user to root/SYSTEM.", lv:3, time:"~8h", skip:false,
        learn:[
          "Linux: SUID binaries, sudo misconfig, cron jobs, capabilities, kernel exploits",
          "Windows: unquoted service paths, token privileges, AlwaysInstallElevated",
          "Running enumeration scripts and reading their output critically"],
        do:[
          "Run linPEAS on a lab box and chase one highlighted finding to root",
          "Exploit a sudo or SUID misconfig using GTFOBins",
          "On Windows, run winPEAS and escalate via a service misconfig"],
        tools:["linPEAS","winPEAS","GTFOBins","pspy"],
        res:[{t:"GTFOBins",u:"https://gtfobins.github.io/"},
             {t:"HackTricks: Linux PrivEsc",u:"https://book.hacktricks.xyz/linux-hardening/privilege-escalation"}] },

      { id:"n_pivot", t:"Pivoting & Lateral Movement", d:"Use one box to reach the rest.", lv:3, time:"~4h", skip:false,
        learn:[
          "Why internal hosts aren't reachable directly, and what a pivot is",
          "Port forwarding and SOCKS proxies (chisel, ssh -L/-D, proxychains)",
          "Lateral movement with reused credentials"],
        do:[
          "Set up a SOCKS proxy with chisel and route tools through proxychains",
          "SSH dynamic port-forward (-D) to reach an internal service",
          "Reach a second box that was invisible before the pivot"],
        tools:["chisel","proxychains","ssh","sshuttle"],
        res:[{t:"HackTricks: Tunneling & Pivoting",u:"https://book.hacktricks.xyz/generic-methodologies-and-resources/tunneling-and-port-forwarding"},{t:"Chisel (fast tunnels)",u:"https://github.com/jpillora/chisel"}] },

      { id:"n_persist", t:"Persistence, Cleanup & Loot", d:"Stay in, then prove it and clean up.", lv:3, time:"~2h", skip:true,
        tip:"A professional documents every change and removes it afterward. Persistence isn't 'cool', untracked changes left on a client's box are how you lose trust (and contracts).",
        learn:[
          "Common persistence (authorized keys, cron, services, scheduled tasks)",
          "Looting: creds, configs, keys, and pivoting data to gather",
          "Why you must log and reverse every change you make"],
        do:[
          "Add and then REMOVE a test persistence mechanism in your lab",
          "Practice collecting loot into your notes folder systematically",
          "Write a 'cleanup checklist' you can hand a client"],
        tools:[],
        res:[{t:"MITRE ATT&CK: Persistence",u:"https://attack.mitre.org/tactics/TA0003/"}] }
    ]}
  ]
},

/* ============================ PHASE 5 ============================ */
{
  id:"p5", phase:"Phase 5: Specializations (Pick Your Path)", icon:"🚀",
  blurb:"You don't need all of these, go deep on what excites you: enterprise AD, cloud, APIs, mobile, or DevSecOps. Each is a career on its own.",
  stages:[
    { id:"s5a", title:"Enterprise & Cloud", nodes:[
      { id:"n_ad", t:"Active Directory Attacks", d:"The enterprise endgame.", lv:3, time:"~12h", skip:false,
        learn:[
          "AD concepts: domains, OUs, GPOs, Kerberos, NTLM",
          "Attacks: Kerberoasting, AS-REP roasting, NTLM relay, Pass-the-Hash",
          "Mapping attack paths with BloodHound"],
        do:[
          "Build a small AD lab (or use TryHackMe/HTB AD rooms)",
          "Collect data with BloodHound and find a path to Domain Admin",
          "Perform a Kerberoast and crack the ticket offline"],
        tools:["BloodHound","Impacket","CrackMapExec","Rubeus"],
        res:[{t:"TryHackMe: AD basics",u:"https://tryhackme.com/room/winadbasics"},
             {t:"HackTricks: AD methodology",u:"https://book.hacktricks.xyz/windows-hardening/active-directory-methodology"}] },

      { id:"n_cloud", t:"Cloud Pentesting (AWS/Azure/GCP)", d:"Where modern infrastructure lives.", lv:3, time:"~8h", skip:false,
        learn:[
          "IAM, roles, and over-permissioned policies",
          "Metadata service abuse (via SSRF) and exposed storage buckets",
          "Cloud-specific enumeration and privilege escalation"],
        do:[
          "Run flaws.cloud (free AWS hacking challenge) start to finish",
          "Audit a cloud account with ScoutSuite and read the findings",
          "Find and read an exposed S3 bucket in a lab/CTF"],
        tools:["ScoutSuite","Pacu","awscli"],
        res:[{t:"flaws.cloud (free)",u:"http://flaws.cloud/"},
             {t:"flaws2.cloud",u:"http://flaws2.cloud/"},{t:"HackTricks Cloud",u:"https://cloud.hacktricks.xyz/"}] }
    ]},
    { id:"s5b", title:"Modern Attack Surfaces", nodes:[
      { id:"n_api", t:"API Security", d:"The fastest-growing attack surface.", lv:2, time:"~5h", skip:false,
        learn:[
          "REST & GraphQL basics and how APIs differ from web pages",
          "OWASP API Top 10: BOLA (object-level auth), mass assignment, excessive data exposure",
          "Discovering and fuzzing API endpoints from docs/JS files"],
        do:[
          "Import an API into Postman and map its endpoints",
          "Test BOLA by swapping object IDs across accounts",
          "Probe a GraphQL endpoint with introspection in a lab"],
        tools:["Postman","Burp Suite","ffuf"],
        res:[{t:"OWASP API Security Top 10",u:"https://owasp.org/API-Security/editions/2023/en/0x00-header/"},
             {t:"crAPI vulnerable API",u:"https://github.com/OWASP/crAPI"}] },

      { id:"n_mobile", t:"Mobile App Security (Android/iOS)", d:"Apps in your pocket, bugs in their code.", lv:3, time:"~6h", skip:false,
        learn:[
          "APK structure, static analysis, and decompiling to read code",
          "Dynamic analysis & traffic interception (bypassing cert pinning)",
          "Insecure storage, hardcoded secrets, and exported components"],
        do:[
          "Decompile an APK with jadx and search for secrets/URLs",
          "Run MobSF on an APK and read its automated report",
          "Intercept app traffic through Burp on an emulator"],
        tools:["MobSF","jadx","Frida","Burp Suite"],
        res:[{t:"OWASP MASTG",u:"https://mas.owasp.org/MASTG/"},
             {t:"MobSF",u:"https://github.com/MobSF/Mobile-Security-Framework-MobSF"}] },

      { id:"n_devsecops", t:"DevSecOps & CI/CD Security", d:"Attack the software supply chain.", lv:3, time:"~4h", skip:true,
        tip:"Secrets committed to git, poisoned pipelines, and vulnerable containers are everywhere, and most pentesters never look. A growing, underserved niche.",
        learn:[
          "Secrets in repos and how to scan for them",
          "CI/CD pipeline risks (poisoned builds, exposed runners)",
          "Container & image scanning, and supply-chain basics"],
        do:[
          "Scan a repo for secrets with trufflehog",
          "Scan a container image with trivy and read the CVEs",
          "Review a public CI config for an injectable step"],
        tools:["trufflehog","trivy","gitleaks"],
        res:[{t:"trufflehog",u:"https://github.com/trufflesecurity/trufflehog"},
             {t:"Trivy",u:"https://github.com/aquasecurity/trivy"},{t:"OWASP DevSecOps Guideline",u:"https://owasp.org/www-project-devsecops-guideline/"}] }
    ]}
  ]
},

/* ============================ PHASE 6 ============================ */
{
  id:"p6", phase:"Phase 6: Bug Bounty, Certs & Career", icon:"🏆",
  blurb:"Turn skills into reputation, income, and a job. Consistency and good reporting matter more than raw talent here.",
  stages:[
    { id:"s6a", title:"Earn & Prove It", nodes:[
      { id:"n_bb", t:"Bug Bounty Hunting", d:"Get paid for finding real bugs.", lv:2, time:"~ongoing", skip:false,
        learn:[
          "How platforms work and how to read a program's scope/rules",
          "Picking a target and a repeatable methodology to hunt it",
          "Triage, duplicates, and managing your own expectations"],
        do:[
          "Create HackerOne & Bugcrowd accounts and read 3 program policies",
          "Pick ONE program with a wide scope and recon it thoroughly",
          "Read 10 disclosed reports to learn what real bugs look like"],
        tools:["HackerOne","Bugcrowd","Intigriti"],
        res:[{t:"HackerOne Hacktivity (disclosed bugs)",u:"https://hackerone.com/hacktivity"},
             {t:"Bugcrowd University",u:"https://www.bugcrowd.com/hackers/bugcrowd-university/"}] },

      { id:"n_report", t:"Writing Great Reports", d:"The most undervalued skill in the field.", lv:2, time:"~2h", skip:true,
        tip:"A critical bug with a confusing report gets a low bounty (or rejected). A clear report with impact + reproduction steps gets paid fast. This single skill changes your income.",
        learn:[
          "Report anatomy: title, summary, impact, steps to reproduce, PoC, remediation",
          "Writing for a busy triager, clarity and impact first",
          "Good screenshots, request/response evidence, and severity (CVSS)"],
        do:[
          "Take a lab finding and write a full professional report for it",
          "Score it with a CVSS calculator and justify the rating",
          "Get feedback or compare against a public disclosed report"],
        tools:["CVSS Calculator"],
        res:[{t:"CVSS Calculator",u:"https://www.first.org/cvss/calculator/3.1"},
             {t:"How to write a good report",u:"https://docs.hackerone.com/en/articles/8470531-quality-reports"},{t:"OWASP Disclosure Cheat Sheet",u:"https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html"}] },

      { id:"n_certs", t:"Certifications & Portfolio", d:"Prove your skills to employers.", lv:2, time:"~varies", skip:false,
        learn:[
          "Beginner-friendly certs (eJPT, PNPT) vs the respected OSCP",
          "Building a public portfolio: write-ups, GitHub tools, CTF profiles",
          "Picking a cert that matches your goal (job vs bounty)"],
        do:[
          "Start a blog and publish one detailed lab/CTF write-up",
          "Make a CTF profile (TryHackMe/HTB) and climb a bit",
          "Pick a first cert target and plan the study path"],
        tools:["OSCP","PNPT","eJPT","CPTS"],
        res:[{t:"TCM Security (PNPT/PEH)",u:"https://academy.tcm-sec.com/"},
             {t:"OffSec OSCP",u:"https://www.offsec.com/courses/pen-200/"},{t:"CompTIA Security+",u:"https://www.comptia.org/certifications/security"}] },

      { id:"n_community", t:"Community & Never Stop Learning", d:"The field changes every week.", lv:1, time:"~ongoing", skip:true,
        tip:"The hackers who stay relevant follow researchers, read new disclosures, and keep practicing. Stagnation is the real vulnerability.",
        learn:[
          "Where security news/research lives (Twitter/X, blogs, newsletters)",
          "Learning from disclosed reports and CTF write-ups",
          "Giving back: teaching, tooling, and translations"],
        do:[
          "Follow 10 active security researchers and read weekly",
          "Subscribe to one newsletter (e.g. tl;dr sec) and one CTF feed",
          "Contribute one fix/translation to an open-source security project"],
        tools:[],
        res:[{t:"tl;dr sec newsletter",u:"https://tldrsec.com/"},
             {t:"Awesome Hacking",u:"https://github.com/Hack-with-Github/Awesome-Hacking"},{t:"r/netsec",u:"https://www.reddit.com/r/netsec/"}] }
    ]}
  ]
}
];
