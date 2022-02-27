import { DataTypes, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize) => {
    const imageModel = sequelize.define<Model<any, any>, unknown>(
        "Image",
        {
            file_id: {
                type: DataTypes.STRING(64),
                primaryKey: true,
            },
            article_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                foreignKey: true,
            },
            alt_text: {
                type: DataTypes.STRING,
            },
        },
        {
            createdAt: true,
            updatedAt: true,
        }
    );
    return imageModel;
};
