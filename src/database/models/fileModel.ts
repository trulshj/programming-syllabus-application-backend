import {DataTypes, Model, Sequelize} from "sequelize";

module.exports=(sequelize:Sequelize)=>{
    const fileModel = sequelize.define<Model<any,any>, unknown>("file",{
        file_id:{
            type: DataTypes.STRING(64),
            primaryKey: true
        },
        file_name:{
            type: DataTypes.STRING
        },
        article_id:{
            type: DataTypes.BIGINT.UNSIGNED,
            foreignKey:true
        }
    },{
        createdAt:true,
        updatedAt:true,
    });
    return fileModel;
}