const following = (sequelize,DataTypes) => {
    return sequelize.define("following",{
        username:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        freezeTableName:true
    })
}

module.exports = following;