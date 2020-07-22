#!/usr/bin/env node

const inquirer  = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
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
]).then(answers => {
    console.log(answers)
    const tmpDir = path.join(__dirname, 'templates')
    const destDir = path.join(process.cwd(), 'dist')
    fs.readdir(tmpDir, (err, files)=>{
        if(err) throw err
        files.forEach(file => {
            ejs.renderFile(path.join(tmpDir, file), answers, (err, result)=>{
                if(err) throw err
                fs.writeFileSync(path.join(destDir, file), result)
            })
            
        })
    })
})