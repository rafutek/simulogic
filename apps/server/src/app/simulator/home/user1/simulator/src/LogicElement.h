//
// Created by Luc on 17/05/2019.
//

#ifndef UNTITLED_LOGICELEMENT_H
#define UNTITLED_LOGICELEMENT_H

#include <vector>
#include <string>

using namespace std;

//Pour Eviter l'inclusion circulaire
class Bloc;
class Wire;
class Gate;

class LogicElement
{

public:
    LogicElement(vector<Wire *> inputs, vector<Wire *> outputs);
    LogicElement(vector<Wire *> inputs, vector<Wire *> outputs, LogicElement *containedBy, string name);
    LogicElement(vector<Wire *> inputs, vector<Wire *> outputs, vector<Wire *> ios, LogicElement *containedBy,
                 string name);

    vector<Wire *> getOutputs();
    vector<Wire *> getInputs();
    string getName();

protected:
    string m_name;
    vector<Wire *> m_inputs;
    vector<Wire *> m_outputs;
    vector<Wire *> m_ios;
    LogicElement *m_containedBy; //Normalement seul un bloc peut être contenant mais si on met Bloc* cela pose
                                 // problème dans la definition de getName();
};

#endif //UNTITLED_LOGICELEMENT_H
