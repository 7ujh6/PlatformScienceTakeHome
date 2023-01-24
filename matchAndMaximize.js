const { BitSet } = require("bitset");
const { PriorityQueue } = require("@datastructures-js/priority-queue");
const { findGCDWithCache } = require("./Helpers/NumericHelpers");
const { countCharactersInName } = require("./Helpers/InputHelpers")
const _= require("lodash");

const calculateAndRankScores = (driverArray, evenDestinationArray, oddDestinationArray, driverTaken, destinationTaken, gcdBitset) => {
    const matchComparator = (match1, match2) => {
        if (match1.score > match2.score)
            return -1; // push match down on queue (towards front)
        return 1; // push match up on queue (towards back)
    }

    const rankedMatchesByVowelScore = new PriorityQueue(matchComparator), rankedMatchesByConsonantScore = new PriorityQueue(matchComparator);
    // using two priority queues to rank driver scores by their vowel score or their consonant score which uses the driver's vowel and consonant count respectively

    driverArray.filter((__, driverIndex) => !_.isEmpty(driverTaken) || !(driverIndex in driverTaken)).map((driver, driverIndex) => {
        const {vowelCount, consonantCount} = countCharactersInName(driver);

        evenDestinationArray.filter(({destinationIndex}) => !_.isEmpty(destinationTaken) || !(destinationIndex in destinationTaken)).map(({destinationIndex, destinationAddress}) => { // filter and map through array of destinations; skipping over any index that has already been processed
            const driverSharesCommonFactor = findGCDWithCache(Math.max(driver.length, destinationAddress.length), Math.min(driver.length, destinationAddress.length), gcdBitset) != 1; // if a gcd is found between a driver and a destination then the suitability score is increased by 1.5
            rankedMatchesByVowelScore.push({driverIndex, destinationIndex, score: vowelCount * (driverSharesCommonFactor ? 2.25 : 1.5)}); // update vowel score to be vowel count * 1.5 times additional 1.5 if the driver shares a common factor with the destination
        });

        oddDestinationArray.filter(({destinationIndex}) => !_.isEmpty(destinationTaken) || !(destinationIndex in destinationTaken)).map (({destinationIndex, destinationAddress}) => { // filter and map through array of destinations; skipping over any index that has already been processed
            const driverSharesCommonFactor = findGCDWithCache(Math.max(driver.length, destinationAddress.length), Math.min(driver.length, destinationAddress.length), gcdBitset) != 1; // if a gcd is found between a driver and a destination then the suitability score is increased by 1.5
            rankedMatchesByConsonantScore.push({driverIndex, destinationIndex, score: consonantCount * (driverSharesCommonFactor ? 1.5 : 1)}); // update consonant score to be consonant count times additional 1.5 if the driver shares a common factor with the destination
        });
    })

    return {rankedMatchesByVowelScore, rankedMatchesByConsonantScore}; // return queues containing randked vowel matches and ranked consonant mathces
};


const generateBestShippingMatchesResult = (rankedMatchesByVowelScore, rankedMatchesByConsonantScore, driverNames, destinationNames, driverTaken, destinationTaken, bestMatches) => {
    var currentMatched = 0, currentScore = 0; // the tabulated score for this iteration

    while (!rankedMatchesByVowelScore.isEmpty() || !rankedMatchesByConsonantScore.isEmpty()) { // process scores while there are still scores in any of the queues

        if (!rankedMatchesByVowelScore.isEmpty() && !rankedMatchesByConsonantScore.isEmpty()) { // both queues are non empty

            if (rankedMatchesByVowelScore.front().score > rankedMatchesByConsonantScore.front()) { // the vowel score is greater than the consonant score
                const {driverIndex, destinationIndex, score} = rankedMatchesByVowelScore.pop();
                if (!(driverIndex in driverTaken) && !(destinationIndex in destinationTaken)) { // check to see if both the driver and destination are not taken (if they are then skip)
                    currentScore += score;
                    currentMatched++;
                    bestMatches.push({driver: driverNames[driverIndex], destination: destinationNames[destinationIndex], driverIndex, destinationIndex, score}); // update the best matches array
                    driverTaken[driverIndex] = true, destinationTaken[destinationIndex] = true; // update the set / map of taken destinations if driver is processed
                }
            } else {
                const {driverIndex, destinationIndex, score} = rankedMatchesByConsonantScore.pop();
                if (!(driverIndex in driverTaken) && !(destinationIndex in destinationTaken)) { // check to see if both the driver and destination are not taken (if they are then skip)
                    currentScore += score;
                    currentMatched++;
                    bestMatches.push({driver: driverNames[driverIndex], destination: destinationNames[destinationIndex], driverIndex, destinationIndex, score});
                    driverTaken[driverIndex] = true, destinationTaken[destinationIndex] = true; //update the set / map of taken destinations if driver is processed
                }
            }
        } else if (!rankedMatchesByVowelScore.isEmpty()) {
            const {driverIndex, destinationIndex, score} = rankedMatchesByVowelScore.pop();
            if (!(driverIndex in driverTaken) && !(destinationIndex in destinationTaken)) { // check to see if both the driver and destination are not taken (if they are then skip)
                currentScore += score;
                currentMatched++;
                bestMatches.push({driver: driverNames[driverIndex], destination: destinationNames[destinationIndex], driverIndex, destinationIndex, score});
                driverTaken[driverIndex] = true, destinationTaken[destinationIndex] = true;//update the set / map of taken destinations if driver is processed
            }
        } else {
            const {driverIndex, destinationIndex, score} = rankedMatchesByConsonantScore.pop();
            if (!(driverIndex in driverTaken) && !(destinationIndex in destinationTaken)) { // check to see if both the driver and destination are not taken (if they are then skip)
                currentScore += score;
                currentMatched++;
                bestMatches.push({driver: driverNames[driverIndex], destination: destinationNames[destinationIndex], driverIndex, destinationIndex, score});
                driverTaken[driverIndex] = true, destinationTaken[destinationIndex] = true; //update the set / map of taken destinations if driver is processed
            }
        }
    }
    
    return {currentMatched, currentScore}; // return the current number of matched shipments this iteration along with the current score
};


const matchAndMaximize = (driverArray, destinationArray, evenDestinationArray, oddDestinationArray, stop=100) => {
    const bestMatches = [], driverTaken = {}, destinationTaken = {}, gcdBitset = new Array(100).fill(new BitSet("0x65"));
    var totalMatched = 0, totalScore = 0;

    for (let iterations=0; totalMatched < Math.min(driverArray.length, destinationArray.length) && iterations < stop; iterations++) { // stop when either specified or all the available drivers / destinations have been processed
        const {rankedMatchesByVowelScore, rankedMatchesByConsonantScore} = calculateAndRankScores(driverArray, evenDestinationArray, oddDestinationArray, driverTaken, destinationTaken, gcdBitset); // rank the value and consonant scores
        const {currentMatched, currentScore} = generateBestShippingMatchesResult(rankedMatchesByVowelScore, rankedMatchesByConsonantScore, driverArray, destinationArray, driverTaken, destinationTaken, bestMatches); // get current interation's total to increment the running totals
        totalMatched+=currentMatched, totalScore+=currentScore;
    }

    return {bestMatches, totalMatched, totalScore}; // this is the response that is returned to the user
};

module.exports = {matchAndMaximize};