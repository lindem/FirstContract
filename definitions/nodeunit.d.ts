/**
 * Created by lindem on 12/2/13.
 */
///<reference path="../definitions/node.d.ts" />

interface NodeUnitTestObject {
    // test administration
    expect(numberOfUpcomingTests: number):void;
    done():void;
    // assertions
    ok(booleanExpression: boolean):void;
    ok(booleanExpression: boolean, message: string):void;

    equal(actual: any, expected: any): void;
    equal(actual: any, expected: any, message: string): void;

    notEqual(actual: any, expected: any): void;
    notEqual(actual: any, expected: any, message: string): void;

    deepEqual(actual: any, expected: any): void;
    deepEqual(actual: any, expected: any, message: string): void;

    notDeepEqual(actual: any, expected: any): void;
    notDeepEqual(actual: any, expected: any, message: string): void;

    strictEqual(actual: any, expected: any): void;
    strictEqual(actual: any, expected: any, message: string): void;

    notStrictEqual(actual, expected): void;
    notStrictEqual(actual, expected, message: string): void;

    throws(block: Function);
    throws(block: Function, error: any);
    throws(block: Function, error: any, message: string);

    doesNotThrow(block: Function);
    doesNotThrow(block: Function, error: any);
    doesNotThrow(block: Function, error: any, message: string)
}