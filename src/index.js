const Discord = require('discord.js')
const client = new Discord.Client()
const Axios = require('axios')
const axios = Axios.create({
  baseURL: process.env.API_URL,
  headers: {
    authorization: `Bearer ${process.env.TOKEN}`
  }
})
const GifEncoder = require('gifencoder')
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')

let playerFromId = async (id) => {
  let player = await axios.get(`/player/${id}`).then(r => r.data)
  if(player.discord_notifications)
    return await client.users.fetch(player.discord_id)
  else
    return player.username
}

let render = async (game) => {
  let text = `Game ${game.id}\n`
  if(game.is_complete)
    if(game.winner == 'red'){
      let red = await playerFromId(game.red_player_id)
      text += `${red} wins!`
    } else if(game.winner == 'blue') {
      let blue = await playerFromId(game.blue_player_id)
      text += `${blue} wins!`
    } else
      text += 'Draw!'
  else {
    let toMove = await playerFromId(game[`${game.to_move}_player_id`])
    text += `${toMove} to move with ${game.to_move}.`
  }

  const encoder = new GifEncoder(16*(1+game.files), 16*(1+game.ranks))
  const canvas = createCanvas(16*(1+game.files), 16*(1+game.ranks))
  const filename = `${game.id}.gif`
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
  await draw(i, 0, (game.ranks-i)*16)

  // draw file letters
  for(let i=0; i<game.files; i++)
    await draw(String.fromCharCode('a'.charCodeAt(0)+i),(i+1)*16,game.ranks*16)

  // draw board contents
  for(let i in game.board) {
    let y = i * 16
    for(let j in game.board[i]) {
      let square = game.board[i][j]
      let x = (parseInt(j)+1) * 16
      await draw(square.terrain.name, x, y)
      if(square.unit)
        await draw(`${square.unit.team}_${square.unit.type}`, x, y)
    }
  }

  encoder.addFrame(ctx)
  encoder.finish()

  return {text, filename}
}


