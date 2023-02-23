# LWW-Element-Dictionary

## 👓 Introduction

In distributed computing, a conflict-free replicated data type (CRDT) is a data structure that is replicated across multiple computers in a network, with the following features:

- The application can update any replica independently, concurrently and without coordinating with other replicas.
- An algorithm (itself part of the data type) automatically resolves any inconsistencies that might occur.
- Although replicas may have different state at any particular point in time, they are guaranteed to eventually converge.

A state-based CRDT (CvRDT) must...

- Have a partial order to the values.
- "Monotonically increase" in state, meaning a new state only ever succeeds the current state in the value's ordering.
- Define a merge function ("least upper bound") which is idempotent and order-independent.

Different from ```LWW-Element-Set```, ```LWW-Element-Dictionary``` store Object/Dictionary which is [Element](https://github.com/dominwong4/LWW-Element-Dictionary/blob/main/src/utils/types.ts#L16) but not only storing string. It gives various data type option on using CRDT.

## ✨ Features

- Dictionary List that works under [CRDTs prinicial](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
- [Add](https://github.com/dominwong4/LWW-Element-Dictionary/blob/main/src/LWWElementDictionary.ts#L20) (Only latest element will be added if key already exists)
- [Update](https://github.com/dominwong4/LWW-Element-Dictionary/blob/main/src/LWWElementDictionary.ts#L27) (Only latest element will be updated if key already exists)
- [Lookup](https://github.com/dominwong4/LWW-Element-Dictionary/blob/main/src/LWWElementDictionary.ts#L45) (Only element in Addset with latest timestamp can be lookup if RemoveSet has same key)
- [Remove](https://github.com/dominwong4/LWW-Element-Dictionary/blob/main/src/LWWElementDictionary.ts#L31) (Add element into RemoveSet if not exist in Add Set or the element is later then AddSet element with same key)
- [Merge](https://github.com/dominwong4/LWW-Element-Dictionary/blob/main/src/LWWElementDictionary.ts#L74) two LWW-Element-Dictionary withou any conflict (Merge two dicts under go LWW CRDTs princial)

## 📦 Install

```bash
$ git clone https://github.com/dominwong4/LWW-Element-Dictionary
$ cd LWW-Element-Dictionary
$ npm install
# or
$ yarn install
# or
$ pnpm install
```

## 🧪 Test

```bash
$ npm test
$ npm coverage
# or
$ yarn test
$ yarn coverage
# or
$ pnpm test
$ pnpm coverage
```

## 🔨 Usage

```ts
import { LWWElementDictionary } from '../LWWElementDictionary';
import { Element } from '../utils/types';
const dict = new LWWElementDictionary();
const dict2 = new LWWElementDictionary();

const element1: Element = {
  string_data: 'test', //optional
  timestamp: 1, //required
};

const element2: Element = {
  string_data: 'test2',
  number_data: 123,
  timestamp: 2,
};

dict.add('key1', element1);
dict2.add('key2', eleemnt2);

dict.lookup('key1'); //return True
dict2.lookup('key2'); //return True

dict.remove('key1', 2);
dict.lookup('key1'); //return False

dict2.remove('key2', 1);
dict2.lookup('key2'); //return True

dict.merge(dict2);
```

## 📚 Reference

- [Wiki](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
- [pfrazee/crdt_notes](https://github.com/pfrazee/crdt_notes)
- [Inria](https://hal.inria.fr/inria-00555588/PDF/techreport.pdf)
