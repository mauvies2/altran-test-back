const axios = require("axios");
const { insert } = require("../database/database");

async function fetchDataToDatabase(url, collection) {
  try {
    const response = await axios.get(url);
    // Store clients data and change id field to _id
    const data = Object.values(response.data)[0].map((obj) => {
      if (collection === "clients") {
        return {
          _id: obj.id,
          name: obj.name,
          email: obj.email,
          role: obj.role,
        };
      } else if (collection === "policies") {
        return {
          _id: obj.id,
          amountInsured: obj.amountInsured,
          email: obj.email,
          inceptionDate: obj.inceptionDate,
          installmentPayment: obj.installmentPayment,
          clientId: obj.clientId,
        };
      } else {
        return obj;
      }
    });

    // Insert data to in-memory database
    insert(data, collection);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  fetchDataToDatabase,
};
