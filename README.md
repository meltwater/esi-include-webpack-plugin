# Webpack ESI Include Plugin
## How do I use it
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



