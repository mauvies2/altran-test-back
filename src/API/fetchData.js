const axios = require("axios");
const { insert } = require("../database/ads");

async function fetchData(url, collection) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    insert(data, collection);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  fetchData,
};
