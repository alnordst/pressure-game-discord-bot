const axios = require('../util/axios')
const gameReport = require('../util/reports/gameReport')
const render = require('../util/render')

module.exports = async (msg, [gameId]) => {
  try {
    let game = await axios.get(`/game/${gameId}`)
      .then(r => r.data)
    let text = gameReport(game)
    return render(msg, text, game)
  } catch(err) {
    if(err.response && err.response.status == 404)
      return msg.channel.send('Game not found.')
    else
      throw err
  }
}