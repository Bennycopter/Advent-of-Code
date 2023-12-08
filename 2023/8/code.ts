import { getInput } from "../../shared";

export default function() {
    console.log("Test~~~");
    console.log("fast");
    runTodaysProgram(getInput("test-fast"));
    console.log("slow");
    runTodaysProgram(getInput("test-slow"));
    console.log("ghost");
    runTodaysProgram(getInput("test-ghost"));
    console.log();
    console.log("Puzzle~~~");
    runTodaysProgram(getInput("puzzle"));
}

type NodePaths = Record<string, {L: string, R: string}>;

function runTodaysProgram(input: string) {
    // Puzzle: https://adventofcode.com/2023/day/8
    
    // Part 1 --
    // Start from AAA
    // Follow the LR instructions until you hit ZZZ
    
    const lines = input.split("\n");

    const instructions = lines[0];
    const nodePaths = {} as NodePaths;
    for (const line of lines.slice(2)) {
        // Line format: RKX = (NHL, XMM)
        const {source, L, R} = /(?<source>\w{3}) = \((?<L>\w{3}), (?<R>\w{3})\)/.exec(line).groups;
        nodePaths[source] = {L, R};
    }

    if (nodePaths["AAA"])
        console.log(countNodeStepsNeeded(instructions, nodePaths, ["AAA"]));
    else
        console.log("Skipping");
    
    // Part 2 --
    // The puzzle says "Simultaneously start on every node that ends with A.
    // How many steps does it take before you're only on nodes that end with Z?"
    // Instead, I'll just run these instructions on each node that ends with A and take the max.
    const ghostNodes = Object.keys(nodePaths).filter(node=>node.endsWith("A"));
    //console.log(countNodeStepsNeeded(instructions, nodePaths, ghostNodes));
    ghostNodes.forEach(node=>{
        console.log("Ghost", node, countNodeStepsNeeded(instructions, nodePaths, [node]));
    });

    // Apparently, just calculating the LCM of each one separately is good enough.
    // I didn't know these were loops, but okay.
}

function countNodeStepsNeeded(instructions: string, nodePaths: NodePaths, startNodes: string[]) {
    let instructionIndex = 0;
    let currentNodes = startNodes;
    while (currentNodes.some(node=>!node.endsWith("Z"))) {
        const instruction = instructions[instructionIndex % instructions.length];
        currentNodes = currentNodes.map(node=>takeNodeStep(nodePaths, node, instruction));
        instructionIndex++;
        if (instructionIndex % 1000000 === 0)
            console.log(currentNodes.length, instructionIndex)
    }

    return instructionIndex;
}

function takeNodeStep(nodePaths: NodePaths, currentNode: string, instruction: string) {
    return nodePaths[currentNode][instruction];
}