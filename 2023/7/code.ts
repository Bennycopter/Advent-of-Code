import { getInput } from "../../shared";

const HAND_SIZE = 5;
let cardTypesInOrder: string; // modified multiple times during the program
let isJokerAWildcard: boolean;
const sortingFunctionsByOrderWeights = [
    isHandFiveOfAKind,
    isHandFourOfAKind,
    isHandFullHouse,
    isHandThreeOfAKind,
    isHandTwoPair,
    isHandOnePair,
];

export default function() {
    console.log("Test~~~");
    runTodaysProgram(getInput("test"));
    console.log();
    console.log("Puzzle~~~");
    runTodaysProgram(getInput("puzzle"));
}

function runTodaysProgram(input: string) {
    // Puzzle: https://adventofcode.com/2023/day/7

    // Part 1 -- Sort hands
    cardTypesInOrder = "AKQJT98765432";
    isJokerAWildcard = false;

    const hands = input.split("\n").map(line=>new Hand(line));

    function getWinnings() {
        hands.sort((a,b)=>{
            const aWeight = getOrderWeightOfHand(a);
            const bWeight = getOrderWeightOfHand(b);
            if (aWeight > bWeight)
                return 1;
            if (aWeight < bWeight)
                return -1;

            // Compare the cards in order from left to right
            for (let i = 0; i < HAND_SIZE; i++) {
                const aValue = getCardValue(a.cards[i]);
                const bValue = getCardValue(b.cards[i]);
                if (aValue > bValue)
                    return 1;
                if (aValue < bValue)
                    return -1;
            }

            return 0;
        });

        let winnings = 0;
        for (let handIndex = 0; handIndex < hands.length; handIndex++) {
            const rank = handIndex + 1;
            const hand = hands[handIndex];
            winnings += rank * hand.bid;
        }
        return winnings;
    }

    console.log(getWinnings());

    // Part 2 -- J cards are now Jokers, and they can do anything, but they are worth less.  Yikes.
    cardTypesInOrder = "AKQT98765432J";
    isJokerAWildcard = true;
    console.log(getWinnings());
}

class Hand {
    cards: string;
    bid: number;
    numCardsPerType: Record<string, number> = {};
    numCardsPerTypeWithWildcards: Record<string, number> = {};
    constructor(line: string) {
        // format: JK5QK 838
        const [cards, bid] = line.split(" ");
        this.cards = cards;
        this.bid = parseInt(bid);

        // Count number of cards
        for (const cardType of cardTypesInOrder.split("")) {
            this.numCardsPerType[cardType] = 0;
            this.numCardsPerTypeWithWildcards[cardType] = 0;
        }
        for (const cardType of this.cards.split("")) {
            this.numCardsPerType[cardType]++;
            this.numCardsPerTypeWithWildcards[cardType]++;
        }

        // Turn Jokers into wildcards
        if (this.numCardsPerTypeWithWildcards["J"] > 0) {
            // Decrease Jokers
            const numJokers = this.numCardsPerTypeWithWildcards["J"];
            this.numCardsPerTypeWithWildcards["J"] = 0;

            // Increase the highest other
            const highestCardType = Object.entries(this.numCardsPerTypeWithWildcards)
                .filter(pair=>pair[0]!=="J")
                .sort((a,b)=>b[1]-a[1])
                .map(pair=>pair[0])
                .at(0);
            this.numCardsPerTypeWithWildcards[highestCardType] += numJokers;
        }
    }

    getIndividualCardCountNumbers(): number[] {
        return Object.values(isJokerAWildcard ? this.numCardsPerTypeWithWildcards : this.numCardsPerType);
    }
}

function getOrderWeightOfHand(hand: Hand) {
    for (let i = 0; i < sortingFunctionsByOrderWeights.length; i++) {
        if (sortingFunctionsByOrderWeights[i](hand))
            return sortingFunctionsByOrderWeights.length - i;
    }
    return 0;
}

function getCardValue(card: string) {
    // assumes valid input
    return cardTypesInOrder.length - cardTypesInOrder.indexOf(card);
}

// Lower-order functions don't care about the possibility of higher-order functions being true.
// E.g., a hand with AA222 will have isHandOnePair return true, even though it's a full house

function isHandFiveOfAKind(hand: Hand) {
    return hand.getIndividualCardCountNumbers().includes(5);
}


function isHandFourOfAKind(hand: Hand) {
    return hand.getIndividualCardCountNumbers().includes(4);
}


function isHandFullHouse(hand: Hand) {
    // Full house is 3 of a kind and 2 of a kind
    return hand.getIndividualCardCountNumbers().includes(3)
        && hand.getIndividualCardCountNumbers().includes(2);
}


function isHandThreeOfAKind(hand: Hand) {
    return hand.getIndividualCardCountNumbers().includes(3);
}


function isHandTwoPair(hand: Hand) {
    return hand.getIndividualCardCountNumbers().filter(num=>num===2).length === 2;
}


function isHandOnePair(hand: Hand) {
    return hand.getIndividualCardCountNumbers().includes(2);
}