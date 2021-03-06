FirstContract
=============

A JavaScript data contract library. It's not done yet, but usable. It works with:

- node.js
- MSIE (tested 10 and 11)
- Chrome/Chromium (also on Android)
- Firefox 
- PhantomJS

## Why type contracts?
A contract provides a run-time clamp around your code. As JavaScript has no
static typing (and many people, myself included, argue it doesn't necessarily
need it), sometimes it's nice, during development, to have code just die if
types don't match. 

If you declare a function that should take (for example)) a non-negative, 
proper number, and return a non-negative, proper number, and you want code to 
die then and there if that isn't the case, then contracts are a tool to do 
that -- think "type constraints" for the application of functions to both 
parameters and return value. 

Aside from that, this library contains transparent check functions (so-called
elementary contracts) which are easy to apply and don't get in the way. "

Firstcontract will throw Exceptions to have your code die. It doesn't require
you to even touch the function you are making a contract for. It's got a terse 
syntax and is on npm. 

## Getting FirstContract

You can install firstcontract through npm, by typing

     npm install firstcontract

or by cloning this repository. The module is written in TypeScript, which I am
learning at the moment. Ideas to improve are welcome.

## How it works

A trivial example: 

    var sum = function (a, b) {
        return a + b;
    }

To be sure that only proper numbers (a number that adheres to this contract
can be neither `NaN` nor `Infinity`) are ever encountered by that function, 
create a contract for it: 

    var c = require("firstcontract").c, 
        contract = c(["R", "R"], "R"),
        csum = contract(sum);
        
`"R"` is an alias for the contract "Real numbers".

> Yes I know. IEEE-754 floating point is not "real numbers". But it's close 
> enough. 

The `c` shorthand above creates a contract function. The first argument is
an array with aliases for the parameters, the second parameter is an alias for 
the return value's check.

If you want to give a particular contract a label that will be included in the
error message, you can. In the above example, instead of `contract(sum)`, call
`contract("label", sum)`. See below how an error message looks with and without
labels.

As soon as a contract is violated, either by a contract function receiving 
the wrong arguments or returning the wrong values, the contract will make
your program blow up then and there by throwing a "contract violation" (an
exception). Examples:

If a function returns a value illegal by the contract, the error message reads
`[return value]` after the contract label and the function name (if any).

    Contract Violation: label: »(no label)« function bang [return value]: NaN  is not an integer.

If a function is supplied with the wrong kind of parameter, it reads like this:

    Contract Violation: label: »testlabel«  function sum [parameter 2] NaN is not finite.


As such, the code between entry and exit of the function is guaranteed to be
able to make certain assumptions -- execution won't even reach the code
otherwise. If something unexpected happens, it did not happen in the functions
which fulfilled their contracts.

After development, if all contracts are "usually satisfied", you can either
still leave them in, or remove them (but then you need to handle violations
yourself). 

## Example of transparency

From the unit tests: 

    function F() {
        this.foo = "bar";
        return this;
    }
    function baz () {
        return this.foo;
    }    
    F.prototype.baz = c([], "S+")(baz);
    
The above contract specifies no contracts for parameters, but the return value 
must be a nonempty string. The execution context `this` of the function is 
preserved. This example shows that a contract is added very easily to a 
function without even touching its implementation.

## Aliases

The easiest method of getting at a contract function is to use the 
`Contracts.byAlias` function: 

    var Contracts = require('firstcontract'),
        // Contracts.TypeContracts.isString
        isString = Contracts.byAlias("S"), 
        // Contracts.NumberContracts.positiveInteger;
        positiveInt = Contracts.byAlias("Z+") 
        
The wrappers `c` and `contractify` support aliases only, for reasons of 
terseness. 

The aliases include (this list is growing, as I added only the most useful 
ones first): 

### Numeric contracts

 - `"Z"` for integers only (Number-type values without fractional parts)
 - `"Z+0"` for non-negative integers including zero
 - `"Z+"` for positive integers 
 - `"Z-"` for negative integers
 - `"R"` for "proper" Number-type values (not `NaN` or `Infinity` values)
 - `"R+0"` for positive floating point Number-type values
 - `"R+"` for positive Number-type values
 - `"R-"`" for negative Number-type values

