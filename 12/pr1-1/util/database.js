const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://art:Klishch_mongo_1@cluster0.fwtwmjh.mongodb.net/shop?retryWrites=true&w=majority";
// const uri = "mongodb+srv://art:Klishch_mongo_1@cluster0.fwtwmjh.mongodb.net/shop"
const client = new MongoClient(uri);
let _db;

const mongoConnect = async (cb) => {
  try {
    const clientRes = await client.connect();
    _db = clientRes.db();
    console.log("Connected!");
    cb();
  } catch (err) {
    console.log("Failed to connect with database", err);
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No database found";
  }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
