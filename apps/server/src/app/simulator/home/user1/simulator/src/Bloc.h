//
// Created by Luc on 17/05/2019.
//

#ifndef UNTITLED_BLOC_H
#define UNTITLED_BLOC_H

#include "LogicElement.h"


#include <vector>
#include <string>

class Wire;
class Gate;

/* Un bloc peut être composé d'un assemblage de portes et/ou d'autres blocs, il ne contient pas d'équation logique ou
de modèle de délais. Il peut également contenir des fils internes.
 */



class Bloc : public LogicElement{

public:
    //Les blocs au plus haut niveau du circuits ne sont pas contenus dans un bloc
    Bloc(std::vector<Wire*> inputs,std::vector<Wire*> outputs);
    Bloc(std::vector<Wire*> inputs,std::vector<Wire*> outputs, Bloc* containedBy, std::string name);
    Bloc(std::vector<Wire*> inputs,std::vector<Wire*> outputs,std::vector<Wire*> ios, Bloc* containedBy, std::string name);

protected:
    std::vector<Gate*> m_gates;
    std::vector<Bloc*> m_blocs;
    std::vector<Wire*> m_internalWires;

};


#endif //UNTITLED_BLOC_H
