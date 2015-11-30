var Handlebars = require('handlebars');
var Prism = require('prismjs');
var fs = require('fs');
var s = require('underscore.string');
var faker = require('faker');
var path = require('path');
var glob = require('glob');

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

function collectSlides(path) {
    return glob
        .sync(`${path}/*`)
        .map((p) => {
            if(fs.statSync(p).isFile()) {
                return fs.readFileSync(p).toString()
            }

            return `<section>
                ${collectSlides(p)}
            </section>`;
        })
        .reduce((slides, slide) => slides + '\n\n' + slide, '');
}

Handlebars.registerHelper('highlight', function(code) {
    var highlightedCode = Prism.highlight(code, Prism.languages.javascript);

    return new Handlebars.SafeString(highlightedCode);
});

Handlebars.registerHelper('codeblock', function(sourceFile, obj) {
    var context = {
        code: fs.readFileSync(path.resolve('code', sourceFile)).toString(),
        runnable: obj.hash.runnable,
        functionName: obj.hash.runnable ? randomFunctionName() : ''
    };

    return new Handlebars.SafeString(
        loadTemplate('codeblock')(context)
    );
});

Handlebars.registerHelper('slides', function() {
    return new Handlebars.SafeString(collectSlides('build/slides'));
});

module.exports = function compile(content) {
    return Handlebars.compile(content)({});
};
