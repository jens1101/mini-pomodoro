// This small module acts as a conversion layer to convert the `idb` module
// from CommonJS to ESM. It does this by imporing the `idb` module (which will
// cause it to be added to the global scope), assigning the global variable to
// a local one, removing the global variable, and finally exporting the `idb`
// object.
import '../../node_modules/idb/lib/idb.js'

const idb = window.idb
delete window.idb

export { idb }
