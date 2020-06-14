//
// Created by Luc on 17/05/2019.
//

#include "LogicElement.h"

using namespace std;

LogicElement::LogicElement(vector<Wire *> inputs, vector<Wire *> outputs) :
m_inputs(inputs), m_outputs(outputs)
{

}

LogicElement::LogicElement(vector<Wire *> inputs, vector<Wire *> outputs, LogicElement  *containedBy, string name) :
m_inputs(inputs), m_outputs(outputs), m_containedBy(containedBy), m_name(name)
{

}

LogicElement::LogicElement(vector<Wire *> inputs, vector<Wire *> outputs, vector<Wire *> ios, LogicElement *containedBy
,string name):
m_inputs(inputs), m_outputs(outputs), m_ios(ios) , m_containedBy(containedBy), m_name(name)
{

}

std::vector<Wire *> LogicElement::getOutputs() {
    return m_outputs;
}

std::vector<Wire *> LogicElement::getInputs() {
    return m_inputs;
}

std::string LogicElement::getName() {
    string fullname;
    if(m_containedBy != nullptr){
        fullname = m_containedBy->getName();
        fullname.append(".");
    }
    fullname.append(m_name);
    return fullname;
}
