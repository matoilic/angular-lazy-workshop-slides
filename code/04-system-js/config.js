System.config({
    baseURL: '/asset/root/',
    defaultJSExtensions: true,
    transpiler: 'babel',
    babelOptions: { /* ... */ },
    paths: {
        '*': 'build/*' // resolves to /asset/root/build/*.js
    }
});