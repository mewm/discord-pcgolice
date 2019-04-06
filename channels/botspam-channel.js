const config  = require("../config.js");
const axios   = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');


async function run(message, database)
{
    if (message.content === '!lan') {
        axios.get(config.lan_url)
        .then(function(response) {
            let $              = cheerio.load(response.data);
            let attendees      = [];
            let attendeesNames = $('.username').map(function(i, e) {
                let row  = $(e);
                let name = row.text();
                attendees.push(name);
            });

            // console.log(attendeesNames);
            message.channel.send(`${attendees.length} er tilmeldt: ${attendees.join(', ')}`);
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    if (message.content === '!peak') {
        let query  = 'select * from online_tracker order by date desc limit 1';
        let result = await database.query(query);

        if (result.rows.length === 0) {
            return 0;
        }
        
        let date = moment(result.rows[0].date).format('dddd, MMMM Do YYYY, H:mm:ss');
        message.channel.send(`${result.rows[0].online_users} - ${date}`);
    }

}

module.exports = run;