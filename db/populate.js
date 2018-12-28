var dogs = [
  { name: 'Nola'},
  { name: 'Roxy'},
  { name: 'Pup'},
];

var trainers = [
  { name: 'Jenny'},
  { name: 'Bridget'},
  { name: 'Chris'},
];

MongoClient.connect(createDBUri('dogs'), function(err, db) {
  if (err) throw err;

  db.db(dbName).collection("dogs").insertMany(dogs, function(err, res) {
    if (err) throw err;
    console.log("Number of dogs inserted: " + res.insertedCount);
    db.close();
  });

});

MongoClient.connect(createDBUri('trainers'), function(err, db) {
  if (err) throw err;

  db.db(dbName).collection("trainers").insertMany(dogs, function(err, res) {
    if (err) throw err;
    console.log("Number of trainers inserted: " + res.insertedCount);
    db.close();
  });

});

createDBUri((name) => {
  return `mongodb+srv://admin:doggorocks!@doggo-z5a8n.azure.mongodb.net/${name}?retryWrites=true`; 
});