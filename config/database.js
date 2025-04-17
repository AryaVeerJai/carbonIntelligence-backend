const mongoose = require('mongoose');

//Database Connection
//mongodb://localhost:27017/tanziva
//mongodb+srv://websharkdeveloper:<password>@cluster0.vrkzeyq.mongodb.net/tanziva?retryWrites=true&w=majority
const connectDatabase = () => {
    // mongoose.connect("mongodb+srv://websharkdeveloper:developerwebshark@cluster0.vrkzeyq.mongodb.net/khadostore?retryWrites=true&w=majority", {
    mongoose.connect("mongodb+srv://jaiwebshark:jai7544@greenscore.4odue.mongodb.net/greenscore?retryWrites=true&w=majority", {
        
        //For avoid Warnings
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    }).then(con => {
        console.log(`MongoDb Database connect with HOST : ${con.connection.host}`)
    })
}

module.exports = connectDatabase 
