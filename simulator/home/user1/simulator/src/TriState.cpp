//
// Created by Luc on 16/07/2019.
//

#include "TriState.h"
#include <vector>

using namespace std;

//Le fil de decision rentre dans les inputs du Tri puisque il provoque un changement à la sortie
TriState::TriState(Timeline *timelineAddr, Wire *input, Wire *decision, Wire *output, map<string, vector<int>> delay, Bloc *containedBy, string name) : Gate({input, decision}, {output}, delay, containedBy, name), m_decisionWire(decision), m_timelineAddr(timelineAddr)
{
    m_outputs[0]->addTriState(this);
}

std::vector<std::tuple<Wire *, State, int>> TriState::modifOut(Wire *modifiedInput)
{
    State outputState;
    if (m_decisionWire->getState() == T)
    {
        outputState = m_inputs[0]->getState();
    }
    else if (m_decisionWire->getState() == F)
    {
        outputState = Z;
    }
    else
    {
        outputState = X;
    }

    // State oldOutput = m_outputs[0]->getState();
    State newOutput = outputState;

    State oldInput = modifiedInput->getPreviousState();
    State newInput = modifiedInput->getState();

    int delay = getDelay(modifiedInput, oldInput, newInput, oldInput, newOutput);
    //We insert a change in
    m_outputStateHis.insert(pair<int, State>(m_timelineAddr->getTime() + delay, outputState));
    return {make_tuple(m_outputs[0], outputState, delay)};
}

State TriState::getCurrentOutputState()
{
    map<int, State>::iterator itr;
    itr = m_outputStateHis.upper_bound(m_timelineAddr->getTime()); //get the iterator to point directly after the current time
    if (m_outputStateHis.size() != 0)
    {
        itr--; //So the iterator point at the current state
    }
    if (itr != m_outputStateHis.end())
    {
        return itr->second;
    }
    else
    {
        return X;
    }
}

void Wire::changeState(const Event *event)
{
    State newState = event->getState();
    //If the wire has no TriState connected to it, it takes the next events states and the event is added to it's event list
    if (m_connectedTristates.size() == 0)
    {
        m_state = newState;
        this->addEvent(event);
    }
    else
    { //If there are Tristates connected to the wire, either all of them are retruning Z states and the wire takes Z states,
        // or all of them are Z states but one so the wire takes this state, or more than one arn't in Z and returning different values
        // then the output is undetermined.
        State stateFromTri(Z);
        for (int i(0); i < (int)m_connectedTristates.size(); i++)
        {
            if (m_connectedTristates[i]->getCurrentOutputState() != Z && stateFromTri == Z)
            {
                stateFromTri = m_connectedTristates[i]->getCurrentOutputState();
            }
            else if (m_connectedTristates[i]->getCurrentOutputState() != Z && stateFromTri != Z && m_connectedTristates[i]->getCurrentOutputState() != stateFromTri)
            {
                stateFromTri = X;
            }
        }
        m_state = stateFromTri;
        Event *newEvent = new Event(event->getWire(), stateFromTri, event->getTime());
        this->addEvent(newEvent);
    }
}
