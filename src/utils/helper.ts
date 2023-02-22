import { ElementMap } from './types';

export function mergeHelper(masterMap: ElementMap, slaveMap: ElementMap): void {
  slaveMap.forEach((element, key) => {
    const exisitingElement = masterMap.get(key);
    if (
      exisitingElement === undefined ||
      element.timestamp > exisitingElement.timestamp
    ) {
      masterMap.set(key, element);
    }
  });
}
