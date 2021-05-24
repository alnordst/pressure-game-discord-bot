const axios = require('../util/axios')
const makeTable = require('../util/makeTable')

module.exports = async (msg) => {
  let maps = await axios.get('/maps').then(r => r.data)
  let data = maps.reduce((acc, map) => {
    acc.ID.push(map.id.toString())
    acc.Name.push(map.map_name)
    return acc
  }, {ID: [], Name: []})
  return msg.channel.send(makeTable(data))
}