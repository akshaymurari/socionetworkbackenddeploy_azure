const {Op} = require("sequelize");
const getmychats = async (req,res,db) => {
    const data = req.body;
    const user = require("./auth")(data.token);
    try{
        if(user){
            const result = await db.chats.findAll({
                where:{
                    [Op.or]:[
                        {user1:user.username},
                        {user2:user.username}
                    ]
                },
            });
            let send=[];
            result.forEach((ele)=>{
                if(ele.user1!=user.username){
                    send.push(ele.user1);
                }
                if(ele.user2!=user.username){
                    send.push(ele.user2);
                }
            })
            send=[...new Set(send)]
            console.log(send);
            return res.status(200).send(send);
        }
        else{
            return res.status(400).send("invalid token");
        }
    }
    catch(error){
        console.log(error);
        return res.status(400).send("invalid token");
    }
}

module.exports = {getmychats};