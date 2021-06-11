const posts = (sequelize,DataTypes) => {
    return sequelize.define("post",{
        pic:{
            type:DataTypes.STRING,
            allowNull:false
        },
        tagline:{
            type:DataTypes.TEXT
        }
    })
}

module.exports = posts;