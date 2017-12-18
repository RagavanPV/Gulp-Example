var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({
    lazy: true
});
/************* Gulp Tasks START **************/
gulp.task('jslint', function() {
    log('Starting JS Lint Task in Gulp');
    return gulp
        .src(config.paths.js)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('build-scripts', function() {
    return gulp
        .src(config.paths.js)
        .pipe($.concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe($.rename('all.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('beautify', function() {
    var lineFeed = osCheck();
    return gulp.src(config.paths.beautify, {
            base: './'
        })
        .pipe($.jsbeautifier({
            config: './beautify-settings.json',
            eol: lineFeed
        }))
        .pipe($.jsbeautifier.reporter())
        .pipe(gulp.dest('./'));
});

gulp.task('serve', function() {
    var isDev = true;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': config.defaultPort,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.serverWatchFiles]
    };
    return $.nodemon(nodeOptions)
        .on('start', function() {
            log('Node server started')
            setTimeout(() => {
                startBrowserSync();
            }, config.browserReloadDelay);
        })
        .on('restart', function(event) {
            log('Node server restarted');
            log('Files changed : ' + event);
            setTimeout(() => {
                browserSync.notify('Reloaded BrowserSync');
                browserSync.reload({
                    stream: false
                });
            }, config.browserReloadDelay);
        })
        .on('exit', function() {
            log('Node server exited');
        });
});
/************* Gulp Tasks END **************/

/************* Custom Functions START **************/
function log(message) {
    if (typeof(message) === 'object') {
        for (var item in message) {
            if (message.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(message[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(message));
    }

}

function osCheck() {
    var lineFeed;
    if (process.platform === 'win32') {
        lineFeed = '\r\n';
    } else if (process.platform === 'darwin' || process.platform === 'linux') {
        lineFeed = '\n';
    } else {
        var error = 'Unfamiliar operating system.';
        log(error);
        throw error;
    }

    return lineFeed;
}

function startBrowserSync() {
    if (args.nosync || browserSync.active) {
        return;
    }
    browserSync(config.browserSyncOptions);
}
/************* Custom Functions END **************/