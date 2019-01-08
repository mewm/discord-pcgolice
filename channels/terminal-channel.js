const config = require("../config.js");

function run(client, message)
{
    if(message.content.substr(0, 13) === '!relaymessage') {
        textRelay(client, message);
    }
}

function textRelay(client, message) 
{
    if(!message.member.roles.some(r=>["Server Moderator"].includes(r.name)) ) {
        message.channel.send('Sorry, only Server Moderators can use this feature');
        return;
    }

    const explodedMessage = message.content.split(' ');

    if(explodedMessage.length <= 1) {
        console.log('Invalid number of arguments');
        return;
    }

    const channelId = explodedMessage[1].replace(/\D/g,'');

    // Check for invalid channel mention
    if(channelId.length === 0) {
        console.log('Invalid channel');
        return;
    }

    const intendedMessage = explodedMessage.slice(2).join(' ');
    // Check for invalid message
    if(intendedMessage.length === 0) {
        console.log('Invalid message');
        return;
    }

    // Relay the message
    const channel = client.channels.get(channelId);
    channel.send(intendedMessage);

    // Log in logchannel
    logchannel = client.channels.find(x => x.name === config.log_channel);
    logchannel.send(`${message.author.toString()} just relayed following in ${channel.name}: ${intendedMessage}`);
}

module.exports = run;