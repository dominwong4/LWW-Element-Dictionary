/**
 * ElementMap -> the customised type for AddSet/RemoveSet
 */
export type ElementMap = Map<string, Element>;

/**
 * TimeStamp which is number ~ new Date.now()
 * The reason of this type is enhancing readabilty
 */
export type Timestamp = number;

/**
 * The atomic element inside the AddSet/RemoveSet (ElmentMap)
 * It forces the element inside the map must inculde TimeStamp
 */
export interface Element {
  /**
   * It accept various data type to let the Set store dictionary
   */
  [key: string]: unknown;
  /**
   * forcing timestamp should be included for every ops in AddSet/RemoveSet
   */
  timestamp: Timestamp;
}

/**
 * LWW-Element-Dictionary data structure.
 */
export interface ILWWElementDictionary {
  /**
   * Gets the add set of the dictionary.
   */
  getAddSet(): ElementMap;

  /**
   * Gets the remove set of the dictionary.
   */
  getRemoveSet(): ElementMap;

  /**
   * Adds an element to the dictionary.
   * The add rule follows LWW, if the key already exists,
   * it will check the timestamp of two element in the same key.
   * The latest one will stay into the ElementMap
   *
   * @param key The key of the element.
   * @param element The element to add.
   */
  add(key: string, element: Element): void;

  /**
   * Update an element to the dictionary.
   * The Logic should be the same as add
   *
   * @param key The key of the element.
   * @param element The element to add.
   */
  update(key: string, element: Element): void;

  /**
   * Removes an element from the dictionary.
   * The remove rule follows LWW
   * It will first call lookup(key) function to check if the data is exist by LWW rules
   * If the data exists and able to be deleted, it will check the timestamp again
   * It can be removed(add to removeSet) if the timestamp is later then the one in AddSet
   *
   * @param key The key of the element to remove.
   * @param timestamp The timestamp of the removal.
   */
  remove(key: string, timestamp: Timestamp): void;

  /**
   * Looks up whether an element exists in the dictionary.
   * The lookup logic as follow
   *
   * condition 1
   * if element is in addSet and element is not in removeSet
   *  then return True
   *
   * condition 2
   * if element in Both Set, then if AddSet.timestamp is later then RemoveSet.timestamp
   * then return True , else False
   *
   * condition 3
   * return false if Element is not in Add Set
   *
   * @param key The key of the element to look up.
   * @returns True if the element exists, false otherwise.
   */
  lookup(key: string): boolean;

  /**
   * Merges this dictionary with another replica.
   * @param replica The replica to merge with.
   */
  merge(replica: ILWWElementDictionary): void;
}
