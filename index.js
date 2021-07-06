// npm init
// npm install express mongodb
// npm install --save-dev nodemon
// npm install --save cors body-parser

const express = require('express');
const bodyParser = require('body-parser');
// mongodb
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const password =  '4dg4ft-rv4Gj!fQussBkVF-thtf543';

const uri = "mongodb+srv://organicUser:4dg4ft-rv4Gj!fQussBkVF-thtf543@cluster0.b99uy.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

// mongodb
client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");
    
    // Get product
    app.get('/products',(req, res) =>{
        productCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })
    // post product
    app.post("/addProduct",(req, res) =>{
        const product = req.body;
        productCollection.insertOne(product)
        .then(result=>{
            console.log("Product added successfully!");
            res.redirect('/');
        })
    })
    //get update
    app.get('/product/:id',(req, res) =>{
        productCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err, documents) =>{
            res.send(documents[0]);
        })
    })
    // patch update
    app.patch('/update/:id',(req, res)=>{
        productCollection.updateOne({ _id: ObjectId(req.params.id)},
        {
            $set: {name: req.body.name ,price: req.body.price, quantity: req.body.quantity}
        })
        .then(result =>{
            res.send(result.modifiedCount > 0)
        })
    })

    // delete
    app.delete('/delete/:id',(req, res) =>{
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((result)=>{
            res.send(result.deletedCount > 0);
        })
    })

});


app.listen(3000);
