
const {app,BrowserWindow,Menu,globalShortcut,ipcMain,shell}=require('electron')
const path=require('path')
const os=require('os');
const compress_images=require('compress-images')
// it is very important to know on which environment(windows,linux or mac) you want to work 
process.env.NODE_ENV='production'

const isDev=process.env.NODE_ENV !== 'production'? true: false
const isWin=process.platform == 'win32'? true :false

console.log(isDev)
console.log(isWin)
let mainWindow

function createMainWindow(){
     mainWindow=new BrowserWindow({
        title:"Image_Shrinker",
        width:isDev?800:500,
        height:500,
        icon:'./assets/icon/icon.png',
        resizable:isDev?true:false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
          },
    })
    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
}

// ipcmain is used to render the events coming from the renderer main.js

ipcMain.on('image:minimize',async (e,options)=>{
   options.dest=path.join(os.homedir(),'downlaods')
//    console.log(slash(options.dest))
   console.log(options)

   await compress_images(
    "src/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}",
    "build/img/",
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (err, completed) {
      if (completed === true) {
        // Doing something.
        console.log("Task is completed")
      }
    }
  );
})


// app.on('ready',createMainWindow)
// garbage collection  app function
app.on('ready',()=>{
    createMainWindow()
    const mainMenu=Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu) 
    mainWindow.on('ready',()=>mainWindow=null)

    globalShortcut.register('CmdOrCtrl+r',()=>mainWindow.reload())
    globalShortcut.register(isWin?'Ctrl+Shift+I':'Command+Alt+I',()=>mainWindow.toggleDevTools())
})

//menu tempelate
const menu=[
    ...(isWin?[{
        label:'Home',
        click:()=>mainWindow.loadURL(`file://${__dirname}/app/index.html`)
    },
]:[]),
    ...(isWin?[{
        label:'About',
        click:()=>mainWindow.loadURL(`file://${__dirname}/app/About.html`)
    },
]:[]), 
    // {
    //     label:"File",
    //     submenu:[
    //         {
    //             label:'Quit',
    //             // to add custom shortcuts
    //             accelerator:isWin?'Ctrl+w':'Command+w',
    //             click:()=>app.quit()
    //         }
    //     ]
    // },{
    //     label:"View"
    // },
    ...(isDev?[
        {
            label:'Developer',
            submenu:[
                {role:'reload'},
                {role:'forcereload'}
            ]
        }
    ]:[])
]

// if(isWin){
//     // role are predefined menu options 
//     menu.unshift({role:'appMenu'})
// }

app.on('window-all-closed', () => {
    if (process.platform !== 'win32') app.quit()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })



  //we will be using some plugins like imagemin and slash for paths