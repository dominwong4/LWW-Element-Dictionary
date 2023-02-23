import { mergeHelper } from './utils/helper';
import {
  Element,
  ElementMap,
  ILWWElementDictionary,
  Timestamp,
} from './utils/types';

class LWWElementDictionary implements ILWWElementDictionary {
  private addSet: ElementMap = new Map();
  private removeSet: ElementMap = new Map();

  getAddSet(): ElementMap {
    return this.addSet;
  }
  getRemoveSet(): ElementMap {
    return this.removeSet;
  }

  add(key: string, element: Element): void {
    const exisitingElement = this.addSet.get(key);
    if (!exisitingElement || element.timestamp > exisitingElement.timestamp) {
      this.addSet.set(key, element);
    }
  }

  update(key: string, element: Element): void {
    this.add(key, element);
  }

  remove(key: string, timestamp: Timestamp): void {
    // prelookup, skip it if lookup return false
    if (!this.lookup(key)) return;

    const exisitingElement = this.addSet.get(key);

    if (exisitingElement && timestamp > exisitingElement.timestamp) {
      //Add the corresponding element from addSet to RemoveSet with updating timestamp without changing existing object
      const removedElement = structuredClone(exisitingElement);
      removedElement.timestamp = timestamp;
      this.removeSet.set(key, removedElement);
    }
  }

  lookup(key: string): boolean {
    const exisitingElementInAddSet = this.addSet.get(key);
    const exisitingElementInRemoveSet = this.removeSet.get(key);

    // condition 1
    // if element is in addSet and element is not in removeSet
    // then return True
    if (exisitingElementInAddSet && !exisitingElementInRemoveSet) {
      return true;
    }

    // condition 2
    // if element in Both Set, then if AddSet.timestamp is later then RemoveSet.timestamp
    // then return True , else False
    if (exisitingElementInAddSet && exisitingElementInRemoveSet) {
      if (
        exisitingElementInAddSet.timestamp >
        exisitingElementInRemoveSet.timestamp
      ) {
        return true;
      }
      return false;
    }

    // condition 3
    // return false if Element is not in Add Set
    return false;
  }

  merge(replica: LWWElementDictionary): void {
    mergeHelper(this.getAddSet(), replica.getAddSet());
    mergeHelper(this.getRemoveSet(), replica.getRemoveSet());
  }
}

export { LWWElementDictionary };
