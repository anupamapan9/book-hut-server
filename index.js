const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // get data **************
        // all data --------------
        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = bookCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // one data by Id------------ 
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookCollection.findOne(query)
            res.send(result)
        })
        // get data end *********************



        // post & update data **********************
        // post data ----------------------
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await bookCollection.insertOne(book)
            res.send(result)
        })
        // update ---------------------
        app.put('/update/:id', async (req, res) => {
            const id = req.params;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.newQuantityTotal
                }
            }
            const result = await bookCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        // delete a data by id ------------------------
        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookCollection.deleteOne(query)
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
