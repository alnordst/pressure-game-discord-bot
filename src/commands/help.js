module.exports = msg => {
  let sections = {
    'Play': {
      'find-game': 'Find a match with another player.',
      'move <game id> <from heading> <to heading>': `Make a move (ex: ${process.env.PREFIX}move 1 a3 b4)`,
      'undo <game id>': 'Undo a move.',
      'concede <game id>': 'Concede game.',
      'offer-draw <game id>': 'Offer a draw.'
    },
    'Analysis': {
      'available-moves <game id> <heading>': 'Show available moves for unit at specified heading.',
      'threatens <game id> <heading>': 'Display units threatening square at specified heading.',
      'threatened-by <game id> <heading>': 'Display squares threatened by unit at specified heading.'
    },
    'Info': {
      'ping': "Check that the bot is alive.",
      'list-games': 'Display your active games.',
      'show-game <game id>': 'Display current status of a game.',
      'list-maps': 'Get list of available maps.',
      'show-map <map name>': 'Show a graphical representation of a map.'
    },
    'Settings': {
      'set-notifications <on|off>': 'This dictates whether or not the bot pings you on discord when its your turn. By default this is on.'
    }
  }
  return msg.channel.send(Object.entries(sections).map(([name, contents]) => {
    let formattedContent = Object.entries(contents).map(([command, text]) => {
      return `\`${process.env.PREFIX}${command}\` ${text}`
    }).join('\n')
    return `**${name}**\n${formattedContent}`
  }).join('\n\n'))
}