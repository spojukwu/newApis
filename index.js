const express = require("express");  
const dotenv = require("dotenv");  
const mongoose = require("mongoose");  

dotenv.config();  

const app = express();  

// Middleware  
app.use(express.json());  

const PORT = process.env.PORT || 3000;  

app.listen(PORT, () => {  
    console.log(`Server is running on port ${PORT}`);  
});  

mongoose.connect(`${process.env.MONGODB_URL}`)  
    .then(() => console.log("MongoDB connected...!"))  
    .catch(err => console.error("MongoDB connection error:", err));  

const studentSchema = new mongoose.Schema({  
    firstName: { type: String, required: true },  
    lastName: { type: String, required: true },  
    email: { type: String },  
    phoneNumber: { type: Number },  
    age: { type: Number },  
});  

const Students = mongoose.model("Student", studentSchema);  

// post request 1 for - Register user  
app.post("/add_user", async (req, res) => {  
    const { firstName, lastName, email, phoneNumber, age } = req.body;  

    if (!firstName) {  
        return res.status(400).json({ message: "Please add your firstName" });  
    }  
    if (!lastName) {  
        return res.status(400).json({ message: "Please add your lastName" });  
    }  
    if (!email) {  
        return res.status(400).json({ message: "Please add your Email" });  
    }  
    //existing email
    const alreadyExisting = await Students.findOne({email})
    if (alreadyExisting){
        return res.status(400).json({message:"email already exist"})
    }


    const newUser = new Students({ firstName, lastName, email, phoneNumber, age });  
    
    await newUser.save();  
    
    return res.status(200).json({  
        message: "User Registration successful",  
        user: newUser  
    });  
});  



//post request 3

// Define User Schema  
const userSchema = new mongoose.Schema({  
    name: { type: String, required: true },  
    age: { type: Number, required: true },  
});  

const User = mongoose.model('User', userSchema);  

// POST /add-users route  
app.post('/add-users', async (req, res) => {  
    const users = req.body;  

    // Validate input  
    if (!Array.isArray(users)) {  
        return res.status(400).json({ error: 'Input must be an array of users.' });  
    }  

    const validUsers = [];  
    const errors = [];  

    users.forEach((user, index) => {  
        if (user.age < 18 || user.age > 99) {  
            errors.push(`User at index ${index} has an invalid age: ${user.age}`);
              
        } else {  
            validUsers.push(user);  
        }  
    });  

    if (errors.length > 0) {  
        return res.status(400).json({ errors });  
    }  

    try {  
        const savedUsers = await User.insertMany(validUsers);  
        res.status(201).json(savedUsers);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to save users.' });  
    }  
});  