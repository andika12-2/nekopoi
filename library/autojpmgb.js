const fs = require('fs');
const path = require('path');

// Import conn dari file utama (sesuaikan dengan struktur Anda)
// const { conn } = require('../index.js'); // Sesuaikan path

async function startAutoJPMGB(conn) {
  console.log('[AutoJPMGB] System started...');
  
  async function checkAndSend() {
    try {
      // Baca status
      const statusPath = path.join(__dirname, 'database/status_autojpmgb.json');
      let statusData = { status: 'off' };
      
      if (fs.existsSync(statusPath)) {
        statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
      }
      
      // Jika status off, skip
      if (statusData.status !== 'on') {
        setTimeout(checkAndSend, 60000); // Cek setiap 1 menit
        return;
      }
      
      // Baca konfigurasi
      const configPath = path.join(__dirname, 'database/autojpmgb.json');
      let configData = { message: "", interval: 0, lastRun: null };
      
      if (fs.existsSync(configPath)) {
        configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
      
      // Validasi konfigurasi
      if (!configData.message || !configData.interval || configData.interval < 60000) {
        console.log('[AutoJPMGB] Konfigurasi belum lengkap atau interval terlalu pendek (min 1 menit)');
        setTimeout(checkAndSend, 60000);
        return;
      }
      
      const now = Date.now();
      const lastRun = configData.lastRun || 0;
      const timeSinceLastRun = now - lastRun;
      
      // Cek apakah sudah waktunya kirim pesan
      if (timeSinceLastRun >= configData.interval) {
        console.log(`[AutoJPMGB] Mulai mengirim pesan ke semua grup...`);
        
        // Ambil semua grup
        const allgrup = await conn.groupFetchAllParticipating();
        const res = Object.keys(allgrup);
        let count = 0;
        
        // Update lastRun sebelum mulai kirim
        configData.lastRun = now;
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
        
        // Kirim ke semua grup
        for (let i of res) {
          // Cek blacklist
          if (global.db.groups && global.db.groups[i] && 
              global.db.groups[i].blacklistjpm && 
              global.db.groups[i].blacklistjpm == true) {
            console.log(`[AutoJPMGB] Skip grup ${i} (blacklisted)`);
            continue;
          }
          
          try {
            await conn.sendMessage(i, { text: configData.message });
            count += 1;
            console.log(`[AutoJPMGB] Berhasil kirim ke grup ${i}`);
          } catch (error) {
            console.error(`[AutoJPMGB] Gagal kirim ke grup ${i}:`, error.message);
          }
          
          // Delay antar grup (jika ada di config global)
          if (global.delayJpm) {
            await sleep(global.delayJpm);
          } else {
            await sleep(1000); // Default delay 1 detik
          }
        }
        
        console.log(`[AutoJPMGB] Selesai! Terkirim ke ${count} grup.`);
        
        // Update lastRun setelah selesai
        configData.lastRun = Date.now();
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
      }
      
      // Jadwalkan pengecekan berikutnya
      const checkInterval = Math.min(60000, configData.interval); // Cek setiap 1 menit atau interval
      setTimeout(checkAndSend, checkInterval);
      
    } catch (error) {
      console.error('[AutoJPMGB] Error:', error);
      setTimeout(checkAndSend, 60000); // Coba lagi dalam 1 menit jika error
    }
  }
  
  // Fungsi sleep helper
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Mulai pengecekan
  checkAndSend();
}

module.exports = { startAutoJPMGB };