const { json } = require("body-parser");

const test = [
  {
    id: "1",
  },
  {
    id: "2",
  },
  {
    id: "3",
  },
];

console.log(test.map((obj) => (obj["id"] = obj["_id"])));
