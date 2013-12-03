FirstContract
=============

A JavaScript contracting library. 

This is very much a work in progress, but it's usable. 

## Why type contracts?
A contract provides a run-time clamp around your code. As JavaScript has no
static typing (and many people, myself included, argue it doesn't necessarily
need one), sometimes it's nice, during development, to have code just die if
types don't match. 

If you declare a function that should take a non-negative, proper number, and
return a non-negative, proper number, and you want code to die then and there
if that isn't the case, then contracts are a tool to do that.

## how it works

A trivial example: 

    var sum = function (a, b) {
        return a + b;
    }

To be sure that only proper numbers (a number that adheres to this contract
can be neither `NaN` nor `Infinity`) are ever encountered by that function, 
create a contract for it: 

    var contract = c(["R", "R"], "R"),
        sum = contract(function (a, b) {
            return a + b;
        });
        
`"R"` is an alias for the contract "Real numbers".

> Yes I know. IEEE-754 floating point is not "real numbers". But it's close 
> enough. 

As soon as a contract is violated, either by a contract function receiving 
the wrong arguments or returning the wrong values, the contract will make
your program blow up then and there. As such, the code between entry and 
exit of the function is guaranteed to be able to make certain assumptions. 

After development, if all contracts are usually satisfied, you can either
still leave them in, or remove them (but then you need to handle violations
yourself). 

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
 
### Types

 - `"Function"` for values that must be functions
 - `"Number"` for values that must be of type Number
 - `"Array"` for values that must be an array
 - `"Boolean"` for values that must be either true or false ("proper" Booleans)
 - `"String"` for values that must be of type String
 - `"def"` for every value except `undefined`
 - `"notnull"` for every value except `null`
 - `"proper"` for every value except `null` or `undefined`
 
### Exceptions

 - `"none"` or `""` for a contract that's always fulfilled (anything goes)
 - `"fail"` for a contract that's never fulfilled (develoment purposes)
 
### Compound contracts

To use these, they have to be imported from their namespaces, which is given
in full. 

 - `Contracts.ArrayContracts.allElementsContracts(array, [contractsByAlias])` 
 checks whether every element in an array fulfills all of the contracts.
 - `Contracts.ObjectContracts.allValuesContracts(obj, [contractsByAlias])` 
 checks whether every value (right-hand-side part) of the object satisfies
 all contracts.
 
### Tests

Unit Tests are in the `test` directory. Coverage is probably not complete. 

### TODO

There's some redundancy in some checks. They are all built by combining the 
most elementary ones; it's not very DRY.
