const mongoose = require('mongoose')
require('dotenv').config()
const {DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_DEPLOY} = process.env

// 127.0.0.1
mongoose.connect(DB_DEPLOY, {
    
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(db => console.log('Database is connect'))
    .catch(err => console.log(err))
