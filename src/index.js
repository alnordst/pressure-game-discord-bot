const Discord = require('discord.js')
const client = new Discord.Client()

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
  for(let condition in conditions)
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
        turn: null
      }
      msg.channel.send(renderer.render(history.slice(-1)))
    } catch(err) {
      if(err === 'mapNotFound')
        msg.reply('Map not found. Valid maps are: ', mapParser.list.join(', '))
      else
        throw err
    }
  }

  if(command === 'move') {
    
  }
})
client.login(process.env.TOKEN)