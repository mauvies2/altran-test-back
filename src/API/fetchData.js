const axios = require("axios");
const { insert } = require("../database/database");

async function fetchDataToDatabase(url, collection) {
  try {
    const response = await axios.get(url);
    const data = Object.values(response.data)[0];
    insert(data, collection);
  } catch (error) {
    return alert(error);
  }
}

module.exports = {
  fetchDataToDatabase,
};
