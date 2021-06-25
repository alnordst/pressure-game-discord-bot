const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const { matchReport } = require('./reports')
const render = require('./render')

let handleWebhook = client => {
  const app = express()
  app.use(bodyParser.json())

  app.get('/', (req, res) => {
    res.sendStatus(200)
  })

  app.post('/', async (req, res) => {
    try {
      console.log(`Handling webhook; reason: ${req.body.reason}; match_id: ${req.body.match_id}; player_id: ${req.body.player_id}`)
      let player = await api.get(`/player/${req.body.player_id}`)
      if(req.body.reason == 'draw-offer') {
        client.users.cache.get(player.discord_id).send(`A draw was offered in match ${req.body.match_id}.`)
      } else {
        let match = await api.get(`/match/${req.body.match_id}`)
        let head = ''
        if(req.body.reason == 'match over')
          head = 'Match is over!\n'
        else if(req.body.reason == 'next turn')
          head = 'Next turn!\n'
        await render(client.users.cache.get(player.discord_id), {
          text: head + matchReport(match),
          board: JSON.parse(match.last_state.data)
        })
      }
      res.sendStatus(200)
    } catch(err) {
      console.log(err)
      res.sendStatus(500)
    }
  })

  app.listen(3001)
}

module.exports = handleWebhook