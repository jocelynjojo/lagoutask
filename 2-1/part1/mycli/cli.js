#!/usr/bin/env node

const inquirer  = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const { promisify } = require('util')
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: 'Your Project Name?'
    },
    {
        type: 'input',
        name: 'name',
        message: 'Your Name?'
    }
]).then(async answers => {
    const tmpDir = path.join(__dirname, 'templates')
    const destDir = path.join(process.cwd(), answers.title)
    await deleteFolderRecursive(destDir)
    console.log('删除成功,准备创建文件')
    createPro(tmpDir, destDir,answers)
    
})
async function createPro(tmpDir, destDir, answers){
    
    await mkdir(destDir);
    var files = await readdir(tmpDir);
    for(var i = 0, len = files.length, file = files[i]; i < len; i++, file=files[i]){
        var curTarPath = path.join(destDir, file);
        var curTmpPath = path.join(tmpDir, file);
        var curTmpFile = await stat(curTmpPath); //读取文件夹文件
        var isDirectory = curTmpFile.isDirectory(); //如果文件是文件夹，在重复触发函数
        if(isDirectory){
            createPro(curTmpPath, curTarPath, answers);
        }else{
            ejs.renderFile(curTmpPath, answers, (err, result)=>{
                if(err) throw err
                fs.writeFileSync(curTarPath, result)
            })
        }
    }
}
async function deleteFolderRecursive(url) {
   
    var bool = await exists(url);//判断给定的路径是否存在
    if(bool){
        var files = await readdir(url); //返回文件和子目录的数组
        for(var i = 0, len = files.length, file = files[i]; i < len; i++, file=files[i]){
            
            var curPath = path.join(url, file);
            var curFile = await stat(curPath); //读取文件夹文件
            var isDirectory = curFile.isDirectory(); //如果文件是文件夹，在重复触发函数            
            if(isDirectory){
                await deleteFolderRecursive(curPath);
            }else{
                try{
                    console.log('准备删除文件:::', curPath)
                    await unlink(curPath) // 删除文件; // 删除文件夹
                }catch(e){
                    console.log('准备删除文件错误:::',e)
                }
                
            }
        }
        try{
            console.log('准备删除文件夹:::', url)
            await rmdir(url); // 删除文件夹
        }catch(e){
            console.log('准备删除文件夹错误:::',e)
        }

    }
}