const axios = require('../util/axios')

module.exports = async (msg, [toggle]) => {
  if(toggle && ['on', 'off'].includes(toggle.toLowerCase())) {
    let settings = {
      discord_notifications: ['off', 'on'].indexOf(toggle.toLowerCase())
    }
    await axios.post('/update-settings', {
      player: {
        id: msg.author.id,
        username: msg.author.username
      },
      settings
    })
    return msg.reply(`notifications are now **${toggle}**.`)
  } else
    return msg.reply("choose **on** or **off**.")
}