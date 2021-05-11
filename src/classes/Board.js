const Square = require('./Square')

class Board {
  constructor(data) {
    this.data = data
  }

  static fromJson(json) {
    return new Board(json.map(line => line.split('').map(item => {
      return Square.fromChar(item)
    })))
  }

  get rowCount() {
    return this.data.length
  }

  get fileCount() {
    return this.data[0].length
  }

  get clone() {
    return new Board(this.data.map(row => row.map(square => square.clone)))
  }

  move(from, to) {
    let newBoard = this.clone
    let fromSquare = newBoard.squareAt(from)
    let toSquare = newBoard.squareAt(to)
    if(!fromSquare || !toSquare)
      return null
    let success = Square.moveUnit(newBoard.squareAt(from), newBoard.squareAt(to))
    if(success)
      return newBoard
    else
      return null
  }

  squareAt(address) {
    try {
      let [rawFile, rawRow] = address.toUpperCase().split('')
      let file = rawFile.charCodeAt(0) - 'A'.charCodeAt(0)
      let row = this.rowCount - parseInt(rawRow)
      return this.data[row][file]
    } catch (err) {
      return null
    }
  }

  checkForWin() {
    if(!this.data.some(row => row.some(square => !square.isEmpty && square.unit.toString() == 'C')))
      return 1
    else if(!this.data.some(row => row.some(square => !square.isEmpty && square.unit.toString() == 'c')))
      return 0
    else
      return null
  }

  toString() {
    let display = this.data.map((row, i) => {
      let dispRow = row.map(square => square.toString()).join(' ')
      return `${this.rowCount - i} | ${dispRow}`
    }).join('\n')
    let bottom = new Array(3+this.fileCount*2).fill('-').join('')
    bottom += '\n  | '
    bottom += this.data[0].map((item, i) => {
      return String.fromCharCode('A'.charCodeAt(0) + i)
    }).join(' ')
    return `\`\`\`\n${display}\n${bottom}\`\`\``
  }
}

module.exports = Board