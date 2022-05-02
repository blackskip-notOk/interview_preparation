const str = 'адрес карп кума куст мир мука парк рим среда стук рост сорт трос';

function getAnagrams(str) {
  const map = {};
  const result = [];

  const arr = str.split(' ');

  for (let i = 0; i < arr.length; i++) {
      const sortEl = arr[i].split('').sort().join('');

      if (!map[sortEl]) {
          map[sortEl] = [];
      }
        map[sortEl].push(arr[i]);
    }
    return Object.values(map);
};

console.log(getAnagrams(str));

let arr = [5, 3, 6, -10, 4, 4, 7, -1];

function sortArr(arr) {
    const result = [];

    let arrCopy = arr.slice(0, arr.length);

    arrCopy.forEach(() => {
        let minElementIndex = 0;

        minElementIndex = arr.indexOf(Math.min.apply(Math, arr));

        result.push(arr[minElementIndex]);
        arr.splice(minElementIndex, 1);
    });
    return result;
};

console.log(sortArr(arr));