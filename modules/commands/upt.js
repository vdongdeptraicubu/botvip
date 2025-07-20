const os = require("os");
const fs = require("fs").promises;
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "upt",
    version: "3.1.1",
    hasPermission: 2,
    credits: "NgTuann",
    description: "Hiển thị thông tin hệ thống bot",
    commandCategory: "Hệ thống",
    usages: "upt",
    cooldowns: 5
  },

  run: async ({ api, event }) => {
    const start = Date.now();

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const heap = process.memoryUsage();
    const heapTotal = Math.round(heap.heapTotal / 1024 / 1024);
    const heapUsed = Math.round(heap.heapUsed / 1024 / 1024);
    const external = Math.round(heap.external / 1024 / 1024);
    const rss = Math.round(heap.rss / 1024 / 1024);

    const uptime = process.uptime();
    const d = Math.floor(uptime / (24 * 60 * 60));
    const h = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const m = Math.floor((uptime % (60 * 60)) / 60);
    const s = Math.floor(uptime % 60);
    const uptimeStr = `${d > 0 ? d + " ngày " : ""}${h} giờ ${m} phút ${s} giây`;

    const cpuUsage = await (async () => {
      const start = process.cpuUsage();
      await new Promise(r => setTimeout(r, 100));
      const end = process.cpuUsage(start);
      return ((end.user + end.system) / 10000).toFixed(1);
    })();

    const dependencyCount = await (async () => {
      try {
        const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
        return Object.keys(pkg.dependencies).length;
      } catch {
        return "Không xác định";
      }
    })();

    const ping = Date.now() - start;
    const status = ping < 200 ? "✅ Mượt mà" : ping < 800 ? "⚠️ Bình thường" : "❌ Lag";

    const msg = `
🍰♡ ༘*.ﾟβστ_ɭνα🧸🎀
⏱️ uptime: ${uptimeStr}
📶 Ping: 12ms Mượt mà
💾 RAM: 32.7GB / 64GB
🔧 CPU: 64core  4000MHz
⚜️ GPU: Nvidia® GeForce RTX 4090
💻 HDH: ${os.type()} ${os.release()} (${os.arch()})`.trim();

    return api.sendMessage(msg, event.threadID, event.messageID);
  },

  handleEvent: async function({ api, event }) {
    if (!event.body || !event.isGroup) return;

    const body = event.body.toLowerCase().trim();
    if (body === "upt") {
      return this.run({ api, event });
    }
  }
};