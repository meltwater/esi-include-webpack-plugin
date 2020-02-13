# Webpack ESI Include Plugin
[![Build Status](https://drone.meltwater.io/api/badges/meltwater/esi-include-webpack-plugin/status.svg)](https://drone.meltwater.io/meltwater/esi-include-webpack-plugin) ![GitHub](https://img.shields.io/github/license/meltwater/esi-include-webpack-plugin)
---------
## What is it?
This is a webpack plugin that can be configured with settings for an ESI (edge side include) tag. When running or building as production this plugin will replace a comment tag in html files with the appropriately created esi tag. The real power of this plugin comes in when running in development mode. When in development this plugin will fetch the contents of the configured src and inject the entire source during build to emulate the esi. This allows developers to run locally with the same includes that (for meltwater) akamai provides, without actually needing to proxy local dev through akamai in any way. 

## How do I use it?
Install via npm
`npm i @meltwater/esi-include-webpack-plugin -D`

Below is an example of how to include and configure this plugin in webpack config.
```javascript
const EsiIncludeWebpackPlugin = require('@meltwater/esi-include-webpack-plugin');

plugins: [
    new EsiIncludeWebpackPlugin({
        verbose: true,
        esi: [{ name: 'placeholder', src: 'https://mydomain.com/thingToInclude.html', noStore: 'off', onError: 'continue', authorization: 'bearer tokendatablah' }]
    })
];
```

Plugin configuration object

| Name | Type | Required? |  Default | Description |
| ---- | ---- | --------- | -------- | ----------- |
|verbose | boolean | No | False | Set to true to see additional console logging on webpack builds | 
| esi | Array<EsiObject> | Yes | - | Array of esi objects to configure the replacement of comment snippets |

EsiObject 

| Name | Type | Required? |  Default | Description |
| ---- | ---- | --------- | -------- | ----------- |
| name | string | Yes | - | Matches comment in html so it knows where to replace |
| src | string | Yes | - | Source file to 'GET' to include in esi, or inject into esi tag comment |
| noStore | string | No | "off" | Set 'no-store' property on the esi tag |
| onError | string | No | "continue" | The esi onerror value |
| ttl | string | No | Unused | Property to set the ttl property on the esi:include tag |
| maxwait | string | No | Unused | Property to set the maxwait property on the esi:include tag |
| authorization | string | No | Unused | Value to be passed as the authorization header in the GET request when a file is fetched for dev |


In your HTML use the following snippet to mark the location of the ESI
```html 
<!--esi-include-webpack-plugin name=placeholder-->
```
The name property must match the name in the esi config object exactly.
The spacing is important. At the moment having no spaces around the '=' and no spaces between the open and close comment markers is required exactly. Hopefully flexibility will be added in the future.

### What type of files will the replacement happen in?
The following file extensions will be operated on:
* html
* htm
* ejs

# Need an option or a feature? 
This is an open source project, feel free to submit a PR! If you can't or don't want to, create an issue in the github repo.

# Is it broken?
Please create an issue if you are experiencing any unexpected behavior.

# Contributing

## Where and how to make changes?
All work shall be done in a branch and PR shall be made to master in this repository. PRs require review and approval by an owner of the project. Upon approval the code will be merged and CI will create a new npm package version.

## Commit messages
Commit messages shall be descriptive and follow the format of [semantic-release][semantic-release-1] as they are used to determine version number changes on publish.

## Style Guide
This project follows the [airbnb/javascript](https://github.com/airbnb/javascript) style guide. Please adhere to this when making any contributions. 

### Style Tooling
Eslint, airbnb-base, and prettier are all configured to work together in this project. If you are using VS Code install the eslint and prettier plugins and make sure to npm install. This will provide style guide suggestions and error reporting within your ide. 

## Testing
Tests are automatically run as part of the CI process when commits or PRs are created. All tests shall be passing before merging to master. Currently [jasmine](https://jasmine.github.io/index.html) is used for testing. While 100% code coverage is not required please write tests that cover any new code especially special conditions or edge cases. To have tests continually run as you develop use the test:watch script that utilizes nodemon to watch files via `npm run test:watch`.

## CI/CD
This project is built and published automatically when a commit is made to master. Tests are run on commits to any branch and on PR creation. Drone is the CI tool being used and can be monitored at https://drone.meltwater.io/meltwater/esi-include-webpack-plugin

## Versioning
Semantic release is used to handle version number changes. Commit message must follow [semantic-release][semantic-release-1] format requirements.

## Deploy / Publish
This project is published to NPM automatically when a commit is made to the master branch.

# License

Licensed under the MIT License.


[semantic-release-1]: https://github.com/semantic-release/semantic-release
