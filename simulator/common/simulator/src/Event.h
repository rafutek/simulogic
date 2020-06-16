//
// Created by Luc on 22/05/2019.
//

#ifndef UNTITLED_EVENT_H
#define UNTITLED_EVENT_H

#include <vector>
#include <string>

class Wire;

//Un Event correspond au passage d'un fil vers un etat à un instant donné

// Creer un oprérateur de comparaison less than et avoir une Timeline qui serait juste un multiset d'évent ?

enum State{
    F = 0,
    T = 1,
    X = 2,
    Z = 3
};

class Event {

public:
    Event(Wire* wire,State state,  int time);
    Event(int time); // Event avec seulement un temps utilisé pour parcourrir la timeline, ne correspond pas à un vrai event
    bool operator <(const Event& rhs) const;
    State getState() const;
    std::string getStateStr() const;
    Wire* getWire() const;
    int getTime() const ;


private:
    State m_state;
    Wire* m_wire;
    int m_time;
};


#endif //UNTITLED_EVENT_H
