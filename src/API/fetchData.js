const axios = require("axios");

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    // return response;
    const data = Object.values(response.data)[0];
    return data;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  fetchData,
};
