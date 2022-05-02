import {
    Association,
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "@sequelize/core";
import { sequelizeInstance } from "../../app";
import { File } from "./File.model";
import { User } from "./User.model";

export class Article extends Model<
    InferAttributes<Article>,
    InferCreationAttributes<Article>
> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare timeToComplete: CreationOptional<number>;
    declare published: CreationOptional<boolean>;
    declare description: string;
    declare viewCounter: CreationOptional<number>;

    declare authorId: string;
    declare owner?: NonAttribute<User>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare getFiles: HasManyGetAssociationsMixin<File>;
    declare addFile: HasManyAddAssociationMixin<File, string>;
    declare addFiles: HasManyAddAssociationsMixin<File, string>;
    declare setFiles: HasManySetAssociationsMixin<File, string>;
    declare removeFile: HasManyRemoveAssociationMixin<File, string>;
    declare removeFiles: HasManyRemoveAssociationsMixin<File, string>;
    declare hasFile: HasManyHasAssociationMixin<File, string>;
    declare hasFiles: HasManyHasAssociationsMixin<File, string>;
    declare countFiles: HasManyCountAssociationsMixin;
    declare createFile: HasManyCreateAssociationMixin<File, "articleId">;

    declare static associations: {
        files: Association<Article, File>;
    };
}

Article.init(
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
        timeToComplete: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: true,
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
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
        authorId: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { sequelize: sequelizeInstance, tableName: "Articles" }
);
