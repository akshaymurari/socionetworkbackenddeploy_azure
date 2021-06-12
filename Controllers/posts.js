const auth = require("./auth");

const deletepost = async (req,res,db) => {
    try{
        const data = req.body;
        const user = auth(data.token);
        if(user){
            console.log(user);
            const result = await db.posts.destroy({
                where:{
                    id:data.id
                }
            });
            console.log(result);
            return res.status(200).send("post deleted");
        }
        return res.status(400).send("invalid jwt token");
    }
    catch(error){
        console.log(error);
        return res.status(400).send("error");
    }
}

const getposts = async (req,res,db) => {
    try{
        const data = req.body;
        const user = auth(data.token);
        if(user){
            console.log(user);
            const result = await db.posts.findAll({
                where:{
                    userUsername:user.username
                },
                include:[db.likes]
            });
            console.log(result);
            return res.status(200).send({data:result,username:user.username});
        }
        return res.status(400).send("invalid jwt token");
    }
    catch(error){
        console.log(error);
        return res.status(400).send("error");
    }
}

const followingposts = async (req,res,db) => {
    try{
        const data = req.body;
        const user = auth(data.token);
        if(user){
            console.log(user);
            const result = await db.following.findAll({
                where:{
                    username:user.username
                }
            });
            console.log("result is ",result);
            const postdata = []
            for(var i=0;i<result.length;i++){
                const getisposts = await db.posts.findAll({
                    where:{
                        userUsername:result[i].userUsername,           
                    },
                    include:[db.likes,db.comments]
                })
                for(var j=0;j<getisposts.length;j++){
                    postdata.push(getisposts[j]);
                }
            }
            postdata.sort((a,b)=>{
                if(a.createdAt>b.createdAt) return true;
                return false;
            })
            console.log(postdata)
            return res.status(200).send({data:postdata,username:user.username});
        }
        return res.status(400).send("invalid jwt token");
    }
    catch(error){
        console.log(error);
        return res.status(400).send("error");
    }
}

const addposts = async (req,res,db) => {
    const data = req.body;
    const user = auth(data.token);
    if(!user){
        return res.status(400).send("invalid jwt token");
    }
    else{
        try{
            const img = data.profilepic.replace(/^data:image\/png;base64,/,"");
            const posts = await db.posts.create({
                userUsername: user.username,
                tagline:data.tagline,
                pic:""
            });
            console.log(posts,"in 39");
            const postdata = posts.dataValues;
            require("fs").writeFileSync(
                "/app/static/posts/" + user.username.trim() + postdata.id + ".png",
                img,
                "base64",
                function (err) {
                  console.log(err);
                }
            )
            const result = await db.posts.update({
                userUsername: user.username,
                tagline:data.tagline,
                pic: `${process.env.Baseurl}/static/posts/${user.username.trim()}${postdata.id}.png`,
            },
            {
                where:{
                    id:postdata.id
                }
            }
            );
            console.log(result);
            return res.status(200).send(result);
        }
        catch(error){
            console.log(error);
            return res.status(400).send("error in addposts")
        }
    }
}

module.exports = {addposts,getposts,deletepost,followingposts}
