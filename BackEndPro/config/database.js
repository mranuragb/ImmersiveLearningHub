const mongoose = require('mongoose');
require ("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(()=>{
        console.log("DataBase Connected Successfully")
    }).catch((err)=>{
        console.log("Connection Error ")
        console.log(err)
        process.exit(1)
    });
}



// module.exports = connect;

