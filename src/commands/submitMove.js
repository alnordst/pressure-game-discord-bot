const api = require('../util/api')

module.exports = {
  help: {
    signature: '<matchId> <commands>',
    example: '12 a3:NW b4:N d1:NW',
    usage: 'Submit moves in a match.'
  },
  execute: async (msg, [matchId, ...rawCommands]) => {
    let commands
    try {
      commands = rawCommands.map(command => {
        let [address, direction] = command.split(':')
        return {address, direction}
      })
    } catch(error) {
      msg.channel.send('Invalid command(s)')
    }
    if(commands)
      try {
        await api.post(`/match/${matchId}/submit-move`, {
          on_behalf_of: msg.author,
          commands
        })
        msg.channel.send('Move received.')
      } catch(error) {
        if(error.response && error.response.status == 401)
          msg.channel.send('You are not a participant of this match.')
        else if(error.response && error.response.status == 404)
          msg.channel.send('Match not found.')
        else if(error.response && error.response.status == 406)
          msg.channel.send('Move invalid or match already over.')
        else
          throw error
      }
  }
}