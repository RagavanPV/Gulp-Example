module.exports = function() {
    var defaultPort = 7200;
    var config = {
        paths: {
            js: [
                './src/**/*.js',
                './*.js'
            ],
            css: [
                './src/**/*.css',
            ],
            beautify: [
                './*',
                './src/*'
            ]
        },
        defaultPort: defaultPort,
        nodeServer: './src/server/app.js',
        serverWatchFiles: './src/server',
        browserSyncOptions: {
            proxy: 'localhost:' + defaultPort,
            port: 3000,
            files: ['**/*.*'],
            ghostMode: {
                clicks: true,
                location: false,
                forms: true,
                scroll: true
            },
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'debug',
            logPrefix: 'gulp-patterns',
            notify: true,
            reloadDelay: 1000
        },
        browserReloadDelay: 1000
    };
    return config;
};