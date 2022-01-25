import {Sequelize,Op} from "sequelize";
import {pbkdf2, randomBytes} from "crypto";
import {IUser} from "./IUser";

// 32 byte converted to hex is 32*2 => 64
async function getRandomeString(): Promise<string> {
    return <Promise<string>> new Promise(resolve => {
        randomBytes(32, async (error, randomBuffer) => {
        resolve(randomBuffer.toString('hex'))
    });
    })
}


module.exports=(sequelize:Sequelize)=>{
    return{
        createUser(newUser:IUser){
            return <Promise<undefined|string>> new Promise(async res => {
                const {
                    randomBytes,
                    pbkdf2
                } = await import('crypto');
                await sequelize.model('user').findAndCountAll({
                    where:{
                        [Op.or]:[{
                            username:newUser.username
                        },{
                            email:newUser.email

                        }]
                    }
                }).then(async countRes =>{
                    if(countRes.count<=0){
                        const salt:any = await getRandomeString();

                        //@ts-ignore
                        pbkdf2(newUser.password,salt,100,32,'sha256',async (passwordError,slatedPassowrd)=>{
                            if(!passwordError){
                                await sequelize.model('user').create({
                                    user_id:await getRandomeString(),
                                    username:newUser.username,
                                    email:newUser.email,
                                    password:slatedPassowrd.toString('hex'),
                                    salt: salt
                                }).then((resUser)=>{
                                    if(resUser.getDataValue("username")==newUser.username){
                                        res("user created")
                                    }

                                }).catch(error => {
                                    console.log("create user error:",error?error:"no error specified")
                                    res(undefined)
                                });
                            }
                        });
                    }else{
                        res(undefined)
                    }
                })
            });
        },
        updateUser(user:IUser){
            return <Promise<string>> new Promise(async (res, error:any) => {
                const salt:string = await getRandomeString()
                // @ts-ignore
                pbkdf2(user.password,salt,100,32,'sha256',async (passwordError,slatedPassowrd)=>{
                    sequelize.model('user').update(
                        {
                            username: user.username,
                            email: user.email,
                            password: slatedPassowrd.toString('hex'),
                            salt: salt
                        }, {
                            where: {
                                user_id: user.user_id
                            }
                        }).then(() => res("updated"))
                        .catch((err: any) => {
                            console.error(err);
                            error(err);

                        })

            })
        })
        }
}}