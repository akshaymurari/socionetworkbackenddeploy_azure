const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");

const getprofile = async (req,res,db) => {
  const data = req.body;
  console.log(db.users);
  console.log(data);
  try{
    const user = require("./auth")(req.body.token);
    if(user){
      const result = await db.users.findOne({
        where:{
          username:data.username
        },
        include:[db.profile,{
          model:db.posts,
          include:[db.likes,db.comments]
        },db.following],
        attributes:{exclude:["password"]}
      });
      console.log(result,"in getprofile");
      result.dataValues.userUser=user.username;
      return res.status(200).send(result);
    }
    else{
      return res.status(400).send("invalid token")
    }
  }
  catch(error){
    console.log(error);
    return res.status(400).send("error in getprofile");
  }
}

const onsearch = async (req,res,db) => {
  data=req.body;
  console.log(data,"data");
  try{
    const user = require("./auth")(req.body.token);
    if(user){
      const result = await db.users.findAll({
        where:{
          [Op.and]:[
            {
              username:{
                [Op.substring]:req.body.username
              }
            },
            {
              username:{
                [Op.not]:user.username
              }
            }
          ]
        },
        include:[db.posts,db.profile,db.following],
        attributes:{exclude:["password"]}
      })
      console.log(result);
      return res.status(200).send(result);
    }
    else{
      return res.status(400).send("invalid token")
    }
  }
  catch(error){
    console.log(error);
    return res.status(400).send("error in on serach func")
  }
}

const profilepic = async (req, res, db) => {
  data = req.body;
  try {
    // console.log(data.profilepic);
    console.log(data.token);
    if (require("./auth")(data.token)) {
      const verify = jwt.verify(data.token, process.env.secretkey);
      const username = verify.username;
      console.log(__dirname)
      var base64Data = data.profilepic.replace(/^data:image\/png;base64,/, "");
      require("fs").writeFileSync(
        "/static/" + username.trim() + ".png",
        base64Data,
        "base64",
        function (err) {
          console.log(err);
        }
      );
      const result = await db.profile.count({
        userUsername: username,
      });
      console.log(result);
      if (result == 0) {
        const result = await db.profile.create({
          profilepic: `${process.env.Baseurl}/static/${username.trim()}.png`,
          bio: data.bio,
          userUsername: username,
        });
      } else {
        const result = await db.profile.update(
          {
            profilepic: `${process.env.Baseurl}/static/${username.trim()}.png`,
            bio: data.bio,
            userUsername:username
          },
          {
            where:{
              userUsername: username,
            }
          },
        );
        console.log(result)
      }
      return res
        .status(200)
        .send({ img: `${process.env.Baseurl}/static/${username.trim()}.png` });
    } else {
      return res.status(200).send("invalid token");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("error in profilepic upload");
  }
};

const getprofilepic = async (req, res, db) => {
  try {
    const data = require("./auth")(req.body.token);
    if (data) {
      try {
        const result = await db.profile.findOne({
            where:{
                userUsername: data.username,
            }
        });
        console.log(result.dataValues);
        return res.status(200).send({ ...result.dataValues, username: data.username });
      } catch {
          return res.status(200).send({username:data.username,profilepic:"https://source.unsplash.com/random"})
      }
    } else {
      return res.status(400).send("invalid token");
    }
  } catch {
    return res.status(400).send("error in getprofilepic");
  }
};

module.exports = { profilepic, getprofilepic,onsearch,getprofile };
