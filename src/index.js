const Discord = require('discord.js')
const client = new Discord.Client()

const util = require('./util')
const mapParser = require('./mapParser')
const renderer = require('./renderer')

const prefix = '^'
let game = {
  history: [],
  players: [], //unused atm
  turn: null
} //in the future, manage multiple concurrent games

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
  let conditions = [
    !msg.author.bot,
    msg.content.startsWith(prefix)
  ]
  for(let condition of conditions)
    if(!condition)
      return
  
  let commandBody = msg.content.slice(prefix.length)
  let args = commandBody.split(' ')
  let command = args.shift().toLowerCase()

  if(command === 'ping')
    msg.reply('pong!')

  if(command === 'begin' || command === 'restart') {
    try {
      let map = await mapParser.parse(args[0])
      game = {
        history: [map],
        players: [],
        turn: 0
      }
      msg.channel.send(util.turnMsg(game) + renderer.render(game.history[game.history.length-1]))
    } catch(err) {
      if(err === 'mapNotFound') {
        let list = await mapParser.list()
        msg.channel.send(`Map not found. Valid maps are: ${list.join(', ')}`)
      } else
        throw err
    }
  }

  if(command === 'move') {
    if(game.turn === null)
      msg.channel.send('Start a game first.')
    else {
      let state = JSON.parse(JSON.stringify(game.history[game.history.length-1]))
      let headings = args[0].split(':')
      let [from, to] = headings.map(heading => util.getFromHeading(state, heading))
      state[to.row][to.file] = {
        type: state[from.row][from.file].type,
        team: state[from.row][from.file].team
      }
      state[from.row][from.file] = null
      game.history.push(state)
      game.turn = game.turn==0 ? 1 : 0
      msg.channel.send(util.turnMsg(game) + renderer.render(game.history[game.history.length-1]))
    }
  }

  if(command === 'undo') {
    game.history.pop()
    game.turn = game.turn==0 ? 1 : 0
    msg.channel.send(util.turnMsg(game) + renderer.render(game.history[game.history.length-1]))
  }

  if(command === 'test') {
    //let map = await mapParser.parse(args[0])
    let list = await mapParser.list()
    //msg.channel.send(`\`\`\`\n${map.join('\n')}\`\`\``)
    msg.channel.send(list.join(', '))
  }
})
client.login(process.env.TOKEN)