// 实现这个项目的构建任务
const LoadGruntTasks = require("load-grunt-tasks");
const sass = require("sass");
const swig = require("swig");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);


var opts = {
  defaults: { cache: false, locals: { site_name: "My Blog" } },
  data: {

      menus: [
          {
              name: 'Home',
              icon: 'aperture',
              link: 'index.html'
          },
          {
              name: 'Features',
              link: 'features.html'
          },
          {
              name: 'About',
              link: 'about.html'
          }
      ],
      pkg: require('./package.json'),
      date: new Date()
  }
}
module.exports = (grunt) => {
  grunt.initConfig({
    babel: {
      options: {
        presets: ["@babel/preset-env"],
      },
      main: {
        files: {
          "dist/assets/scripts/main.js": "src/assets/scripts/main.js",
        },
      },
    },
    
    sass: {
      options: {
        sourceMap: true,
        implementation: sass,
      },
      main: {
        files: {
          "dist/assets/styles/main.css": "src/assets/styles/main.scss",
        },
      },
    },
    watch: {
      js: {
        files: ["src/assets/scripts/*.js"],
        tasks: ["babel"],
      },
      
      css: {
        files: ["src/assets/styles/main.scss"],
        tasks: ["sass"],
        options: {
          reload: true
        }
      },
      html: {
        files: ["src/*.html"],
        tasks: ["compilehtml"],
      }
    },
    browserSync: {
      
      dev: {
        
          bsFiles: {
              src : [
                  'dist/**/*'
              ]
          },
          
          options: {
              notify: false,
              port: 2600,
              watchTask: true,
              server: {
                baseDir: ['dist','src','public'],
                routes: {
                    '/node_modules': 'node_modules'
                }
              }
          }
      }
    },
    clean: ['dist','temp'],
    useminPrepare: {
      html: ['dist/index.html','dist/about.html'],
      options: {
        dest: 'dist'
      }
    },
    uglify: {
      generated: {
        files: [
          {
            expand: true,
            cwd: "dist/assets/scripts",
            src: "*.js",
            dest: "dist/assets/scripts",
            ext: ".min.js",
          },
        ],
      },
    },
    cssmin: {
      generated: {
        files: [
          {
            expand: true,
            cwd: "dist/assets/styles",
            src: ["*.css", "!*.css.map"],
            dest: "dist/assets/styles",
            ext: ".min.css",
          },
        ],
      },
    },
    htmlmin: {
      // Task
      dist: {
        // Target
        options: {
          // Target options
          removeComments: true,
          collapseWhitespace: true,
        },
        files: {
          // Dictionary of files
          "dist/index.html": "dist/index.html", // 'destination': 'source'
        },
      },
    },
    
    copy: {
        main: {
          expand: true,
          cwd: 'public',
          src: '**',
          dest: 'dist',
        }
    },
    imagemin: {
      /* 压缩图片大小 */
      dist: {
          options: {
              optimizationLevel: 1 //定义 PNG 图片优化水平
          },
          files: [{
              expand: true,
              cwd: 'src/assets/',//原图存放的文件夹
              src: ['**/*.{png,jpg,jpeg,svg,eot,ttf,woff}'], // 优化 图片
              dest: 'dist/assets/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
          }]
      }
    },
    
    
    
    usemin: {
      html: ['dist/*.html'],
      options: {
        assetsDirs: ['dist']
      }
    },
    
    concat: {
      generated: {
        files: [
          {
            dest: 'dist/assets/styles/vendor.css',
            src: [
              'node_modules/bootstrap/dist/css/bootstrap.css'
            ]
          }
        ]
      }
    }
    
  });
  LoadGruntTasks(grunt);
 
  grunt.registerTask("compilehtml", function () {
    var done = this.async()
    createPro("src","dist", opts.data).then(done)
  });
  async function createPro(tmpDir, destDir, data){
      var bool = await exists(destDir);//判断给定的路径是否存在
      if(!bool){
        await mkdir(destDir);
      }
      var files = await readdir(tmpDir);
      for(var i = 0, len = files.length, file = files[i]; i < len; i++, file=files[i]){
          var curTarPath = path.join(destDir, file);
          var curTmpPath = path.join(tmpDir, file);
          var curTmpFile = await stat(curTmpPath); //读取文件夹文件
          var isDirectory = curTmpFile.isDirectory(); //如果文件是文件夹，在重复触发函数
          if(isDirectory){
              createPro(curTmpPath, curTarPath, data);
          }else if(path.extname(curTmpPath) === '.html'){
            var tpl = swig.compileFile(curTmpPath);
            var renderedHtml = tpl(data);
            await writeFile(curTarPath, renderedHtml)
          }
      }
  }
  grunt.registerTask("replaceHTML", function(){
    var done = this.async()
    replaceHTML("dist", {
      "(?!min).css": ".min.css",
      "(?!min).js": ".min.js"
    }).then(done)
  })
  async function replaceHTML(tmpDir, obj){
    var bool = await exists(tmpDir);//判断给定的路径是否存在
    if(!bool){
      return;
    }
    var files = await readdir(tmpDir);
    for(var i = 0, len = files.length, file = files[i]; i < len; i++, file=files[i]){
        var curTmpPath = path.join(tmpDir, file);
        var curTmpFile = await stat(curTmpPath); //读取文件夹文件
        var isDirectory = curTmpFile.isDirectory(); //如果文件是文件夹，在重复触发函数
        if(isDirectory){
          replaceHTML(curTmpPath);
        }else if(path.extname(curTmpPath) === '.html'){
          var file = await readFile(curTmpPath, {encoding: 'utf-8'});
          for(var key in obj){
            var reg = new RegExp(key, 'g');
            file = file.replace(reg, obj[key])
          }
          
          await writeFile(curTmpPath, file)
        }
    }
  }
  // 监听之前需要先执行一次生成文件
  grunt.registerTask("develop", ["browserSync", "compilehtml", "babel", "sass", "watch"]);
  grunt.registerTask("build", [
    "clean",
    "copy",
    "compilehtml",
    "sass",
    "babel",
    "useminPrepare",
    "concat:generated",
    
    "cssmin",
    "uglify",
    
    "usemin",
    "htmlmin",
    "replaceHTML",
    "imagemin"
  ]);
};
