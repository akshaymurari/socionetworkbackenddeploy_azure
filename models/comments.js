const comments = (sequelize,DataTypes) => {
    return sequelize.define("comment",{
        commenteduser:{
            type:DataTypes.STRING,
            allowNull:false
        },
        message:{
            type:DataTypes.STRING,
            allowNull:false
        }
    })
}

module.exports = comments;