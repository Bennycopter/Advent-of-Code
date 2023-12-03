import { getInput } from "../../shared";

export default function() {
    // https://adventofcode.com/2023/day/1

    // Part 1 --
    // The calibration value of each line is formed
    // by the first digit and last digit of each line
    // E.g., a1b2c3d is 13

    // What is the total of all calibration values?
    let partOneSum = 0;

    // Part 2 --
    // Some of the numbers are written out as words
    // E.g., one2three4five should have a calibration value of 15
    // Note: I have to be careful, because lines like this exist: twoneightwo
    let partTwoSum = 0;

    const lines = getInput().split("\n");
    for (const line of lines) {
        partOneSum += parseInt(getFirstAndLastDigits(line).join(""));
        partTwoSum += parseInt(getFirstAndLastDigitsIncludingWords(line).join(""));
    }

    console.log("Part 1 - Calibration value:", partOneSum);
    console.log("Part 2 - Calibration value:", partTwoSum);
}

function getFirstAndLastDigits(line: string): string[] {
    const numbersOnly = line.replaceAll(/\D/g, "");
    const firstDigit = numbersOnly[0];
    const lastDigit = numbersOnly.at(-1);
    return [firstDigit, lastDigit];
}

function getFirstAndLastDigitsIncludingWords(line: string): string[] {
    const numbers = [
        "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ];
    type occurrence = {
        number: string,
        position: number,
    };
    const earlyOccurrences = [] as occurrence[];
    const lateOccurrences = [] as occurrence[];
    for (const number of numbers) {
        if (line.includes(number)) {
            earlyOccurrences.push({
                number,
                position: line.indexOf(number),
            });
            lateOccurrences.push({
                number,
                position: line.lastIndexOf(number),
            });
        }
    }
    earlyOccurrences.sort((a,b)=>a.position-b.position);
    lateOccurrences.sort((a,b)=>a.position-b.position);

    const firstDigit = normalizeNumbers(earlyOccurrences[0].number);
    const lastDigit = normalizeNumbers(lateOccurrences.at(-1).number);

    return [firstDigit, lastDigit];
}

function normalizeNumbers(text: string) {
    text = text.replaceAll("nine", "9");
    text = text.replaceAll("eight", "8");
    text = text.replaceAll("seven", "7");
    text = text.replaceAll("six", "6");
    text = text.replaceAll("five", "5");
    text = text.replaceAll("four", "4");
    text = text.replaceAll("three", "3");
    text = text.replaceAll("two", "2");
    text = text.replaceAll("one", "1");
    return text;
}