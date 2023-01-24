const findGCDWithCache = (a, b, cache) => {

    if (!b || cache[a].get(b)) return a;

    const denominator = findGCDWithCache(b, a % b, cache);
    
    if (denominator != 1) cache[a].set(b);
    
    return denominator;
};

module.exports = {findGCDWithCache};