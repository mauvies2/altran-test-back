// ./src/database/ads.js
const { getDatabase } = require("./mongo");

// const collection = {
//   clients: "clients",
//   policies: "policies",
// };

async function insert(data, collection) {
  const database = await getDatabase();
  const { insertedId } = await database.collection(collection).insertOne(data);
  // return insertedId;
}

async function getData(collection) {
  const database = await getDatabase();
  return await database.collection(collection).find({}).toArray();
}

module.exports = {
  insert,
  getData,
};
