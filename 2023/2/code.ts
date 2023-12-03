import { getInput } from "../../shared";

export default function() {
    // https://adventofcode.com/2023/day/2

    // Part 1 - Sum the game IDs that are possible with:
    // 12 red cubes
    // 13 green cubes
    // 14 blue cubes

    let part1Sum = 0;
    const lines = getInput().split("\n");
    for (const line of lines) {
        const game = new Game(line);

        if (
            game.getMaxCubesOfColor("red") <= 12 &&
            game.getMaxCubesOfColor("green") <= 13 &&
            game.getMaxCubesOfColor("blue") <= 14
        ) {
            part1Sum += game.id;
        }
    }

    // Part 2 - Get the sum of powers of the minimum set of each game
    let part2Sum = 0;
    for (const line of lines) {
        const game = new Game(line);

        const power = game.getMaxCubesOfColor("red") * game.getMaxCubesOfColor("green") * game.getMaxCubesOfColor("blue");
        part2Sum += power;
    }

    console.log(part1Sum);
    console.log(part2Sum);
}

class Game {
    id: number;
    sets: Set[] = [];

    constructor(line: string) {
        const {groups} = /Game (?<id>\d+): (?<setsText>.*)/.exec(line);
        this.id = parseInt(groups.id);
        const setsTexts = groups.setsText.split("; ");
        for (const setText of setsTexts) {
            this.sets.push(new Set(setText));
        }
    }

    getNumCubesOfColor(color: string) {
        return this.sets.reduce((p,set)=>p+set.colorCounts[color], 0);
    }

    getMaxCubesOfColor(color: string) {
        return this.sets.reduce((p,set)=>Math.max(p, set.colorCounts[color]), 0);
    }
}

class Set {
    colorCounts = {
        blue: 0,
        green: 0,
        red: 0,
    };

    constructor(setText: string) {
        const colorGroups = setText.trim().split(", ");
        for (const colorGroup of colorGroups) {
            const {groups} = /(?<count>\d+) (?<color>[a-z]+)/.exec(colorGroup);
            this.colorCounts[groups.color] = parseInt(groups.count);
        }
    }
}