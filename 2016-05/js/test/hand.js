'use strict';

const Assert = require('assert');
const Lab = require('lab');
const Card = require('../lib/card.js');
const Hand = require('../lib/hand.js');

const lab = exports.lab = Lab.script();

lab.test('it creates and sorts a hand by face value from a string of cards', (done) => {

    const input = '2C 3C 4C 8C AC';
    const output = 'AC 8C 4C 3C 2C';
    const hand = new Hand(input);
    Assert( hand.toString() === output);
    done();
});

lab.test('it creates and sorts a hand by face value from a list of individual cards', (done) => {

    const hand = new Hand();
    const input = '2C 3C 4C 8C AD';
    const output = 'AD 8C 4C 3C 2C';
    const tokens = input.split(' ');
    for (let i = 0; i < tokens.length; ++i){

        hand.pushCard(new Card(tokens[i]));
    }
    Assert( hand.toString() === output);
    done();
});

lab.test('it determines if a hand is a flush', (done) => {

    const input = '2C 3C 4C 8C AC';
    const hand = new Hand(input);
    Assert( hand.isFlush() === true);
    done();
});

lab.test('it determines if a hand is not a straight', (done) => {

    const input = '10C 2C 4C 8C 5C';
    const hand = new Hand(input);
    Assert( hand.isStraight() === false);
    done();
});

lab.test('it determines if a hand is a straight', (done) => {

    const input = '3C 2C 4C 6S 5C';
    const hand = new Hand(input);
    Assert( hand.isStraight() === true);
    done();
});

lab.test('it determines if a hand is a straight with a low end Ace', (done) => {

    const input = '3C 2C 4C AS 5C';
    const hand = new Hand(input);
    Assert( hand.isStraight() === true);
    done();
});

lab.test('it determines if a hand is not a straight with a low end Ace', (done) => {

    const input = '9C 2C 4C AS 5C';
    const hand = new Hand(input);
    Assert( hand.isStraight() === false);
    done();
});

// determines if a hand is a royal flush by using the ranking function
// as opposed to the tests above that just test utility functions
lab.test('it ranks a hand as a royal flush', (done) => {

    const hand = new Hand('AC QC KC 10C JC');
    Assert( hand.getRank().name === 'royal flush');
    done();
});

lab.test('it ranks a hand as a straight flush', (done) => {

    const hand = new Hand('9C QC KC 10C JC');
    Assert( hand.getRank().name === 'straight flush');
    done();
});

lab.test('it ranks a hand as four of a kind', (done) => {

    const hand = new Hand('9C 9H 9D 9S JC');
    Assert( hand.getRank().name === 'four of a kind');
    done();
});

lab.test('it ranks a hand as a full house', (done) => {

    const hand = new Hand('JS KC KS JC JH');
    Assert( hand.getRank().name === 'full house');
    done();
});

lab.test('it ranks a hand as a straight', (done) => {

    const hand = new Hand('9S QD KH 10C JC');
    Assert( hand.getRank().name === 'straight');
    done();
});

lab.test('it ranks a hand as three of a kind ', (done) => {

    const hand = new Hand('9C 9H 9D 10C JC');
    Assert( hand.getRank().name === 'three of a kind');
    done();
});

lab.test('it ranks a hand as two pair', (done) => {

    const hand = new Hand('9C 9H KC KH JC');
    Assert( hand.getRank().name === 'two pair');
    done();
});

lab.test('it ranks a hand as a pair', (done) => {

    const hand = new Hand('9C 9H KC AC JD');
    Assert( hand.getRank().name === 'pair');
    done();
});

lab.test('it ranks a hand as a high card', (done) => {

    const hand = new Hand('9D QC KC 2C JC');
    Assert( hand.getRank().name === 'high card');
    done();
});

lab.test('it ranks a straight flush with an Ace as low', (done) => {

    const hand = new Hand('5D AD 2D 3D 4D');
    const rank = hand.getRank();
    Assert( rank.description(hand) === 'straight flush: Five high');
    done();
});

lab.test('it ranks a straight flush with an Ace as High as a royal flush', (done) => {

    const hand = new Hand('KD AD JD QD 10D');
    hand.rankHand();
    const rank = hand.getRank();
    Assert( rank.description(hand) === 'royal flush');
    done();
});

lab.test('it ranks and describes a full house', (done) => {

    const hand = new Hand('KD KH KS QD QC');
    const rank = hand.getRank();
    Assert( rank.description(hand) === 'full house: King\'s over Queen\'s');
    done();
});

lab.test('it can sort a hand by Pair rank and then by face value', (done) => {

    const input = '3C 3S 4C 4D AC';
    const output = '4C 4D 3C 3S AC';
    const hand = new Hand(input);
    Assert( hand.toString() === output);
    done();
});

lab.test('it can sort a hand by face value with the same pairRank', (done) => {

    const input = '7C 4C 3S 5D AC';
    const output = 'AC 7C 5D 4C 3S';
    const hand = new Hand(input);
    hand.sortByPairRank();
    Assert( hand.toString() === output);
    done();
});

lab.test('it can sort a hand by face value with the same pairRank, swaping input order', (done) => {

    const input = '3S 7C 4C 5D AC';
    const output = 'AC 7C 5D 4C 3S';
    const hand = new Hand(input);
    hand.sortByPairRank();
    Assert( hand.toString() === output);
    done();
});

lab.test('it doesnt barf with an empty list of ranks', (done) => {

    const input = '7C 4C 3S 5D AC';
    const output = 'AC 7C 5D 4C 3S';
    const hand = new Hand(input);
    hand.ranks = [];
    hand.rankHand();
    Assert( hand.toString() === output);
    done();
});
