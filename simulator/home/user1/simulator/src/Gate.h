

#ifndef UNTITLED_GATE_H
#define UNTITLED_GATE_H


#include <string>
#include <tuple>
#include <utility>
#include <map>
#include <map>
#include "Wire.h"
#include "LogicElement.h"
#include "Bloc.h"
#include "EqNode.h"




/*
 * Une porte est un élément de logique avec des entrées, des sorties, et des entrées sorties (hérité de la classe
 * LogicElement) qui à une équation logique et un modèle de délais.
 */

class Gate : public LogicElement {

public:
    Gate( std::vector<Wire*> inputs, std::vector<Wire*> outputs, std::map<std::string,std::vector<int>> delay, Bloc* containedBy, std::string name); // for TriState
    Gate( std::vector<Wire*> inputs, std::vector<Wire*> outputs, std::map<std::string,std::vector<int>> delay, std::vector<EqNode> equation);
    Gate( std::vector<Wire*> inputs, std::vector<Wire*> outputs, std::map<std::string,std::vector<int>> delay, std::vector<EqNode> equation,
            Bloc* containedBy, std::string name);
    Gate( std::vector<Wire*> inputs, std::vector<Wire*> outputs, std::vector<Wire*> ios, int delay,
            std::vector<EqNode> equation, Bloc* containedBy, std::string name);
    std::vector<std::tuple<Wire*,State, int>> modifOut(Wire* modifiedInput);
    std::pair<State,int> getOutputState(std::vector<EqNode> equation);
    int getDelay(Wire* modifiedWire, State oldInput, State newInput, State oldOutput, State newOutput);
    virtual ~Gate() = default;



protected:
    std::map<std::string,std::vector<int>> m_delay;         //le delais est entier car on raisonne en millisecondes
    std::vector<EqNode> m_equation;
};


#endif //UNTITLED_GATE_H
