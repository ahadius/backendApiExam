const mongoose=require('mongoose');
const uri='mongodb+srv://ahad:ahad123@examclustor2023.3vmdfp9.mongodb.net/?retryWrites=true&w=majority';
const connecttomongo=()=>
{
    mongoose.connect(uri).then((data)=>{
        console.log('Connected to databse successfully '+ data.Connection.name)
    }).catch((err)=>{
        console.log(err);
    })
};
module.exports=connecttomongo;