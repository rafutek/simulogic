#!/bin/sh

[ $# != 2 ] && echo "user and circuit arguments needed" && exit 1
circuit_filename=$2

# Create C++ circuit
user_dir_from_here="../../../home/user1"
circuit_filepath="$user_dir_from_here/circuitCreator/data/$circuit_filename"
output_path="$user_dir_from_here/simulator/src/"

cd ../circuitCreator/bin || exit 1
common_headers_path="../../../../common/simulator/src/"
java LogicToCpp "$common_headers_path" "$output_path" "$circuit_filepath"

# make simulator
# the Makefile must be in output path
cd "$output_path" || exit 1
make \
    LIB="../../../../common/simulator/lib/simulib.a" \
    HEADERS_PATH="$common_headers_path" \
    PROGRAM="../bin/$circuit_filename" \

