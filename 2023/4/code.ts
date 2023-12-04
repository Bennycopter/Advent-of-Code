import { getInput } from "../../shared";

export default function() {
    // Puzzle: https://adventofcode.com/2023/day/4
    
    // Part 1 -- How many points are all the cards worth?

    let part1Sum = 0;
    
    const lines = getInput().split("\n");

    const cards = [] as Card[];

    for (const line of lines) {
        const card = new Card(line);
        cards.push(card);
        part1Sum += card.calculatePoints();
    }
    
    // Part 2 -- Make copies of cards after each winner based on how many matching numbers the winning card had
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
        const card = cards[cardIndex];
        const otherStartIndex = cardIndex+1;
        const otherEndIndex = Math.min(cards.length, otherStartIndex + card.numMyWinningNumbers());
        for (let i = 0; i < card.numCards; i++) {
            for (let otherIndex = otherStartIndex; otherIndex < otherEndIndex; otherIndex++) {
                const otherCard = cards[otherIndex];
                otherCard.numCards++;
            }
        }
    }

    const part2Sum = cards.map(card=>card.numCards).reduce((p,c)=>p+c);

    console.log("Part 1", part1Sum);
    console.log("Part 2", part2Sum);
}

class Card {
    id: number;
    winningNumbers: number[];
    myNumbers: number[];
    numCards = 1;

    constructor(line: string) {
        // Format: Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        const {groups} = /Card\s+(?<id>\d+): (?<winningNumbers>[\d\s]+) \| (?<myNumbers>[\d\s]+)/.exec(line);
        this.id = parseInt(groups.id);
        this.winningNumbers = groups.winningNumbers.trim().split(/\s+/).map(n=>parseInt(n));
        this.myNumbers = groups.myNumbers.trim().split(/\s+/).map(n=>parseInt(n));
    }

    numMyWinningNumbers() {
        return this.myNumbers.filter(n=>this.winningNumbers.includes(n)).length;
    }

    calculatePoints() {
        // First one is worth 1
        // Each one thereafter doubles the points
        // It's power-of-two, so I can use that

        const numMyWinningNumbers = this.numMyWinningNumbers();

        if (numMyWinningNumbers)
            return Math.pow(2, numMyWinningNumbers - 1);

        return 0;
    }
}