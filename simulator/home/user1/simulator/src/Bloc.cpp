//
// Created by Luc on 17/05/2019.
//

#include "Bloc.h"

using namespace std;

Bloc::Bloc(std::vector<Wire *> inputs, std::vector<Wire *> outputs) : LogicElement(inputs, outputs) {

}

Bloc::Bloc(std::vector<Wire *> inputs, std::vector<Wire *> outputs, Bloc *containedBy, string name) : LogicElement(inputs,
        outputs, containedBy, name) {

}

Bloc::Bloc(std::vector<Wire *> inputs, std::vector<Wire *> outputs, std::vector<Wire *> ios, Bloc *containedBy, string name)
        : LogicElement(inputs,outputs,ios,containedBy,name) {

}


