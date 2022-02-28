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
import { Article } from "./Article.model";
import { sequelize } from "../../app";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: string;
    declare username: string;
    declare email: string;
    declare password: string;
    declare salt: string;
    declare roleId: number;
    declare verified: boolean;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare getArticles: HasManyGetAssociationsMixin<Article>;
    declare addArticle: HasManyAddAssociationMixin<Article, number>;
    declare addArticles: HasManyAddAssociationsMixin<Article, number>;
    declare setArticles: HasManySetAssociationsMixin<Article, number>;
    declare removeArticle: HasManyRemoveAssociationMixin<Article, number>;
    declare removeArticles: HasManyRemoveAssociationsMixin<Article, number>;
    declare hasArticle: HasManyHasAssociationMixin<Article, number>;
    declare hasArticles: HasManyHasAssociationsMixin<Article, number>;
    declare countArticles: HasManyCountAssociationsMixin;
    declare createArticle: HasManyCreateAssociationMixin<Article, "authorId">;

    declare articles?: NonAttribute<Article[]>;

    declare static associations: { articles: Association<User, Article> };
}

User.init(
    {
        id: {
            type: DataTypes.STRING(64),
            primaryKey: true,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(64),
        },
        salt: {
            type: DataTypes.STRING(64),
        },
        roleId: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "Users",
    }
);
