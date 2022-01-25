import {Sequelize} from "sequelize";
import {IArticle} from "./IArticle";

const formidable = require('formidable');
const userFeatures = require('../user/userFeatures')

// verifying that the user is allowed to change the article
function verifyUser(userId: string, articleId:number,sequelize:Sequelize):Promise<boolean>{
    // undefined means that this is a new article
    if(articleId==undefined){
        return new Promise<boolean>(res => res(true))
    }

    return new Promise<boolean>((res)=>{
        try {
            sequelize.model('article').findOne({
                where: {
                    article_id: articleId
                }
            }).then(async (oneArticle: any) => {
                if (oneArticle.author_id == userId) {
                    res(true);
                } else{
                   res(await userFeatures.isAdmin(userId,sequelize))
                }
            });
        }catch (error:any){
            console.error(error)
            res(false)
        }
    })
}


module.exports=(sequelize: Sequelize)=>{
    return {
        getArticle: (articleNumber: number,userId?:string) => {
            return <Promise<undefined | JSON>>new Promise(async (res, error)=> {
                if (!isNaN(articleNumber)) {
                    sequelize.model('article').findOne({
                        attributes: ['article_title',
                            'article_description',
                            'publication_date',
                            'article_change_date',
                            'time_to_complete',
                            'view_counter',
                            'published',
                            'author_id'],
                        where:{article_id: articleNumber}
                        , include: [{
                            attributes: ['file_name', 'file_id'],
                            model: sequelize.model('file'),
                            required: false
                        }, {
                            attributes: ['file_id', 'alt_text'],
                            model: sequelize.model('image'),
                            required: false
                        }, {
                            attributes: ['subject_id', 'subject_name'],
                            model: sequelize.model('subject'),
                            required: false,
                            through: {attributes: []}
                        }, {
                            model: sequelize.model('user'),
                            required: true,
                            attributes: ['username']

                        }, {
                            model: sequelize.model('theme'),
                            required: false,
                            attributes: ['theme_name'],
                            through: {attributes: []}
                        }, {
                            model: sequelize.model('grade_level'),
                            required: false,
                            attributes: ['grade_name'],
                            through: {attributes: []}
                        }, {
                            model: sequelize.model('tool'),
                            required: false,
                            attributes: ['tool_name'],
                            through: {attributes: []}
                        }]
                    })
                        .then(async (oneArticle: any) => {
                            if (oneArticle != null) {
                                if(!oneArticle.dataValues.published){
                                    if(oneArticle.dataValues.author_id==userId){
                                        delete oneArticle.dataValues['author_id']
                                        res(oneArticle.dataValues);
                                    }else if(await userFeatures.isAdmin(userId,sequelize)){
                                        delete oneArticle.dataValues['author_id']
                                        res(oneArticle.dataValues);
                                    }else error("access denied")
                                }else {
                                    delete oneArticle.dataValues['author_id']
                                    res(oneArticle.dataValues);
                                }


                            } else {
                                error("can't find article")
                            }
                        }).catch((erro: JSON) => error(erro));

                } else {
                    error("not a valid article url")
                }
            });
        },
        createArticle: (req: IArticle) => {
            return <Promise<JSON|IArticle>>new Promise((res:any, error:any)=> {
                try {
                    let article: IArticle;
                    // max filesize 1G
                    const form = formidable({multiples: true, maxFileSize: 1000000000, uploadDir: './artifacts'});

                    form.parse(req, async (err: any, fields: any, files: any) => {
                        if (err) {
                            console.error(err)
                            return;
                        }
                        article = JSON.parse(fields.body)
                        //article data from json
                        await sequelize.model('article').create({
                            article_title: article.article_title,
                            article_description: article.article_description,
                            time_to_complete: article.time_to_complete,
                            author_id: article.author_id
                        }).then((articeCreated: any) => {
                            if (articeCreated.article_id) {
                                // file data from forms
                                if (article.files != undefined) {
                                    article.files.map(async (oneFile: any) => {
                                        let fomrsFile: any = "";
                                        if (Array.isArray(files.file)) {
                                            const tempFile: any = files.file.find((input: { name: string; }) => {
                                                return input.name === oneFile.file_name;
                                            });
                                            fomrsFile = tempFile;
                                        } else {
                                            fomrsFile = files.file;
                                        }
                                        await sequelize.model('file').create({
                                            article_id: articeCreated.article_id,
                                            file_name: oneFile.file_name,
                                            file_id: fomrsFile.path.split('/')[1]
                                        });
                                    })
                                }

                                if (article.images != undefined) {
                                    // image data from forms
                                    article.images.map(async oneImage => {
                                        let fomrsFile: any = "";
                                        if (Array.isArray(files.file)) {
                                            const tempFile: any = files.file.find((input: { name: string; }) => {
                                                return input.name === oneImage.file_name;
                                            });
                                            fomrsFile = tempFile;
                                        } else {
                                            fomrsFile = files.file;
                                        }
                                        await sequelize.model('image').create({
                                            article_id: articeCreated.article_id,
                                            alt_text: oneImage.alt_text,
                                            file_id: fomrsFile.path.split('/')[1]
                                        });
                                    })
                                }

                                if (article.grade_levels != undefined) {
                                    article.grade_levels.map(async oneGrade => {
                                        await sequelize.model('grade_in_article').create({
                                            articleArticleId: articeCreated.article_id,
                                            gradeLevelId: oneGrade.grade_id
                                        });
                                    })
                                }

                                if (article.tools != undefined) {
                                    article.tools.map(async oneTool => {
                                        await sequelize.model('tool_in_article').create({
                                            articleArticleId: articeCreated.article_id,
                                            toolToolId: oneTool.tool_id
                                        });
                                    })
                                }
                            }
                            res(articeCreated);
                        }).catch((er:any)=>{
                            console.error(er)
                            error("cant create article")
                        });
                    });

                } catch (err: any) {
                    console.log("error: ", err ? err : " error not spesified")
                    res(undefined)
                }
            });
        },
        updateArticle: (articleId:number,req: IArticle) => {
            return <Promise<undefined | JSON>>new Promise((res:any, error:any) => {

                try {
                    let article: IArticle;
                    // max filesize 1G
                    const form = formidable({multiples: true, maxFileSize: 1000000000, uploadDir: './artifacts'});

                    form.parse(req, async (err: any, fields: any, files: any) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        article = JSON.parse(fields.body)
                        if(await verifyUser(article.author_id,articleId,sequelize)){
                            await sequelize.model('article').update({
                                article_title: article.article_title,
                                article_description: article.article_description,
                                time_to_complete: article.time_to_complete

                            },{
                                silent:await userFeatures.isAdmin(article.author_id,sequelize),
                                where:{
                                    article_id:articleId
                                }}).then(async (sequlizeResponse: any[]) => {
                                if (article.article_id!=undefined) {
                                    if (article.files != undefined) {
                                        article.files.map(async (oneFile: any) => {
                                            let fomrsFile: any = "";
                                            if (Array.isArray(files.file)) {
                                                const tempFile: any = files.file.find((input: { name: string; }) => {
                                                    return input.name === oneFile.file_name;
                                                });
                                                fomrsFile = tempFile;
                                            } else {
                                                fomrsFile = files.file;
                                            }
                                            await sequelize.model('file').upsert({
                                                article_id: article.article_id,
                                                file_name: oneFile.file_name,
                                                file_id: fomrsFile.path.split('/')[1]
                                            });
                                        })
                                    }

                                    if (article.images != undefined) {
                                        article.images.map(async oneImage => {
                                            let fomrsFile: any = "";
                                            if (Array.isArray(files.file)) {
                                                fomrsFile = files.file.find((input: { name: string; }) => {
                                                    return input.name === oneImage.file_name;
                                                });
                                            } else {
                                                fomrsFile = files.file;
                                            }
                                            await sequelize.model('image').upsert({
                                                article_id: article.article_id,
                                                alt_text: oneImage.alt_text,
                                                file_id: fomrsFile.path.split('/')[1]
                                            });
                                        })
                                    }

                                    if (article.grade_levels != undefined) {
                                        article.grade_levels.map(async oneGrade => {
                                            await sequelize.model('grade_in_article').upsert({
                                                articleArticleId: article.article_id,
                                                gradeLevelId: oneGrade.grade_id
                                            });
                                        })
                                    }

                                    if (article.tools != undefined) {
                                        article.tools.map(async oneTool => {
                                            await sequelize.model('tool_in_article').upsert({
                                                articleArticleId: article.article_id,
                                                toolToolId: oneTool.tool_id
                                            });
                                        })
                                    }
                                }
                                res(sequlizeResponse);
                            }).catch((err:any)=>{
                                console.error(err)
                                error("cant update article")
                            });
                        }else {
                            error("user not allowed to update article")
                        }
                    });

                } catch (err: any) {
                    console.log("error: ", err ? err : " error not spesified")
                    res(undefined)
                }
            });
        }
    }
}