let makeTable = obj => {
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


client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
  try{
    let valid = [
      !msg.author.bot,
      msg.content.startsWith(process.env.PREFIX),
      msg.channel.name === process.env.CHANNEL_NAME
    ].reduce((v, condition) => v && condition)
    if(!valid)
      return
    
    let commandBody = msg.content.slice(process.env.PREFIX.length)
    let args = commandBody.split(' ')
    let command = args.shift().toLowerCase()

    if(command === 'ping') {
      msg.reply(`I'm awake!`)
    }

    if(command === 'help') {
      let commands = {
        'help': 'You are here.',
        'ping': "Check that the bot is alive.",
        'list-games': 'Display your active games.',
        'show-game <game id>': 'Display current status of a game.',
        'find-game': 'Find a match.',
        //'find-game [map name] [password]': 'Find a match. Map name is optional and can be used to specify which map to play on (random if omitted). Use password to set up a game against somebody specific (have other player submit the same command).',
        'move <game id> <from heading> <to heading>': `Make a move (ex: ${process.env.PREFIX}move 1 a3 b4)`,
        'undo <game id>': 'Undo a move.',
        'concede <game id>': 'Concede game.',
        'offer-draw <game id>': 'Offer a draw.',
        'set-notifications <on|off>': 'This dictates whether or not the bot pings you on discord when its your turn. By default this is on.'
      }
      msg.channel.send(Object.entries(commands).map(([key, value]) => {
        return `**${process.env.PREFIX}${key}**\n${value}`
      }).join('\n\n'))
    }

    if(command === 'list-games') {
      let player = await axios.get(`/player-from-discord-id/${msg.author.id}`).then(r => r.data)
      let games = await axios.get(`/games-with-player/${player.id}`).then(r => r.data)
      let activeGames = games.filter(game => game.is_complete == 0)
      let data = activeGames.reduce((acc, game) => {
        acc.ID.push(game.id.toString())
        acc.Red.push(game.red_player)
        acc.Blue.push(game.blue_player)
        acc['To Move'].push(game[`${game.to_move}_player`])
        return acc
      }, {ID:[],Red:[],Blue:[],'To Move':[]})
      msg.reply(`your active games:\n${makeTable(data)}`)
    }

    if(command === 'show-game') {
      try {
        let game = await axios.get(`/game/${args[0]}`).then(response => response.data)
        let {text, filename} = await render(game)
        msg.channel.send(text, { files: [ `./${filename}`]})
      } catch(err) {
        if(err.response && err.response.status == 404)
          msg.channel.send('Game not found.')
        else
          throw err
      }
    }

    if(command === 'find-game') {
      try {
        let response = await axios.post('/find-game', {
          player: { id: msg.author.id, username: msg.author.username },
          map: args[0],
          password: args[1]
        })
        if(response.status == 200) {
          await msg.reply('game found!')
          let {text, filename} = await render(response.data)
          msg.channel.send(text, { files: [ `./${filename}`] })
        } else if(response.status == 204) {
          msg.reply('no game found, your challenge has been posted and is awaiting another player.')
        }
      } catch(err) {
        if(err.response && err.response.data == 'Duplicate challenge')
          msg.reply('you already had a challenge up!')
        else
          throw err
      }
    }

    if(['move', 'mv', 'm'].includes(command)) {
      try {
        let response = await axios.post('/move', {
          player: { id: msg.author.id, username: msg.author.username },
          game: args[0],
          from: args[1],
          to: args[2]
        })
        let {text, filename} = await render(response.data)
        msg.channel.send(text, { files: [`./${filename}`]})
      } catch (err) {
        if(err.response && err.response.status == 400)
          msg.reply('invalid move.')
        else if(err.response && err.response.status == 401)
          msg.reply("it's not your turn.")
        else
          throw err
      }
    }

    if(command === 'undo') {
      try {
        let response = await axios.post('/undo', {
          player: { id: msg.author.id, username: msg.author.username },
          game: args[0]
        })
        let {text, filename} = await render(response.data)
        msg.channel.send(text, { files: [`./${filename}`]})
      } catch (err) {
        if(err.response && err.response.status == 401)
          msg.reply("you're not a player in this game!")
        else if(err.response && err.response.status == 403)
          msg.reply("this game is strict, over, or just started -- you can't undo.")
        else
          throw err
      }
    }

    if(command === 'concede') {
      try {
        await axios.post('/concede', {
          player: { id: msg.author.id, username: msg.author.username },
          game: args[0]
        })
        msg.reply('done.')
      } catch (err) {
        if(err.response && err.response.status == 401)
          msg.reply("you're not a player in this game!")
        else if(err.response && err.response.status == 403)
          msg.reply("this game is over, you can't concede.")
        else
          throw err
      }
    }

    if(command === 'offer-draw') {
      try {
        let response = await axios.post('/offer-draw', {
          player: { id: msg.author.id, username: msg.author.username },
          game: args[0]
        })
        if(response.status == 204)
          msg.reply('you have successfully offered a draw.')
        else if(response.status == 200)
          msg.channel.send(`Both players have agreed to a draw in game ${args[0]}.`)
      } catch (err) {
        if(err.response && err.response.status == 400)
          msg.reply("you've already offered a draw in this game.")
        if(err.response && err.response.status == 401)
          msg.reply("you're not a player in this game!")
        else if(err.response && err.response.status == 403)
          msg.reply("this game is already over.")
        else
          throw err
      }
    }

    if(command === 'set-notifications') {
      if(args[0] && ['on', 'off'].includes(args[0].toLowerCase())) {
        let settings = {
          discord_notifications: ['off', 'on'].indexOf(args[0].toLowerCase())
        }
        await axios.post('/update-settings', {
          player: { id: msg.author.id, username: msg.author.username },
          settings
        })
        msg.reply(`notifications are now **${args[0]}**.`)
      } else
        msg.reply("choose **on** or **off**.")
    }

    if(command === 'list-maps') {
      let maps = await axios.get('/maps').then(r => r.data)
      let data = maps.reduce((acc, map) => {
        acc.ID.push(map.id.toString())
        acc.Name.push(map.name)
        return acc
      }, {ID: [], Name: []})
      msg.channel.send(makeTable(data))
    }

  } catch(err) {
    console.log(err)
  }
})
client.login(process.env.TOKEN)