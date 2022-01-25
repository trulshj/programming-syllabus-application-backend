import { DataTypes, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize) => {
    return sequelize.define<Model<any, any>, unknown>(
        "subject_in_article",
        {},
        {
            createdAt: false,
            updatedAt: false,
            timestamps: false,
        }
    );
};
