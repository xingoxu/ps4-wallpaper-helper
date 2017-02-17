/**
 * Created by xingo on 2017/02/17.
 */
let path = require('path');
let fs = require("fs");
let defaultUrl = path.join(__dirname, './default.jpg');
let imageUrl = defaultUrl;

module.exports = {
    setImageUrl(url){
        return new Promise((resolve, reject) => {
            let realUrl = path.resolve(url);
            fs.exists(realUrl, (exists) => {
                exists ? resolve() : reject();
                if (exists)
                    imageUrl = realUrl;
            });
        })
    },
    getImageUrl(){
        return new Promise((resolve, reject) => {
            fs.exists(imageUrl, (exists) => {
                exists ? resolve(imageUrl) : resolve(defaultUrl);
            })
        })
    }
};