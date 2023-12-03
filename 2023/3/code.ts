import { getInput } from "../../shared";
import { crayon } from "crayon.js";

export default function() {
    // Puzzle: https://adventofcode.com/2023/day/3
    
    // Part 1 -- Find all part numbers that are next to a symbol, and add them up.

    const lines = getInput().split("\n");
    let part1Sum = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {

        const prevLine = lines[lineIndex - 1];
        const currLine = lines[lineIndex];
        const nextLine = lines[lineIndex + 1];

        const regex = /(\d+)/g;
        let match: RegExpMatchArray;
        while (match = regex.exec(currLine)) {

            const leftPos = Math.max(0, match.index - 1);

            // Get the characters surrounding the match
            let surroundingCharacters = "";
            if (prevLine)
                surroundingCharacters += prevLine.slice(leftPos, match.index + match[0].length + 1);

            surroundingCharacters += currLine.slice(leftPos, match.index);
            surroundingCharacters += currLine.slice(match.index + match[0].length, match.index + match[0].length + 1);

            if (nextLine)
                surroundingCharacters += nextLine.slice(leftPos, match.index + match[0].length + 1);

            // If the surrounding characters contain a part (not "."), then this is a valid part number
            if (/[^.\d]/.test(surroundingCharacters))
                part1Sum += parseInt(match[0]);
        }
    }

    console.log(part1Sum);
    
    // Part 2 -- Gear ratios
    // A gear is a "*" that is adjacent to exactly two numbers
    // The gear ratio of that gear is the product of those two numbers
    // Add up all gear ratios

    const lineLength = lines[0].length;
    const widgets = [] as Widget[];
    const parts = [] as Part[];
    let linePosition = 0;
    for (const line of lines) {
        let match: RegExpMatchArray;
        const regex = /(\d+|[^.\d]+)/g;
        while (match = regex.exec(line)) {
            if (/\D/.test(match[0])) {
                // Widget (* # etc)
                widgets.push(new Widget(match[0], match.index + linePosition));
            }
            else {
                // Part (a numbered part)
                parts.push(new Part(match[0], match.index + linePosition));
            }
        }

        linePosition += lineLength;
    }

    let part2Sum = 0;

    // Find all possible gears
    for (const widget of widgets.filter(w=>w.symbol==="*")) {
        // Find all parts that surround this widget
        const positionsToCheck = [
            widget.position - 1 - lineLength, widget.position - lineLength, widget.position + 1 - lineLength,
            widget.position - 1, widget.position, widget.position + 1,
            widget.position - 1 + lineLength, widget.position + lineLength, widget.position + 1 + lineLength,
        ];
        const coveringParts = parts.filter(p=>positionsToCheck.some(pos=>p.isCoveringPosition(pos)));
        if (coveringParts.length === 2)
            part2Sum += coveringParts[0].number * coveringParts[1].number;
    }

    console.log(part2Sum);
}

class Widget {
    symbol: string;
    position: number;
    constructor(symbol: string, position: number) {
        this.symbol = symbol;
        this.position = position;
    }
}

class Part {
    number: number;
    positions: number[];
    constructor(partNumber: string, position: number) {
        this.number = parseInt(partNumber);
        this.positions = [];
        for (let i = 0; i < partNumber.length; i++)
            this.positions.push(position + i);
    }
    isCoveringPosition(position: number): boolean {
        return this.positions.includes(position);
    }
}