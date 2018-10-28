import express from 'express'
import emoji from 'node-emoji';

const API_URL = 'https://doggo.herokuapp.com'

const app = express();      // server
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/api/getAllSessions', (req, res) => {
  res.sendFile({'current': 'data'});
});

app.get('/api/getCurrentUDCSessions', (req, res) => {
  res.sendFile({'current': 'data'});
});

app.listen(process.env.PORT || 3000, function(){
  console.log('server started at port 3000!');
  console.log(`Made with ${emoji.get('heart')}`);
});