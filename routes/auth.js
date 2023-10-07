import express from 'express'
const router = express.Router();
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken';
import 'dotenv/config.js';
import fetchUser from '../middleware/fetchUser.js';

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;


    try {
        // validation 
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All Fields are Required" })

        }
        // validation 


        // eamil-validation 
        if (!email.includes('@')) {
            return res.status(400).json({ error: "Please Enter a Valid Email" })
        }
        // eamil-validation 


        // find-unique eamil 
        const user = await User.findOne({ email })
        if (user) {
            res.status(400).json({ error: "User Already Exist" })
        }
        // find-unique eamil 

        // Generate salt 
        const salt = await bcrypt.genSalt(10);

        // hash-password
        const hashedPassword = await bcrypt.hash(password, salt)
        // hash-password

        // Generate salt 



        // Save data into database
        const newUser = await User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save();
        console.log(newUser);
        res.status(200).json({ success: "SignUp Successfully" })
        // Save data into database





    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }

})


router.post('/login', async (req, res) => {
    // get data from body
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send(error, "All Fields are Required")
        }
        // Email validation 
        if (!email.includes('@')) {
            res.status(400).json({ error: "Please Enter Valid Email" })
        }

        const user = await User.findOne({ email });
        console.log(user);


        if (!user) {
            return res.status(400).json({ error: "User Not Found" })
        }


        // matching the password to the hash password 
        const domatch = await bcrypt.compare(password, user.password);
        console.log(domatch);

        // generate the token  
        if (domatch) {
            const token = Jwt.sign({ userId: user.id }, "" + process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                })
            res.status(201).json({ token, success: "Login Successfully" })

        }
        else {
            res.status(404).json({ error: "Email and Password Not Found" })

        }

    } catch (error) {
        console.log(error);
        res.status(500).send(error, "Internal Server Error")
    }

})


router.get('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.userId;
        console.log("Get User Id", userId);
        const user = await User.findById(userId).select("-password");
        res.send(user)


    } catch (error) {
        console.log(error);
        res.status(500).send("Enternal Server Error")

    }

})

export default router;