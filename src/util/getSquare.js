module.exports = (heading) => ({
  from: (board) => board.reduce((acc, row) => {
    let square = row.find(s => s.heading == heading)
    return square ? square : acc
  }, null)
})