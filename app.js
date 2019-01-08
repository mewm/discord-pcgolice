const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.js");
const policeChannel = require('./channels/police-channel.js')
const botspamChannel = require('./channels/botspam-channel.js')
const terminalChannel = require('./channels/terminal-channel.js')


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


client.on("message", async message => {
    if (message.author.bot) return;
    switch (message.channel.name) {
        case config.police_channel:
            policeChannel(message);
            break;
        case config.botspam_channel:
            botspamChannel(message);
            break;
        case config.terminal_channel:
            terminalChannel(client, message);
            break;
        default:
            break;
    }
});



console.log('Logging in with' + config.token);
client.login(config.token);
