var through = require('through2');
var compile = require('./document-compiler');

module.exports = function (variables) {
    return through.obj(function (file, enc, cb) {
        file.contents = new Buffer(
            compile(file.contents.toString(), variables)
        );

        file.path = file.path.slice(0, -3) + 'html';

        cb(null, file);
    });
};
