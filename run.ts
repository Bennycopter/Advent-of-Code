import { getYear, getDay } from "./shared";
import fs from "fs";

const year = getYear();
const day = getDay();

if (fs.existsSync(`./${year}/${day}`)) {
    import(`./${year}/${day}/code.ts`)
        .then(module=>module.default!());
}
else {
    console.log(`Initializing ./${year}/${day}`);
    fs.mkdirSync(`./${year}/${day}`, {recursive: true});
    fs.writeFileSync(`./${year}/${day}/code.ts`, `
    
import { getInput } from "../../shared";

export default function() {
    console.log("Test~~~");
    runTodaysProgram(getInput("test"));
    //console.log();
    //console.log("Puzzle~~~");
    //runTodaysProgram(getInput("puzzle"));
}

function runTodaysProgram(input: string) {
    // Puzzle: https://adventofcode.com/${year}/day/${day}
    
    // Part 1 -- 
    
    const lines = input.split("\\n");
    
    // ... your code here
    
    // Part 2 --
}
    
    `.trim());
    fs.writeFileSync(`./${year}/${day}/input-test.txt`, `Paste test input here from https://adventofcode.com/${year}/day/${day}`);
    fs.writeFileSync(`./${year}/${day}/input-puzzle.txt`, `Paste puzzle input here from https://adventofcode.com/${year}/day/${day}/input`);
}