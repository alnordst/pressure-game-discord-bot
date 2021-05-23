const axios = require('../util/axios')

module.exports = async (msg, [gameId]) => {
  try {
    let response = await axios.post('/offer-draw', {
      player: {
        id: msg.author.id,
        username: msg.author.username
      },
      game: gameId
    })
    if(response.status == 204)
      return msg.reply('you have successfully offered a draw.')
    else if(response.status == 200)
      return msg.channel.send(`Both players have agreed to a draw in game ${gameId}.`)
  } catch (err) {
    if(err.response && err.response.status == 400)
      return msg.reply("you've already offered a draw in this game.")
    if(err.response && err.response.status == 401)
      return msg.reply("you're not a player in this game!")
    else if(err.response && err.response.status == 403)
      return msg.reply("this game is already over.")
    else
      throw err
  }
}