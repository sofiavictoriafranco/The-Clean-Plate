const mongoose = require('mongoose')
require('dotenv').config()
const {DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_DEPLOY} = process.env

// 127.0.0.1
mongoose.connect('mongodb+srv://jean:20011015kiraynana@proyecto.nn5v7j5.mongodb.net/the-clean-plate?retryWrites=true&w=majority', {
    
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(db => console.log('Database is connect'))
    .catch(err => console.log(err))
