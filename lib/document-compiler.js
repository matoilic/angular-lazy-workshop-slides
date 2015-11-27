var Handlebars = require('handlebars');
var Prism = require('prismjs');
var fs = require('fs');
var s = require('underscore.string');
var faker = require('faker');
var path = require('path');

var templateCache = {};

function loadTemplate(name) {
    if(!templateCache[name]) {
        templateCache[name] = Handlebars.compile(
            fs.readFileSync(path.resolve('templates', name + '.hbs')).toString()
        );
    }

    return templateCache[name];
}

function randomFunctionName() {
    return s(faker.name.findName()).slugify().camelcase().value();
}

Handlebars.registerHelper('highlight', function(code) {
    var highlightedCode = Prism.highlight(code, Prism.languages.javascript);

    return new Handlebars.SafeString(highlightedCode);
});

Handlebars.registerHelper('codeblock', function(sourceFile, runnable) {
    var context = {
        code: fs.readFileSync(path.resolve('code', sourceFile)).toString(),
        runnable: runnable,
        functionName: runnable ? randomFunctionName() : ''
    };

    return new Handlebars.SafeString(
        loadTemplate('codeblock')(context)
    );
});

module.exports = function compile(content) {
    return Handlebars.compile(content)({});
};
