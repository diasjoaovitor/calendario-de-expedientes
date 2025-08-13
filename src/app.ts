import path from 'node:path'

import express from 'express'

import router from './routes'

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(router)

app.listen(3000, () => {
  console.log('Server is running on: http://localhost:3000')
})
