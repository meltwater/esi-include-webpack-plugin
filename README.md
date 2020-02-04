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

# Contributing
* Work in a branch, submit a PR to master


# License
---------
Licensed under the MIT License.
