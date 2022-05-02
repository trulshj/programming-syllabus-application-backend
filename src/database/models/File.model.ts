import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "@sequelize/core";
import { sequelizeInstance } from "../../app";
import { Article } from "./Article.model";

export class File extends Model<
    InferAttributes<File>,
    InferCreationAttributes<File>
> {
    declare id: CreationOptional<number>;
    declare hash: string;
    declare name: string;
    declare altText: CreationOptional<string>;

    declare articleId: number;
    declare article?: NonAttribute<Article>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    extension() {
        return "." + this.name.split(".")[1];
    }
}

File.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        hash: { type: DataTypes.STRING(64), allowNull: false },
        name: { type: DataTypes.STRING(128), allowNull: false },
        altText: { type: DataTypes.STRING(128), allowNull: true },
        articleId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { sequelize: sequelizeInstance, tableName: "Files" }
);
