const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/Nestico" ;


//for database we ccreate async f^n
main()
.then(()=>{
    console.log("connected to Database");

})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);

}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68ac2d4397fe8928b6e5163a"}));
    await Listing.insertMany(initData.data);
    console.log("data was initlized");
}

initDB();