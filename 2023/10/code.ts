import { getInput } from "../../shared";

export default function() {
    console.log("Test~~~");
    runTodaysProgram(getInput("test-square"));
    runTodaysProgram(getInput("test-complex"));
    console.log();
    console.log("Puzzle~~~");
    runTodaysProgram(getInput("puzzle"));
    runTodaysProgram(getInput("part-2-1"));
    runTodaysProgram(getInput("part-2-2"));
    runTodaysProgram(getInput("part-2-3"));
}

function runTodaysProgram(input: string) {

    // Puzzle: https://adventofcode.com/2023/day/10
    
    // Part 1 -- 
    const lineLength = input.indexOf("\n");
    const map = input
        .replaceAll("|", "║")
        .replaceAll("-", "═")
        .replaceAll("7", "╗")
        .replaceAll("L", "╚")
        .replaceAll("J", "╝")
        .replaceAll("F", "╔")
        .replaceAll(".", " ")
        .replaceAll("I", " ")
        .replaceAll("O", " ");

    let loopMap = input.replaceAll(/[^\n]/g, " ");

    const start = getCoordsOfCharacter(map, lineLength, "S");

    // Figure out what this start character should be (for the loop map)
    const startDirections = canHeadInDirections(map, lineLength, start.x, start.y);
    const startCharacter = (()=>{
        if (startDirections["N"] && startDirections["E"]) return "╚";
        if (startDirections["N"] && startDirections["W"]) return "╝";
        if (startDirections["N"] && startDirections["S"]) return "║";
        if (startDirections["E"] && startDirections["W"]) return "═";
        if (startDirections["E"] && startDirections["S"]) return "╔";
        if (startDirections["W"] && startDirections["S"]) return "╗";
    })();

    // Two of the pipes surrounding the start are pointing to it
    // Figure out which direction to head next

    // Let's just go the first direction we find, yolo.
    // I don't care if it's inefficient, that pattern above looks cool.

    let {x, y} = start;
    let currentDirection = findStartDirection(map, lineLength, x, y);
    let numSteps = 0;

    do {
        loopMap = replaceCharacterAtPosition(loopMap, lineLength, x, y, getCharacterAtPosition(map, lineLength, x, y));

        //console.log(numSteps, ".", x, ",", y, currentDirection);
        if (currentDirection === "?") {
            console.log("error");
            process.exit();
        }
        switch (currentDirection) {
            case "N": y--; break;
            case "S": y++; break;
            case "W": x--; break;
            case "E": x++; break;
        }
        const newCharacter = getCharacterAtPosition(map, lineLength, x, y);
        if (currentDirection === "E") {
            if (newCharacter === "╝")
                currentDirection = "N";
            if (newCharacter === "╗")
                currentDirection = "S";
        }
        if (currentDirection === "W") {
            if (newCharacter === "╚")
                currentDirection = "N";
            if (newCharacter === "╔")
                currentDirection = "S";
        }
        if (currentDirection === "N") {
            if (newCharacter === "╔")
                currentDirection = "E";
            if (newCharacter === "╗")
                currentDirection = "W";
        }
        if (currentDirection === "S") {
            if (newCharacter === "╚")
                currentDirection = "E";
            if (newCharacter === "╝")
                currentDirection = "W";
        }

        numSteps++;
    } while (!(x === start.x && y === start.y));

    loopMap = loopMap.replace("S", startCharacter);

    console.log("Loop size", numSteps);
    console.log("Half that", numSteps/2);

    // Part 2 -- How many tiles are enclosed in the loop?

    let numInsideSpots = 0;
    for (const loopLine of loopMap.split("\n")) {
        let numInsideSpotsThisLine = 0;
        let isInside = false;
        let numUps = 0;
        let numDowns = 0;
        for (const char of loopLine.split("")) {
            if ("╚║╝".includes(char))
                numUps++;
            if ("╔║╗".includes(char))
                numDowns++;
            isInside = numUps % 2 === 1 || numDowns % 2 === 1;

            if (isInside && char === " ")
                numInsideSpotsThisLine++;
        }
        console.log(loopLine, numInsideSpotsThisLine);
        numInsideSpots += numInsideSpotsThisLine;
    }
    console.log("# inside spots", numInsideSpots);
}

function getCoordsOfCharacter(map: string, lineLength: number, character: string) {
    // First upper-left character is 1, 1;
    return {
        x: map.indexOf(character) % (lineLength+1) + 1,
        y: Math.floor(map.indexOf(character) / (lineLength+1)) + 1,
    };
}

function getCharacterAtPosition(map: string, lineLength: number, x: number, y: number) {
    return map.charAt(
        (y-1)*(lineLength+1)
        +(x-1)
    );
}

function replaceCharacterAtPosition(map: string, lineLength: number, x: number, y: number, replacement: string,) {
    const index = (y-1)*(lineLength+1)+(x-1);
    return map.slice(0, index) + replacement + map.slice(index+1);
}

function canHeadInDirections(map: string, lineLength: number, x: number, y: number) {
    return {
        "N": "╔║╗".includes(getCharacterAtPosition(map, lineLength, x, y-1)),
        "W": "╚═╔".includes(getCharacterAtPosition(map, lineLength, x-1, y)),
        "E": "╝═╗".includes(getCharacterAtPosition(map, lineLength, x+1, y)),
        "S": "╚║╝".includes(getCharacterAtPosition(map, lineLength, x, y+1)),
    };
}

function findStartDirection(map: string, lineLength: number, x: number, y: number): string {
    const canHeadNorth = canHeadInDirections(map, lineLength, x, y)["N"];
    const canHeadWest  = canHeadInDirections(map, lineLength, x, y)["W"];
    const canHeadEast  = canHeadInDirections(map, lineLength, x, y)["E"];
    const canHeadSouth = canHeadInDirections(map, lineLength, x, y)["S"];
    return canHeadNorth && "N" || canHeadWest && "W" || canHeadEast && "E" || canHeadSouth && "S" || "?";
}