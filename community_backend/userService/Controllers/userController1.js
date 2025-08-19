const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const errorHandler = require("../Utils/response.js");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ====== Helper Functions ======
async function comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
}

// function generateAccessToken(userId) {
//     return jwt.sign(
//         { id: userId },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
//     );
// }

function generateAccessToken(userId) {
    return jwt.sign(
        {
            sub: userId,
            iss: "testuser" // <-- MUST match the consumer key in Kong
        },
        process.env.ACCESS_TOKEN_SECRET, // MUST match Kong's `secret` field
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h"
        }
    );
}

// function generateRefreshToken(userId) {
//     return jwt.sign(
//         { id: userId },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
//     );
// }

function generateRefreshToken(userId) {
    return jwt.sign(
        {
            sub: userId,
            iss: "testuser" // <-- MUST match the consumer key in Kong
        },
        process.env.REFRESH_TOKEN_SECRET, // MUST match Kong's `secret` field
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d"
        }
    );
}


async function refreshToken(userId) {
    try {
        const user1 = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user1) return null;

        const token = generateRefreshToken(user1.id);

        await prisma.user.update({
            where: { id: user1.id },
            data: { refreshToken: token }
        });

        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// ====== Auth Controllers ======
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return errorHandler(res, {
                message: "Email already exists",
                statusCode: 400
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email,
                password: hashedPassword,
                // role: "customer"
            }
        });

        const accessToken = generateAccessToken(newUser.id);
        const refreshTokenValue = await refreshToken(newUser.id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(201)
            .cookie("accessToken", accessToken, options)
            .json({
                message: "User created successfully",
                user: { ...newUser, password: undefined },
                refreshToken: refreshTokenValue
            });

    } catch (error) {
        console.error(error);
        return errorHandler(res, {
            message: "User registration failed",
            statusCode: 500
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorHandler(res, {
                message: "Invalid input",
                statusCode: 400
            });
        }

        const { email, password } = req.body;
        const user1 = await prisma.user.findUnique({ where: { email } });

        if (!user1) {
            return errorHandler(res, {
                message: "User not found",
                statusCode: 404
            });
        }

        const isMatch = await comparePassword(password, user1.password);
        if (!isMatch) {
            return errorHandler(res, {
                message: "Invalid password",
                statusCode: 400
            });
        }

        const accessToken = generateAccessToken(user1.id);
        const refreshTokenValue = await refreshToken(user1.id);

        const options = {
            httpOnly: true,
            secure: true
        };

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                message: "User logged in successfully",
                user: { ...user1, password: undefined },
                refreshToken: refreshTokenValue
            });

    } catch (error) {
        console.error(error);
        return errorHandler(res, {
            message: "Invalid email or password",
            statusCode: 400
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        await prisma.user.update({
            where: { id: req.user.id },
            data: { refreshToken: null }
        });

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        };

        return res.clearCookie("accessToken", options).send({
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return errorHandler(res, {
            message: "Logout failed",
            statusCode: 500
        });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const foundUser = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!foundUser) {
            return errorHandler(res, {
                message: "User not found",
                statusCode: 404
            });
        }

        return res.json({ ...foundUser, password: undefined });

    } catch (error) {
        console.error(error);
        return errorHandler(res, {
            message: "Invalid token",
            statusCode: 401
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser
};
