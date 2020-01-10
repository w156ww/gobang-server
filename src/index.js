const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require("body-parser");
const history = require('connect-history-api-fallback');

const ip = require("ip");
const cors = require('./middleware/cors');
// const cors = require('cors');
const responseFilter = require('./middleware/response-filter');

const apiConfig = require('./config/api.config');
// router
const router = require('./service/router/index');

const hostname = ip.address();
const port = apiConfig.port;

// set cors
app.use(cors);
// 响应中间件
app.use(responseFilter);
// parse post request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(router);

app.use(history());

require('./db-helper/index');

const createIO = require('./socket/index');
const io = createIO(http);

http.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});


