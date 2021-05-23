const axios = require('../util/axios')
const makeTable = require('../util/makeTable')

module.exports = async msg => {
  let player = await axios.get(`/player-from-discord-id/${msg.author.id}`).then(r => r.data)
  let games = await axios.get(`/games-with-player/${player.id}`).then(r => r.data)
  let activeGames = games.filter(game => game.is_complete == 0)
  let data = activeGames.reduce((acc, game) => {
    acc.ID.push(game.id.toString())
    acc.Red.push(game.red_player)
    acc.Blue.push(game.blue_player)
    acc['To Move'].push(game[`${game.to_move}_player`])
    return acc
  }, {ID:[],Red:[],Blue:[],'To Move':[]})
  return msg.reply(`your active games:\n${makeTable(data)}`)
}