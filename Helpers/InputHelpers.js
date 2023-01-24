const fs = require("fs");
const path = require("path");

const defaultAddressPath = path.join(__dirname, '../Assets/randomAddresses.txt');
const defaultNamePath = path.join(__dirname, '../Assets/randomNames.txt');


const countCharactersInName = (name) => {
    var vowelCount = 0, consonantCount = 0; // represents number of vowels and consonants respectively in word
    const vowels = {a: true, e: true, i: true, o: true, u: true}; // map of vowels

    name.replace(/\W/g, "").split('').map(char => { // reduce string to just alphanumeric charcters then split every character into an array to be mapped through
        if (vowels[char]) {
            vowelCount++; // accumulate vowelCount if match
        } else {
            consonantCount++; // accumulate consonantCount if not vowel match
        }
    });

    return {vowelCount, consonantCount}; // return vowelCount and consonantCount
};


const splitDestinationArrayByLength = (destinationArray) => {
    var evenDestinationArray = [], oddDestinationArray = [];
    destinationArray.map((address, index) => {
        if (address.length % 2 == 0) { // if the destinationAddress length is even push the destinationAddress in the even array
            evenDestinationArray.push({destinationIndex: index, destinationAddress: address});
        } else { // if the destinationAddress length is odd push the destinationAddress in the even array
            oddDestinationArray.push({destinationIndex: index, destinationAddress: address});
        }
    })

    return {evenDestinationArray, oddDestinationArray}; // return both even and odd destinationArrays
};


const readDestinationAddresses = () => {
    var processedAddresses = [];
    try {
        var filename = process.argv[2] ?? defaultAddressPath; // if no second arg read in defaultAddressPath
        processedAddresses = fs.readFileSync(filename, "utf8").toString().toLowerCase().split("\n"); // enforce lowercasing on string and append array for every newline
    } catch (error) {
        console.log(error)
        console.log("Input Addresses Not Valid");
    } finally {
        return processedAddresses; // return destinationArray
    }
};

const readDriverNames = () => {
    var processedNames = [];
    try {
        var filename = process.argv[3] ?? defaultNamePath; // if third arg read in defaultNamePath
        processedNames = fs.readFileSync(filename, "utf8").toString().toLowerCase().split("\n"); // enforce lowercasing on string and append array for every newline
    } catch (error) {
        console.log(error);
        console.Console.log("Input Names Not Valid");
    } finally {
        return processedNames; // return destinationArray
    }
};

// Proccesses the input. Defaults to reading in two local files from ./Assets if args are not provided
const processInput = () => {
    const driverArray = readDriverNames(), destinationArray = readDestinationAddresses(); // read in the array of driver and read in the array of destination addresses
    const {evenDestinationArray, oddDestinationArray} = splitDestinationArrayByLength(destinationArray); // split the destination address into two arrays because even and odd length destinations are score differently

    return {driverArray, destinationArray, evenDestinationArray, oddDestinationArray}; // return the processed arrays
};

module.exports = {processInput, countCharactersInName};