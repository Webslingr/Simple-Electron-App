const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeTheme,
  Menu,
} = require("electron");
const path = require("path");
const fs = require("fs");

// Functions

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) {
    return;
  } else {
    const filePath = filePaths[0];

    const fileContents = fs.readFileSync(filePath);

    console.log(fileContents);

    const fileObject = {
      filePath: filePath,
      Contents: fileContents.toString(),
    };

    return fileObject;
  }
}

function saveChanges(event, fileObject) {

  console.log("saving");

  // If filepath empty
  if (fileObject.filePath == "") {

    // save file path in saveFile variable
    const saveFile = dialog.showSaveDialogSync();

    //Checks if filepath is empty when dialog opens
    if (saveFile) {
      fs.writeFileSync(saveFile, fileObject.Contents);
      console.log("saved!")
    }

  } else {
    // If file path defined writes to file using object
    fs.writeFileSync(fileObject.filePath, fileObject.Contents);
    console.log("saved!")
  }
}

//Custom Menu Bar

const isMac = process.platform === "darwin";

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
      {
        label: app.name,
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "services" },
          { type: "separator" },
          { role: "hide" },
          { role: "hideOthers" },
          { role: "unhide" },
          { type: "separator" },
          { role: "quit" },
        ],
      },
    ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "New",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  // { role: 'editMenu' }
  {
    label: "Open",
    click: () => handleFileOpen(),
  },
  // { role: 'viewMenu' }
  {
    label: "Save",
    submenu: [
      { role: "reload" },
      { label: "open" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Save As",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
          { type: "separator" },
          { role: "front" },
          { type: "separator" },
          { role: "window" },
        ]
        : [{ role: "close" }]),
    ],
  },
];

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true, // Hides main menu bar
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  win.loadFile("index.html");

  //Handles dark mode
  ipcMain.handle("dark-mode:toggle", () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    } else {
      nativeTheme.themeSource = "dark";
    }
    return nativeTheme.shouldUseDarkColors;
  });

  return win;
};

// Events

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.on("dialog:saveFile", saveChanges);
  // ipcMain.on('dialog:saveAsFile', saveAsChanges)
  const win = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
