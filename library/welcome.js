/*

  !- Base By Skyzopedia
  https://wa.me/6285624297894
    !- Pengembang By AlLuffy
  https://wa.me/6285720866796
  !- Credits By AlLuffy
  
  Bantu Folow Channel AlLuffy
  https://whatsapp.com/channel/0029VavsEpc8kyyG9PxG8s38
  
*/

const canvafy = require("canvafy")

// =======================
// FUNGSI FIX JID (@lid)  
// =======================
function normalizeJid(jid) {
    if (!jid) return jid;

    if (jid.endsWith("@lid")) {
        jid = jid.split("@")[0] + "@s.whatsapp.net";
    }
    if (!jid.includes("@")) {
        jid = jid + "@s.whatsapp.net";
    }

    return jid;
}


// =======================
// RANDOM COLOR GENERATOR
// =======================
function randomHexColor() {
    const hex = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += hex[Math.floor(Math.random() * 16)];
    }
    return color;
}


// =======================
// WELCOME BANNER
// =======================
async function welcomeBanner(avatar, name, subject, type) {
    name = normalizeJid(name).split("@")[0];

    const title = name;
    const desc = (type == "welcome" ? "Selamat datang di " : "Telah keluar dari grup ") + subject;

    const background = "https://img1.pixhost.to/images/7917/631342826_ochobot.jpg";

    const borderColor = randomHexColor();
    const avatarBorderColor = randomHexColor();

    const welcome = await new canvafy.WelcomeLeave()
        .setAvatar(avatar)
        .setBackground("image", background)
        .setTitle(title.length > 20 ? title.substring(0, 16) + ".." : title)
        .setDescription(desc.length > 70 ? desc.substring(0, 65) + ".." : desc)
        .setBorder(borderColor)              // RANDOM COLOR
        .setAvatarBorder(avatarBorderColor)  // RANDOM COLOR
        .setOverlayOpacity(0.1)
        .build();

    return welcome;
}


// =======================
// PROMOTE / DEMOTE BANNER
// =======================
async function promoteBanner(avatar, name, type) {
    name = normalizeJid(name).split("@")[0];

    const title = name;
    const desc = type == "promote"
        ? "Telah menjadi admin"
        : "Telah di berhentikan menjadi admin";

    const background = "https://img1.pixhost.to/images/7917/631342826_ochobot.jpg";

    const borderColor = randomHexColor();
    const avatarBorderColor = randomHexColor();

    const welcome = await new canvafy.WelcomeLeave()
        .setAvatar(avatar)
        .setBackground("image", background)
        .setTitle(title.length > 20 ? title.substring(0, 16) + ".." : title)
        .setDescription(desc.length > 70 ? desc.substring(0, 65) + ".." : desc)
        .setBorder(borderColor)              // RANDOM COLOR
        .setAvatarBorder(avatarBorderColor)  // RANDOM COLOR
        .setOverlayOpacity(0.1)
        .build();

    return welcome;
}

module.exports = { welcomeBanner, promoteBanner }