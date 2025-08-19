const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verify = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken; // fixed case: matches what you set in cookies
        if (!token) {
            return res.status(401).json({ msg: 'Access denied' });
        }

        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user1 = await prisma.user.findUnique({
            where: { id: decodedUser.id }
        });

        if (!user1) {
            return res.status(404).json({ msg: 'User not found' });
        }

        req.user = user1;
        next();

    } catch (error) {
        res.status(500).json({
            message: 'Error verifying user',
            error: error.message
        });
    }
};

module.exports = verify;
