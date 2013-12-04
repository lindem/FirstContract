/**
 * Created by lindem on 12/4/13.
 */
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        ts: {
            // use to override the default options, See: http://gruntjs.com/configuring-tasks#options
            // these are the default options to the typescript compiler for grunt-ts:
            // see `tsc --help` for a list of supported options.
            options: {
                compile: true,                 // perform compilation. [true (default) | false]
                comments: false,               // same as !removeComments. [true | false (default)]
                target: 'es5',                 // target javascript language. [es3 (default) | es5]
                module: 'commonjs',                 // target javascript module style. [amd (default) | commonjs]
                sourceMap: true,               // generate a source map for every output js file. [true (default) | false]
                sourceRoot: '',                // where to locate TypeScript files. [(default) '' == source ts location]
                mapRoot: '',                   // where to locate .map.js files. [(default) '' == generated js location.]
                declaration: false            // generate a declaration .d.ts file for every output js file. [true | false (default)]
            },
            // a particular target
            cjsbuild: {
                src: ["src/FirstContract.ts"],          // The source typescript files, http://gruntjs.com/configuring-tasks#files
                //outDir: 'commonjs',             // If specified, generate an out.js file which is the merged js file
                outDir: 'commonjs',

                //watch: 'src',                  // If specified, watches this directory for changes, and re-runs the current target
                // use to override the grunt-ts project options above for this target
                options: {
                    module: 'commonjs'
                }
            }
        },
        clean: {
            commonjs: ["commonjs"]
        },
        mocha: {
            test: {
                src: ["tests/*js"]
            }
        },
        browserify: {
            browsersuite: {
                files: {
                    "browser/build.js": ["browser/alltests.js"]
                }
            }
        },
        mocha_phantomjs: {
            browsersuite: ["browser/*.html"]
        },
        gitpush: {
            "github": {
                options: {
                    remote: "github",
                    branch: "master"
                }
            },
            "tixn": {
                options: {
                    remote: "origin",
                    branch: "master"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-mocha");
    grunt.loadNpmTasks("grunt-mocha-phantomjs");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-git");
    grunt.registerTask("browsersuite", [
        "browserify:browsersuite",
        "mocha_phantomjs:browsersuite"
    ]);
    grunt.registerTask("gitpush", ["gitpush:tixn", "gitpush:github"]);
    grunt.registerTask("test", ["mocha:test"]);
    grunt.registerTask("default", ["clean:commonjs","ts:cjsbuild", "test"]);
};