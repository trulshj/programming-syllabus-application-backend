import {DataTypes, Model, ModelDefined, Sequelize} from "sequelize";

module.exports=(sequelize:Sequelize)=>{
    const article = sequelize.define<Model<any,any>,unknown>("article",{
            article_id:{
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                unique:true,
                autoIncrement:true
            },
            article_title:{
                type: DataTypes.STRING
            },
            author_id:{
                type: DataTypes.STRING(64),
                foreignKey:true,
                unique:false,
                allowNull: false
            },
            publication_date:{
                type:DataTypes.DATE,
                createdAt:true
            },
            article_change_date:{
                type:DataTypes.DATE
            },
            time_to_complete:{
                type:DataTypes.TINYINT.UNSIGNED
            },
            published:{
                type:DataTypes.BOOLEAN,
                defaultValue:false,
                allowNull:false
            },
            article_description:{
                type:DataTypes.STRING(1234)
            },
            view_counter:{
                type:DataTypes.BIGINT.UNSIGNED,
                counterIncrement:1
            }

        },{
            createdAt:"publication_date",
            updatedAt:"article_change_date"
        }
    );

    return article
}