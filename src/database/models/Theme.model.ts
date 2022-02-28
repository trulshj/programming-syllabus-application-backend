import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "@sequelize/core";
import { sequelize } from "../../app";

export class Theme extends Model<
    InferAttributes<Theme>,
    InferCreationAttributes<Theme>
> {
    declare id: CreationOptional<number>;
    declare name: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Theme.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "Themes" }
);
