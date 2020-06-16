
#include <iostream>
#include <map>
#include <iterator>
#include <utility>
#include <vector>
#include "Timeline.h"
#include "Wire.h"

using namespace std;


Timeline::Timeline(int startTime, int maxTime) : m_currentTime(startTime), m_maxTime(maxTime), m_simulationState(true),
m_startTime(startTime)
{
    m_eventLine.insert(Event(maxTime+1)); // Déclanchera l'arret de la simulation
}
 /*
  * The timeline is a multiset of event (the events are ordered by comparing happening time, see '<' operator description
  * in Event files.
  * nextEvent return a vector of event having the same happening time.
  */
std::vector<const Event*> Timeline::nextEvent() {
    vector<const Event *> nexEventVector;
    multiset<Event> :: iterator itr;

    int nextEventTime(m_eventLine.upper_bound(Event(m_currentTime))->getTime());
    int numberEvent(m_eventLine.count(Event(nextEventTime))); // Number of Event having the same happening time

    itr = m_eventLine.find(Event(nextEventTime));
    m_currentTime = itr->getTime();
    for(int k(0); k<numberEvent; k++){
        nexEventVector.push_back(&(*itr));
        itr++;
    }

    return nexEventVector;
}



void Timeline::addEvent(Wire *wire, State state, int delay) {
    multiset<Event> :: iterator itr;
    int numberEvent(m_eventLine.count(Event(delay+m_currentTime))); // Number of Event having the same happening time
    itr = m_eventLine.find(Event(delay+m_currentTime)); // itr that will loop on all the event happening at the same time
    for(int k(0); k<numberEvent; k++){
       if(itr->getWire() == wire){ //if an event is happening one the same wire, at the same time, delete it
           m_eventLine.erase(itr);
           break;
       }
        itr++;
    }

    m_eventLine.insert(Event(wire,state,delay+ m_currentTime));
}

//This event is only used to search the multiset and does not represent a real event.
void Timeline::addEvent(Event event) {
    m_eventLine.insert(event);
}


int Timeline::getTime() {
    return m_currentTime;
}

bool Timeline::getSimulationState() {
    if(m_eventLine.upper_bound(m_currentTime)->getTime() > m_maxTime){ //Check if future nextEvent is within simulation time
        m_simulationState = false;                                // if not, (return false) stop the simulation
    }
    return m_simulationState;
}

void Timeline::increaseTime(int addedTime) {
    m_currentTime += addedTime;
}




