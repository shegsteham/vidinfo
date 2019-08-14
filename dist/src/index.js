"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _electron = require("electron");

var _path = _interopRequireDefault(require("path"));

var _fluentFfmpeg = _interopRequireDefault(require("fluent-ffmpeg"));

let mainWindow;
let newWindow;
const server = {
  get: (event, callback) => _electron.ipcMain.on(event, callback),
  send: (event, callback) => mainWindow.webContents.send(event, callback)
};
const menuTemplate = [{
  label: 'VidInfo',
  submenu: [{
    label: 'Settings',

    click() {
      // activeWindow.toggleDevTools();
      createNewWindow('ui/index.html', 'Settings'); // new Notification({
      //   title: 'notify',
      //   body: 'I am warning you o!'
      // }).show();
    }

  }, {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',

    click() {
      _electron.app.quit();
    }

  }]
}];
process.env.NODE_ENV !== 'production' ? menuTemplate.push({
  label: 'Dev Console',
  submenu: [{
    label: "toggle console",
    accelerator: "Alt+Cmd+I",

    click(item, activeWindow) {
      activeWindow.toggleDevTools();
    }

  }]
}) : null;
process.platform === 'darwin' ? menuTemplate.unshift({
  label: 'wink'
}) : null;
const dockTemplate = [{
  label: 'New Window',

  click() {
    console.log('New Window');
  }

}, {
  label: 'New Window with Settings',
  submenu: [{
    label: 'Basic'
  }, {
    label: 'Pro'
  }]
}, {
  label: 'New Command...'
}];

const mainMenu = _electron.Menu.buildFromTemplate(menuTemplate);

const dockMenu = _electron.Menu.buildFromTemplate(dockTemplate);

_electron.app.on('ready', () => {
  mainWindow = new _electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      backgroundColor: 'red'
    }
  });
  mainWindow.loadURL(`file://${_path.default.resolve(`__dirname/../`, 'ui/index.html')}`);

  _electron.app.dock.setMenu(dockMenu);

  _electron.Menu.setApplicationMenu(mainMenu); // mainWindow.setProgressBar(0.9)


  mainWindow.on('close', () => _electron.app.quit());
  console.log(menuTemplate);
});

const createNewWindow = (filePath, title) => {
  newWindow = new _electron.BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      backgroundColor: 'red'
    },
    title
  });
  newWindow.loadURL(`file://${_path.default.resolve(`__dirname/../`, filePath)}`);
};

const probeDuration = (event, path) => {
  _fluentFfmpeg.default.ffprobe(path, (err, metadata) => {
    server.send('videoDuration', metadata.format.duration);
  });
};

server.get('videoFile', (event, path) => probeDuration(event, path));