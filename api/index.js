import express from 'express'
import emoji from 'node-emoji';
import { MongoClient } from 'mongodb';

const API_URL = 'https://doggo.herokuapp.com'
const dbUri = "mongodb+srv://admin:doggorocks!@doggo-z5a8n.azure.mongodb.net/doggo?retryWrites=true";

const app = express();      // server
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/api/getAllSessions', (req, res) => {
  MongoClient.connect(dbUri, function(err, client) {
    const collection = client.db("test").collection("sessions");
    client.close();
  });

  res.sendFile({'current': 'data'});
});

app.get('/api/getCurrentUDCSessions', (req, res) => {
  res.sendFile({'current': 'data'});
});

app.listen(process.env.PORT || 3000, function(){
  console.log('server started at port 3000!');
  console.log(`Made with ${emoji.get('heart')}`);
});