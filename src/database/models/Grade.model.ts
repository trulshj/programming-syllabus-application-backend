import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../app";

export const Grade = sequelize.define<Model<any, any>, unknown>(
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
