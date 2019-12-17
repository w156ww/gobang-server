const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    keepAlive: 120,
};

mongoose.connect(dbConfig.gobang, options);








