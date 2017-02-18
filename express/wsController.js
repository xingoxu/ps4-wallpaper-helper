/**
 * Created by xingo on 2017/02/18.
 */

let _ws;

module.exports = {
    setWebSocket(ws){
        _ws = ws;
    },
    getWebSocket(){
        return _ws;
    }
}