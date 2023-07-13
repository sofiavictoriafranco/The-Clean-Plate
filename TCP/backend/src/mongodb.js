const mongoose = require('mongoose')
require('dotenv').config()
const {DB_USER, DB_PASSWORD, DB_HOST, DB_NAME} = process.env

// 127.0.0.1
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`, {
    
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(db => console.log('Database is connect'))
    .catch(err => console.log(err))
