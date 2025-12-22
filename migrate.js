const connection = require('./models/connection');

require('./models/user');
require('./models/task');

connection
    .sync({
        alter: true
    })
    .then(() =>  console.log("Database synced"))
    .then(() => connection.close());
  
