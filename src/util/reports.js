module.exports = {
  forecastReport: (matchId, commands) => {
    let text = `Forecast on match ${matchId}\n`
    let commandString = commands
      .map(command => `${command.address}:${command.direction}`)
      .join(', ')
    text += `Commands: ${commandString}`
    return text
  },
  mapReport: map => {
    let text = `Map ${map.id} -- ${map.name}\n`
    text += `Ranks: ${map.ranks}; Files: ${map.files}`
    return text
  },
  matchReport: match => {
    let text = `Match ${match.id}\n`
    text += `Red: ${match.red_player.username}\n`
    text += `Blue: ${match.blue_player.username}\n`
    if(match.over) {
      if(match.winner == 'red') {
        text += `Red player (${match.red_player.username}) wins!`
      } else if(match.winner == 'blue') {
        text += `Blue player (${match.blue_player.username}) wins!`
      } else {
        text += 'Draw!'
      }
    } else {
      text += `Awaiting commands. Actions per turn: ${match.match_configuration.actions_per_turn}`
    }
    return text
  }
}