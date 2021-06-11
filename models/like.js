const like = (sequelize,DataTypes)=>{
    return sequelize.define("like",{
        likedusername:{
            type:DataTypes.STRING,
            allowNull:false
        }
    })
}

module.exports = like;