import { DataTypes, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize) => {
    const article = sequelize.define<Model<any, any>, unknown>(
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
            publication_date: {
                type: DataTypes.DATE,
                createdAt: true,
            },
            change_date: {
                type: DataTypes.DATE,
            },
            time_to_complete: {
                type: DataTypes.TINYINT.UNSIGNED,
            },
            published: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(1234),
            },
            view_counter: {
                type: DataTypes.BIGINT.UNSIGNED,
                counterIncrement: 1,
            },
        },
        {
            createdAt: "publication_date",
            updatedAt: "change_date",
        }
    );

    return article;
};
