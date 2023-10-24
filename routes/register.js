const express = require('express');
const router = express.Router();
const Users = require('../models/users');

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.post('/submit', async (req, res) => {
    try {
        let data = new Users({
            username: req.body.username,
            password: req.body.password,
            postID : []
        });
        await data.save(); // ใช้ await เพื่อรอให้ข้อมูลบันทึกเสร็จสมบูรณ์

        res.redirect(`/homepage/${data._id}`)
    } catch (error) {
        console.error(error);
        res.status(500).send('User already use'); // หรือใช้ res.render() เพื่อแสดงหน้าผลลัพธ์ที่ถูกแก้ไข
    }
});

module.exports = router;
