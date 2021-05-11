const fs = require('fs').promises
const path = require('path')

let key = {
  a: { type: 'artillery', team: 1 },
  c: { type: 'command', team: 1 },
  i: { type: 'infantry', team: 1 },
  s: { type: 'sniper', team: 1 },
  t: { type: 'tank', team: 1 },
  A: { type: 'artillery', team: 0 },
  C: { type: 'command', team: 0 },
  I: { type: 'infantry', team: 0 },
  S: { type: 'sniper', team: 0 },
  T: { type: 'tank', team: 0 },
}

module.exports = {
  parse: (mapName) => {
    return fs.readFile(
      path.resolve(__dirname, `./maps/${mapName}.json`),
      'utf8'
    ).then(file => {
      let json = JSON.parse(file)
      let map = json.map(line => line.split('').map(item => {
        if(item in key)
          return {
            type: key[item].type,
            team: key[item].team
          }
        else
          return null
      }))
      return map
    }).catch(err => {
      console.log(err)
      throw('mapNotFound')
    })
  },
  // return array of available maps
  list: () => {
    return fs.readdir(
      path.resolve(__dirname, `./maps`)
    ).then(files => files.map(file => file.split('.')[0]))
  }
}