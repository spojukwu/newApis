
const mongoose = require ("mongoose")

// post request for- Email validation function  
// Define User Schema  
const userSchema = new mongoose.Schema({  
    name: { type: String, required: true },  
    email: { type: String, required: true, unique: true },  
});  

const Use = mongoose.model('User', userSchema);  

// POST /update-email route  
app.post('/update-email', async (req, res) => {  
    const { name, email } = req.body;  

    // Validate input  
    if (!name || !email) {  
        return res.status(400).json({ error: 'Name and email are required.' });  
    }  

    // Validate email format  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!emailRegex.test(email)) {  
        return res.status(400).json({ error: 'Invalid email format.' });  
    }  

    try {  
        const user = await User.findOneAndUpdate(  
            { name },  
            { email },  
            { new: true, runValidators: true }  
        );  

        if (!user) {  
            return res.status(404).json({ error: 'User not found.' });  
        }  

        res.status(200).json({ message: 'Email updated successfully.', user });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to update email.' });  
    }  
}); 

    