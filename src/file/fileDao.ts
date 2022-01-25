import {ModelCtor} from "sequelize";
const fileReader = require('fs');
module.exports=(artifactpath:string)=>{
    return{
        getFile(fileDatabase:ModelCtor<any>,imageDatabase:ModelCtor<any>,fileSha:string){
            return <Promise<undefined|string[]>> new Promise(async res => {
                // images
                await imageDatabase.findOne({
                    attributes:['file_id'],
                    where:{
                        file_id:fileSha
                    }
                }).then(async (oneImage)=>{
                    if(oneImage!=undefined){
                        fileReader.stat(artifactpath + oneImage.file_id,(error:any) => {
                            if(!error){
                                res([artifactpath+oneImage.file_id]);
                                return;
                            }else {
                                console.log("image not on disk",fileSha);
                                console.log(error?error:"")
                                res(undefined)
                            }
                        });
                    }else {
                        // generic files
                        await fileDatabase.findOne({
                            attributes:['file_id','file_name'],
                            where:{
                                file_id:fileSha
                            }
                        }).then(async (oneFile)=>{
                            if(oneFile!=undefined){
                                await fileReader.stat(artifactpath + oneFile.file_id,(error:any) => {
                                    if(!error){
                                        res([artifactpath+oneFile.file_id,oneFile.file_name]);
                                    }else {
                                        console.log("file not on disk",fileSha);
                                        console.log(error?error:"")
                                        res(undefined);
                                    }
                                });
                            }else {
                                console.log("not a file")
                                res(undefined)
                            }
                        });
                    }
                });
            });
        }
    }
}