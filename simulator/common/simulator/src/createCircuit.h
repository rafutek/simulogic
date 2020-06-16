#ifndef SIMULATION_CIRCUIT_H
#define SIMULATION_CIRCUIT_H

#include <iostream>
#include <string>
#include "vector"
#include "Wire.h"
#include "EqNode.h"
#include "Gate.h"
#include "Timeline.h"
#include "Bloc.h"
#include "LogicElement.h"
#include "TriState.h"

LogicElement *createCircuit(std::vector<Gate *> *gateMapAddr, Timeline *timelineAddr, std::string name);

#endif