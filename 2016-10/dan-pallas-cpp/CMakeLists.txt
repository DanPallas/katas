cmake_minimum_required(VERSION 3.5)
project(rpsgame)
set(BUILD_SHARED_LIBS FALSE)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14 -Werror -Wall")

include_directories(BEFORE ./librps/)
add_executable(rpsserver 
    ./server/server.cpp
    ./shared/librps.cpp)
