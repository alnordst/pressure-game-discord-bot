const GifEncoder = require('gifencoder')
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')

const SQUARE_SIZE = 16

let count = 0

module.exports = async (msg, text, game, highlights = []) => {
  let filename = `${count++}.gif`

  const length = SQUARE_SIZE*(1+game.files)
  const width = SQUARE_SIZE*(1+game.ranks)
  const encoder = new GifEncoder(length, width)
  const canvas = createCanvas(length, width)
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
  for(let i=game.ranks; i>=1; i--)
  await draw(i, 0, (game.ranks-i)*SQUARE_SIZE)

  // draw file letters
  for(let i=0; i<game.files; i++)
    await draw(
      String.fromCharCode('a'.charCodeAt(0)+i),
      (i+1)*SQUARE_SIZE,
      game.ranks*SQUARE_SIZE
    )

  // draw board contents
  for(let i in game.board) {
    let y = i * SQUARE_SIZE
    for(let j in game.board[i]) {
      let square = game.board[i][j]
      let x = (parseInt(j)+1) * SQUARE_SIZE
      await draw(square.terrain.name, x, y)
      if(square.unit)
        await draw(`${square.unit.team}_${square.unit.type}`, x, y)
      if(highlights.includes(square.heading)){
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE)
      }
    }
  }

  encoder.addFrame(ctx)
  encoder.finish()

  let result = await msg.channel.send(text, { files: [ `./${filename}`]})
  await fs.unlink(filename, () => {})
  return result
}