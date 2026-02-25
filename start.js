require('./settings')

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore,
  fetchLatestWaWebVersion,
  getContentType,
  Browsers
} = require('@whiskeysockets/baileys')

const fetch = require("node-fetch")
const axios = require('axios')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const pino = require('pino')
const moment = require('moment-timezone')
const { Solving, MessagesUpsert, loadmodule } = require('./source/message.js');

let session = `session`
let sesiPath = './' + session
if (!fs.existsSync(sesiPath)) {
  fs.mkdirSync(sesiPath, {
    recursive: true
  })
}
const storeFilePath = path.join(sesiPath, 'store.json')
if (!fs.existsSync(storeFilePath)) {
  fs.writeFileSync(storeFilePath, JSON.stringify({
    chats: [],
    contacts: {},
    messages: {},
    presences: {}
  }, null, 4))
}
const debounceWrite = (() => {
  let timeout
  return (callback) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(), 3000)
  }
})()

const store = makeInMemoryStore({
  logger: pino().child({
    level: 'silent',
    stream: 'store'
  })
})

try {
  const initialData = JSON.parse(fs.readFileSync(storeFilePath, 'utf-8'))
  store.chats = initialData.chats || []
  store.contacts = initialData.contacts || {}
  store.messages = initialData.messages || {}
  store.presences = initialData.presences || {}
  setInterval(() => {
    debounceWrite(() => {
      const formattedData = JSON.stringify({
        chats: store.chats || [],
        contacts: store.contacts || {},
        messages: store.messages || {},
        presences: store.presences || {}
      }, null, 4)
      fs.writeFileSync(storeFilePath, formattedData)
    })
  }, 30000)
} catch (err) {
  console.log('Terjadi kesalahan saat menyimpan sesion: ' + err)
}

// 🔒 Anti backdoor (Baileys safe)
const originalFetch = global.fetch;

global.fetch = async function (url, ...args) {
    if (
        typeof url === "string" &&
        url.includes("raw.githubusercontent.com/tskiofc/ChannelID")
    ) {
        return {
            ok: true,
            json: async () => [],
            text: async () => "[]"
        };
    }

    return originalFetch(url, ...args);
};


const rainbowColors = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#9400D3'
]

const rainbowText = [
  `🤖 BOT INFORMATION`,
  ``,
  `👤 Owner Name : ${global.namaOwner}`,
  `⚙️  Bot Type   : Case (CJS)`,
  `📦 Version     : ${global.versi}`,
  `🖥️  Node.js     : ${process.version}\n`
]

function printRainbowText(text, colors) {
  let colorIndex = 0
  return text.split('').map(char => {
    const color = colors[colorIndex % colors.length]
    colorIndex++
    return chalk.hex(color)(char)
  }).join('')
}

rainbowText.forEach(line => {
  console.log(printRainbowText(line, rainbowColors))
})

async function getNumber(prompt) {
  process.stdout.write(prompt)
  return new Promise((resolve, reject) => {
    process.stdin.once('data', (data) => {
      const input = data.toString().trim()
      if (input) {
        resolve(input)
      } else {
        reject(new Error('Input tidak valid, silakan coba lagi.'))
      }
    })
  })
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

try {
  global.db = JSON.parse(fs.readFileSync("./library/database/database.json"));
  if (global.db)
    global.db = {
      users: {},
      groups: {},
      database: {},
      settings: {},
      sholatSent: {},
      warnings: {},
      data: {},
      ...(global.db || {}),
    };
} catch (err) {
  console.log(
    `Error save data`,
  );
  return;
}


async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
const clientData = {
  logger: pino({ level: "silent" }),
  auth: state,
  printQRInTerminal: false,

  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 0,
  keepAliveIntervalMs: 10000,

  // pakai versi dari defaults Baileys (seperti script yang bisa)
  version: (await (await fetch("https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json")).json()).version,

  // samain browser
  browser: ["Ubuntu", "Chrome", "20.0.04"],
}
  const conn = makeWASocket(clientData)
  conn.ev.on('creds.update', saveCreds)
  //await waitForOpen(conn)
  if (!conn.authState.creds.registered) {
    let NumAuthorized = false;
    let nomor = '';

    console.clear();
    rainbowText.forEach(line => {
      console.log(printRainbowText(line, rainbowColors));
    });

    while (!NumAuthorized) {
      console.log(chalk.red.bold('Masukkan Nomor WhatsApp,\ncontoh : 628xxx'));
      nomor = await getNumber(chalk.blue.bold('Nomor: '));

      if (nomor) {
        try {
          const code = await conn.requestPairingCode(nomor, "ABCDEFGH");
          console.log(chalk.red.bold('Code Pairing: ') + chalk.reset(code));
          NumAuthorized = true;
        } catch (err) {
          console.log(chalk.red.bold('Gagal mendapatkan kode pairing.' + err));
        }
      } else {
        console.log(chalk.red.bold('Nomor tidak boleh kosong. Coba lagi.'));
      }
    }
  }
  store.bind(conn.ev)

  const processedMessages = new Set()

  if (!(store.messages instanceof Map)) {
    const oldMessages = store.messages || {}
    store.messages = new Map(Object.entries(oldMessages))
  }
  
  Solving(conn, store)
  
  conn.ev.on("messages.upsert", async (chatUpdate) => {
  try {
    MessagesUpsert(conn, chatUpdate, store)
  } catch (e) {
    throw e;
  }
})

  conn.ev.on("connection.update", async (update) => { loadmodule(conn);
    const {
      connection,
      lastDisconnect
    } = update
    if (connection === "close") {
      let reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode
      if (reason === DisconnectReason.badSession) {
        console.log(`Session error, please delete the session and try again...`)
        startWhatsAppBot()
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log(`Connection closed, reconnecting....`)
        startWhatsAppBot()
      } else if (reason === DisconnectReason.connectionLost) {
        console.log(`Connection lost from the server, reconnecting...`)
        startWhatsAppBot()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(`Session connected to another server, please restart the bot.`)
        startWhatsAppBot()
      } else if (reason === DisconnectReason.loggedOut) {
        console.error(`Logout details:`, {
          error: lastDisconnect?.error,
          stack: lastDisconnect?.error?.stack,
          statusCode: reason
        })
        process.exit()
      } else if (reason === DisconnectReason.restartRequired) {
        console.log(`Restart required, restarting connection...`)
        startWhatsAppBot()
      } else if (reason === DisconnectReason.timedOut) {
        console.log(`Connection timed out, reconnecting...`)
        startWhatsAppBot()
      } else {
        console.log(`Unknown DisconnectReason: ${reason}|${connection}`)
        startWhatsAppBot()
      }
    } else if (connection === "connecting") {

    } else if (connection === "open") {
      console.log(chalk.red.bold(`Bot WhatsApp Terkoneksi...`))
      //await conn.groupAcceptInvite("EzASxBUGNsU8KD8IEDx6cu");
      conn.newsletterFollow("120363186130999681@newsletter")
      conn.newsletterFollow("120363403636531082@newsletter")
      conn.newsletterFollow("120363380388430434@newsletter")
    }
  })
  return conn
}

startWhatsAppBot()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update ${__filename}`)
  delete require.cache[file]
  require(file)
})