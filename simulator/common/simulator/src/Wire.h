

#ifndef UNTITLED_WIRE_H
#define UNTITLED_WIRE_H


#include <vector>
#include<string>

#include "Event.h"

#include "Bloc.h"

class Gate;

class TriState;



class Wire{

protected:
    static int ID;

public:

    Wire();
    Wire(std::string name,Bloc* containedBy);
    void changeState(const Event* event); //Defined in TriState.cpp
    State getState();
    State getPreviousState();
    bool operator <(const Wire& rhs) const;
    void addGate(Gate* connectedGate);
    std::vector<Gate*> getConnectedGate();
    void addTriState(TriState* connectedTritate);
    std::vector<TriState *> getConnectedTriStates();
    void addEvent(const Event* newEvent);
    std::vector<const Event*> getEventList();
    std::string getName();
    std::string getSimpleName();




private:

    std::string m_name;
    State m_state;
    int m_id;
    std::vector<Gate*> m_connectedGates;
    std::vector<TriState *> m_connectedTristates;
    std::vector<const Event *> m_eventList;
    Bloc* m_containedBy;

};


#endif //UNTITLED_WIRE_H
