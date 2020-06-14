//
// Created by Luc on 16/07/2019.
//

#ifndef UNTITLED_TRISTATE_H
#define UNTITLED_TRISTATE_H

#include <map>
#include "Gate.h"
#include "Timeline.h"


class TriState : public Gate {

public :
    TriState(Timeline* timelineAddr, Wire* input, Wire* decision, Wire* output, std::map<std::string,std::vector<int>> delay, Bloc* containedBy, std::string name);
    std::vector<std::tuple<Wire*,State, int>> modifOut(Wire* modifiedInput);//
    State getCurrentOutputState();

private:
    Wire* m_decisionWire;
    Timeline* m_timelineAddr;
    std::map<int,State> m_outputStateHis;
};


#endif //UNTITLED_TRISTATE_H
