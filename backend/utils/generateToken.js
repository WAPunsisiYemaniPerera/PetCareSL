const jwt =require ('jsonwebtoken');

const generateToken = (id, name) =>{
    const payload = { id, name};

    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: '30d',
    });
};

module.exports = generateToken;