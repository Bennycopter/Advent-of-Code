import { getInput } from "../../shared";

export default function() {
    console.log("Test~~~");
    runTodaysProgram(getInput("test"));
    console.log();
    console.log("Puzzle~~~");
    runTodaysProgram(getInput("puzzle"));
}

function runTodaysProgram(input: string) {
    // Puzzle: https://adventofcode.com/2023/day/9
    const lines = input.split("\n").map(o=>new Line(o.split(" ").map(o=>parseInt(o))));
    console.log("Part 1 -", lines.reduce((p,c)=>p+c.getNextNumber(), 0));
    console.log("Part 2 -", lines.reduce((p,c)=>p+c.getPrevNumber(), 0));
}

class Line {
    numbers: number[];

    constructor(numbers: number[]) {
        this.numbers = numbers;
    }

    getNextNumber(): number {
        // If all of my numbers are 0, then my next number is 0
        if (!this.numbers.some(n=>n!==0))
            return 0;

        // If not, then increase my last number by the last number of my child
        return this.numbers.at(-1) + this.getLowerLine().getNextNumber();
    }

    getPrevNumber(): number {
        // Like getNextNumber, but backwards
        if (!this.numbers.some(n=>n!==0))
            return 0;
        return this.numbers.at(0) - this.getLowerLine().getPrevNumber();
    }

    getLowerLine(): Line {
        const numbers = [] as number[];
        for (let i = 1; i < this.numbers.length; i++) {
            numbers.push(this.numbers[i] - this.numbers[i-1]);
        }
        return new Line(numbers);
    }
}