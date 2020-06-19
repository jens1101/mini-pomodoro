const CSSAsset = require('parcel-bundler/src/assets/CSSAsset.js')

module.exports = class CSSStyleSheetAsset extends CSSAsset {
  async generate () {
    const css = this.ast ? this.ast.render(this.name).css : this.contents

    const jsParts = []

    if (this.options.hmr) {
      this.addDependency('_css_loader')
      jsParts.push(`
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      `)
    }

    jsParts.push(`
      var styleSheet = new window.CSSStyleSheet();
      styleSheet.replaceSync(${JSON.stringify(css)});

      module.exports = styleSheet;
    `)

    return [{
      type: 'js',
      value: jsParts.join('\n')
    }]
  }
}
