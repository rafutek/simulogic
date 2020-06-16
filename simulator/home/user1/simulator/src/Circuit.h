#ifndef SIMULATION_CIRCUIT_H
#define SIMULATION_CIRCUIT_H

#include <iostream>
#include <string>
#include <vector>
#include "../../../../common/simulator/src/Wire.h"
#include "../../../../common/simulator/src/EqNode.h"
#include "../../../../common/simulator/src/Gate.h"
#include "../../../../common/simulator/src/Timeline.h"
#include "../../../../common/simulator/src/Bloc.h"
#include "../../../../common/simulator/src/LogicElement.h"
#include "../../../../common/simulator/src/TriState.h"
class LatchedAdder : public Bloc {
public:
LatchedAdder(std::vector<Gate*>* gateMapAddr, Timeline* timelineAddr, std::vector<Wire*> inputBloc, std::vector<Wire*> outputBloc, Bloc* containedBy,
std::string name);
};

class EightBitAdder : public Bloc {
public:
EightBitAdder(std::vector<Gate*>* gateMapAddr, Timeline* timelineAddr, std::vector<Wire*> inputBloc, std::vector<Wire*> outputBloc, Bloc* containedBy,
std::string name);
};

class FullAdder : public Bloc {
public:
FullAdder(std::vector<Gate*>* gateMapAddr, Timeline* timelineAddr, std::vector<Wire*> inputBloc, std::vector<Wire*> outputBloc, Bloc* containedBy,
std::string name);
};

class HalfAdder : public Bloc {
public:
HalfAdder(std::vector<Gate*>* gateMapAddr, Timeline* timelineAddr, std::vector<Wire*> inputBloc, std::vector<Wire*> outputBloc, Bloc* containedBy,
std::string name);
};

LogicElement* createCircuit(std::vector<Gate*>* gateMapAddr,Timeline* timelineAddr,std::string name);

#endif