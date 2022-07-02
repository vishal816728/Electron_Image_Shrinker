const path=require('path')
const os=require('os')
const { ipcRenderer }=require('electron')



const dirpath=document.getElementById('output-path')

dirpath.innerText=path.join(os.homedir(),'/downlaods')
console.log(path.join(os.homedir(),'/downloads'))

const form=document.getElementById('image-form')
const slider=document.getElementById('slider')
const image=document.getElementById('img')


form.addEventListener('submit',(e)=>{
    e.preventDefault()

    var imgpath=image.files[0].path
    const quality=slider.value
   
    ipcRenderer.send('image:minimize',{imgpath,quality})
   
    
})

