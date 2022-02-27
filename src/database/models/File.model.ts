import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../app";

export const File = sequelize.define<Model<any, any>, unknown>(
    "File",
    {
        id: {
            type: DataTypes.STRING(64),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
    },
    {
        createdAt: true,
        updatedAt: true,
    }
);
