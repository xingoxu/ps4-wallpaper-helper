const {app, Menu, ipcMain} = require('electron');
let mainWindow;
ipcMain.on('mainWindowRegister', (event) => {
  mainWindow = event.sender;
})

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: (() => {
      let viewSubmenu = [
        {
          role: 'reload'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ];

      require('electron-is-dev') ? viewSubmenu.push({
        role: 'toggledevtools'
      }) : viewSubmenu;
      return viewSubmenu;
    })()
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Welcome',
        click() {
          mainWindow.send('showWelcome');
        }
      },
      {
        label: 'Star me!',
        click () { require('electron').shell.openExternal('https://github.com/xingoxu/ps4-wallpaper-helper') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const menu = Menu.buildFromTemplate(template);
module.exports = menu;