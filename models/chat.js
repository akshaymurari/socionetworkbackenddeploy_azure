const chat = (sequelize,DataTypes) => {
    return sequelize.define("chat",{
        user1:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        user2:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        message:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    },{
        updatedAt:false
    })
}

module.exports = chat;