const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const {OAuth2Client} = require("google-auth-library");

const client = new OAuth2Client();

const signin = async (req,res,db) => {
    const data = req.body;
    if(data.password!=data.conformpassword){
        res.status(400).send("Password and conformpass mismatch");
    }
    else{
        try{
            const userexits = await db.users.findOne({
                where:{
                    username:data.username
                },
            });
            if(userexits.dataValues!=null){
                console.log(userexits.dataValues);
                if(await bcrypt.compare(data.password,userexits.dataValues.password)){
                    const token = await jwt.sign(data,process.env.secretkey);
                    return res.status(200).send({token});
                }
                else{
                    return res.status(400).send("wrong password");
                }
            }
            else{
                return res.status(400).send("user not found");
            }
        }catch(error){
            console.log(error);
            res.status(400).send("error in signin");
        }
    }
}

const googlesignin = async (req, res, db) => {
    try{
        const data = req.body;
        const response = await client.verifyIdToken({
            idToken: data.token,
            audience:process.env.clientid
        });
        console.log(response.payload);
        const result = await db.users.findOne({
            where:{
                email:response.payload.email
            }
        });
        if(result){
            const token = await jwt.sign({username:result.username,email:result.email},process.env.secretkey);
            res.status(200).send({token});
        }
        else{
            res.status(400).send("username not found");
        }
    }
    catch(error){
        console.log(error);
        res.status(400).send("error in google signin");
    }
}

module.exports = {signin,googlesignin};