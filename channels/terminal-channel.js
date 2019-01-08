const config = require("../config.js");

function run(client, message)
{
    if(message.content.substr(0, 13) === '!relaymessage') {
        textRelay(client, message);
    }
}

function textRelay(client, message) 
{
    const explodedMessage = message.content.split(' ');
    const channelId = explodedMessage[1].replace(/\D/g,'');
    const intendedMessage = explodedMessage.slice(2).join(' ');
    const channel = client.channels.get(channelId);
    channel.send(intendedMessage);
    // console.log(`Channel: ${channelId} - Message: ${intendedMessage}`);
    logchannel = client.channels.find(x => x.name === config.log_channel);
    logchannel.send(`${message.author.toString()} just relayed following in ${channel.name}: ${intendedMessage}`);
}

module.exports = run;