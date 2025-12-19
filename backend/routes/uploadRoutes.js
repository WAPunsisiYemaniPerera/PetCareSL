const path = require ('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

//give the keys for cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//create multer (the place where the photo is temporirily stored
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/'); //put into the uploads folder
    },
    filename(req,file, cb){
        //do not change the filename, add a date at the end
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

//check the file types
function checkFileType(file, cb){
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype){
        return cb(null, true);
    } else{
        cb('Images Only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb){
        checkFileType(file, cb);
    }
})

//upload route
//image means the fieldname that sentfrom the frontend
router.post('/',upload.single('image'), async (req,res)=>{
    try{
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'petcare_products',
        })
        res.send(result.secure_url)
    } catch (error){
        console.error(error);
        res.status(500).send('Image upload failed');
    }
})

module.exports = router;