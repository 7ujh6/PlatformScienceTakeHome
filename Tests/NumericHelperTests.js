var expect = require('chai').expect;
const { BitSet } = require("bitset"); 
const { findGCDWithCache } = require('../Helpers/NumericHelpers');

describe("Tests for InputHelpers", () => {

    beforeEach(() => {
        console.log("Input Helper Tests Running...");
    });

    it("findGCDWithCacheTest", () => {
        const gcdBitset = new Array(120).fill(new BitSet("0x78")); // initialize bit set to 120 (upper bound of our test cases)
        var inputA = [2, 8, 9, 13, 71, 49];
        var inputB = [2, 72, 3, 5, 19, 119];
        var gcdResult = [2, 8, 3, 1, 1, 7];

        for (var i = 0; i < Math.min(inputA.length, inputB.length); i++) {
            expect(findGCDWithCache(inputA[i], inputB[i], gcdBitset)).to.eql(gcdResult[i])
        }
    });
});