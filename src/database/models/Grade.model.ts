import { DataTypes, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize) => {
    return sequelize.define<Model<any, any>, unknown>(
        "Grade",
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            createdAt: false,
            updatedAt: false,
        }
    );
};
