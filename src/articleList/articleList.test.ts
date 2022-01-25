import DoneCallback = jest.DoneCallback;
import {Sequelize} from "sequelize";

jest.setTimeout(50000)
// Sequelize database connection
// @ts-ignore
const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USER,process.env.DATABASE_PASSWORD,{
    host: process.env.DATABASE_URL,
    dialect: process.env.DATABASE_DIALECT,
    logging: process.env.QUERY_LOG == 'true'
});
const database=require('../database/database')
beforeAll(  async (done:DoneCallback)=>{
    await sequelize.authenticate().then(async ()=>{
        await database().setup(sequelize)
            .then(()=>{
                done();
            })
    });
});

test("fetching data from articlelist", (done)=>{
    const articleList = require('./articleListDao')
    articleList().getArticleList(sequelize)
        .then((res:JSON[])=>{
            expect(res).toHaveLength(12);
            done()
        });
},6000);

test("fetching hidden articles", (done)=>{
    const articleList = require('./articleListDao')
    articleList().getArticleList(sequelize,"fc8252c8dc55839967c58b9ad755a59b61b67c13227ddae4bd3f78a38bf394f7")
        .then((res:JSON[])=>{
            expect(res).toHaveLength(4);
            done()
        });
},6000);

test("fetching all articlefrom one user", (done)=>{
    const articleList = require('./articleListDao')
    articleList().getByUser(sequelize,"6d9010b2b7a1483b256ae7477738dba7c530bd9ba53db1d6691441e74b83608a")
        .then((res:JSON[])=>{
            expect(res).toHaveLength(8);
            done()
        });
},6000);



test("search data from articlelist", (done)=>{
    const articleList = require('./articleListDao')
    articleList().searchArticleList(sequelize,'test')
        .then((res:JSON[])=>{
            expect(res).toHaveLength(2);
            done()
        });
},6000);


test("search data from articlelist (empty)", (done)=>{
    const articleList = require('./articleListDao')
    articleList().searchArticleList(sequelize,'')
        .then((res:JSON[])=>{
            expect(res).toHaveLength(0);
            done()
        });
},6000);



afterAll(async (done)=>{
    sequelize.close().then(done())
});