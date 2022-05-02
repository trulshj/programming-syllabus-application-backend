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
import { sequelizeInstance } from "../../app";
import { pbkdf2Sync } from "crypto";
import { UserDto } from "../../types/UserDto";
import { getRandomString } from "../../utils/helper";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: string;
    declare username: string;
    declare email: string;
    declare password: string;
    declare salt: CreationOptional<string>;
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

    comparePassword(comparisonPassword: string): boolean {
        if (!this.salt) {
            return this.password == comparisonPassword;
        }

        const hash = pbkdf2Sync(
            comparisonPassword,
            this.salt,
            100,
            32,
            "sha256"
        ).toString("hex");

        return hash == this.password;
    }

    getDto(): UserDto {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            roleId: this.roleId,
            verified: this.verified,
        };
    }

    isAdmin(): boolean {
        return this.roleId == 1;
    }
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
            set(newPassword: string) {
                const newSalt = getRandomString();
                const hash = pbkdf2Sync(
                    newPassword,
                    newSalt,
                    100,
                    32,
                    "sha256"
                ).toString("hex");

                this.setDataValue("salt", newSalt);
                this.setDataValue("password", hash);
            },
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
        sequelize: sequelizeInstance,
        tableName: "Users",
    }
);
