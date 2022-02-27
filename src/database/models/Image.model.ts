import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../app";

export const Image = sequelize.define<Model<any, any>, unknown>(
    "Image",
    {
        fileId: {
            type: DataTypes.STRING(64),
            primaryKey: true,
        },
        altText: {
            type: DataTypes.STRING,
        },
    },
    {
        createdAt: true,
        updatedAt: true,
    }
);
