let key = {
  artillery: 'a',
  command: 'c',
  infantry: 'i',
  tank: 't',
  sniper: 's'
}

module.exports = {
  render: board => {
    let display = board.map((row, i) => {
      let newRow = row.map(item => {
        if(!item)
          return '-'
        else if(item.team==0)
          return key[item.type].toUpperCase()
        else
          return key[item.type]
      }).join(' ')
      return `${board.length - i} | ${newRow}`
    }).join('\n')
    let bottom = new Array(3+board[0].length*2).fill('_').join('')
    bottom += '\n    '
    bottom += board[0].map((item, i) => {
      return String.fromCharCode('A'.charCodeAt(0) + i)
    }).join(' ')
    return `\`\`\`\n${display}\n${bottom}\`\`\``
  }
}