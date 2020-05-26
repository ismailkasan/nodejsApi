'use strict';

/*inital library */
const express = require('express');
const app = express();


/*body parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*routers */
const todosRouter = require('./routers/todo.routers');
app.use('/todos',todosRouter);

const usersRouter = require('./routers/user.routers');
app.use('/user',usersRouter);

/*db */
const db = require('./helper/db')();

/*Config*/
app.set("api_secret_key", require("./config").api_secret_key);

/*swagger */
var swaggerUi = require('swagger-ui-express');    
var swaggerDocument = require('./swagger.json');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/*server port */
app.listen(1453, function () {
    console.log('Sunucu çalışıyor...');
});