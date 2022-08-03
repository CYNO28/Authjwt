const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const jwt = require("jsonwebtoken");
const { Schema, model } = mongoose;
const UserSchema = new Schema({
  username: String,
  password: String,
  age: Number,
});

const UserModel = model("User", UserSchema);

app.post("/signup", (req, res) => {
  console.log(req.body);
  const { username, password, age } = req.body;
  const user = new UserModel({
    username,
    age,
    password,
  });
  user.save();
  return res.json({ message: "user created" });
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username, password });
  if (!user) {
    return res.status(401).send("user not found");
  }
  const token = jwt.sign(
    { username: user.username, age: user.age, id: user._id },
    "dinesh",{expiresIn: '1 hour'}
  );
  const refreshtoken=jwt.sign({},'dinesh',{expiresIn:'7 days'})
  return res.send({ message: "user found", token,refreshtoken });
});

app.get("/profile/:id",async(req,res)=>{
    const {id}=req.params;
    const token=req.headers["authorization"].split(" ")[1];
   try{
    const verification=jwt.verify(token,"dinesh");
    if(verification){
        
        const user=await UserModel.findById(id);
        return res.json(user);
    }
}
catch{
    return res.status(401).send("unauthorized");
}
})

mongoose.connect("mongodb://127.0.0.1:27017/web17").then(() => {
  app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
});
