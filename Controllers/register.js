const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {Op} = require("sequelize");

const register = async (req, res, db) => {
  const data = req.body;
  console.log(data);
  if (data.password !== data.conformpassword) {
    return res.status(400).send("password and conformpass are not equal");
  }
  data.pass = data.password;
  data.password = await bcrypt.hash(data.password, 10);
  try {
    const result = {
      username: data.username,
      password: data.password,
      email: data.email,
    };
    const useroremailexits = await db.users.count({
        where:{
            [Op.or]:[
                {username:data.username},
                {email:data.email}
            ]
        }
    });
    console.log(useroremailexits)
    if(useroremailexits==0){
        console.log(result);
        const token = await jwt.sign({...result,password:data.pass}, process.env.secretkey);
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.user,
            pass: process.env.pass,
          },
        });
        let info = await transporter.sendMail({
          from: process.env.user,
          to: data.email,
          subject: "Ecommerce ✔",
          text: "dont share this link to anyone?",
          html: `<a href=${process.env.Baseurl}/verify/${token}>verify</a>`,
        });
        return res.status(200).send({ token });
    }
    else{
        return res.status(400).send("error");
    }
  } catch(error) {
      console.log(error);
    return res.status(400).send("error");
  }
};

module.exports = { register };
