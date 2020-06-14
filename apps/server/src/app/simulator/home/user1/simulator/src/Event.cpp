//
// Created by Luc on 22/05/2019.
//

#include "Event.h"

using namespace std;

Event::Event(Wire *wire,State state, int time) : m_state(state), m_wire(wire), m_time(time) {

}

Event::Event(int time) : m_time(time){

}

State Event::getState() const {
    return m_state;
}

string Event::getStateStr() const {
    string out;
    if( m_state == F){
        out = "F";
    } else if(m_state == T){
        out = "T";
    } else if(m_state == X){
        out = "X";
    } else {
        out = "Z";
    }

    return out;
}

Wire *Event::getWire() const{
    return m_wire;
}

int Event::getTime() const {
    return m_time;
}

// Opérateur de comparaison, les Event sont classé enfonction de leur temps (utile pour la timeline)
bool Event::operator<(const Event &rhs) const {
    return m_time < rhs.m_time;
}


