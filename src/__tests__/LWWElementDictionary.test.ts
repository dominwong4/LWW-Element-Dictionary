import { LWWElementDictionary } from '../LWWElementDictionary';
import { Element } from '../utils/types';

describe('LWW Element Dictionary Testing', () => {
  describe('Test Add & Lookup Function', () => {
    describe('Normal Case', () => {
      it('Case(1): add one test data, test data should be inside addSet', () => {
        // Arrange
        const dict = new LWWElementDictionary();
        const testKey = 'key1';
        const testData: Element = {
          string_data: 'a',
          number_data: 123,
          timestamp: Date.now(),
        };

        // Act
        dict.add(testKey, testData);

        // Assert
        expect(dict.getAddSet().get(testKey)).toEqual(testData);
        expect(dict.lookup(testKey)).toBeTruthy();
      });
      it('Case(2): add one or more test data, test data should be inside addSet', () => {
        //Arragne
        const dict = new LWWElementDictionary();
        const testKeys = ['key1', 'key2', 'key3'];
        const testDatas: Element[] = [
          {
            string: 'a',
            timestamp: 1,
          },
          {
            string: 'b',
            timestamp: 2,
          },
          {
            string: 'c',
            timestamp: 3,
          },
        ];

        //Act
        for (let index = 0; index < testKeys.length; index++) {
          const key = testKeys[index];
          const element = testDatas[index];
          dict.add(key, element);
        }

        //Assert

        for (let index = 0; index < testKeys.length; index++) {
          expect(dict.getAddSet().get(testKeys[index])).toEqual(
            testDatas[index],
          );
          expect(dict.lookup(testKeys[index])).toBeTruthy();
        }
      });
      it('Case(3) - LWW: add multiple test data with same keys, should only latest one stay', () => {
        //Arrange
        const dict = new LWWElementDictionary();
        const testKey = 'key1';
        const testDatas: Element[] = [
          {
            string: 'a',
            timestamp: 1,
          },
          {
            string: 'd',
            timestamp: 4,
          },
          {
            string: 'b',
            timestamp: 2,
          },
          {
            string: 'c',
            timestamp: 3,
          },
        ];

        //Act
        for (let index = 0; index < testDatas.length; index++) {
          const element = testDatas[index];
          dict.add(testKey, element);
        }

        //Assert
        expect(dict.getAddSet().get(testKey)).toBeDefined;
        expect(dict.getAddSet().size).toBe(1);
        expect(dict.getAddSet().get(testKey)).toEqual({
          string: 'd',
          timestamp: 4,
        } as Element);
        expect(dict.lookup(testKey)).toBeTruthy();
      });
      it('Case(4) - LWW - 2: add multiple test data with same keys and diff keys, should only latest same key stay and diff key should also stay', () => {
        //Arragne
        const dict = new LWWElementDictionary();
        const testKeys = ['key1', 'key2', 'key1'];
        const testDatas: Element[] = [
          {
            string: 'a',
            timestamp: 1,
          },
          {
            string: 'b',
            timestamp: 2,
          },
          {
            string: 'c',
            timestamp: 3,
          },
        ];

        //Act
        for (let index = 0; index < testKeys.length; index++) {
          const key = testKeys[index];
          const element = testDatas[index];
          dict.add(key, element);
        }

        //Assert
        expect(dict.getAddSet().get('key1')).toBeDefined();
        expect(dict.getAddSet().get('key2')).toBeDefined();
        expect(dict.getAddSet().get('key1')).toEqual({
          string: 'c',
          timestamp: 3,
        } as Element);
        expect(dict.lookup('key1')).toBeTruthy();
        expect(dict.lookup('key2')).toBeTruthy();
      });
    });
  });
  describe('Test Remove & Lookup  Function', () => {
    describe('Normal Case', () => {
      it('Case(1), add one data to addSet (T=1) and then add to removeSet(T=2)', () => {
        //Arrange
        const dict = new LWWElementDictionary();
        const testKey = 'key1';
        const testData: Element = {
          string_data: 'a',
          timestamp: 1,
        };

        //Act
        dict.add(testKey, testData);
        dict.remove(testKey, 2);

        //Assert
        expect(dict.getRemoveSet().size).toBe(1);
        expect(dict.getAddSet().get(testKey)).toEqual({
          string_data: 'a',
          timestamp: 1,
        } as Element);
        expect(dict.getRemoveSet().get(testKey)).toEqual({
          string_data: 'a',
          timestamp: 2,
        } as Element);
        expect(dict.lookup(testKey)).toBeFalsy();
      });
      it('Case(2), add one data to AddSet, and remove one data with non-exist key which should not affect other key in AddSet and not in Remove Set', () => {
        //Arrange
        const dict = new LWWElementDictionary();
        const testKey = 'key1';
        const testData = {
          string_data: 'a',
          timestamp: 1,
        };
        const testDeleteKey = 'delete1';

        //Act
        dict.add(testKey, testData);
        dict.remove(testDeleteKey, 2);

        //Assert
        expect(dict.getAddSet().size).toBe(1);
        expect(dict.lookup(testKey)).toBeTruthy();
        expect(dict.getRemoveSet().size).toBe(0);
        expect(dict.lookup(testDeleteKey)).toBeFalsy();
      });
      it('Case(3), add remove to RemoveSet(T=1), then add same key to AddSet(T=2), lookup should return true', () => {
        //Arrange
        const dict = new LWWElementDictionary();
        const testKey = 'key1';
        const testData = {
          string_data: 'a',
          timestamp: 2,
        };

        //Act
        dict.remove(testKey, 1);
        dict.add(testKey, testData);

        //Assert
        expect(dict.getAddSet().size).toBe(1);
        expect(dict.lookup(testKey)).toBeTruthy();
        expect(dict.getRemoveSet().size).toBe(0);
      });
    });
  });
  describe('Test Merge Function', () => {
    describe('Normal Case', () => {
      //Arrange
      const master = new LWWElementDictionary();
      const testMasterKey = ['cat', 'dog', 'ape'];
      const testMasterData: Element[] = [
        {
          name: 'kitty',
          timestamp: 1,
        },
        {
          name: 'wow',
          timestamp: 1,
        },

        {
          name: '**',
          timestamp: 2,
        },
      ];
      const slave = new LWWElementDictionary();
      const testSlaveKey = ['cat', 'ape'];
      const testSlaveData: Element[] = [
        {
          name: 'hello',
          timestamp: 5,
        },
        {
          name: 'star',
          timestamp: 1,
        },
      ];

      for (let index = 0; index < testMasterKey.length; index++) {
        master.add(testMasterKey[index], testMasterData[index]);
      }
      for (let index = 0; index < testSlaveKey.length; index++) {
        slave.add(testSlaveKey[index], testSlaveData[index]);
      }
      it('Case(1), Create 2 dicts, and merge it. Should return a new AddSet undergo LWW rules', () => {
        //Act
        master.merge(slave);

        //Assert
        expect(master.getAddSet().size).toBe(3);
        expect(master.lookup('cat')).toBeTruthy();
        expect(master.getAddSet().get('cat')).toEqual({
          name: 'hello',
          timestamp: 5,
        } as Element);
        expect(master.getAddSet().get('ape')).toEqual({
          name: '**',
          timestamp: 2,
        } as Element);
      });
      it('Case(2), Add RemoveSet From Case(1)', () => {
        //Act
        master.remove('cat', 3);
        slave.remove('cat', 6);

        master.merge(slave);
        expect(master.getAddSet().size).toBe(3);
        expect(master.getRemoveSet().size).toBe(1);
        // the latest removeSet should be stayed in Remove set
        expect(master.getRemoveSet().get('cat')).toEqual({
          name: 'hello',
          timestamp: 6,
        });
        // Lookup return False because the latest cat in AddSet is T=5, RemoveSet is T=6
        expect(master.lookup('cat')).toBeFalsy();
      });
    });
  });
});
