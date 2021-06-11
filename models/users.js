module.exports = (sequelize,DataTypes) => {
    const Users = sequelize.define("user",{
        username:{
            type:DataTypes.STRING,
            allowNull:false,
            primaryKey:true
        },
        email:{
            type:DataTypes.STRING,
            isEmail:true,
            unique:true,
            trim:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        isadmin:{
            type:DataTypes.STRING,
            defaultValue:false,
        }
    },{
        timestamps:true,
        createdAt:"createdat",
        updatedAt:"updatedat"
    });
    return Users;
}