const CSSAsset = require('parcel-bundler/src/assets/CSSAsset.js')

module.exports = class CSSStyleSheetAsset extends CSSAsset {
  async generate () {
    const css = this.ast ? this.ast.render(this.name).css : this.contents

    let js = ''
    if (this.options.hmr) {
      this.addDependency('_css_loader')
      js = `
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      `
    }

    return [{
      type: 'js',
      value: `${js} module.exports = ${JSON.stringify(css)}`
    }]
  }
}
