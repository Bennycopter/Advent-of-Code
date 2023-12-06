import { getInput } from "../../shared";

export default function() {
    // Puzzle: https://adventofcode.com/2023/day/6
    
    // Part 1 -- Determine the # of ways we can win each race, then multiply them together
    
    const [timeText, distanceText] = getInput().split("\n");
    const times = timeText.split(/\s+/).slice(1).map(o=>parseInt(o));
    const distances = distanceText.split(/\s+/).slice(1).map(o=>parseInt(o));

    let part1Product = 1;

    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const distance = distances[i];

        const numWaysToWin = calculateNumberOfWaysToWin(time, distance);
        part1Product *= numWaysToWin;
    }

    console.log(part1Product);

    
    // ... your code here
    
    // Part 2 -- Lmao, there was just bad kerning.  There's no spaces.
    const part2Time = parseInt(times.map(o=>o.toFixed()).join(""));
    const part2Distance = parseInt(distances.map(o=>o.toFixed()).join(""));
    console.log(calculateNumberOfWaysToWin(part2Time, part2Distance));

}

function calculateNumberOfWaysToWin(raceTime: number, previousWinnerDistance: number): number {
    let numWaysToWin = 0;
    for (let i = 0; i <= raceTime; i++) {
        const amountOfTimeHeldDown = i;
        const amountOfRunningTime = raceTime - amountOfTimeHeldDown;
        const myDistance = amountOfTimeHeldDown * amountOfRunningTime;
        if (myDistance > previousWinnerDistance)
            numWaysToWin++;
    }
    return numWaysToWin;
}