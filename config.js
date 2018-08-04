module.exports = {
  token: process.env["PCGOLICE_TOKEN"],
  channel_to_police: process.env["PCGOLICE_CHANNEL"] || 'brugerfeed',
  botspam_channel: process.env["PCGOLICE_CHANNEL_BOTSPAM"] || 'botspam'
};