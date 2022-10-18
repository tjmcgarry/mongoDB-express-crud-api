const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  // establish connection
  connectToDb: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/bookstore")
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  // return connection
  getDb: () => dbConnection,
};
