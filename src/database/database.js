const { getDatabase } = require("./mongo");

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
  getData,
};
