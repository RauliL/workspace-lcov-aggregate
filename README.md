# LCOV code coverage aggregator for monorepos

Utility which combines [LCOV] test coverage reports from multiple NPM packages
inside an monorepo into a single file, which can be submitted to code coverage
services such as [Coveralls].

[LCOV]: http://ltp.sourceforge.net/coverage/lcov.php
[Coveralls]: https://coveralls.io

## Installation

```shell
$ npm install --save-dev workspace-lcov-aggregate
```

## Usage

The package provides an executable called `workspace-lcov-aggregate`. When it's
run at the root directory of an monorepo containing multiple NPM packages it
will go through all the packages it finds using [workspace-info] utility and
collects all `coverage/lcov.info` files found inside them. Then it will combine
them all into a single file (with some modifications done with file paths in
the `lcov.info` files) and creates an single coverage report file
`coverage/lcov.info` at the root directory of the repository. This file can
then be submitted to an coverage service or any other tool that processes LCOV
files.

[workspace-info]: https://www.npmjs.com/package/workspace-info
