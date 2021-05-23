module.exports = obj => {
  let colWidth = (arr, min=0) => arr.reduce((max, item) => {
    return max > item.length ? max : item.length
  }, min)
  let pad = (string, width) => {
    let padding = ''
    for(let i=string.length; i<width; i++)
      padding += ' '
    return `${string}${padding}`
  }
  let headings = Object.keys(obj).map(key => pad(key, colWidth(obj[key], key.length))).join('  ')
  let line = headings.split('').map(() => '-').join('')
  let body = Object.values(obj)[0].map((_, i) => {
    return Object.keys(obj).map(key => {
      return pad(obj[key][i], colWidth(obj[key], key.length))
    }).join('  ')
  }).join('\n')
  return `\`\`\`\n${headings}\n${line}\n${body}\n\`\`\``
}