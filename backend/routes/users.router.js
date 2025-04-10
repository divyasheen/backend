import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from "uuid";
import { getUsers, registerUser, loginUser, logoutUser } from '../controllers/users.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// setup multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const myFileName = uuidv4() + "_" + file.originalname
        req.myFileName = myFileName;
        cb(null, myFileName)
    }
});

const upload = multer({storage})

// register route
router.get('/', getUsers);
router.post('/register', upload.single('profilepic'), registerUser);
router.post('/login', loginUser);


// Example of a protected route
router.get('/profile', authenticate, (req, res) => {
    // This route is now protected, only accessible if the user is logged in
    res.json({ msg: 'User profile data', user: req.user });
  });


router.post('/logout', logoutUser);
export default router;