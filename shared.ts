import fs from "fs";

export function getYear(): string {
    return process.argv[2];
}

export function getDay(): string {
    return process.argv[3];
}

export function getInput(id: string = null): string {
    const filename = id
        ? `input-${id}.txt`
        : "input.txt";
    return fs.readFileSync(`./${getYear()}/${getDay()}/${filename}`, "utf-8")
        .replaceAll("\r", "");
}

export function sumArray(array: number[]): number {
    return array.reduce((p,c)=>p+c, 0);
}