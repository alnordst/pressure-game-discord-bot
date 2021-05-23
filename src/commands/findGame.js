const axios = require('../util/axios')
const gameReport = require('../util/reports/gameReport')
const render = require('../util/render')

module.exports = async (msg, [mapName, pw]) => {
  try {
    let response = await axios.post('/find-game', {
      player: {
        id: msg.author.id,
        username: msg.author.username
      },
      map_name: mapName,
      pw: pw
    })
    if(response.status == 200) {
      await msg.reply('game found!')
      let text = gameReport(game)
      return render(msg, text, game)
    } else if(response.status == 204) {
      return msg.reply('no game found, your challenge has been posted and is awaiting another player.')
    }
  } catch(err) {
    if(err.response && err.response.data == 'Duplicate challenge')
      return msg.reply('you already had a challenge up!')
    else
      throw err
  }
}