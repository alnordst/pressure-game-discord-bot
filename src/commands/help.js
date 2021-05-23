module.exports = msg => {
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
    'set-notifications <on|off>': 'This dictates whether or not the bot pings you on discord when its your turn. By default this is on.',
    'list-maps': 'Get list of available maps.',
    'show-map <map name>': 'Show a graphical representation of a map.'
  }
  return msg.channel.send(Object.entries(commands).map(([key, value]) => {
    return `**${process.env.PREFIX}${key}**\n${value}`
  }).join('\n\n'))
}