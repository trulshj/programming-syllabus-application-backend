import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "@sequelize/core";
import { sequelizeInstance } from "../../app";
import { TagType } from "../../types/TagDto";

export class Tag extends Model<
    InferAttributes<Tag>,
    InferCreationAttributes<Tag>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare tagType: TagType;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Tag.init(
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
        tagType: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { sequelize: sequelizeInstance, tableName: "Tags" }
);
