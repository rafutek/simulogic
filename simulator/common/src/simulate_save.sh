#!/bin/sh

[ $# != 3 ] && echo "user, simulator and simulation arguments needed" && exit 1
user=$1
simulator_filename=$2
simulation_filename=$3

# Launch simulation and save result
cd ../../home/$user/simulator/bin || exit 1
[ ! -f $simulator_filename ] && echo "simulator $simulator_filename not found" && exit 1
[ ! -f ../data/$simulation_filename ] && echo "simulation $simulation_filename not found" && exit 1
./$simulator_filename ../data/$simulation_filename > ../out/$simulation_filename
