const playerFromId = require('../playerFromId')

module.exports = async (game) => {
  let text = `Game ${game.id}\n`
  if(game.is_complete)
    if(game.winner == 'red'){
      let red = await playerFromId(game.red_player_id)
      text += `${red} wins!`
    } else if(game.winner == 'blue') {
      let blue = await playerFromId(game.blue_player_id)
      text += `${blue} wins!`
    } else
      text += 'Draw!'
  else {
    let toMove = await playerFromId(game[`${game.to_move}_player_id`])
    text += `${toMove} to move with ${game.to_move}.`
  }
  return text
}