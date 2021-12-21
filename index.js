const connectToMongo = require('./db')
const express = require('express')
let cors = require('cors')

// connectToMongo();
const app = express()
const port = process.env.PORT || 5000;

connectToMongo()


app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/codes', require('./routes/codes'))
app.use('/api/forms', require('./routes/forms'))


app.get("/", (req, res) =>{
  res.json("Backend running...")
})

app.get("/google", (req, res) =>{
  res.json("Google Sign-in running...")
})

app.listen(port, () => {
  console.log(`Nargeeks Backend listening at http://localhost:${port}`)
})
