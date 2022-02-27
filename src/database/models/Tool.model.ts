import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../app";

export const Tool = sequelize.define<Model<any, any>, unknown>(
    "Tool",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
    },
    {
        createdAt: false,
        updatedAt: false,
    }
);
