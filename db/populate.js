import mongoose, { Schema, ObjectId } from "../server/node_modules/mongoose";
import User from "./schemas/userSchema";
import XLSX from "xlsx";
import csv from "fast-csv";
import "isomorphic-fetch"

// var users = [
//   {
//     email: 'wdc.training@gmail.com',
//     password: 'password',
//     password_conf: 'password',
//     protocols: [
//       {
//         name: 'UDC',
//         sections: [
//           {
//             name: 'General',
//             fields: [
//               {
//                 name: 'location',
//                 fieldType: 'dropdown',
//                 values: ['Training Room', 'Building Interior']
//               },
//               {
//                 name: 'temperature',
//                 fieldType: 'number'
//               },
//               {
//                 name: 'humidity',
//                 fieldType: 'number'
//               },
//               {
//                 name: 'wind',
//                 fieldType: 'number',
//               },
//             ]
//           },
//           {
//             name: 'Hides',
//             fields: [
//               {
//                 name: '4 mil - 1',
//                 fieldType: 'number'
//               },
//               {
//                 name: '4 mil - .09',
//                 fieldType: 'number'
//               },
//               {
//                 name: '4 mil - .04',
//                 fieldType: 'number'
//               },
//               {
//                 name: '4 mil - .02',
//                 fieldType: 'number'
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ]

const createDBUri = name =>
  `mongodb+srv://admin:doggorocks!@doggo-z5a8n.azure.mongodb.net/${name}?retryWrites=true`;

var workbook = XLSX.readFile("udc.xlsx");
var worksheet = workbook.Sheets["udc"];
const json = XLSX.utils.sheet_to_json(worksheet);

const dogs = new Set();
const handlers = new Set();
const sessions = [];

csv
  .fromPath("./udc.csv", { headers: true })
  .on("data", function(data) {
    const k9Name = data.k9name;
    console.log(k9Name);
    const handler = data.handler;

    dogs.add(k9Name);
    handlers.add(handler);

    const hides = [];
    for (let i = 1; i < 11; i++) {
      hides.push({
        concentration: data[`concentrationmil_${i}`],
        size: data[`concentrationcm_${i}`],
        location: data[`location_${i}`],
        isConcealed: data[`concealed_${i}`],
        placementArea: data[`placement1_${i}`],
        placementHeight: data[`placement2_${i}`],
        roomNumber: null,
        hideType: null,
        notes: null
      });
    }

    sessions.push({
      sessionType: "UDCBuildingSearch",
      data: {
        createdAt: new Date(data.timestamp),
        sessionId: mongoose.Types.ObjectId(),
        isNewSession: false,
        temperature: data.temperature,
        humidity: data.humidity,
        wind: data.wind,
        windDirection: data.winddirection,
        complete: true,
        hides: hides
      }
    });
    // console.log(data);
    return;
  })
  .on("end", function() {
    console.log("done");
    connectToDB();
  });

const connectToDB = () => {
  console.log("connecting....");
  fetch("http://localhost:3010/api/users/import-user", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "wdc@gmail.com",
      password: "adogsworld!",
      dogs: [...dogs].map(dog => ({ name: dog })),
      handlers: [...handlers].map(handler => ({ name: handler }))
    })
  });

  // mongoose.connect(createDBUri("users")).then(
  //   () => {
  //     console.log("Database is working!");
  //     const userData = {
  //       email: "wdc@gmail.com",
  //       password: "adogsworld!",
  //       sessions: sessions,
  //       dogs: [...dogs].map(dog => ({ name: dog }))
  //     };
  //     User.create(userData, function(err, user) {
  //       console.log("fdfd");
  //       if (err) {
  //         console.log("creation failed");
  //       } else {
  //         console.log("yay, user created!");
  //       }
  //     });
  //   },
  //   err => {
  //     console.log(err);
  //   }
  // );
  // const db = mongoose.connection;
};

// User.find({ email:users[0].email }).remove().exec();
// wdc = new User(users[0])
// wdc.save(err => {
//   if (err) throw err;
// });

// User.insertMany(users, function(err) {
//   if (err) throw(err);
// });
