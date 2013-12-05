# Browser test suite

*mocha.css* and *mocha.js* are needed here; you can get them from the mocha
project:

    npm install mocha

just put them into this directory. Any webserver will do; I've used gatling.

## Extending the browser test suite:

1. add your tests to alltests.js.
2. run `grunt browsersuite`. It will bundle up the tests.