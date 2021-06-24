const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const { matchReport } = require('./render')

let handleWebhook = client => {
  const app = express()
  app.use(bodyParser.json())

  app.post('/', async (req, res) => {
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
  })

  app.listen(3001)
}

module.exports = handleWebhook