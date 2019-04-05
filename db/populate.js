import mongoose from 'mongoose';
import XLSX from "xlsx";
import csv from "fast-csv";
import "isomorphic-fetch";

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
    const handler = data.handler;

    if (k9Name.length === 0 || handler.length === 0) {
      return;
    }

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
    createUserWithData("des@gmail.com", "123");
  });

const createUserWithData = (email, pass) => {
  console.log("connecting....");
  fetch("http://localhost:3010/api/users/import-user", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password: pass,
      dogs: [...dogs].map(dog => ({ name: dog })),
      handlers: [...handlers].map(handler => ({ name: handler }))
    })
  });
};

