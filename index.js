const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

// dotenv-------
require('dotenv').config()

// middleware 
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uqrs1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect()
        const bookCollection = client.db('bookHut').collection('books');
        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = bookCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
    } finally {

    }
}

run().catch(console.dir)











app.get('/', (req, res) => {
    res.send('Hello World')
})
app.listen(port, () => {
    console.log('Book Hut listing to port', port)
})