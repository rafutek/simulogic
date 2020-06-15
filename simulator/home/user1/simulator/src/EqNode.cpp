//
// Created by Luc on 14/05/2019.
//

#include "EqNode.h"
#include <vector>

using namespace std;

EqNode::EqNode(Wire* wire) : m_wire(wire), m_compt(1), m_requieredNode(0),m_operator(){

}

EqNode::EqNode(Op op) :m_wire(0) {
    if(op==inv){
        m_operator = op;
        m_requieredNode = 1;
        m_compt = 1;
    }
    else if(op==ou){
        m_operator = op;
        m_requieredNode = 2;
        m_compt = 1;
    }
    else if(op==et){
        m_operator = op;
        m_requieredNode = 2;
        m_compt = 1;
    }

}

State EqNode::computeState(vector<State> values) {
    State output;
    if(m_wire!=0){
        output = m_wire->getState();
    }
    else if(m_operator==inv){
        if(values[0]==F){
            output = T;
        } else if(values[0]==T){
            output = F;
        } else {
            output = X;
        }

    } else if(m_operator==ou){
        if(values[0]==T || values[1]==T){
            output = T;
        } else if(values[0]==F && values[1]==F) {
            output = F;
        } else {
            output = X;
        }

    }else if(m_operator==et){
        if(values[0]==F || values[1]==F ){
            output = F;
        } else if(values[0]==T && values[1]==T){
            output = T;
        } else {
            output = X;
        }
    }

    return output;
}



int EqNode::getRequieredNode() {
    return m_requieredNode;
}


