const mongoose= require('mongoose');
const mongoURI="mongodb://localhost:27017/mangodb";
const dbConnect=()=>{
    mongoose.connect(mongoURI)
    .then(()=>{
        console.log("connected to mongoosedb");
    })
}
module .exports=dbConnect;