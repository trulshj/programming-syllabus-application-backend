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

export class File extends Model<
    InferAttributes<File>,
    InferCreationAttributes<File>
> {
    declare id: string;
    declare name: string;

    declare articleId: number;
    declare article?: NonAttribute<Article>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

File.init(
    {
        id: { type: DataTypes.STRING(64), primaryKey: true },
        name: { type: DataTypes.STRING(128) },
        articleId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "Files" }
);