### Strings
 - `"S+"`: passes for nonempty String. `""` and non-String values fail the
 contract.
 
### Dates 
 
 - `"Future"` passes if the date is in the future (compared to when the test is
 run)
 - `"Past"` passes if the date is in the past seen from when the test is run
 
### Types

 - `"Function"` for values that must be functions
 - `"Number"` for values that must be of type Number
 - `"Array"` for values that must be an array
 - `"Boolean"` for values that must be either true or false ("proper" Booleans)
 - `"Date"` passes for Dates.
 - `"String"` or `"S"` for values that must be of type String
 - `"def"` for every value except `undefined`
 - `"notnull"` for every value except `null`
 - `"proper"` for every value except `null` or `undefined`
 
### Other

 - `"none"` or `""` for a contract that's always fulfilled (anything goes)
 - `"fail"` for a contract that's never fulfilled (develoment purposes)

### Elementary contracts

You can call any contract at any point in your code, if you want to make a
decisive check (during development, you want things to blow up; "make it fail
 early" is useful to find problems).

All ECs share the same order of parameters:

    Contracts.<ContractType>.<ContractName>(thingToTest, semanticName)

- `thingToTest` is the variable holding the value you want checked.
- `semanticName` is what the variable actually is for (try "margin", "width",
"size"). The error message will contain that name and why a contract failed.

Of course, the `Contracts.byAlias` call makes it easy to do:

    var foo = bar / baz;
    
you can check that `bar / baz` is in fact an integer (or throw an exception
if it isn't) like so:

    var Z = Contracts.byAlias("Z"),
        foo = Z(bar / baz, "important calculation for foo"),
        
As the contract still returns its value if it's fulfilled, this code block 
behaves the same as before in that case.       

All ECs either pass transparently or blow up by throwing an Error. That's the
 intention.
 
### Compound contracts

To use these, they have to be imported from their namespaces, which is given
in full. 

 - `Contracts.ArrayContracts.allElementsContracts(array, [contractsByAlias])` 
 checks whether every element in an array fulfills all of the contracts.
 - `Contracts.ObjectContracts.allValuesContracts(obj, [contractsByAlias])` 
 checks whether every value (right-hand-side part) of the object satisfies
 all contracts.

### Immediate contracts on method calls

You can also add a contract to a method call on the fly. An example:

    // ...
    foo = anotherObject.importantCall(bar, baz)
    // ...
    
You can, in that case (assuming the Contract is `Z+0`, for the parameters, and 
`R+0`, for positive proper numbers), do:

    var contract = c(["Z+0", "Z+0"], R+0);
    // ...
    foo = contract(anotherObject.importantCall, anotherObject)(bar, baz);
    
The only thing you must do is **provide the object the method belongs to** as an
additional parameter to the contract.

> The reason of that is that anotherObject.importantCall is just the "name" under
> which the function can be reached. That "anotherObject." is part of the name 
> will only have an effect on the function's `this` if it's immediately executed 
> by appending () to that. So you must provide the execution context explicitly 
> in this scenario. 

You can also do that with a label that gets repeated in the error message, so
you can more easily find it (just prepend it to the function wrapped and the
execution context as an additional argument):

    foo = contract("look here!", anotherObject.importantCall, anotherObject)
                  (bar, baz);
                  
See above, "How it works", for example messages to see what an error message
looks like. 

### Tests

Unit Tests are in the `test` directory. Coverage is probably not complete. 

### TODO

- There's some redundancy in some checks. They are all built by combining the
most elementary ones; it's not very DRY. Improve that.

- A nicer API might be nice. Easier said than done.

- allow for proper pre- and postcondition functions when figured out how to 
integrate them in a way that doesn't look uglier than this API currently 
looks.

## DISCLAIMER

As the current form of contracts is fairly limited, these things cannot 
possibly do everything proper aspect-oriented programming can. But then, 
that wasn't the original intent.

The original intent was to provide a means to easily add constraints checking
code with (for developers) meaningful error messages as conveniently as 
possible. I'm lazy, so the less I have to type to do this, the more likely I 
will. Also, it was meant to be non-invasive -- if I had to directly edit the 
functions I want to monitor, it's already unusable. 

Suggestions welcome.
