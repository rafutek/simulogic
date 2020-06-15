#!/bin/sh

[ $# != 2 ] && echo "user and circuit arguments needed" && exit 1
user=$1
circuit_filename=$2

# Create C++ circuit
cd circuitCreator/bin || exit 1
userCircuitData="../../../../home/$user/circuitCreator/data"
[ ! -f $userCircuitData/$circuit_filename ] && echo "circuit $circuit_filename not found" && exit 1
java LogicToCpp $user $userCircuitData/$circuit_filename

# make simulator
userSimulatorSrc="../../../../home/$user/simulator/src"
cd $userSimulatorSrc
make PROGRAM="$circuit_filename"
