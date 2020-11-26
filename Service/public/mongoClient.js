const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://IndySMStesting:Viz9tZMyEWAAQgc3@indysmstesting.czvmq.mongodb.net/mainDB?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
module.exports = mongoClient;