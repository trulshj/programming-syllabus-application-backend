import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../app";

export const Article = sequelize.define<Model<any, any>, unknown>(
    "Article",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        publicationDate: {
            type: DataTypes.DATE,
            createdAt: true,
        },
        updatedDate: {
            type: DataTypes.DATE,
        },
        timeToComplete: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        published: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(1024),
        },
        viewCounter: {
            type: DataTypes.BIGINT.UNSIGNED,
            counterIncrement: 1,
        },
    },
    {
        createdAt: "publicationDate",
        updatedAt: "updatedDate",
    }
);
