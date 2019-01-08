const config = require("../config.js");

let warnings = {};

function run(message)
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

async function policeWithMessage(message, warningText) {
    let warning = await message.channel.send(warningText);
    warning.delete(config.police_delay).catch(err => console.log(`Could not delete bot message: ${err}`));
    message.delete(config.police_delay).catch(err => console.log(`Could not delete user message: ${err}`));
}

module.exports = run;