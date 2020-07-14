const { getDatabase } = require("./mongo");

async function insertUser(data) {
  const database = await getDatabase();
  return await database.collection("users").insertOne(data);
}
async function insert(data, collection) {
  const database = await getDatabase();
  return await database.collection(collection).insertMany(data);
}

async function aggregateClientsPolicies() {
  const database = await getDatabase();
  return await database
    .collection("clients_policies")
    .aggregate([
      {
        $lookup: {
          from: "policies",
          localField: "id",
          foreignField: "clientId",
          as: "policies",
        },
      },
    ])
    .toArray(async function (err, res) {
      if (err) throw err;
      await insert(res, "clients_policies");
    });
}

async function getData(collection) {
  const database = await getDatabase();
  return await database.collection(collection).find({}).toArray();
}

module.exports = {
  insert,
  insertUser,
  aggregateClientsPolicies,
  getData,
};
