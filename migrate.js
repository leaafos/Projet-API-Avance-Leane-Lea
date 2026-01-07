const connection = require('./models/connection');

require('./models/user');
require('./models/author');
require('./models/category');
require('./models/book');

// Importer les associations
require('./models/associations');

connection
    .sync({
        alter: true
    })
    .then(() =>  console.log("Database synced"))
    .then(() => connection.close());
  
