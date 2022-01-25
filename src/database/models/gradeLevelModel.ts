import {DataTypes, Model, Sequelize} from "sequelize";

module.exports=(sequelize:Sequelize)=>{
    return sequelize.define<Model<any,any>, unknown>("grade_level", {
            grade_name: {
                type: DataTypes.STRING,
                unique:true
            }
        },{
            createdAt:false,
            updatedAt:false
        }
    );
}