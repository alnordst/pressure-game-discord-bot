const api = require('../util/api')
const { matchReport } = require('../util/reports')
const render = require('../util/render')

module.exports = {
  help: {
    signature: '[<map_id>] [<actions_per_turn>]',
    example: '* 2',
    usage: `Find a match. Map ID and actions per turn can be omitted for a more permissive search. To specify actions per turn while keeping map ID open, use a wildcard (*).`
  },
  execute: async (msg, [mapId, actionsPerTurn=1]) => {
    let matchConfiguration = { actions_per_turn: actionsPerTurn }
    if(mapId && parseInt(mapId) == parseInt(mapId))
      matchConfiguration.map_id == parseInt(mapId)
    try {
      let response = await api.post('/match/find-match', {
        on_behalf_of: msg.author,
        match_configuration: matchConfiguration
      })
      let match = response.data
      if(response.status == 201) {
        return render(msg.channel, {
          text: `Game found!\n${matchReport(match)}`,
          board: JSON.parse(match.last_state.data)
        })
      } else if(response.status == 202) {
        msg.channel.send('No match found, new challenge issued and awaiting opponent.')
      }
    } catch(error) {
      if(error.response && error.response.status == 409) {
        msg.channel.send('You already have a challenge active!')
      } else {
        throw error
      }
    }
  }
}