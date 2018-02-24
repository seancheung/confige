module.exports = function(source) {
    const utils = require('./');

    return `module.exports.default = ${JSON.stringify(
        utils.resolve(JSON.parse(source))
    )
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')};`;
};
