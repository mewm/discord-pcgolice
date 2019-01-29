const config = require("../config.js");
const axios = require('axios');
const cheerio = require('cheerio');

function run(message)
{
    if(message.content === '!lan') {
        axios.get(config.lan_url)
        .then(function (response) {
            let $ = cheerio.load(response.data);
            let attendees = [];
            let attendeesNames = $('.username').map(function (i, e) {
                let row = $(e);
                let name = row.text();
                attendees.push(name);
            });

            // console.log(attendeesNames);
            message.channel.send(`${attendees.length} er tilmeldt: ${attendees.join(', ')}`);
            console.log(message.channel);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

module.exports = run;