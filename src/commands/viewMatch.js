const api = require('../util/api')
const { matchReport } = require('../util/reports')
const render = require('../util/render')

module.exports = {
  help: {
    signature: '<matchId>',
    example: '24',
    usage: 'Display a match.'
  },
  execute: async (msg, [matchId]) => {
    try {
      let response = await api.get(`/match/${matchId}`)
      let match = response.data
      return render(msg.channel, {
        text: matchReport(match),
        board: JSON.parse(match.last_state.data)
      })
    } catch(error) {
      if(error.response && error.response.status == 404)
        msg.channel.send('Match not found.')
      else
        throw error
    }
  }
}