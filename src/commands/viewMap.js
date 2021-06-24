const api = require('../util/api')
const { mapReport } = require('../util/reports')
const render = require('../util/render')

module.exports = {
  help: {
    signature: '<mapId>',
    example: '14',
    usage: 'Display a map.'
  },
  execute: async (msg, [mapId]) => {
    try {
      let response = await api.get(`/map/${mapId}`)
      let map = response.data
      return render(msg.channel, {
        text: mapReport(map),
        board: JSON.parse(map.data)
      })
    } catch(error) {
      if(error.response && error.response.status == 404)
        msg.channel.send('Map not found.')
      else
        throw error
    }
  }
}