const mongoose = require('mongoose');
const inPro = require('./inPro');

const Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/prod-info', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});




const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < 9; i++) {
        
        const prod = new Product({
      
            title: `${inPro[i].title}`,
            price:`${inPro[i].price}`,description:`${inPro[i].description}`,
            location: `${inPro[i].location}`,
            image:`${inPro[i].image}`
        })
        await prod.save();
    }
        }
        


seedDB().then(() => {
    mongoose.connection.close();
})