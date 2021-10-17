const mongoose= require('mongoose');
const mongoURL= 'mongodb://localhost/auth_db'
mongoose.connect(mongoURL);

const db= mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log("Database is running...");
});

module.exports= {db, mongoURL};