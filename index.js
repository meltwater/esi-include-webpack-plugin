/* eslint-disable no-console */
const fetch = require('node-fetch');

const pluginName = 'EsiIncludeWebpackPlugin';

class EsiIncludeWebpackPlugin {
  constructor(options) {
    this.options = options;
    this.replacers = [];

    const { esi } = options;

    if (typeof options.verbose !== 'boolean') {
      this.options.verbose = false;
    } else {
      this.options.verbose = options.verbose;
    }

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
    if (this.options.verbose) {
      console.info(msg);
    }
  }

  async apply(compiler) {
    const isProductionMode =
      compiler.options.mode === 'production' || !compiler.options.mode;
    this.logVerbose(
      `${pluginName} detected production mode as ${isProductionMode}`
    );

    this.replacers = [];
    const promises = this.options.esi.map(async esiItem => {
      if (isProductionMode) {
        this.replacers.push(this.buildEsiString(esiItem));
      } else {
        this.replacers.push(await this.buildFullFileInclude(esiItem));
      }
      return new Promise(result => {
        result();
      });
    });

    await Promise.all(promises);

    this.logVerbose(this.replacers);

    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // Loop through all compiled assets,

      for (var filename in compilation.assets) {
        const bits = filename.split('.');
        if (
          bits[bits.length - 1] === 'html' ||
          bits[bits.length - 1] === 'htm' ||
          bits[bits.length - 1] === 'ejs'
        ) {
          // this is an html file so do the replacement
          this.logVerbose(filename);
          this.logVerbose(compilation.assets[filename]);
          const replacedHtml = this.replace(
            compilation.assets[filename].source()
          );
          // eslint-disable-next-line no-param-reassign
          compilation.assets[filename] = {
            source() {
              return replacedHtml;
            },
            size() {
              return replacedHtml.length;
            }
          };
        }
      }

      callback();
    });
  }

  replace(html) {
    let newHtml = html;
    this.replacers.forEach(replacer => {
      newHtml = html.replace(replacer.searchString, replacer.replaceString);
    });
    return newHtml;
  }

  static buildEsiString(esiItemParam) {
    const esiItem = esiItemParam;
    if (!esiItem.noStore) {
      esiItem.noStore = 'off';
    }
    if (!esiItem.onError) {
      esiItem.onError = 'continue';
    }

    let tag = `<!--esi <esi:include src="${esiItem.src}" no-store="${esiItem.noStore}" onerror="${esiItem.onError}"`;
    if (esiItem.ttl) {
      tag += ` ttl="${esiItem.ttl}"`;
    }
    if (esiItem.maxwait) {
      tag += ` maxwait="${esiItem.maxwait}"`;
    }
    tag += `></esi:include>-->`;

    return {
      searchString: `<!--esi-include-webpack-plugin name=${esiItem.name}-->`,
      replaceString: tag
    };
  }

  async buildFullFileInclude(esiItem) {
    const include = await this.fetchInclude(esiItem.src, esiItem.authorization);
    return {
      searchString: `<!--esi-include-webpack-plugin name=${esiItem.name}-->`,
      replaceString: include
    };
  }

  async fetchInclude(uri, authorization) {
    const options = {};
    if (authorization) {
      options.headers = { authorization };
    }
    const res = await fetch(uri, options);
    const text = await res.text();
    this.logVerbose(`${res.status} - ${uri} - ${text}`);

    if (res.status !== 200) {
      console.error(
        `${pluginName} errored attempting to fetch ${uri}, returned with code ${res.status}`
      );
    }

    return text;
  }
}

module.exports = EsiIncludeWebpackPlugin;
