const { getDatabase } = require("./mongo");

async function insertUser(data) {
  const database = await getDatabase();
  return await database.collection("users").insertOne(data);
}
async function insert(data, collection) {
  const database = await getDatabase();
  return await database.collection(collection).insertMany(data);
}

async function getData(collection) {
  const database = await getDatabase();
  return await database.collection(collection).find({}).toArray();
}

module.exports = {
  insert,
  insertUser,
  getData,
};
