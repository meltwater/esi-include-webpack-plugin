const fetch = require('node-fetch');


const pluginName = 'EsiIncludeWebpackPlugin';


class EsiIncludeWebpackPlugin {

  constructor(options) {
    this.options = options;
    this.replacers = [];

    const { esi } = options;

    this.options.verbose = (options.verbose === true) ? true : false;

    // Just do a little type checking
    if (esi === undefined || esi === null || !Array.isArray(esi)) {
      console.error(`${pluginName}: esi property must exist and be an array.`);
    }

    // Some more type checking
    this.options.esi.forEach(esiItem => {
      if (!esiItem.name || !esiItem.src) {
        console.error(`esi config item requires a name and src tag!`);
      }
    });

  }

  logVerbose(msg) {
    if(this.options.verbose) {
      console.info(msg);
    }
  }

  async apply(compiler) {

    const isProductionMode = compiler.options.mode === 'production' || !compiler.options.mode;
    
    this.logVerbose(`${pluginName} detected production mode as ${isProductionMode}`);

    this.replacers = [];
    const promises = this.options.esi.map(async (esiItem) => {
      if (isProductionMode) {
        this.replacers.push(this.buildEsiString(esiItem));
      } else {
        this.replacers.push(await this.buildFullFileInclude(esiItem));
      }
      return new Promise((result, reject) => { result() });
    });

    await Promise.all(promises);

    this.logVerbose(this.replacers);

    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {

      // Loop through all compiled assets,
      for (var filename in compilation.assets) {
        let bits = filename.split('.');
        if (bits[bits.length - 1] === 'html' || bits[bits.length - 1] === 'htm' || bits[bits.length - 1] === 'ejs') {
          // this is an html file so do the replacement
          this.logVerbose(filename);
          this.logVerbose(compilation.assets[filename]);

          let replacedHtml = this.replace(compilation.assets[filename].source());

          compilation.assets[filename] = {
            source: function () {
              return replacedHtml;
            },
            size: function () {
              return replacedHtml.length;
            }
          }
        }
      }

      callback();
    });

  }

  replace(html) {
    this.replacers.forEach(replacer => {
      html = html.replace(replacer.searchString, replacer.replaceString);
    });
    return html;
  }



  buildEsiString(esiItem) {
    if (!esiItem.noStore) {
      esiItem.noStore = 'off';
    }
    if (!esiItem.onError) {
      esiItem.onError = 'continue';
    }

    let tag = `<!--esi <esi:include src="${esiItem.src}" no-store="${esiItem.noStore}" onerror="${esiItem.onError}"`;
    if(esiItem.ttl){
      tag += ` ttl="${esiItem.ttl}"`;
    }
    if(esiItem.maxwait) {
      tag += ` maxwait="${esiItem.maxwait}"`;
    }
    tag += `></esi:include>-->`;

    return {
      searchString: `<!--esi-include-webpack-plugin name=${esiItem.name}-->`,
      replaceString: tag
    };
  }

  async buildFullFileInclude(esiItem) {
    let include = await this.fetchInclude(esiItem.src, esiItem.authorization);
    return {
      searchString: `<!--esi-include-webpack-plugin name=${esiItem.name}-->`,
      replaceString: include
    };
  }

  async fetchInclude(uri, authorization) {
    let options = {};
    if (authorization) {
      options.headers = { 'authorization': authorization }
    }
    let res = await fetch(uri, options);
    let text = await res.text();
    this.logVerbose(`${res.status} - ${uri} - ${text}`)

    if (res.status !== 200) {
      console.error(`${pluginName} errored attempting to fetch ${uri}, returned with code ${res.status}`);
    }

    return text;

  }

}

module.exports = EsiIncludeWebpackPlugin;
