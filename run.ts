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
    // Puzzle: https://adventofcode.com/${year}/day/${day}
    
    // Part 1 -- 
    
    const lines = getInput().split("\\n");
    
    // ... your code here
    
    // Part 2 --
    
}
    
    `.trim());
    fs.writeFileSync(`./${year}/${day}/input.txt`, `Paste input here from https://adventofcode.com/${year}/day/${day}/input`);
}