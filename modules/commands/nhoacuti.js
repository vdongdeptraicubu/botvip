const axios = require('axios');
this.config = {
    name: "nhoacuti",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "DC-Nam",
    description: "nhoacuti ",
    commandCategory: "Tiện ích",
    usages: "",
    cooldowns: 0,
    usePrefix: false
  
};
global.o = [];
this.stream_url= function (url) {
    return axios({
        url: url,
        responseType: 'stream',
    }).then(_ => _.data);
},
this.onLoad = async function (o) {
        let status = false;
        let urls = require('./../../gojo/datajson/nhoacuti.json');
    if (!global.lllo) global.lllo = setInterval(_ => {
            if (status == true || global.o.length > 50) return;
            status = true;
            Promise.all([...Array(5)].map(e=>this.upload(urls[Math.floor(Math.random()*urls.length)]))).then(res=>(global.o.push(...res), status = false));
    },1000 * 5);
this.upload = async function (url) {
            const form = {
                upload_1024: await this.stream_url(url),
            };

            return o.api.postFormData('https://upload.facebook.com/ajax/mercury/upload.php',
                form).then(res => Object.entries(JSON.parse(res.body.replace('for (;;);', '')).payload?.metadata?.[0] || {})[0]);
        };
    },
this.run = async function (o) {
        let send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));
        let name = await o.Users.getNameUser(o.event.senderID)
        send({
            body: `⋆NHoacuti ne`,
            attachment: global.o.splice(0,1),
        });
}
