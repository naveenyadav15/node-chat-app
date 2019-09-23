const emoji = require('node-emoji');

const generateMessage = (username, text) => {

    var me = text;
    me = me.replace(':)', ':smile:');
    me = me.replace(':(', ':disappointed:');
    me = me.replace(':|', ':expressionless:');
    me = emoji.emojify(me);
    // text = emoji.random();
    // console.log(text)
    return {
        username,
        text: me,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }

}


module.exports = {
    generateMessage,
    generateLocationMessage,
}