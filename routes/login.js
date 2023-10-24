const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const bcrypt = require('bcrypt');


router.post('/check', async (req, res) => {
    let { username, password } = req.body;
    try {
        const user = await Users.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            // รหัสผ่านถูกต้อง
            res.redirect(`/homepage/${user._id}`); // ไปหน้าhome
        } else {
            // รหัสผ่านไม่ถูกต้อง
            res.send('รหัสผ่านไม่ถูกต้อง');
        }
    } catch (error) {
        console.error("error");
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
