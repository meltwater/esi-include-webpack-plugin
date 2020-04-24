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

  apply(compiler) {
    const isProductionMode =
      compiler.options.mode === 'production' || !compiler.options.mode;
    this.logVerbose(
      `${pluginName} detected production mode as ${isProductionMode}`
    );

    compiler.hooks.emit.tapPromise(pluginName, async compilation => {
      this.replacers = [];
      const promises = this.options.esi.map(async esiItem => {
        if (isProductionMode) {
          this.replacers.push(EsiIncludeWebpackPlugin.buildEsiString(esiItem));
        } else {
          const content = await this.buildFullFileInclude(esiItem);
          this.replacers.push(content);
        }
        return new Promise(result => {
          result();
        });
      });

      await Promise.all(promises);

      this.logVerbose(this.replacers);
      this.manipulateCompilationAssets(compilation);
    });
  }

  manipulateCompilationAssets(compilation) {
    // Loop through all compiled assets
    const assetKeys = Object.keys(compilation.assets);
    assetKeys.forEach(_assetKey => {
      const bits = _assetKey.split('.');
      if (
        bits[bits.length - 1] === 'html' ||
        bits[bits.length - 1] === 'htm' ||
        bits[bits.length - 1] === 'ejs'
      ) {
        // this is an html file so do the replacement
        this.logVerbose(_assetKey);
        this.logVerbose(compilation.assets[_assetKey]);

        const replacedHtml = this.replace(
          compilation.assets[_assetKey].source()
        );
        // eslint-disable-next-line no-param-reassign
        compilation.assets[_assetKey] = {
          source() {
            return replacedHtml;
          },
          size() {
            return replacedHtml.length;
          }
        };
      }
    });
  }

  replace(html) {
    let newHtml = html;
    this.replacers.forEach(replacer => {
      // Convert search string to regex to do:
      //    - Global replace (every instance not just the first)
      //    - Case insensitive replace. TODO: Make this a config option defaulted to true
      const re = new RegExp(replacer.searchString, 'gi');
      newHtml = newHtml.replace(re, replacer.replaceString);
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
