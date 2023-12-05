import { getInput } from "../../shared";

export default function() {
    // Puzzle: https://adventofcode.com/2023/day/5
    
    // Part 1 -- Get the lowest location number for any seed
    
    const sections = getInput().split("\n\n");

    // I assume the sections are:
    // - Seeds
    // - ... everything else in proper order

    const seeds = sections.shift().split(": ")[1].split(/\s+/).map(n=>parseInt(n));

    const mapSets = [] as MapSet[];
    for (const section of sections) {
        mapSets.push(new MapSet(section));
    }

    function getLocationForSeed(seed: number) {
        return mapSets.reduce((source,mapSet)=>{
            return mapSet.convert(source);
        }, seed) as number;
    }

    let part1Answer = Infinity;

    for (const seed of seeds) {
        const locationNumber = getLocationForSeed(seed);
        part1Answer = Math.min(part1Answer, locationNumber);
    }

    console.log(part1Answer);
    
    // ... your code here
    
    // Part 2 -- Surprise!  The seed numbers are actually pairs that describe ranges

    let part2Answer = Infinity;

    for (let i = 0; i < seeds.length; i += 2) {
        const [rangeStart, rangeLength] = [seeds[i], seeds[i+1]];
        for (let j = rangeStart; j < rangeStart + rangeLength; j++) {
            if (j % 1000000 === 0)
                console.log(j, "in", rangeStart, "to", rangeStart + rangeLength)
            part2Answer = Math.min(part2Answer, getLocationForSeed(j));
        }
    }

    console.log(part2Answer);
}

class MapSet {
    maps: Map[];

    constructor(section: string) {
        // The first line of the section is the key, which we can discard.
        this.maps = section.split("\n").slice(1).map(line=>new Map(line));
    }

    convert(number: number) {
        // Test all maps in the set
        // If all return null, then just return the number as normal
        return this.maps.reduce((p,c)=>p??c.convertOrNull(number), null) ?? number;
    }
}

class Map {
    destinationRangeStart: number;
    sourceRangeStart: number;
    rangeLength: number;

    constructor(line: string) {
        [this.destinationRangeStart, this.sourceRangeStart, this.rangeLength] =
            line.split(/\s+/).map(n=>parseInt(n));
    }

    convertOrNull(number: number): number|null {
        if (number < this.sourceRangeStart || number >= this.sourceRangeStart + this.rangeLength)
            return null;

        return (number - this.sourceRangeStart) + this.destinationRangeStart;
    }
}