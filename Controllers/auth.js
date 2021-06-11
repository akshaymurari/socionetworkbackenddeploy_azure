const jwt = require("jsonwebtoken");

const auth =  (token) => {
    try{
        const result = jwt.verify(token,process.env.secretkey);
        return result;
    }
    catch{
        console.log("inff")
        return null;
    }
}

module.exports = auth;
