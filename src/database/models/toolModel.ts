import { DataTypes, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize) => {
    return sequelize.define<Model<any, any>, unknown>(
        "tool",
        {
            tool_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            tool_name: {
                type: DataTypes.STRING,
            },
        },
        {
            createdAt: false,
            updatedAt: false,
        }
    );
};
