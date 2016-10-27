require.config({
    paths: {
        'angular':'../node_modules/angular/angular',
        'angular-animate':'../node_modules/angular-animate/angular-animate',
        'angular-aria':'../node_modules/angular-aria/angular-aria',
        'angularCSS':'../node_modules/angular-css/angular-css',
        'angular-ui-router':'../node_modules/angular-ui-router/release/angular-ui-router',
        'angular-material-icons':'../node_modules/angular-material-icons/angular-material-icons',
        'angularjs-slider':'../node_modules/angularjs-slider/dist/rzslider.min',
        'angular-messages':'../node_modules/angular-messages/angular-messages',
        'angular-jwt':'../node_modules/angular-jwt/dist/angular-jwt',
        'angular-material':'../node_modules/angular-material/angular-material',
        'ngStorage':'../node_modules/ngstorage/ngStorage',
        'socket.io':'../node_modules/socket.io-client/socket.io',
        'socket':'../node_modules/angular-socket-io/socket',
        'jquery':'../node_modules/jquery/dist/jquery',
        'config':'../config'
    },
    shim: {
        'angular': {
            exports:'angular'
        },
        'angular-animate': {
            deps:['angular']
        },
        'angular-aria': {
            deps:['angular']
        },
        'angularCSS': {
            deps:['angular']
        },
        'angular-ui-router': {
            deps:['angular']
        },
        'angular-material': {
            deps:['angular']
        },
        'angular-material-icons': {
            deps:['angular']
        },
        'angular-messages': {
            deps:['angular']
        },
        'angular-jwt': {
            deps:['angular']
        },
        'ngStorage': {
            deps:['angular']
        },
        'socket': {
            deps:['angular']
        },
        'socket.io': {
            deps:['angular', 'socket'],
            exports: 'io'
        },
        'angularjs-slider': {
            deps:['angular']
        }
    }
});

require(['./bootstrap'], function(bootstrap){
    bootstrap.init();
});
