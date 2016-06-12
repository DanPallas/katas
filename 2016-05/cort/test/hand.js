'use strict';

const Assert = require('assert');
const Lab = require('lab');
const Card = require('../lib/card.js');
const Hand = require('../lib/hand.js');

const lab = exports.lab = Lab.script();

lab.test('it creates a hand from a string of cards', (done) => {

    const input = '2C 3C 4C 8C AC';
    let hand = new Hand(input);
    Assert( hand.toString() === input);
    done();
});

lab.test('it creates a hand from a list of individual cards', (done) => {

    let hand = new Hand();
    const input = '2C 3C 4C 8C AC';
    const tokens = input.split(' ');

    for(let i=0; i < tokens.length; i++){
        hand.pushCard(new Card(tokens[i]));
    }
    Assert( hand.toString() === input);
    done();
});

lab.test('it sorts a hand by face value', (done) => {

    const input = '3C 2S 4C 8D AC';
    const output = 'AC 8D 4C 3C 2S';
    const hand = new Hand(input);

    hand.sortCards();

    Assert( hand.toString() === output);
    done();
});

lab.test('it determines if a hand is a flush', (done) => {

    const input = '2C 3C 4C 8C AC';
    const hand = new Hand(input);

    Assert( hand.isFlush() == true);
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

// determines if a hand is a royal flush by using the ranking function
// as opposed to the tests above that just test utility functions
lab.test('it ranks a hand as a royal flush', (done) => {

    let hand = new Hand('AC QC KC 10C JC');
    hand.rankHand();
    Assert( hand.getRank().name === "royal flush");
    done();
});

lab.test('it ranks a hand as a straight flush', (done) => {

    let hand = new Hand('9C QC KC 10C JC');
    hand.rankHand();
    Assert( hand.getRank().name === "straight flush");
    done();
});

//lab.test('it ranks a hand as four of a kind', (done) => {
//
//    let hand = new Hand('9C 9H 9D 9S JC');
//    hand.rankHand();
//    Assert( hand.getRank().name === "four of a kind");
//    done();
//});

//lab.test('it ranks a hand as a full house', (done) => {
//
//    let hand = new Hand('JS KC KS JC JH');
//    hand.rankHand();
//    Assert( hand.getRank().name === "full house");
//    done();
//});
//
//// determines if a hand is a
//lab.test('it ranks a hand as a straight', (done) => {
//
//    let hand = new Hand('9S QD KH 10C JC');
//    hand.rankHand();
//    Assert( hand.getRank().name === "straight");
//    done();
//});
//
//lab.test('it ranks a hand as three of a kind ', (done) => {
//
//    let hand = new Hand('9C 9H 9D 10C JC');
//    hand.rankHand();
//    Assert( hand.getRank().name === "three of a kind");
//    done();
//});
//
//lab.test('it ranks a hand as two pair', (done) => {
//
//    let hand = new Hand('9C 9H KC KH JC');
//    hand.rankHand();
//    Assert( hand.getRank().name === "");
//    done();
//});
//
//lab.test('it ranks a hand as a pair', (done) => {
//
//    let hand = new Hand('9C 9H KC AC JD');
//    hand.rankHand();
//    Assert( hand.getRank().name === "");
//    done();
//});
//// determines if a hand is high card
//lab.test('it ranks a hand as a high card', (done) => {
//
//    let hand = new Hand('9D QC KC 10C JC');
//    hand.rankHand();
//    Assert( hand.getRank().name === "high card");
//    done();
//});
// compares two hands by face card rank
// compares two straights by face card rank
// compares two flushes by face card rank
// compares two four of a kinds by fours rank
// compares two full houses by trips pair rank
// compares two trips by trip face rank
// compares two two pair hands by high pair, low pair, kicker
// compares two pair by pair rank, then by face card rank