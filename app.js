const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.js");
const cheerio = require('cheerio');
const axios = require('axios');

const pcgeeksLan3Url = 'https://pc-geeks.dk/events/pc-geeks-lan-3/';

async function policeWithMessage(message, warningText) {
    let warning = await message.channel.send(warningText);
    await message.delete(10000);
    await warning.delete();
}

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`You better not disobey!`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

let warnings = {};

client.on("message", async message => {
    if (message.author.bot) return;
    
    if (message.channel.name === config.channel_to_police) {
        policeChannel(message);
        return;
    }

    if (message.channel.name === config.botspam_channel) {
      botspam(message);
      return;
    }

});

function botspam(message)
{
    if(message.content === '!lan') {
        axios.get(pcgeeksLan3Url)
        .then(function (response) {
            let $ = cheerio.load(response.data);
            let attendees = [];
            let attendeesNames = $('h3:contains("Tabel over tilmeldinger")').next().next().children().children().children(':nth-child(2)').map(function (i, e) {
                let row = $(e);
                let name = row.text();
                if(name === 'Nickname') {
                    return false;
                }
                
                attendees.push(name);
            });

            // console.log(attendeesNames);
            message.channel.send(`${attendees.length} er tilmeldt: ${attendees.join(', ')}`);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

function policeChannel(message)
{
    if (message.attachments.array().length !== 0) {
        return;
    } else if (message.content.indexOf('http') !== -1) {
        return;
    } else {
        let username = message.author.username;
        let knownWarnings = warnings[username] || 0;
        warnings[username] = ++knownWarnings;
        console.log(message.author);
        policeWithMessage(message, `${message.author.toString()} det er kun tilladt at poste vedhæftninger eller links herinde. Din besked vil blive slettet om lidt. (${warnings[username]}. advarsel)`);
    }
}

console.log('Logging in with' + config.token);
client.login(config.token);
