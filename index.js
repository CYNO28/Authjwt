
const express=require('express');
const app=express();
const mongoose=require('mongoose');

const {Schema,model}=mongoose;
const UserSchema=new Schema({
    username:String,
    password:String,
    age:Number,})

const UserModel=model('User',UserSchema);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/signup',(req,res)=>{
const {username,password,age}=req.body;
const user =new UserModel({
    username,age,password,})
user.save()

})
mongoose.connect('mongodb://127.0.0.1:27017/web17').then(()=>{
    app.listen(8080,()=>{
        console.log('Server is running on port 8080');
    })
})

