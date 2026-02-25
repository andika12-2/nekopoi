/*

  !- Base By Skyzopedia
  https://wa.me/6285624297894
    !- Pengembang By AlLuffy
  https://wa.me/6285720866796
  !- Credits By AlLuffy
  
  Bantu Folow Channel AlLuffy
  https://whatsapp.com/channel/0029VavsEpc8kyyG9PxG8s38
  
*/

const fs = require('fs');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const statusPath = './library/database/autojpmch_status.json';
const teksPath = './library/database/autojpmch_text.json';
const saluranPath = './library/database/idsaluran.json';

let teksIndex = 0; // untuk ganti teks bergiliran

async function autoJPMCH(conn) {
  try {
    if (!fs.existsSync(statusPath)) return;
    const { status } = JSON.parse(fs.readFileSync(statusPath));
    if (!status) return;

    const daftarSaluran = JSON.parse(fs.readFileSync(saluranPath));
    if (!daftarSaluran.length) return console.log("[AUTOJPMCH] Daftar channel kosong.");

    const { texts } = JSON.parse(fs.readFileSync(teksPath)); // ← multiple texts
    if (!texts || !texts.length) return console.log("[AUTOJPMCH] Teks kosong.");

    const teksSekarang = texts[teksIndex]; // ambil teks berdasarkan index
    teksIndex = (teksIndex + 1) % texts.length; // next teks (loop)

    for (const id of daftarSaluran) {
      try {
        await conn.sendMessage(id, { text: teksSekarang });
        console.log(`[AUTOJPMCH] ✅ Terkirim ke ${id}`);
        await delay(1000); // Delay antar kirim (1 detik)
      } catch (err) {
        console.error(`[AUTOJPMCH] ❌ Gagal ke ${id}: ${err.message}`);
      }
    }

  } catch (err) {
    console.error("[AUTOJPMCH] Error:", err.message);
  }
}

function startAutoJPMCH() {
  setInterval(() => {
    try {
      if (!fs.existsSync(statusPath)) return;
      const { status } = JSON.parse(fs.readFileSync(statusPath));
      if (status) {
        if (!global.autoJPMCH_aktif) {
          console.log("[AUTOJPMCH] Aktif. Kirim otomatis setiap 15 menit.");
          global.autoJPMCH_aktif = true;
        }
        if (global.conn) autoJPMCH(global.conn);
      } else {
        if (global.autoJPMCH_aktif) {
          console.log("[AUTOJPMCH] Nonaktif. Berhenti kirim otomatis.");
          global.autoJPMCH_aktif = false;
        }
      }
    } catch (err) {
      console.error("[AUTOJPMCH] Error interval:", err.message);
    }
  }, 900000); // 15 menit
}

module.exports = { autoJPMCH, startAutoJPMCH };