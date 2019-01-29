const config = require("../config.js");

class OnlineTracker
{
    constructor(client, config, database)
    {
        this.client = client;
        this.config = config;
        this.db = database;
        
        this.guild = client.guilds.get(config.guild);
        this.logChannel = this.guild.channels.get(config.botspam_channel);
        this.generalChannel = this.guild.channels.get(config.general_channel);
    }

    async startTracking()
    {
        this.onlineRecord = await this.getRecord();
        await this.track();
        setInterval(async () => {
            await this.track();
        }, 20000);
    }

    async track()
    {
        let members  = this.guild.members;
        let onlineMembers = members.filter(member => {
            return member.presence.status !== 'offline' && member.user.bot === false;
        }).array().length;

        if(onlineMembers > this.onlineRecord) {
            this.onlineRecord = onlineMembers;
            this.reportNewRecord();   
            await this.storeRecord();
        }
    }

    reportNewRecord()
    {
        // this.generalChannel.send(`Sådan, ny rekord af online brugere: ${this.onlineRecord}!`);
        this.logChannel.send(`New online record detected: ${this.onlineRecord}`);
    }

    async storeRecord()
    {
        let text = 'insert into online_tracker(date, online_users) values($1, $2)';
        let values = ['NOW()', this.onlineRecord];
        try {
            await this.db.query(text, values)
        } catch(err) {
            console.log(err.stack)
        }
    }

    async getRecord()
    {
        let query = 'select * from online_tracker order by date desc limit 1';
        let result = await this.db.query(query);

        if(result.rows.length === 0) {
            return 0;
        }

        return result.rows[0].online_users;
    }
}

module.exports = OnlineTracker;