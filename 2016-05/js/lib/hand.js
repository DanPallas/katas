'use strict';

const Rank = require('./rank');
const Card = require('./card');

// ====================================
// Hand
//
// we can take a set of cards as input
// in the form of '2C 3C 4C 8C AC'
// or we can or push cards on one at a time
// call rankHand() before
// ====================================
module.exports = class Hand {

    constructor(input) {

        this.cards = [];

        if (typeof input === 'string'){
            const tokens = input.trim().replace(/\s+/g, ' ').split(' ');
            for (let i = 0; i < tokens.length; ++i) {
                this.cards.push(new Card(tokens[i]));
            };
        };

        // a rank has a name, rank, subRank, criteria and description
        this.ranks = [
            new Rank('royal flush', 10,
                (hand) => {

                    // all royal flushes have the same subrank value and are tied
                    return 0;
                },
                (hand) => {

                    // check that both A and K are there in case of a low Ace straight
                    return (hand.isStraight() &&
                    hand.isFlush() &&
                    (hand.cards[0].getCode() === 'A') &&
                    (hand.cards[1].getCode() === 'K'));
                },
                (hand) => {

                    return `${hand.getRank().name}`;
                }
            ),
            new Rank('straight flush', 9,
                (hand) => {

                    // second high cards facevalue (also so we disregard a possible low Ace straight)
                    return hand.cards[2].getValue();
                },
                (hand) => {

                    return (hand.isStraight() && hand.isFlush());
                },
                (hand) => {

                    let results = '';
                    const first = hand.cards[0].getName();
                    const second = hand.cards[1].getName();
                    if ((first === 'Ace') && (second === 'Five')) {
                        results = `${hand.getRank().name}: ${second} high`;
                    }
                    else {
                        results = `${hand.getRank().name}: ${first} high`;
                    }
                    return results;
                }
            ),
            new Rank('four of a kind', 8,
                (hand) => {

                    //face +14^4 + kicker value
                    hand.sortByPairRank();
                    let result = Math.pow( hand.cards[0].getValue() + 14, 4);
                    result += hand.cards[4].getValue();
                    return result;
                },
                (hand) => {

                    return hand.hasFourOfAKind();
                },
                (hand) => {

                    // four fourOfAKindCardName 's
                    hand.sortByPairRank();
                    return `${hand.getRank().name}: four ${hand.cards[0].getName()}'s`;
                }
            ),
            new Rank('full house', 7,
                (hand) => {

                    //tripsFace+14^2 + pairFace
                    hand.sortByPairRank();
                    return Math.pow( hand.cards[0].getValue() + 14, 2) + hand.cards[3].getValue();
                },
                (hand) => {

                    return (hand.hasHighPair() && hand.hasTrips());
                },
                (hand) => {

                    // tripsFace over pairface
                    hand.sortByPairRank();
                    return `${hand.getRank().name}: ${hand.cards[0].getName()}'s over ${hand.cards[3].getName()}'s`;
                }
            ),
            new Rank('flush', 6,
                (hand) => {

                    // same as face rank
                    let result = Math.pow( hand.cards[0].getValue() + 14, 4);
                    result += Math.pow( hand.cards[1].getValue() + 14, 3);
                    result += Math.pow( hand.cards[2].getValue() + 14, 2);
                    result += Math.pow( hand.cards[3].getValue() + 14, 1);
                    result += hand.cards[4].getValue();
                    return result;
                },
                (hand) => {

                    return hand.isFlush();
                },
                (hand) => {

                    return `${hand.getRank().name}: ${hand.cards[0].getCode()} ${hand.cards[1].getCode()} ${hand.cards[2].getCode()} ${hand.cards[3].getCode()} ${hand.cards[4].getCode()}`;
                }
            ),
            new Rank('straight', 5,
                (hand) => {

                    let result = 0;
                    // second high cards facevalue (also so we disregard a possible low Ace straight)
                    if ((hand.cards[0].getCode() === 'A') && (hand.cards[1].getCode() === '5')){
                        // return the 5, rather than the ace
                        result = hand.cards[1].getValue();
                    }
                    else {
                        result = hand.cards[0].getValue();
                    }
                    return result;
                },
                (hand) => {

                    // each faceRank less than previous (or A5432),
                    return hand.isStraight();
                },
                (hand) => {

                    // second high card facevalue (disregarding a possible low Ace)
                    const first = hand.cards[0].getName();
                    return `${hand.getRank().name}: ${first} high`;
                }
            ),
            new Rank('three of a kind', 4,
                (hand) => {

                    hand.sortByPairRank();
                    // face +14 ^3 face^i for i = 1, 0
                    // include the kickers in case we add wildcards in the future
                    // which would enable multiple trips of the same rank
                    let result = Math.pow( hand.cards[0].getValue() + 14, 3);
                    result += Math.pow( hand.cards[3].getValue() + 14, 2);
                    result += Math.pow( hand.cards[4].getValue());
                    return result;
                },
                (hand) => {

                    return hand.hasTrips();
                },
                (hand) => {

                    hand.sortByPairRank();
                    // tripsFace+14^3 + two face values
                    return `${hand.getRank().name}: three ${hand.cards[0].getName()}'s, ${hand.cards[3].getCode()} ${hand.cards[4].getCode()} kickers`;
                }
            ),
            new Rank('two pair', 3,
                (hand) => {

                    //face +14 ^4 + face +14 ^4 + face
                    hand.sortByPairRank();
                    let result = Math.pow( hand.cards[0].getValue() + 14, 4);
                    result += Math.pow( hand.cards[2].getValue() + 14, 4);
                    result += hand.cards[4].getValue();
                    return result;
                },
                (hand) => {

                    hand.sortByPairRank();
                    return hand.hasHighPair() && hand.hasLowPair();
                },
                (hand) => {

                    // highPairFace+14^2 + lowPairFace+14^2 + one face value
                    hand.sortByPairRank();
                    return `${hand.getRank().name}: ${hand.cards[0].getName()}'s over ${hand.cards[2].getName()}'s, ${hand.cards[4].getCode()} kicker`;

                }
            ),
            new Rank('pair', 2,
                (hand) => {

                    hand.sortByPairRank();
                    //face +14 ^4 + face^i for i = 2, 1, 0
                    let result = Math.pow( hand.cards[0].getValue() + 14, 4);
                    result += Math.pow( hand.cards[2].getValue() + 14, 2);
                    result += Math.pow( hand.cards[3].getValue() + 14, 1);
                    result += hand.cards[4].getValue();
                    return result;
                },
                (hand) => {

                    return hand.hasHighPair();
                },
                (hand) => {

                    // pairFace+14^2 + three face values
                    hand.sortByPairRank();
                    return `${hand.getRank().name}: two ${hand.cards[0].getName()}'s, ${hand.cards[2].getCode()} ${hand.cards[3].getCode()} ${hand.cards[4].getCode()} kickers`;
                }
            ),
            new Rank('high card', 1,
                (hand) => {

                    // face+14^i
                    let result = Math.pow( hand.cards[0].getValue() + 14, 4);
                    result += Math.pow( hand.cards[1].getValue() + 14, 3);
                    result += Math.pow( hand.cards[2].getValue() + 14, 2);
                    result += Math.pow( hand.cards[3].getValue() + 14, 1);
                    result += hand.cards[4].getValue();
                    return result;
                },
                (hand) => {

                    //criteria: high card is always true
                    return true;
                },
                (hand) => {

                    // up to five face values
                    return `${hand.getRank().name}: ${hand.cards[0].getName()}`;
                }
            )
        ];

        this.rankHand();
    };

    pushCard(card) {

        this.cards.push(card);
        this.rankHand();
    };

    rankHand() {

        // only rank the hand if there are 5 cards
        if (this.cards.length === 5){
            // sort the cards
            this.sortByFaceValue();

            this.assignPairRanks();

            // resort the cards by pairRank
            this.sortByPairRank();

            // for each rank in ranks
            // pass this hand into the criteria function from highest to lowest
            // and when we find a match we break out and return it
            for (let i = 0; i < this.ranks.length; ++i){

                if (this.ranks[i].criteria(this) === true){
                    this.rank = this.ranks[i];
                    break;
                }
            };
        }
    };

    sortByFaceValue() {

        this.cards.sort((card1, card2) => {

            return (card2.getValue() - card1.getValue());
        });
    };

    assignPairRanks() {

        // then give each card a pairRank
        const numCards = this.cards.length;
        for ( let i = 0; i < numCards; ++i){

            const faceValue = this.cards[i].getValue();
            let count = 0;
            let iPointer = i;
            while ((iPointer < numCards) && faceValue === this.cards[iPointer].getValue() ) {
                count++;
                iPointer++;
            };
            for (let j = i; j < iPointer; ++j){

                this.cards[j].setPairRank(count);
            };
            i = iPointer - 1;
        };
    };

    // Makes it so that 3 or four of a kind
    // will be higher (to the left) of a pair
    // even if the pair or a kicker has a higher face value
    // this will make accessing the values easier
    // and wont affect straights or flushes or faceRank
    // as those cards will all have the same pairRank
    sortByPairRank() {

        this.cards.sort( (card1, card2) => {

            let results = 0;
            if (card2.getPairRank() < card1.getPairRank() ) {
                results = -1;
            }
            else if (card2.getPairRank() > card1.getPairRank()){
                results = 1;
            }
            else {
                // when tied continue to rank by regular value
                if (card2.getValue() < card1.getValue() ) {
                    results = -1;
                // we should never get here since we always sort by face value first
                //} else if(card2.getValue() > card1.getValue()){
                //    return 1;
                }
                else {
                    // then it really is a tie
                    results = 0;
                }
            }
            return results;
        });
    };

    // true if there is either one or two pair
    hasHighPair() {

        let result = false;
        const numPair = this.cards.filter((card) => card.getPairRank() === 2).length;
        if (numPair >= 1){
            result = true;
        }
        return result;
    };

    // only true if there are two pair
    // so there will be 4 cards total with pairRank of 2
    hasLowPair() {

        let result = false;
        if (this.cards.filter((card) => card.getPairRank() === 2).length === 4){
            result = true;
        }
        return result;
    };

    hasTrips() {

        let result = false;
        if (this.cards.some((card) => card.getPairRank() === 3)){
            result = true;
        }
        return result;
    };

    hasFourOfAKind() {

        let result = false;
        if (this.cards.some((card) => card.getPairRank() === 4)){
            result = true;
        }
        return result;
    };

    isStraight() {

        let result = true;
        this.sortByFaceValue();
        // check high and low ace straights
        // which means that either every card
        // has a face value that is lower than it's leftmost sibling by 1
        // or its an A 5 4 3 2 after being sorted

        // if its an A 5 sequence
        if ((this.cards[0].getCode() === 'A' ) && ((this.cards[1].getCode() === '5') )){
            // try the 5 4 3 2 part
            for (let i = 1; i < this.cards.length - 1; ++i){

                if (this.cards[i].getValue() !== this.cards[i + 1].getValue() + 1 ){
                    result = false;
                };
            }
        }
        else {
            // otherwise we test for all the other straights
            for (let i = 0; i < this.cards.length - 1; ++i){

                if (this.cards[i].getValue() !== this.cards[i + 1].getValue() + 1 ){
                    result = false;
                };
            }
        };
        // if we get through all that it's  a straight
        return result;
    };

    isFlush() {

        let result = false;
        if (this.cards.every( (card) => card.suit.getName() === 'Diamonds') ||
            this.cards.every( (card) => card.suit.getName() === 'Hearts') ||
            this.cards.every( (card) => card.suit.getName() === 'Spades') ||
            this.cards.every( (card) => card.suit.getName() === 'Clubs')) {
            result = true;
        };
        return result;
    };

    getRank() {

        return this.rank;
    };

    getRankValue() {

        return this.rank.rank;
    };

    getSubRank() {

        return this.rank.subRank(this);
    };

    getShowdownResults(hand) {

        return this.rank.description(this);
    };

    toString() {

        let result = '';
        for (let i = 0; i < this.cards.length; ++i) {

            result = result += this.cards[i].toString();
            if (i < this.cards.length - 1){
                result = result + ' ';
            }
        }
        return result;
    };
};

