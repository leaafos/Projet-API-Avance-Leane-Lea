const express = require('express');
const { format } = require('sequelize/lib/utils');
const connection = require('./models/connection');
const translateMiddleware = require('./middlewares/translateMiddleware.js');
const hateoasMiddleware = require('./middlewares/hateoasMiddleware.js');
const validationMiddleware = require('./middlewares/validation.js');
const errorHandlerMiddleware = require('./middlewares/errorHandler.js');

const app = express();

app.use(express.json()); 

app.use(translateMiddleware); 
app.use(hateoasMiddleware);
app.use(validationMiddleware);
app.use(require("./routes/users.js")); 
app.use(require("./routes/books.js"));
app.use(require("./routes/authors.js"));
app.use(require("./routes/categories.js"));

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT, () => { 
  console.log(`Server is listening on port ${process.env.PORT}`); 
});


