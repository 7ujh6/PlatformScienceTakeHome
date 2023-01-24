var expect = require('chai').expect;
const { findGCDWithCache } = require('../Helpers/NumericHelpers');

describe("Tests for InputHelpers", () => {

    beforeEach(() => {
        console.log("Input Helper Tests Running...");
    });

    it("findGCDWithCacheTest", () => {

        const cache = new Array(101).fill(0).map(() => new Set()); // initialize set to 100 (upper bound of our test cases)    
        
        var inputA = [2, 8, 9, 13, 71, 48];
        var inputB = [2, 72, 3, 5, 19, 100];
        var gcdResult = [true, true, true, false, false, true];

        for (var i = 0; i < Math.min(inputA.length, inputB.length); i++) {
            expect(findGCDWithCache(inputA[i], inputB[i], cache) != 1).to.equal(gcdResult[i]);
        }
    });
});