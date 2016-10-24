#pragma once

#include <string>

namespace rps {
    const std::string ROCK = "rock";
    const std::string PAPER = "paper";
    const std::string SCISSORS = "scissors";

    const std::string& generate_move();
    int compare_moves(const std::string& move1, const std::string& move2);
}

