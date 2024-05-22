const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs")
const jwtToken = require('jsonwebtoken');
const dotEnv = require('dotenv')
const PORT = process.env.PORT || 4000
const templeRoutes = require('./routers/templeRoutes')  
const trekkingRoutes = require('./routers/trekkingRoutes')
const waterfallRoutes = require('./routers/waterfallsRoute')
const path = require('path')

const app = express();

app.use(cors());
app.use(express.json())

dotEnv.config()

mongoose.connect(process.env.MONGO_URI)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/temples',templeRoutes)
app.use('/waterfalls',waterfallRoutes)
app.use('/trekking',trekkingRoutes)


// const schema = new mongoose.Schema({
//     state: String,
//     district: String,
//     name: String,
//     url: String,
//     img:String,
//     description: String,
//     territory: String
// })

// const templeModel = mongoose.model('temple',schema)
// const waterfallsModel = mongoose.model('waterfall',schema)
// const trekkingModel = mongoose.model('trekking',schema)



// app.post('/temples',async (req,res)=>{
//     const {name,state,district,url,img,description} = req.body
//     try{
//         const existingName = await templeModel.findOne({name})
//         if(!existingName){
//             const newTrip = new templeModel({
//                 name,state,district,url,img,description
//             })
//             await newTrip.save()
//             res.status(201).send("trip posted Successfully")
//         }
//         else{
//             res.status(400).send('Place Already Exists');
//         }
//     }
//     catch(err){
//         res.status(500).send("Internal Server Error");
//     }
// })

// app.post('/waterfalls',async (req,res)=>{
//     const {name,state,district,url,img,description} = req.body
//     try{
//         const existingName = await waterfallsModel.findOne({name})
//         if(!existingName){
//             const newTrip = new waterfallsModel({
//                 name,state,district,url,img,description
//             })
//             await newTrip.save()
//             res.status(201).send("trip posted Successfully")
//         }
//         else{
//             res.status(400).send('Place Already Exists');
//         }
//     }
//     catch(err){
//         res.status(500).send("Internal Server Error");
//     }
// })

// app.post('/trekking',async (req,res)=>{
//     const {name,state,district,url,img,description} = req.body
//     try{
//         const existingName = await trekkingModel.findOne({name})
//         if(!existingName){
//             const newTrip = new trekkingModel({
//                 name,state,district,url,img,description
//             })
//             await newTrip.save()
//             res.status(201).send("trip posted Successfully")
//         }
//         else{
//             res.status(400).send('Place Already Exists');
//         }
//     }
//     catch(err){
//         res.status(500).send("Internal Server Error");
//     }
// })

// app.get('/gettemples', async (req,res)=>{
//     const {state} = req.query
//     try{
//         if (state) {
//             const data = await templeModel.find({state})
//             // Filter temples by state if 'state' query parameter is provided
//             const filteredTemples = data.filter(temple => temple.state.toLowerCase() === state.toLowerCase());
//             res.json(filteredTemples);
//           } else {
//             // Send all temples if no state is specified
//             const data = await templeModel.find()
//             res.json(data);
//           }
//     } catch(err){
//         console.log(err)
//         res.status(500).json({message: 'server err'})
//     }
// })





// app.get('/waterfalls',async (req,res)=>{
//     const {state} = req.query
//     try{
//         if (state) {
//             const data = await waterfallsModel.find({state})
//             // Filter temples by state if 'state' query parameter is provided
//             const filteredWaterFalls = data.filter(waterfall => waterfall.state.toLowerCase() === state.toLowerCase());
//             res.json(filteredWaterFalls);
//           } else {
//             // Send all temples if no state is specified
//             const data = await waterfallsModel.find()
//             res.json(data);
//           }
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({message: 'server err'})
//     }
// })



// app.get('/trekking', async (req,res)=>{
//     const {state}= req.query

//     try{

//         if (state) {
//             const data = await trekkingModel.find({state})
//             // Filter temples by state if 'state' query parameter is provided
//             const filteredTemples = data.filter(temple => temple.state.toLowerCase() === state.toLowerCase());
//             res.json(filteredTemples);
//           } else {
//             // Send all temples if no state is specified
//             const data = await trekkingModel.find()
//             res.json(data);
//           }

//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({message: 'server err'})
//     }
// })



const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email:String,
    number: Number,
    gender: String
})

const userModel = mongoose.model('user',userSchema)

app.post("/register", async (req,res)=>{
    const {username,password,email,number,gender} = req.body

    const hashedPassword = await bcrypt.hash(password,10);

    try{

        const existingUser = await userModel.findOne({email})

        if (!existingUser){
            const newUser = new userModel({
                username,
                password: hashedPassword,
                email,
                number,
                gender
            })
            await newUser.save()
            res.status(200).send("User Registered Successfully")
        }
        else{
            res.status(400).send('Email Already Exists');
        }
    }
    catch(err){
        console.error("Error registering user:", err)
        res.status(500).send(err)
    }

})



app.post("/login", async (req,res)=>{
    const {email,password} = req.body
    try {
        const existingUser = await userModel.findOne({email})

        if (!existingUser){
            res.status(400).send("Invalid User")
        }
        else{
            const isPasswordMatched = await bcrypt.compare(password,existingUser.password)

            if (isPasswordMatched){

                const payload = {
                    id : existingUser._id
                }
                const token = jwtToken.sign(payload,"jwt_token")
                res.status(200).send({token, message: "Login Success"})
            }
            else{
                res.status(400).send("Invalid Password")
            }
        }
    }
    catch(err){
        console.error('Error during login:', error);
    res.status(500).send('Internal server error');
    }
})




app.listen(PORT, () => {
    console.log(`server is running\n http://localhost:${PORT}`)
})


