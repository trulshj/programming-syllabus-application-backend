import {DataTypes, Model, Sequelize} from "sequelize";

module.exports=(sequelize:Sequelize)=>{
    return sequelize.define<Model<any,any>, unknown>("theme", {
            theme_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement:true
            },
            theme_name: {
                type: DataTypes.STRING
            }
        },{
            createdAt:false,
            updatedAt:false
        }
    );
}