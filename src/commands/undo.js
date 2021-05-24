const axios = require('../util/axios')
const gameReport = require('../util/reports/gameReport')
const render = require('../util/render')

module.exports = async (msg, [gameId]) => {
  try {
    let game = await axios.post('/undo', {
      player: {
        id: msg.author.id,
        username: msg.author.username
      },
      game: gameId
    }).then(r => r.data)
    let text = await gameReport(game)
    return render(msg, text, game)
  } catch (err) {
    if(err.response && err.response.status == 401)
      return msg.reply("you're not a player in this game!")
    else if(err.response && err.response.status == 403)
      return msg.reply("this game is strict, over, or just started -- you can't undo.")
    else
      throw err
  }
}