import { Sequelize, Op, FindOptions } from "sequelize";

const userFeatures = require("../user/userFeatures");
const returnAttributes: string[] = [
    "article_id",
    "article_title",
    "article_description",
    "article_change_date",
    "published",
];

function fetchData(options: FindOptions, sequelize: Sequelize): Promise<any> {
    return new Promise((res: any, error: any) => {
        sequelize
            .model("article")
            .findAll(options)
            .then((articleList: any) => {
                let output: JSON[] = [];
                articleList.map((oneItem: any) => {
                    output.push(oneItem.dataValues);
                });
                if (articleList != null) {
                    res(output);
                } else {
                    error("articles not found");
                }
            })
            .catch((err: any) => {
                console.error(err);
                error(err);
            });
    });
}

module.exports = () => {
    return {
        getByUser(sequelize: Sequelize, userID: string) {
            return <Promise<undefined | JSON[]>>new Promise(async (res) => {
                let getList: FindOptions = {
                    attributes: returnAttributes,
                    where: {
                        author_id: userID,
                    },
                    include: [
                        {
                            attributes: ["file_id", "alt_text"],
                            model: sequelize.model("image"),
                            required: false,
                            limit: 1,
                        },
                    ],
                };
                fetchData(getList, sequelize).then((aList) => res(aList));
            });
        },
        getArticleList: (sequelize: Sequelize, userID: string) => {
            return <Promise<undefined | JSON[]>>new Promise(async (res) => {
                let getList: FindOptions = {
                    attributes: returnAttributes,
                    where: {
                        published: userID
                            ? !(await userFeatures.isAdmin(userID, sequelize))
                            : true,
                    },
                    include: [
                        {
                            attributes: ["file_id", "alt_text"],
                            model: sequelize.model("image"),
                            required: false,
                            limit: 1,
                        },
                    ],
                };
                fetchData(getList, sequelize).then((aList) => res(aList));
            });
        },
        searchArticleList: (sequelize: Sequelize, search: string) => {
            return <Promise<undefined | JSON[]>>new Promise((res) => {
                if (search == "") {
                    res([]);
                    return;
                }

                const searchList: FindOptions = {
                    attributes: returnAttributes,
                    where: {
                        published: true,
                        [Op.and]: {
                            [Op.or]: {
                                article_description: {
                                    [Op.like]: "%" + search + "%",
                                },
                                article_title: {
                                    [Op.like]: "%" + search + "%",
                                },
                            },
                        },
                    },
                    include: [
                        {
                            attributes: ["file_id", "alt_text"],
                            model: sequelize.model("image"),
                            required: false,
                            limit: 1,
                        },
                    ],
                };

                fetchData(searchList, sequelize).then((aList) => res(aList));
            });
        },
    };
};
