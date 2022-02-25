const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
const cors = require('cors');
require('dotenv').config()
// const fileUpload = require("express-fileUpload")



const port = process.env.PORT || 5000;

app.use(cors());
// app.use(fileUpload());
app.use(express());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ernrq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

  try {
    await client.connect();
    console.log("database connected");
    const database = client.db('foodmart_shop');
    const productCollection = database.collection('products')
    const blogCollection = database.collection('blogs')

    const commentCollection = database.collection('comments')
    const reviewCollection = database.collection('reviews')
    const addblogCollection = database.collection('add_blog')
    const vendorsCollection = database.collection('vendors')


    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({})
      const products = await cursor.toArray();
      res.send(products);
  })


    app.post('/products', async (req, res) => {
      const productTitle = req.body.productTitle;
      const productCategory = req.body.productCategory;
      const productPrice = req.body.productPrice;
      const productStock = req.body.productStock;
      const productVendor = req.body.productVendor;
      const productDetails = req.body.productDetails;
      const productImage = req.files.productImage
      const productImageData = productImage.data
      const encodedProductImage = productImageData.toString('base64')
      const imageBuffer = Buffer.from(encodedProductImage, 'base64')

      const product = {
        productTitle,
        productCategory,
        productPrice,
        productPrice,
        productStock,
        productVendor,
        productDetails,
        productImage: imageBuffer
      }
      const result = await productCollection.insertOne(product)
      res.json(result)
    })



    app.get('/blogs', async (req, res) => {
      const cursor = blogCollection.find({})
      const blogs = await cursor.toArray();
      res.send(blogs);
  })
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find({})
      const reviews = await cursor.toArray();
      res.send(reviews);
  })

  } 
  finally {
    // await client.close();
  }



}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Foodmart!!')
})

app.listen(port, () => {
  console.log(` listening at ${port}`)
})