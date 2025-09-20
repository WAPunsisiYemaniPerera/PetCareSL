const jwt =require ('jsonwebtoken');

const generateToken = (id, name, isAdmin) =>{
    const payload = { id, name, isAdmin};

    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: '30d',
    });
};

module.exports = generateToken;