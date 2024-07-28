/** Контекст вызова */

const obj = {
  name: 'Colin',
  prop: {
    name: 'Rox',
    getname: function() {
      return this.name;
    },
    arrow: () => this.name,
    iife: function() {
      (function() {
        console.log(this.name);
      })()
    },
    arrowInsideFunction: function() {
      return () => console.log(this.name);
    }
  }
}

console.log(obj.prop.getname()); // ? 

const test = obj.prop.getname;
console.log(test()); // ? 

console.log(test.call(obj.prop)); // ?
console.log(test.apply(obj)); // ?
console.log(test.bind(obj)); // ?
console.log(test.bind(obj).bind(obj.prop)()); // ?
console.log(obj.prop.arrow()); // ?

obj.prop.iife(); // ?
obj.prop.arrowInsideFunction()();

/**Задача по подсчёту количества вызовов функции
* дана функция и цикл в котором вызывается эта функция
* нужно добавить счетчик вызовов
*/

function foo(num) {
 console.log( "foo: " + num );
}

for (let i=0; i < 10; i++) {
 if (i > 5) {
     foo( i );
 }
}

// console.log( foo.count ); // 4


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

/** This в функции конструкторе */

function C() {
  this.a = 37;
}

var o = new C();
console.log(o.a); // logs 37

function C2() {
  this.a = 37;
  return { a: 38 };
}

o = new C2();
console.log(o.a); // logs 38

