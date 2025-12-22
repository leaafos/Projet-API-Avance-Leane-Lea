const express = require('express');
const { format } = require('sequelize/lib/utils');
// const formatMiddleware = require('./middlewares/formatMiddleware.js');
// const translateMiddleware = require('./middlewares/translateMiddleware.js');

const app = express();

app.use(express.json()); 

// app.use(translateMiddleware); 
// app.use(formatMiddleware); 

// app.use(require("./routes/tasks.js"));
// app.use(require("./routes/users.js")); 

app.listen(process.env.PORT, () => { 
  console.log(`Server is listening on port ${process.env.PORT}`); 
});
