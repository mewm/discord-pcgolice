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

    let intendedMessage = explodedMessage.slice(2).join(' ');
    // Check for invalid message
    if(intendedMessage.length === 0) {
        console.log('Invalid message');
        return;
    }

    // Check if username is written after channel
    const perhapsUser = explodedMessage.slice(2,3).toString();
    if(perhapsUser.length > 0 && perhapsUser.substr(0,1) === '@') {
        // Username detected, find it
        const mentionedUser = perhapsUser.substr(1, perhapsUser.length);
        const mentionedUserId = message.guild.members.find(x => x.nickname === mentionedUser);
        if(mentionedUserId) {
            // Replace mentionedUser in intendedMessage with their ID
            intendedMessage = intendedMessage.replace('@' + mentionedUser, '<@' + mentionedUserId.id + '>');
        }
    }

    // Relay the message
    const channel = client.channels.get(channelId);
    channel.send(intendedMessage);

    // Log in logchannel
    logchannel = client.channels.find(x => x.name === config.log_channel);
    logchannel.send(`${message.author.toString()} just relayed following in ${channel.name}: ${intendedMessage}`);
}

module.exports = run;