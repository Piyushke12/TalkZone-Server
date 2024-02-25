const jwt = require('jsonwebtoken')

const verifyRequest = (req,res,next)=>{

    if( req.headers.authorization.startsWith("Bearer") ) {
        try{
            const token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user=decode; // don't know what to do with this value
            return next();
        }
        catch(err){
            res.status(401).send("Authentication Failed")
        }
    }
    else
    res.status(401).send("Authentication Failed");
}

module.exports = verifyRequest;