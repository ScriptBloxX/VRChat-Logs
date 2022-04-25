const axios = require("axios");
const { MessageEmbed, WebhookClient } = require('discord.js');

require('dotenv').config();
vrchat_();

// vrchat main func
function vrchat_() {
    // friends check
        function Online() {
            axios.get("https://vrchat.com/api/1/auth/user", { headers: { Cookie: process.env.COOKIE } }).then(res => {
                const mydata_ = res.data
                console.log(`Logged in as: ${mydata_.displayName} 💗`);
                axios.get("https://vrchat.com/api/1/auth/user/friends", { headers: { Cookie: process.env.COOKIE } }).then(res => {
                    const data = res.data;
                    data.forEach(friend => {
                        const friend_data = {
                            "username": friend.username,
                            "displayName": friend.displayName,
                            "des": friend.statusDescription,
                            "bio": friend.bio,
                            "avatarImage": friend.currentAvatarImageUrl,
                            "url": `https://vrchat.com/home/user/${friend.id}`,
                            "status": friend.status
                        };
                        const obj_fields = {
                            "status": friend.status,
                            'last_login': friend.last_login,
                            "last_platform": friend.last_platform,
                            'location': friend.location,
                        }
                        discord(mydata_,friend_data,objToArr(obj_fields));
                    })
                });
            });
        }
        Online();
        setInterval(()=>{Online()},15*60*1000); // online state check every 15 minutes
}

function objToArr(obj) {
    var arr = [];
    for (const [key, value] of Object.entries(obj)) {
        var obj_={};
        if(value!==''){
            obj_ = { name: key, value: value, inline: true };
        }else{
            obj_ = { name: key, value: '-', inline: true };
        }
        arr.push(obj_);
    }
    return arr
}

// discord main func
function discord(user,obj,fields) {
    // state color
    const state_ = {
        'join me' : '#38F3EF',
        'active' : '#3cf08a',
        'ask me' : '#F38E23',
        'busy': '#FD4D4D'
    };
    // discord embed
    const embed = new MessageEmbed()
        .setTitle(`${obj.displayName} (${obj.username})`)
        .setURL(obj.url)
        .setColor(state_[obj.status])
        .setDescription(`Description | ${obj.des}\n**bio** | ${obj.bio}\n`)
        .setThumbnail(obj.avatarImage)
        .addFields(fields)
        .setTimestamp()
        .setFooter({ text: user.displayName, iconURL: 'https://cdn-icons-png.flaticon.com/512/173/173045.png' });

    const webhookClient = new WebhookClient({ url: process.env.WEBHOOK });
    webhookClient.send({ embeds: [embed] });
}

console.log('server is starting ✅')
