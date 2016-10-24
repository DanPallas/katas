#include "librps.hpp"

#include <random>

namespace rps {
    const std::string& generate_move() {
        static std::default_random_engine generator;
        static std::uniform_int_distribution<int> distribution(1,3);
        switch (distribution(generator)) {
            case 1: return ROCK;
            case 2: return PAPER;
            case 3: return SCISSORS;
            default: throw "random number not 1, 2, or 3";
        }
    }

    void verify_valid(const std::string& move) {
        if (move != ROCK && move != PAPER && move != SCISSORS) {
            throw "attempted to compare invalid move";
        }
    } 

    int compare_moves(const std::string& move1, const std::string& move2) {
        verify_valid(move1);
        verify_valid(move2);
        if (move1 == move2) {
            return 0;
        } else if (move1 == ROCK && move2 == SCISSORS) {
            return 1;
        } else if (move1 == PAPER && move2 == ROCK) {
            return 1;
        } else if (move1 == SCISSORS && move2 == PAPER) {
            return 1;
        } else {
            return -1;
        }
    }
}
