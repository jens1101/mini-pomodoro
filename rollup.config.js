import { createDefaultConfig } from '@open-wc/building-rollup'

// TODO: copy assets. Ideally I need a plugin that recognises hrefs in link
//  tags, but it seems like none of those exist. The best solution I could find
//  is to use `rollup-plugin-copy` plugin to manually copy assets.
export default createDefaultConfig({ input: './index.html' })
