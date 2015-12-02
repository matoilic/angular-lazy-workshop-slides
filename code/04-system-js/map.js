System.config({
    paths: {
        "*": "build/*",
        "github:*": "jspm_packages/github/*"
    },
    map: {
        "angular": "github:angular/bower-angular@1.4.8",
        "angular-lazy": "github:matoilic/angular-lazy@0.1.0",
        "angular-ui-router": "github:angular-ui/ui-router@0.2.15"
    }
});
