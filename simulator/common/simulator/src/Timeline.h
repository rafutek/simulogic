

#ifndef UNTITLED_TIMELINE_H
#define UNTITLED_TIMELINE_H

#include <map>
#include <iterator>
#include <utility>
#include <vector>
#include <set>
#include "Wire.h"
#include "Event.h"


class Timeline {

public:
    Timeline(int startTime, int maxTime);
    std::vector<const Event *>  nextEvent(); //return const because of find() methode that return const
    int getTime();
    bool getSimulationState();
    void addEvent(Wire* wire, State state, int time);
    void addEvent(Event event);
    void increaseTime(int addedTime);

private:
    // La liste d'event est une map ordonée de pair <fil, valeur prise>, le vecteur permet de prendre en compte le cas ou plusieurs
    // events se produiraient en même temps
    std::multiset<Event> m_eventLine;
    int m_currentTime;
    int m_startTime;
    int m_maxTime;
    bool m_simulationState;

};


#endif //UNTITLED_TIMELINE_H
