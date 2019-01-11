/**
 * A map class used to map numeric indexes or ID strings to HTML elements.
 *
 * The intent is that an element is primarily mapped using numeric indices,
 * but the same element can in addition be mapped using string IDs.
 *
 * The only custom behaviour that exists currently is that iteration will skip
 * all string keys and only use numeric ones. All other behaviour is identical
 * to the vanilla `Map` class.
 */
export class ElementMap extends Map {
  /**
   * This iterator will only loop through the unique templates. This is
   * necessary, because we may have duplicates in this map, because we map
   * templates by their index and ID (if it has one).
   */
  * [Symbol.iterator] () {
    for (let [key, value] of this.entries()) {
      if (Number.isInteger(key)) {
        yield [key, value]
      }
    }
  }
}
