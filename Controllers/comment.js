const comment = async (req,res,db) => {
    const data = req.body;
    try{
        const user = require("./auth")(data.token);
        if(user){
            const addcomment = await db.comments.create({
                commenteduser:user.username,
                message:data.message,
                postId:data.id
            })
            console.log(addcomment.dataValues);
            return res.status(200).send(addcomment.dataValues);
        }
        else{
            return res.status(400).send("invalid token");
        }
    }catch(error){
        console.log(error);
        return res.status(400).send("error in comment");
    }
}

const getcomments = async (req,res,db) => {
    const data = req.body;
    try{
        const user = require("./auth")(data.token);
        if(user){
            const getcomment = await db.comments.findAll({
                where:{
                    postId:data.id
                }
            })
            console.log(getcomment);
            return res.status(200).send(getcomment);
        }
        else{
            return res.status(400).send("invalid token");
        }
    }catch(error){
        console.log(error);
        return res.status(400).send("error in getcomments");
    }
}


module.exports = {comment,getcomments};