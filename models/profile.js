const profile = (sequelize,DataTypes) => {
    return sequelize.define("profile",{
        profilepic:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:"https://source.unsplash.com/random"
        },
        bio:{
            type:DataTypes.TEXT,
            defaultValue:""
        }
    },{
        createdAt:false
    })
}

module.exports = profile;