const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {registerUser,loginUser,logoutUser, verifyUser} = require("../Controllers/userController1.js")
const verify = require('../Middlewares/authMiddleware.js')

router.post('/register', [
        check("name").notEmpty().withMessage("First name is required"),
        check("email").isEmail().withMessage("Invalid email address"),
        check("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long")
    ],registerUser)

router.post('/login',[
    check("email").isEmail().withMessage("Invalid email address")
], loginUser)


router.get('/logout', verify, logoutUser);
router.post('/verify',verifyUser)

module.exports = router;