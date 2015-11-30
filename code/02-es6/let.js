'use strict';

{
    let a = 1;
    var b = 2;

    alert(`a = ${a} / b = ${b}`); // a = 1 / b = 2
}

alert(`a = ${a} / b = ${b}`); // ReferenceError: a is not defined