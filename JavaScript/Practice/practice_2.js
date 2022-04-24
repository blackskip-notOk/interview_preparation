// https://www.youtube.com/watch?v=x-EZy6gu_38&t=833s from Vladilen Minin video

/** Уникальность всех символов в строке
Напишите функцию, которая определяет уникальны ли все символы в строке. Регистр должен учитываться: `‘a’` и `‘A’` разные символы.
*/

//  function isUnique(string) {
//     const stringSet = new Set(string);
//     return string.length === stringSet.size;
// }

// function isUnique(str) {
// for (let i = 0; i < str.length; i++) {
//   if (str.lastIndexOf(str[i]) !== i) {
//     return false
//   }
// }
// return true
// }

function isUnique(string) {

    for (i = 0; i < string.length; i++) {
        for (j = 0; j < string.length; j++) {
            if ((i !== j) && string[i] === string[j]) {
                return false;
            }
        }
    }
    return true;
}

console.log(isUnique('abcdef')) // -> true
console.log(isUnique('1234567')) // -> true
console.log(isUnique('abcABC')) // -> true
console.log(isUnique('abcadef')) // -> false

/** Плоский массив
 Напишите функцию, принимающая массив с вложенными массивами и распакуйте в результирующий плоский массов.
 В результате должны получить новый одномерный массив.
 */

function flatten(array) {
    const result = [];

    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i])) {
            const flat = flatten(array[i]);

            for (let j = 0; j < flat.length; j++) {
                result.push(flat[j]);
            }
        } else {
            result.push(array[i]);
        }
    }
    return result;
}

console.log(flatten([
    [1],
    [
        [2, 3]
    ],
    [
        [
            [4]
        ]
    ]
])) // -> [1, 2, 3, 4];

/** Удаление всех повторяющихся значений в строке
Напишите функцию, которая принимает строку и возвращает новую, в которой все дублирующиеся символы будут удалены.
*/

function removeDupes(str) {
    // return Array.from(new Set(str)).join('');
    const result = [];

    for (let i = 0; i < str.length; i++) {
        if (!result.includes(str[i])) {
            result.push(str[i]);
        };
    }
    return result.join('');
};

console.log(removeDupes('abcd')) // -> 'abcd'
console.log(removeDupes('aabbccdd')) // -> 'abcd'
console.log(removeDupes('abcddbca')) // -> 'abcd'
console.log(removeDupes('abababcdcdcd')) // -> 'abcd'

/** Какая строка встречается чаще всего
Напишите функцию, которая принимает массив строк и возвращает самую частовстречающуюся строку в этом массиве.
Если таких строк несколько, то нужно вернуть первую, идя слева на право.
*/

function highestFrequency(array) {
    const map = {};
    let max = 0;
    let result = array[0];

    for (let i = 0; i < array.length; i++) {
        const current = array[i];
        if (map[current]) {
            map[current]++;
        } else {
            map[current] = 1;
        }

        if (map[current] > max) {
            max = map[current];
            result = current;
        }
    }
    return result;
}

console.log(highestFrequency(['a', 'b', 'c', 'c', 'd', 'e'])) // -> c
console.log(highestFrequency(['abc', 'def', 'abc', 'def', 'abc'])) // -> abc
console.log(highestFrequency(['abc', 'def'])) // -> abc
console.log(highestFrequency(['abc', 'abc', 'def', 'def', 'def', 'ghi', 'ghi', 'ghi', 'ghi'])) // -> ghi

/** Повернута ли строка?
Напишите функцию, которая принимает 2 строки.
Верните `true` если строки являются перевернутым вариантом друг друга. Иначе верните `false`.
*/

function isStringRotated(source, test) {
    if (source.length !== test.length) {
        return false;
    }
    for (i = 0; i < source.length; i++) {
        const rotate = source.slice(i, source.length) + source.slice(0, i);

        if (rotate === test) {
            return true;
        }
    }
    return false;
    // return (source + source).includes(test);
}

  console.log(isStringRotated('javascript', 'scriptjava')) // -> true
  console.log(isStringRotated('javascript', 'iptjavascr')) // -> true
  console.log(isStringRotated('javascript', 'java')) // -> false

/** Является ли массив подмножеством другого массива
Напишите функцию, которая проверяет, является ли второй массив подмножеством первого.
*/

function arraySubset(source, subset) {
    if (source.length < subset.length) {
        return false;
    }

    const map = {};
    const subsetMap = {};

    source.forEach(el => {
        if (map[el]) {
            map[el]++;
        } else {
            map[el] = 1;
        };
    });

    subset.forEach(el => {
        if (subsetMap[el]) {
            subsetMap[el]++;
        } else {
            subsetMap[el] = 1;
        };
    });

    for (let key in subsetMap) {
        if (!map.hasOwnProperty(key) || subsetMap[key] > map[key]) {
            return false;
        }
    }

    return true;
}

  console.log(arraySubset([2, 1, 3], [1, 2, 3])) // -> true
  console.log(arraySubset([2, 1, 1, 3], [1, 2, 3])) // -> true
  console.log(arraySubset([1, 1, 1, 3], [1, 3, 3])) // -> false
  console.log(arraySubset([1, 2], [1, 2, 3])) // -> false

/** Анаграммы
Напишите функцию, которая проверяет, являются ли все элементы в массиве анаграммами друг друга.
*/

function allAnagrams(array) {
    const sorted = array.map(item => item.split('').sort().join(''));

    for (let el of sorted) {
        if (el !== sorted[0]) {
            return false;
        }
    }
    return true;
};

console.log(allAnagrams(['abcd', 'bdac', 'cabd'])) // true
console.log(allAnagrams(['abcd', 'bdXc', 'cabd'])) // false