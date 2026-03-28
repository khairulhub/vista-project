const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 8000

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token
  console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zm1n6te.mongodb.net/?appName=Cluster0`
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    //make the database and make the rooms collection to store the rooms data
    const roomsCollection = client.db('stayvista').collection('rooms')



    // auth related api
    app.post('/jwt', async (req, res) => {
      const user = req.body
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
        console.log('Logout successful')
      } catch (err) {
        res.status(500).send(err)
      }
    })

    // get all rooms data from database
    app.get('/rooms', async (req, res) => {
      const category = req.query.category   //here category will come from client side as query parameter and we will use it to filter the rooms data based on category. if category is not provided then we will return all rooms data. if category is provided then we will return only those rooms which belong to that category. if category is provided as null then we will return all rooms data because in our client side code we are sending category as null when user click on All categories. so here we will check if category is null then we will return all rooms data otherwise we will return only those rooms which belong to that category.
      //here we find the category will be string and value in null 
      let query = {}
      if (category && category !== 'null') {
        query.category = category
      }
      try {
        const rooms = await roomsCollection.find(query).toArray()
        res.send(rooms)
      } catch (error) {
        res.status(500).send(error)
      }
    })


    //save a single room data in database
    app.post('/room', async (req, res) =>{
      const roomData = req.body
      const result = await roomsCollection.insertOne(roomData)
      res.send(result)
    })

    // get single room data by id
    app.get('/room/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      try {
        const room = await roomsCollection.findOne(query)
        if (!room) {
          return res.status(404).send({ message: 'Room not found' })
        }
        //send the room data as response
        res.send(room)
      } catch (error) {
        res.status(500).send(error)
      }
    })  



    // get all rooms data for host by email
    app.get('/my-listings/:email', async (req, res) => {
      const email = req.params.email
      
      let query = {'host.email': email}
     const result = await roomsCollection.find(query).toArray()
     res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}












run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from StayVista Server..')
})

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`)
})
