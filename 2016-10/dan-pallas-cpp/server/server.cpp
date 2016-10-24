#include <cstdlib>
#include <iostream>
#include <sstream>
#include <string>
#include <zmqpp/zmqpp.hpp>
#include "../shared/librps.hpp"

using namespace std;

int play_game(zmqpp::socket& socket) {
    auto my_move = rps::generate_move();
    cout << "Me: " << my_move << endl;
    zmqpp::message your_move;
    socket.receive(your_move, false);
    zmqpp::message my_move_message;
    my_move_message << my_move;
    socket.send(my_move_message);
    cout << "You: " << your_move.get(0) << endl;
    int result = rps::compare_moves(my_move, your_move.get(0));
    cout << "Winner: " << (result > 0 ? "Me" : (result < 0 ? "You" : "Tie")) << endl; 
    return result;
}

int main(int argc, char* argv[]) {
    char* port;
    if (!(port = getenv("PORT"))) {
        cout << "environment variable PORT must be set" << endl;
        return EXIT_FAILURE;
    }
    int games;
    if (char* port = getenv("GAMES")) {
        games = stoi(port);
    } else {
        cout << "environment variable GAMES must be set" << endl;
        return EXIT_FAILURE;
    }
    
    zmqpp::context context;
    zmqpp::socket_type type = zmqpp::socket_type::pair;
    zmqpp::socket socket(context, type);
    string endpoint = (ostringstream() << "tcp://*:" << port).str();
    cout << "Games to play: 3" << endl;
    cout << "Socket: " << endpoint << endl;
    zmqpp::message message;
    socket.receive(message);
    string text;
    int number;
    message >> text >> number;
    return EXIT_SUCCESS;
}
