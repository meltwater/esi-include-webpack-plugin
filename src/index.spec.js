const EsiIncludeWebpackPlugin = require('./index');

describe('index', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  describe('EsiIncludeWebpackPlugin', () => {
    describe('buildEsiString', () => {
      it('Shall return an object with "searchString" and "replaceString" properties of type string', () => {
        const result = EsiIncludeWebpackPlugin.buildEsiString({ src: 'hello' });

        expect(typeof result).toBe('object');
        expect(typeof result.searchString).toBe('string');
        expect(typeof result.replaceString).toBe('string');
      });
    });

    describe('manipulateCompilationAssets', () => {
      let compilation;
      let replacers;
      beforeEach(() => {
        compilation = {
          assets: {
            'test.html': {
              source() {
                return 'This string has a key MARCO and has a second one MARCO and a third one CHICKEN';
              }
            },
            'file.html': {
              source() {
                return 'This string does not have a key';
              }
            },
            'template.ejs': {
              source() {
                return 'This string a key but it is marco lowercase';
              }
            },
            'other.txt': {
              source() {
                return 'This file with MARCO should not be touched';
              }
            }
          }
        };

        replacers = [
          {
            // searchString: `<!--esi-include-webpack-plugin name=${esiItem.name}-->`,
            searchString: 'MARCO',
            replaceString: 'POLO'
          },
          {
            searchString: 'CHICKEN',
            replaceString: 'LITTLE'
          }
        ];
      });

      it('should replace strings based on replacers', () => {
        const plugin = new EsiIncludeWebpackPlugin({
          esi: [{ name: 'scooby', src: 'doo' }]
        });
        plugin.replacers = replacers;
        plugin.manipulateCompilationAssets(compilation);

        expect(compilation.assets['test.html'].source()).toEqual('This string has a key POLO and has a second one POLO and a third one LITTLE');
      });

      it('should only alter file extensions html, htm, ejs', () => {
        const plugin = new EsiIncludeWebpackPlugin({
          esi: [{ name: 'scooby', src: 'doo' }]
        });
        plugin.replacers = replacers;
        plugin.manipulateCompilationAssets(compilation);

        expect(compilation.assets['other.txt'].source()).toEqual('This file with MARCO should not be touched');
      });
    });
  });
});
