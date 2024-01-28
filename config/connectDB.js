const mongoose = require("mongoose");
require("colors");

module.exports = () => {
  mongoose.connect(process.env.DB_LOCAL_URL).then(() => {
    console.log(`- DATABASE:`.magenta, `Connected to mongoDB ✓`.white);
  });
};
