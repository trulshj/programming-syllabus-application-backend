import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "@sequelize/core";
import { sequelize } from "../../app";
import { Article } from "./Article.model";

export class Image extends Model<
    InferAttributes<Image>,
    InferCreationAttributes<Image>
> {
    declare fileId: string;
    declare altText: string;

    declare articleId: number;
    declare article?: NonAttribute<Article>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Image.init(
    {
        fileId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        altText: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        articleId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "Images" }
);
