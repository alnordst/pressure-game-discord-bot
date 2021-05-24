const axios = require('../util/axios')
const mapReport = require('../util/reports/mapReport')
const render = require('../util/render')

module.exports = async (msg, [gameId]) => {
  try {
    let map = await axios.get(`/map/${gameId}`)
      .then(r => r.data)
    let text = mapReport(map)
    return render(msg, text, map)
  } catch(err) {
    if(err.response && err.response.status == 404)
      return msg.channel.send('Map not found.')
    else
      throw err
  }
}