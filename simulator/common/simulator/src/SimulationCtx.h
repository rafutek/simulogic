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
#include "createCircuit.h"
#include "Event.h"
#include "LogicElement.h"

class SimulationCtx
{

public:
    SimulationCtx(string inputFileName);
    Timeline *getTimelineAddr();
    void displayWatchedWires();
    Wire *getWireByName(string wireName);

    vector<string> parseLine(string line);
    vector<vector<string>> findAndParseLines(string file_path, string line_name);
    vector<string> findAndParseLine(string file_path, string line_name);
    string findString(string file_path, string string_name);
    int findValue(string file_path, string value_name);
    int getStartSimTime(string inputFileName);
    int getMaxSimTime(string inputFileName);
    string getCircuitName(string inputFileName);
    vector<string> getWatchList(string inputFileName);
    void getEvents(string inputFilePath, int start_time);
    void getClock(string inputFilePath, int start_time, int end_time);

private:
    Timeline *m_timeline;
    LogicElement *m_circuitAddr; //Adresse du bloc de plus haut niveau
    vector<string> m_watchList;
    vector<Wire *> *m_wireList;
    vector<Gate *> *m_gateMap;
};

#endif //UNTITLED_SIMULATIONCTX_H
