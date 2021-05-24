const axios = require('../util/axios')

module.exports = async (msg, [gameId]) => {
  try {
    await axios.post('/concede', {
      player: {
        id: msg.author.id,
        username: msg.author.username
      },
      game: gameId
    })
    return msg.reply('done.')
  } catch (err) {
    if(err.response && err.response.status == 401)
      return msg.reply("you're not a player in this game!")
    else if(err.response && err.response.status == 403)
      return msg.reply("this game is over, you can't concede.")
    else
      throw err
  }
}