module.exports = {
  token: process.env["PCGOLICE_TOKEN"],
  botspam_channel: process.env["BOTSPAM_CHANNEL"] || 'botspam',
  police_channel: process.env["PCGOLICE_CHANNEL"] || 'brugerfeed',
  terminal_channel: process.env["TERMINAL_CHANNEL"] || 'terminal', 
  log_channel: process.env["LOG_CHANNEL"] || 'logviewer',
  police_delay: 10000,
  lan_url: 'https://pc-geeks.dk/events/pc-geeks-lan-4/',
};