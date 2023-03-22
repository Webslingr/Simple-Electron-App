// const { BrowserWindow } = require('electron')

// contextBridge.exposeInMainWorld('myAPI', {
//     desktop: true,
//   })

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveChanges: (fileObject) => ipcRenderer.send('dialog:saveFile', fileObject),
})

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle')
  })