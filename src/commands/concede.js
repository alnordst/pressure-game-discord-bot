const api = require('../util/api')

module.exports = {
  help: {
    signature: '<matchId>',
    example: '32',
    usage: 'Concede a match.'
  },
  execute: async (msg, [matchId]) => {
    try {
      await api.post(`/match/${matchId}/concede`, {
        on_behalf_of: msg.author
      })
      msg.channel.send('Concession successful.')
    } catch(error) {
      if(error.response && error.response.status == 401) {
        msg.channel.send('You are not a participant of this match.')
      } else if(error.response && error.response.status == 404) {
        msg.channel.send('Match not found.')
      } else if(error.response && error.response.status == 406) {
        msg.channel.send('Match is over.')
      } else {
        throw error
      }
    }
  }
}