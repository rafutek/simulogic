

#include "Wire.h"


using namespace std;

int Wire::ID = 0; // Start at 0 and get incremented in order to get unique Wire Id

Wire::Wire() : m_state(X)
{
    m_id = ID++;
}

Wire::Wire(std::string name, Bloc* containedBy) : m_state(X), m_name(name), m_containedBy(containedBy)
{
    m_id = ID++;
}




State Wire::getState() {
    return m_state;
}




bool Wire::operator<(const Wire &rhs) const {
    return m_id < rhs.m_id;
}

void Wire::addGate(Gate *newConnectedGate) {
    m_connectedGates.push_back(newConnectedGate);
}

std::vector<Gate *> Wire::getConnectedGate() {
    return m_connectedGates;
}

void Wire::addEvent(const Event* newEvent) {
    m_eventList.push_back(newEvent);
}

std::vector<const Event *> Wire::getEventList() {
    return m_eventList;
}

std::string Wire::getName() {
    string fullname;
    if(m_containedBy != nullptr){
        fullname = m_containedBy->getName();
        fullname.append(".");
    }
    fullname.append(m_name);
    return fullname;
}

void Wire::addTriState(TriState* connectedTritate) {
    m_connectedTristates.push_back(connectedTritate);
}

std::string Wire::getSimpleName() {
    return m_name;
}

State Wire::getPreviousState() {
    if (m_eventList.size() == 0 || m_eventList.size() == 1) {
        return X;
    } else {
        return m_eventList.at(m_eventList.size() - 2)->getState();
    }
}

std::vector<TriState *> Wire::getConnectedTriStates() {
    return m_connectedTristates;
}




