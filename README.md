# Webpack ESI Include Plugin
[![Build Status](https://drone.meltwater.io/api/badges/dsappet/esi-include-webpack-plugin/status.svg)](https://drone.meltwater.io/dsappet/esi-include-webpack-plugin)
---------
## What is it?
This is a webpack plugin that can be configured with settings for an ESI (edge side include) tag. When running or building as production this plugin will replace a comment tag in html files with the appropriately created esi tag. The real power of this plugin comes in when running in development mode. When in development this plugin will fetch the contents of the configured src and inject the entire source during build to emulate the esi. This allows developers to run locally with the same includes that (for meltwater) akamai provides, without actually needing to proxy local dev through akamai in any way. 

## How do I use it?
Below is an example of how to include and configure this plugin in webpack config.
```javascript
const EsiIncludeWebpackPlugin = require('@meltwater/esi-include-webpack-plugin');

plugins: [
    new EsiIncludeWebpackPlugin({
        verbose: true,
        esi: [{ name: 'placeholder', src: 'https://mydomain.com/thingToInclude.html', noStore: false, onError: 'continue', authorization: 'bearer tokendatablah' }]
    })
];
```
verbose: optional - set to true to see additional console logging.

esi: array of esi objects
  esiObjects: 
    name: matches comment in html so it knows where to replace
    src: source file to 'GET' to include in esi
    noStore: set to true or false to set the 'no-store' esi 
    onError: the esi onerror value
    authorization: optional property to passed as the authorization header in the GET request when a file is fetched for dev. 

In HTML use the following snippet to mark the location of the ESI
```html 
<!--esi-include-webpack-plugin name=placeholder-->
```
The name property must match the name in the esi config object exactly.
The spacing is important. At the moment having no spaces around the '=' and no spaces between the open and close comment markers is required exactly. Hopefully flexibility will be added in the future.




# License
---------
Licensed under the MIT License.