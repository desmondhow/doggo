const mongoose = require('mongoose');
const User = require('./schemas/userSchema');

var users = [
  {
    email: 'wdc.training@gmail.com',
    password: 'password', 
    password_conf: 'password', 
    protocols: [
      {
        name: 'UDC',
        sections: [
          {
            name: 'General',
            fields: [
              {
                name: 'location',
                fieldType: 'dropdown',
                values: ['Training Room', 'Building Interior']
              },
              {
                name: 'temperature',
                fieldType: 'number'
              },
              {
                name: 'humidity',
                fieldType: 'number'
              },
              {
                name: 'wind',
                fieldType: 'number',
              },
            ]
          },
          {
            name: 'Hides',
            fields: [
              {
                name: '4 mil - 1',
                fieldType: 'number'
              },
              {
                name: '4 mil - .09',
                fieldType: 'number'
              },
              {
                name: '4 mil - .04',
                fieldType: 'number'
              },
              {
                name: '4 mil - .02',
                fieldType: 'number'
              }
            ]
          }
        ]
      }
    ]
  }
]

createDBUri = name => (
  `mongodb+srv://admin:doggorocks!@doggo-z5a8n.azure.mongodb.net/${name}?retryWrites=true`
);

// mongoose.connect(createDBUri('users'))
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// User.find({ email:users[0].email }).remove().exec();
// wdc = new User(users[0])
// wdc.save(err => {
//   if (err) throw err;
// });

// User.insertMany(users, function(err) {
//   if (err) throw(err);
// });





