const axios = require('../util/axios')
const squareReport = require('../util/reports/squareReport')
const getSquare = require('../util/getSquare')
const render = require('../util/render')

module.exports = async (msg, [gameId, heading]) => {
  try {
    let game = await axios.get(`/game/${gameId}`)
      .then(r => r.data)
    let square = getSquare(heading).from(game.board)
    let threatens = square.unit.threatens
    let text = `Game ${gameId}:\nSquares threatened by ${squareReport(square)}`
    return render(msg, text, game, threatens)
  } catch(err) {
    if(err.response && err.response.status == 404)
      return msg.channel.send('Game not found.')
    else
      throw err
  }
}