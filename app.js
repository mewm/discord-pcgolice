const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.js");

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
    
    if (message.channel.name !== config.channel) return;

    if (message.attachments.array().length !== 0) {
        return;
    } else if(message.content.indexOf('http') !== -1) {
        return;
    } else {
        let username = message.author.username;
        let knownWarnings = warnings[username] || 0;
        warnings[username] = ++knownWarnings;
        console.log(message.author);
        policeWithMessage(message, `${message.author.toString()} det er kun tilladt at poste vedhæftninger eller links herinde. Din besked vil blive slettet om lidt. (${warnings[username]}. advarsel)`);
    }
});

console.log('Logging in with' + config.token);
client.login(config.token);
