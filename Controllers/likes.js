const like = async (req, res, db) => {
  try {
    const data = req.body;
    console.log(data, "in like");
    const user = require("./auth")(req.body.token);
    if (user) {
      if(data.username!=null && data.username != undefined) {
          user.username=data.username
      }
      const result = await db.likes.count({
        where: {
          likedusername: user.username,
          postId: data.id,
        },
      });
      if (result == 0) {
        const create = await db.likes.create({
          likedusername: user.username,
          postId: data.id,
        });
        console.log(create.dataValues);
        return res.status(200).send({...create.dataValues});
      }
      else{
        return res.status(400).send("cannot like more than one time");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("error in likes");
  }
};

const unlike = async (req, res, db) => {
    try {
        const data = req.body;
        console.log(data, "in like");
        const user = require("./auth")(req.body.token);
        if (user) {
            const removelike = await db.likes.destroy({
                where:{
                    likedusername: user.username,
                    postId: data.id,
                }
            });
            return res.status(200).send("unlike");
        }
      } catch (error) {
        console.log(error);
        return res.status(400).send("error in likes or connnot like more than one time");
      }
};

module.exports = { like, unlike };
