module.exports = (square) => {
  if(square.unit)
    return `the ${square.unit.team} ${square.unit.type} at ${square.heading}.`
  else
    return `the empty square at ${square.heading}.`
}