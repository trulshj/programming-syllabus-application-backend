import { DataTypes, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize) => {
    return sequelize.define<Model<any, any>, unknown>(
        "subject",
        {
            subject_id: {
                type: DataTypes.STRING(10),
                primaryKey: true,
                unique: true,
            },
            subject_name: {
                type: DataTypes.STRING,
            },
        },
        {
            createdAt: false,
            updatedAt: false,
        }
    );
};
