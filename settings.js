/*

  !- Base By Skyzopedia
  https://wa.me/6285624297894
    !- Pengembang By AlLuffy
  https://wa.me/6283840240138
  !- Credits By AlLuffy
  
  Bantu Folow Channel AlLuffy
  https://whatsapp.com/channel/0029VavsEpc8kyyG9PxG8s38
  
*/

const fs = require('fs');
const chalk = require('chalk');
const { version } = require("./package.json")

//~~~~~~~~~~~ Settings Bot ~~~~~~~~~~~//
global.owner = '6282295535487'
global.botNumber = '6282295535387'
global.versi = version
global.versiBot = "5.0"
global.namaOwner = "Boti"
global.packname = 'Bot WhatsApp'
global.botname = 'Boti Jpmch'
global.botname2 = 'Boti Jpmch'

//~~~~~~~~~~~ Settings Link ~~~~~~~~~~//
global.linkOwner = "https://wa.me/"
global.linkTelegram = "https://t.me/"
global.linkGrup = "https://chat.whatsapp.com/"
global.ApikeyRestApi = "ubot"

//~~~~~~~~~~~ Manage Vercell ~~~~~~~~~~//
global.vercelToken = "AnLcrZENIT3qx9d742Ycoc7g" //Your Vercel Token

//~~~~~~~~~~~ Manage GitHub ~~~~~~~~~~//
global.githubToken = "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" //Your GitHub Token
global.githubUsername = "website-terbaru" //Your GitHub Username

//~~~~~~~~~~~ Settings Jeda ~~~~~~~~~~//
global.delayJpm = 3500
global.delayPushkontak = 6000
global.cd = 600 // 600 detik = 10 menit (Set Cd Own Js)

//~~~~~~~~~~ Settings Saluran ~~~~~~~~~//
global.linkSaluran = "https://whatsapp.com/channel/"
global.idSaluran = "120363837143107@newsletter"
global.namaSaluran = "Boti"

//~~~~~~~~~ Settings Payment ~~~~~~~~~//
global.dana = ""
global.ovo = "Tidak Tersedia"
global.gopay = "Tidak Tersedia"

//~~~~~~~~~~ Settings Image ~~~~~~~~~~//
global.image = {
menu: "https://img1.pixhost.to/images/11133/673983882_ochobot.jpg", 
reply: "https://img1.pixhost.to/images/11133/673983882_ochobot.jpg", 
logo: "https://img1.pixhost.to/images/11133/673983882_ochobot.jpg", 
qris: "https://files.catbox.moe/t9gvgk.jpg"
}

//~~~~~~~~~ Settings Api Panel ~~~~~~~~//
global.egg = "15" // Egg ID
global.nestid = "5" // nest ID
global.loc = "1" // Location ID
global.domain = "-" // Domain
global.apikey = "-" //ptla
global.capikey = "-" //ptlc

//~~~~~~~~ Settings Api Panel 2 ~~~~~~~~//
global.eggV2 = "15" // Egg ID
global.nestidV2 = "5" // nest ID
global.locV2 = "1" // Location ID
global.domainV2 = "-" // Domain
global.apikeyV2 = "-" //ptla
global.capikeyV2 = "-" //ptlc

//~~~~~~~ Settings Api Subdomain ~~~~~~~//
global.subdomain = {
  "skypedia.qzz.io": {
    zone: "59c189ec8c067f57269c8e057f832c74",
    apitoken: "mZd-PC7t7PmAgjJQfFvukRStcoWDqjDvvLHAJzHF"
  },
  "pteroweb.my.id": {
    zone: "714e0f2e54a90875426f8a6819f782d0",
    apitoken: "SbRAPRzC34ccmf4cJs-0qZ939yHe3Ko6CpolxqW4"
  },
  "panelwebsite.biz.id": {
    zone: "2d6aab40136299392d66eed44a7b1122",
    apitoken: "SbRAPRzC34ccmf4cJs-0qZ939yHe3Ko6CpolxqW4"
  },
  "privatserver.my.id": {
    zone: "699bb9eb65046a886399c91daacb1968",
    apitoken: "SbRAPRzC34ccmf4cJs-0qZ939yHe3Ko6CpolxqW4"
  },
  "serverku.biz.id": {
    zone: "4e4feaba70b41ed78295d2dcc090dd3a",
    apitoken: "SbRAPRzC34ccmf4cJs-0qZ939yHe3Ko6CpolxqW4"
  },
  "vipserver.web.id": {
    zone: "e305b750127749c9b80f41a9cf4a3a53",
    apitoken: "SbRAPRzC34ccmf4cJs-0qZ939yHe3Ko6CpolxqW4"
  },
  "mypanelstore.web.id": {
    zone: "c61c442d70392500611499c5af816532",
    apitoken: "SbRAPRzC34ccmf4cJs-0qZ939yHe3Ko6CpolxqW4"
  }
}


//~~~~~~~~~~ Settings Message ~~~~~~~~//
global.mess = {
	owner: "🚫 *Akses Ditolak!*\nFitur ini hanya bisa digunakan oleh *Owner Bot* 🔑",
	admin: "🚫 *Akses Ditolak!*\nFitur ini khusus untuk *Admin Grup* ⚙️",
	botAdmin: "⚠️ *Bot Bukan Admin!*\nJadikan bot sebagai admin terlebih dahulu 👑",
	group: "💬 *Khusus Grup!*\nFitur ini hanya dapat digunakan di *dalam grup* 🫂",
	private: "📩 *Khusus Chat Pribadi!*\nGunakan fitur ini di *private chat* dengan bot 💬",
	prem: "💎 *Fitur Premium!*\nHanya user *Premium* yang bisa mengakses fitur ini ✨",
	wait: "⏳ *Tunggu sebentar...*\nProses sedang berjalan ⚡",
	error: "❌ *Terjadi Kesalahan!*\nSilakan coba lagi nanti 🧩",
	done: "✅ *Berhasil!*\nPerintahmu sudah selesai dijalankan 🚀"
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})