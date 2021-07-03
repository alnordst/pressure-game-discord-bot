const changeCase = require('change-case')
const Discord = require('discord.js')
const commands = require('auto-load')('src/commands')
const handleWebhook = require('./util/handleWebhook')

const client = new Discord.Client()

const sendToErrorChannel = msg => {
  if(process.env.ERROR_CHANNEL && false)
    client.channels.cache.get(process.env.ERROR_CHANNEL).send(msg)
}

client.on('ready', async () => {
  handleWebhook(client)
  client.user.setActivity(`| DM me 'hello' to play`)
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
  if(msg.author.bot || msg.channel.type != 'dm')
    return

  let args = msg.content.trim().split(' ')
  let command = changeCase.camelCase(args.shift())
  console.log(`command: ${command}; args: [${args.join(' ')}]`)
  if(!(command in commands))
    command = 'default'
  try {
    return await commands[command].execute(msg, args)
  } catch(error) {
    console.log(error.stack)
    let full
    if(error.response && error.response.data){
      //console.log(error.response.data)
      full = JSON.stringify(error.response.data)
    } else {
      //console.log(error)
      full = error.stack
    }
    sendToErrorChannel(
      `**Encountered error**: \`${error.message}\`\nUser: \`${msg.author.username}#${msg.author.discriminator}\`\nMessage: \`${msg.content}\`\nFull: \`\`\`\n${full}\`\`\``
    )
    msg.channel.send('Whoops, something went wrong! An error log was sent to the dev team.')
  }
})

client.login(process.env.TOKEN)

/*
todo, redo necessary commands
update renderer with arrows
webhook handler
*/