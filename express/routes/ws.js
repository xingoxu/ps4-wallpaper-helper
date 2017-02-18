/**
 * Created by xingo on 2017/02/18.
 */
let socketIO = require('socket.io');
let wsController = require('../wsController');

function startSocketIO(server) {
    let ws = socketIO(server);
    ws = ws
        .of('/ws');
    wsController.setWebSocket(ws);
}

module.exports = startSocketIO;