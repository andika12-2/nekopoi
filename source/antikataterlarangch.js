/*

  !- Base By Skyzopedia
  https://wa.me/6285624297894
    !- Pengembang By AlLuffy
  https://wa.me/6283839137381
  !- Credits By AlLuffy
  
  Bantu Folow Channel AlLuffy
  https://whatsapp.com/channel/0029VavsEpc8kyyG9PxG8s38
  
*/

const fs = require("fs");
const path = require("path");

// gunakan proses root agar path konsisten
const statusFile = path.join(process.cwd(), "library", "database", "status_antikatach.json");

function ensureDirExists(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function loadStatus() {
    try {
        ensureDirExists(statusFile);
        if (!fs.existsSync(statusFile)) {
            fs.writeFileSync(statusFile, JSON.stringify({ antikatach: false }, null, 2));
            return { antikatach: false };
        }
        const raw = fs.readFileSync(statusFile, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("loadStatus error:", err);
        return { antikatach: false };
    }
}

function saveStatus(status) {
    try {
        ensureDirExists(statusFile);
        fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
    } catch (err) {
        console.error("saveStatus error:", err);
    }
}

const forbiddenWords = [
    "anjing",
    "babi",
    "tolol",
    "goblok",
    "memek",
    "suntik",
    "kontol",
    "monyet",
    "jembut",
    "titit",
    "sange",
    "kencing",
    "catbox",
    "ngewe",
    "coli",
    "judi",
    "vercel",
    "unchek",
    "jasteb",
    "sewa wa",
    "sewawa",
    "freelance",
    "free lance",
    "judol",
    "prem",
    "premium"
];

module.exports = (Sky, store) => {

    Sky.ev.on("messages.upsert", async (messageUpdate) => {
        const messages = messageUpdate.messages;
        if (!messages) return;

        for (let m of messages) {
            if (!m.message || !m.key || m.key.fromMe) continue;

            let msgText = "";
            const type = Object.keys(m.message)[0];

            if (type === "conversation") {
                msgText = m.message.conversation;
            } else if (type === "extendedTextMessage") {
                msgText = m.message.extendedTextMessage.text;
            } else if (type === "imageMessage" && m.message.imageMessage.caption) {
                msgText = m.message.imageMessage.caption;
            }

            if (!msgText) continue;

            const status = loadStatus();
            if (!status.antikatach) continue;

            const lc = msgText.toLowerCase();
            for (let word of forbiddenWords) {
                if (lc.includes(word)) {
                    console.log(`[Anti Kata] Menghapus pesan dari ${m.key.participant || "Unknown"} karena mengandung kata terlarang "${word}"`);
                    try {
                        await Sky.sendMessage(m.key.remoteJid, {
                            delete: {
                                remoteJid: m.key.remoteJid,
                                fromMe: false,
                                id: m.key.id
                            }
                        });
                    } catch (e) {
                        console.error("Gagal hapus pesan:", e);
                    }
                    break;
                }
            }
        }
    });

    // tampilkan log hanya jika aktif
    const status = loadStatus();
    if (status.antikatach) {
        console.log("[Anti Kata Terlarang] Aktif ✅");
    }

    return { loadStatus, saveStatus };
};