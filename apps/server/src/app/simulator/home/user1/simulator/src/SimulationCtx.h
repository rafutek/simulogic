//
// Created by Luc on 03/07/2019.
//

#ifndef UNTITLED_SIMULATIONCTX_H
#define UNTITLED_SIMULATIONCTX_H

#include <string>
#include <vector>
#include <iostream>
#include <iomanip>
#include <fstream>
#include <iterator>
#include <utility>
#include <algorithm>
#include <math.h>


#include "Wire.h"
#include "EqNode.h"
#include "Gate.h"
#include "Timeline.h"
#include "Bloc.h"
#include "Circuit.h"
#include "Event.h"
#include "LogicElement.h"


class SimulationCtx {

public:
    SimulationCtx(std::string inputFileName);
    Timeline* getTimelineAddr();
    void displayWatchedWires();
    Wire* getWireByName(std::string wireName);
    std::vector<std::string> parseLine(std::string line);
    int getStartSimTime(std::string inputFileName);
    int getMaxSimTime(std::string inputFileName);
    std::string getCircuitName(std::string inputFileName);
    std::vector<std::string> getWatchList(std::string inputFileName);
    void initializeFromFile(std::string inputFileName);

private:
    Timeline* m_timeline;
    LogicElement* m_circuitAddr; //Adresse du bloc de plus haut niveau
    std::vector<std::string> m_watchList;
    std::vector<Wire*>* m_wireList;
    std::vector<Gate*>* m_gateMap;


};


#endif //UNTITLED_SIMULATIONCTX_H
