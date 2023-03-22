const btnOpen = document.getElementById("btnOpen");
// const template =
const txtFilePath = document.getElementById("filePath");
const btnShowPath = document.getElementById("btnShowFilePath");
const txtEditor = document.getElementById("txtEditor");
const saveButton = document.getElementById("btnSave");
const saveAsButton = document.getElementById('btnSaveAs')
// const titleInput = document.getElementById('title')

let filePath = "";

// Initializes new instance of window
document.getElementById("btnNew").onclick = () => {
  window.location.reload();
};


// Saving function
function save() {
  const content = txtEditor.value;

  const fileObject = {
    filePath: filePath,
    Contents: content,
  };

  window.electronAPI.saveChanges(fileObject);
};

saveButton.addEventListener("click", function() {save()});
saveAsButton.addEventListener("click", function() {save()});


// Asynchronously
btnOpen.addEventListener("click", async () => {
  
  const fileObj = await window.electronAPI.openFile();

  filePath = fileObj.filePath;

  txtEditor.value = fileObj.Contents;
});

btnShowPath.addEventListener("click", () => {
  alert("File Path:" + filePath);
});

//Dark mode
document
  .getElementById("toggle-dark-mode")
  .addEventListener("click", async () => {
    const isDarkMode = await window.darkMode.toggle();
    document.getElementById("theme-source").innerHTML = isDarkMode
      ? "Dark"
      : "Light";
  });
