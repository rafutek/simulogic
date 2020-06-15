//
// Created by Luc on 14/05/2019.
//

#ifndef UNTITLED_EQNODE_H
#define UNTITLED_EQNODE_H

#include "Wire.h"

enum Op{
    inv = 0,
    ou = 1,
    et = 2
};

class EqNode {

public:
    EqNode(Wire*);
    EqNode(Op);
    State computeState(std::vector<State>);
    int getRequieredNode();



private :
    Wire* m_wire;
    int m_compt;
    int m_requieredNode;
    Op m_operator;


};


#endif //UNTITLED_EQNODE_H
