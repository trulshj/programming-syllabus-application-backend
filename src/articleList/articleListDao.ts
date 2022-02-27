import { Sequelize, Op, FindOptions } from "@sequelize/core";

const userFeatures = require("../user/userFeatures");
const returnAttributes: string[] = [
    "id",
    "title",
    "description",
    "updatedDate",
    "published",
];

function fetchData(options: FindOptions, sequelize: Sequelize): Promise<any> {
    return new Promise((res: any, error: any) => {
        sequelize
            .model("Article")
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
                        authorId: userID,
                    },
                    include: [
                        {
                            attributes: ["fileId", "altText"],
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
                            attributes: ["fileId", "altText"],
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
                                description: {
                                    [Op.like]: "%" + search + "%",
                                },
                                title: {
                                    [Op.like]: "%" + search + "%",
                                },
                            },
                        },
                    },
                    include: [
                        {
                            attributes: ["fileId", "altText"],
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
