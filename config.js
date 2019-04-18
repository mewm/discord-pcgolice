module.exports = {
  token: process.env["PCGOLICE_TOKEN"],
  guild: process.env["GUILD_ID"],
  general_channel: process.env["GENERAL_CHANNEL_ID"],
  botspam_channel: process.env["BOTSPAM_CHANNEL_ID"],
  police_channel: process.env["PCGOLICE_CHANNEL_ID"],
  terminal_channel: process.env["TERMINAL_CHANNEL_ID"], 
  log_channel: process.env["LOG_CHANNEL_ID"],
  police_delay: 10000,
  lan_url: 'https://pc-geeks.dk/events/pc-geeks-lan-5/',

  database: {
    user: process.env["POSTGRES_USER"],
    host: process.env["POSTGRES_HOST"],
    database: process.env["POSTGRES_DB"],
    password: process.env["POSTGRES_PASSWORD"],
  }
};