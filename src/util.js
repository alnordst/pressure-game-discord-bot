module.exports = {
  turnMsg: (game) => {
    if(game.turn == 0)
      return 'UPPERCASE to move'
    else if(game.turn == 1)
      return 'lowercase to move'
    else return null
  },
  getFromHeading(state, heading) {
    let [rawFile, rawRow] = heading.toUpperCase().split('')
    let file = rawFile.charCodeAt(0) - 'A'.charCodeAt(0)
    let row = state.length - parseInt(rawRow)
    return { row, file }
  }
}