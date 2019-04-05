(async function() {
    const Discord = require("discord.js");
    const client = new Discord.Client();
    const config = require("./config.js");
    const policeChannel = require("./channels/police-channel.js");
    const botspamChannel = require("./channels/botspam-channel.js");
    const terminalChannel = require("./channels/terminal-channel.js");
//    const AllChannels = require("./channels/all-channels.js");
    const OnlineTracker = require("./features/online-tracker.js");
    const { Client } = require("pg");
    const database = new Client({
        user: config.database.user,
        host: config.database.host,
        database: config.database.name,
        password: config.database.password,
        port: 5432
    });

    await database.connect();

//    const allChannels = new AllChannels;

    client.on("ready", async () => {
        client.user.setActivity(`You better not disobey!`);
        let tracker = new OnlineTracker(client, config, database);
        tracker.startTracking();
    });

    client.on("message", async message => {
        if (message.author.bot) return;
        switch (message.channel.id) {
            case config.police_channel:
                policeChannel(message);
            break;
            case config.botspam_channel:
                botspamChannel(message, database);
            break;
            case config.terminal_channel:
                terminalChannel(client, message);
            break;
            default:
            break;
        }

    });

    client.login(config.token);
})();
