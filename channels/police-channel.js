const config = require("../config.js");
const moment = require("moment")

let warnings = {};

async function run(message, client, config, database)
{

    if (message.attachments.array().length !== 0) {
        return;
    } else if (message.content.indexOf('http') !== -1) {
        return;
    } else {

        // Get user warnings
        let author       = message.author;
        let userWarnings = await database.query('select count(1) from user_warnings where user_id = $1', [author.id]);
        userWarnings     = userWarnings.rows[0].count;
        let guild        = client.guilds.cache.get(config.guild);
        let username     = author.username;
        userWarnings     = ++userWarnings;

        await policeWithMessage(message, `${author.toString()} det er kun tilladt at poste vedhæftninger eller links herinde. Din besked vil blive slettet om lidt. (${userWarnings}. advarsel)`);

        // Add warning to database
        database.query('insert into user_warnings (username, user_id, created_at) values($1, $2, $3)', [
            username,
            author.id,
            'NOW()'
        ]);

        if (userWarnings % 3 === 0) {
            let log       = guild.channels.cache.get(config.log_channel);
            let mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");
            await message.member.roles.add(mutedRole.id);

            // Add mute to database
            let muteDurationInSeconds = 60;
            let now                   = new Date();
            let unmuteDate            = now.setSeconds(now.getSeconds() + muteDurationInSeconds);

            log.send(`Muted ${author.username} for violating #brugerfeed rules. Expires at ${moment(unmuteDate).format('DD.MM.YYYY HH:MM')}`);
            database.query('insert into user_mutes (user_id, username, unmuted_date, created_at) values($1, $2, $3, $4)', [
                author.id,
                author.username,
                unmuteDate,
                'NOW()'
            ]).then(res => {
                console.log(res);
            }).catch(e => {
                console.error(e);
            });

            setTimeout(async () => {
                await message.member.roles.remove(mutedRole.id);
                log.send(`Unmuted ${message.author.username} after violating #brugerfeed rules`);
            }, muteDurationInSeconds * 1000);
        }
    }
}

async function policeWithMessage(message, warningText)
{
    let warning = await message.channel.send(warningText);
    warning.delete({timeout: config.police_delay, reason: 'Rule violation'}).catch(err => console.log(`Could not delete bot message: ${err}`));
    message.delete({timeout: config.police_delay, reason: 'Rule violation'}).catch(err => console.log(`Could not delete user message: ${err}`));
}

module.exports = run;