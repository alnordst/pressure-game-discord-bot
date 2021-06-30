const GifEncoder = require('gifencoder')
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')

const SQUARE_SIZE = 16

let count = 0

module.exports = async (sender, {text, board}) => {
  let filename = `${count++}.gif`

  const ranks = board.length
  const files = board[0].length
  const length = SQUARE_SIZE*(1+ranks)
  const width = SQUARE_SIZE*(1+files)
  const encoder = new GifEncoder(width, length)
  const canvas = createCanvas(width, length)
  encoder.createReadStream().pipe(fs.createWriteStream(filename))
  encoder.start()
  encoder.setRepeat(0)
  encoder.setDelay(500)
  encoder.setQuality(10)
  const ctx = canvas.getContext('2d')
  const draw = async function(filename, x, y) {
    let image = await loadImage(`./sprites/${filename}.png`)
    ctx.drawImage(image, x, y)
  }

  // draw row numbers
  for(let i=ranks; i>=1; i--)
  await draw(i, 0, (ranks-i)*SQUARE_SIZE)

  // draw file letters
  for(let i=0; i<files; i++)
    await draw(
      String.fromCharCode('a'.charCodeAt(0)+i),
      (i+1)*SQUARE_SIZE,
      ranks*SQUARE_SIZE
    )

  // draw board contents
  for(let i in board) {
    let y = i * SQUARE_SIZE
    for(let j in board[i]) {
      let square = board[i][j]
      let x = (parseInt(j)+1) * SQUARE_SIZE
      await draw(square.terrain.type, x, y)
      if(square.unit && square.unit.team && square.unit.type) {
        await draw(`${square.unit.team}_${square.unit.type}`, x, y)
        if(square.unit.command) {
          let dir = square.unit.command.toLowerCase()
          await draw(`arrow_${dir}`, x, y)
        }
      }
    }
  }

  encoder.addFrame(ctx)
  encoder.finish()

  let result = await sender.send(text, { files: [ `./${filename}`]})
  await fs.unlink(filename, () => {})
  return result
}