/** Контекст вызова */

var name = 'Name1';

const obj = {
    name: 'Name2',
    prop: {
        name: 'Name3',
        getName: function () {
            return this.name;
        },
    },
};

console.log(obj.prop.getName());

const test = obj.prop.getName;

console.log(test());

/**Задача по подсчёту количества вызовов функции */
let data = { count: 0 };

function foo(num) {
 console.log( "foo: " + num );
 // Подсчет вызовов `foo`
 data.count++;
}

for (let i=0; i < 10; i++) {
 if (i > 5) {
 foo( i );
 }
}

console.log( data.count ); // 4


/** Решение задачи без использования `this` путём использования идентификатора `foo` как ссылку на объект функции: */

function foo(num) {
 console.log( "foo: " + num );
 // Подсчет вызовов `foo`
 foo.count++;
}

foo.count = 0;

for (let i=0; i < 10; i++) {
 if (i > 5) {
 foo( i );
 }
}
console.log( foo.count ); // 4

/** Решение задачи с использованием `this`: */

function foo(num) {
 console.log( "foo: " + num );
 // Подсчет вызовов `foo`.
 // Примечание: `this` в действительности сейчас содержит
 // `foo` из-за того, как была вызвана функция `foo`
 // (см. ниже)
 this.count++;
}

foo.count = 0;

for (let i=0; i < 10; i++) {
 if (i > 5) {
 // используя `call(..)`, мы гарантируем, что `this` указывает на сам объект функции (`foo`)
 foo.call( foo, i );
 }
}
console.log( foo.count ); // 4

