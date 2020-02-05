const { describe, it, expect, beforeEach } = require('jasmine');

import EsiIncludeWebpackPlugin from './index';


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
    describe('manipulateCompulationAssets', () => {
      beforeEach(() => {
        let compilation = {
          assets: {
            'test.html': {
              source() {
                return '';
              }
            },
            'file.html': {
              source() {
                return '';
              }
            },
            'template.ejs': {
              source() {
                return '';
              }
            },
            'other.txt': {
              source() {
                return '';
              }
            }
          }
        };

        const replacers = [
          {
            searchString: `<!--esi-include-webpack-plugin name=${esiItem.name}-->`,
            replaceString: tag
          }
        ];
      });
      it('should replace strings based on replacers', () => {

      });
      it('should only alter file extensions html, htm, ejs', () => {

      });
    });
  });
});
