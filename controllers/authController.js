const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { username, password } = req.body;

   
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign(
            { id: 1, username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        return res.json({ token });
    }

    res.status(401).json({ message: 'Invalid Credentials' });
};

module.exports = { login };
