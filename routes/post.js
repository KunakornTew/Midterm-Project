const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const Post = require('../models/post');
const User = require('../models/users');


router.use(bodyParser.urlencoded({ extended: false }));

// ตั้งค่า multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/post_picture'); // กำหนดโฟลเดอร์ที่รับไฟล์ที่อัปโหลด
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // กำหนดชื่อไฟล์ที่จะถูกบันทึก
    }
  });
  
  // กำหนดการอัปโหลดโดยใช้ multer
  const upload = multer({
    storage: storage,
  });

  //==============================================================================================================

//create post
  router.post('/createpost', upload.single('image'), async (req, res) => {
    const { text,id } = req.body; // ข้อความจากฟอร์ม
    USERID = req.body.id;

  
    try {
      // สร้างโพสต์ใหม่
        const newPost = new Post({
            text: text,
            imageName: req.file ? req.file.filename : null,
            userId: id,
            comments: [{
              from: null,
              commentText: null 
          }]
        });
        
        await newPost.save(); // ใช้ await เพื่อรอให้ข้อมูลบันทึกเสร็จสมบูรณ์
        //เอา id จาก post
        let postid = await Post.find({ userId: USERID }, '_id').exec();
        
        postid.forEach(async(item)=>{
          // //กำหนดpost id ให้ user
            await User.findByIdAndUpdate(
                      {_id: id},
                      {$push: {postID: item._id}}
            );
        });


        res.redirect(`/homepage/${id}`);
        console.log('Create New post Success!!!');
  
    }catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
  });

//create comment
  router.post('/create/comment/:id',async(req,res)=>{
    let id = await User.findOne({ postID: req.params.id }, '_id').exec();
    let text = req.body.commenttext
    const newComment = await Post.findOneAndUpdate(
        {userId: id._id},
        { $push: { 'comments': {
                        from: req.params.id,
                        commentText: text
                    } 
                } 
        },
        { new: true }
    );
    res.redirect('/post');

});

//view post
router.get('/post', async (req, res) => {
    //all post
    let post = await Post.find();
    //map post with username
    let USERNAME = await Promise.all(post.map(async function(item) {
        let user = await User.findOne({ _id: item.userId }, 'username').exec();
        return user.username;
    }));
    try {
      res.render('post.ejs', { data: post, userName: USERNAME ,comment: post[0].comments});
      console.log(post[0].comments)
    } catch (error) {
      res.render('warning.ejs')
    }
   });



//delete post
router.get('/delete/:id',async(req,res)=>{
  let id = req.params.id;
  try {
      await Post.deleteOne({_id: id});
      await User.findOneAndUpdate({postID: id},{$set: {postID: ['']}})
      // ทำสิ่งที่คุณต้องการกับ deletedDocument
      res.redirect('/');
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.log(error)
    }

})

router.get('/update/post/:id',(req,res)=>{
  res.render('update.ejs',{id: req.params.id});
})

//update post
router.post('/update/post',upload.single('image'),async(req,res)=>{

  let id = req.body.id;
  let text = req.body.text;
  let userid = req.body.userid;

  try {
      // สร้างออบเจ็กต์ใหม่ที่ต้องการอัปเดต
      const updatedPost = {
          text: text,
          imageName: req.file ? req.file.filename: null,
          userId: userid
      };

      // ใช้ findByIdAndUpdate() โดยไม่ระบุฟิลด์ _id ในออบเจ็กต์ที่ต้องการอัปเดต
      const POST = await Post.findByIdAndUpdate(id, updatedPost, { new: true });
      res.redirect('/post')
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
  }
})

module.exports = router;