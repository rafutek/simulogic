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