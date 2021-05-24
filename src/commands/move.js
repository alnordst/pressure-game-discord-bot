const axios = require('../util/axios')
const gameReport = require('../util/reports/gameReport')
const render = require('../util/render')

module.exports = async (msg, [gameId, fromHeading, toHeading]) => {
  try {
    let game = await axios.post('/move', {
      player: {
        id: msg.author.id,
        username: msg.author.username
      },
      game: gameId,
      from: fromHeading,
      to: toHeading
    }).then(r => r.data)
    let text = gameReport(game)
    return render(msg, text, game)
  } catch (err) {
    if(err.response && err.response.status == 400)
      return msg.reply('invalid move.')
    else if(err.response && err.response.status == 401)
      return msg.reply("it's not your turn.")
    else
      throw err
  }
}