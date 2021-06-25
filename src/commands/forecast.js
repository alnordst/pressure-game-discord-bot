const api = require('../util/api')
const { forecastReport } = require('../util/reports')
const render = require('../util/render')

module.exports = {
  help: {
    signature: '<matchId> <commands>',
    example: '12 a3:NW b4:N d1:NW',
    usage: 'Forecast moves on a match.'
  },
  execute: async (msg, [matchId, ...rawCommands]) => {
    let commands
    try {
      commands = rawCommands.map(command => {
        let [address, direction] = command.split(':')
        return {address, direction}
      })
    } catch(error) {
      return msg.channel.send('Invalid command(s)')
    }
    if(commands)
      try {
        let response = await api.post(`/match/${matchId}/forecast`, {
          on_behalf_of: msg.author,
          commands
        })
        let forecast = response.data
        return render(msg.channel, {
          text: forecastReport(matchId, commands),
          board: JSON.parse(forecast.data)
        })
      } catch(error) {
        if(error.response && error.response.status == 404)
          return msg.channel.send('Match not found')
        else
          throw error
      }
  }
}