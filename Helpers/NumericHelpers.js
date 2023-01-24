const findGCDWithCache = (a, b, cache = new Array(101).fill(0).map(() => new Set())) => {
    if (!b || cache[a].has(b)) return a;

    const denominator = findGCDWithCache(b, a % b, cache);
    
    if (denominator != 1) cache[a].add(b), cache[b].add(a);
    
    return denominator;
};

module.exports = {findGCDWithCache};