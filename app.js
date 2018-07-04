const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.js");

async function policeWithMessage(message, warningText) {
    let warning = await message.channel.send(warningText);
    await message.delete(2000);
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

client.on("message", async message => {
    if (message.author.bot) return;

    if (message.channel.name !== config.channel) return;

    if (message.attachments.array().length !== 0) {
        return;
    } else if(message.content.indexOf('http') !== -1) {
        return;
    } else {
        policeWithMessage(message, "Please only post attachments in here " + message.author.username + " (removing in a few seconds)");
    }
});


client.login(config.token);
