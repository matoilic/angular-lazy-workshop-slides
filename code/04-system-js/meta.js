System.config({
    meta: {
        'angular': {
            // load this module as a global
            format: 'global',
            // the global property to take as the module value
            exports: 'angular',
            // dependencies to load before this module
            deps: [
                'jquery'
            ]
        }
    }
});
