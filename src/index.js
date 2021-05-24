const changeCase = require('change-case')
const Discord = require('discord.js')
const client = new Discord.Client()


const commands = require('auto-load')('src/commands')

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
  try{
    let valid = [
      !msg.author.bot,
      msg.content.startsWith(process.env.PREFIX),
    ].reduce((v, condition) => v && condition)
    if(!valid)
      return
    
    let commandBody = msg.content.slice(process.env.PREFIX.length)
    let args = commandBody.split(' ')
    let command = changeCase.camelCase(args.shift().toLowerCase())

    if(command in commands)
      return commands[command](msg, args)
    else
      return msg.reply(`I don't understand that command.`)
  } catch(err) {
    if(err.response && err.response.data)
      console.log({status: err.response.status, data: err.response.data})
    else if(err.response)
      console.log(err.response)
    else
      console.log(err)
  }
})
client.login(process.env.TOKEN)