const express = require('express');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Fetchuser = require('../middleware/Fetchuser');
const router = express.Router();

const JWT_SECRET = "secretkey";

// Creating user
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "User  already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        console.log(authToken);

        res.json({ user, authToken });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Internal server error");
    }
});

// // Login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "please register your email first" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "your password is not working" });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        console.log(authToken);
        
        res.json({ authToken });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Internal server error");
    }
});

//get user data
router.get('/getuser', Fetchuser, async (req, res) => {


    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Internal server error");
    }
    
})


module.exports = router;