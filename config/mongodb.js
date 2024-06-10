const { MongoClient } = require("mongodb");

const url = "mongodb://zikri:asdfasdf@localhost:27017?authSource=admin";
const client = new MongoClient(url);

(async () => {
  try {
    await client.connect();
    console.log("berhasil konek database");
  } catch (error) {
    console.log(error);
  }
})();

const db = client.db("eduwork-native");

module.exports = db;
