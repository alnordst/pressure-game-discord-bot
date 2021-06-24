const changeCase = require('change-case')
const commands = require('auto-load')('src/commands')

module.exports = {
  execute: async (msg, [rawCommand]) => {
    if(rawCommand) {
      let command = changeCase.camelCase(rawCommand)
      if(command in commands && 'help' in commands[command]) {
        let help = commands[command].help
        msg.channel.send([
          `*${command}* ${help.signature}*`,
          `*ex:* \`${command} ${help.example}\``,
          `${help.usage}`
        ].join('\n'))
      } else {
        msg.channel.send('No help data for that command.')
      }
    } else {
      msg.channel.send(`Available commands: \`${Object.keys(commands).map(changeCase.paramCase).join(', ')}\`\nUse \`help <command>\` for details on a command.`)
    }
  }
}