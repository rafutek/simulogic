
#include "Gate.h"
#include "EqNode.h"

#include <iostream>
#include <algorithm>
#include <vector>
#include <tuple>
#include <utility>

using namespace std;

//Constructeur d'une porte sans équation pour les TriState
Gate::Gate(std::vector<Wire *> inputs, std::vector<Wire *> outputs, map<string, vector<int>> delay, Bloc *containedBy, string name) : LogicElement(inputs, outputs, containedBy, name)
{
    for (int i(0); i < (int)m_inputs.size(); i++)
    {
        string inputName = m_inputs.at(i)->getSimpleName();
        vector<int> delayModel = delay.find(inputName)->second;
        while (delayModel.size() < 6)
        {
            delayModel.push_back(*min_element(delayModel.begin(), delayModel.end()));
            delayModel.push_back(*max_element(delayModel.begin(), delayModel.end()));
        }
        delay[inputName] = delayModel;
    }
    m_delay = delay;
}

//Constructeur d'une porte simple, pas d'io, pas de bloc contenant, utile pour les tests, inutile en pratique
Gate::Gate(std::vector<Wire *> inputs, std::vector<Wire *> outputs, map<string, vector<int>> delay, std::vector<EqNode> equation) : LogicElement(inputs, outputs), m_equation(equation)
{
    for (int i(0); i < (int)m_inputs.size(); i++)
    {
        string inputName = m_inputs.at(i)->getSimpleName();
        vector<int> delayModel = delay.find(inputName)->second;
        while (delayModel.size() < 6)
        {
            delayModel.push_back(*min_element(delayModel.begin(), delayModel.end()));
            delayModel.push_back(*max_element(delayModel.begin(), delayModel.end()));
        }
        delay[inputName] = delayModel;
    }
    m_delay = delay;
}

Gate::Gate(std::vector<Wire *> inputs, std::vector<Wire *> outputs, map<string, vector<int>> delay, std::vector<EqNode> equation,
           Bloc *containedBy, string name) : LogicElement(inputs, outputs, containedBy, name), m_equation(equation)
{
    for (int i(0); i < (int)m_inputs.size(); i++)
    {
        string inputName = m_inputs.at(i)->getSimpleName();
        vector<int> delayModel = delay.find(inputName)->second;
        while (delayModel.size() < 6)
        {
            delayModel.push_back(*min_element(delayModel.begin(), delayModel.end()));
            delayModel.push_back(*max_element(delayModel.begin(), delayModel.end()));
        }
        delay[inputName] = delayModel;
    }
    m_delay = delay;
}

pair<State, int> Gate::getOutputState(std::vector<EqNode> equation)
{
    State output;
    int compt(0);

    //On va chercher le nombre de noeuds necessaire pour résoudre le noeud actuel
    vector<State> nextNodesStates;
    for (int i(0); i < equation[0].getRequieredNode(); i++)
    {
        vector<EqNode> equationNextNode;
        // Copie l'equation à partir du prochain noeuds pas consomé
        for (int i = compt + 1; i < (int)equation.size(); i++)
            equationNextNode.push_back(equation[i]);
        pair<State, int> nextNode(getOutputState(equationNextNode));
        nextNodesStates.push_back(nextNode.first);
        compt += nextNode.second;
    }
    output = equation[0].computeState(nextNodesStates);
    compt += 1; //Le noeud actuel

    return pair<State, int>(output, compt);
}

//La construction de la boucle principale du simulateur permetrais d'avoir plusieur sortie par porte, d'ou le vecteur de sortie
// mais cette fonctionalité à été bridée pour des raisons de robustesse
std::vector<std::tuple<Wire *, State, int>> Gate::modifOut(Wire *modifiedInput)
{

    tuple<Wire *, State, int> output;

    //Recupère les anciennes et nouvelles valeurs des fils d'entrée sortie pour déterminer la valeur du délay.
    State oldOutput = m_outputs[0]->getState();
    State newOutput = this->getOutputState(m_equation).first;

    State oldInput = modifiedInput->getPreviousState();
    State newInput = modifiedInput->getState();

    int delay = this->getDelay(modifiedInput, oldInput, newInput, oldOutput, newInput);
    output = make_tuple(m_outputs[0], newOutput, delay);

    return vector<tuple<Wire *, State, int>>{output};
}

int Gate::getDelay(Wire *modifiedWire, State oldInput, State newInput, State oldOutput, State newOutput)
{
    //Get the delay vector associated with the modified entry
    string entryName = modifiedWire->getSimpleName();
    vector<int> delayModel = m_delay.find(entryName)->second;

    int delay;
    if (oldOutput == newOutput)
    {
        delay = *min_element(delayModel.begin(), delayModel.end() - 2);
    }
    else if (newOutput == X)
    {
        delay = delayModel.at(4);
    }
    else if (oldOutput == X)
    {
        delay = delayModel.at(5);
    }
    else if (newOutput == Z)
    {
        delay = delayModel.at(0);
    }
    else if (oldOutput == Z)
    {
        delay = delayModel.at(1);
    }
    else if (oldOutput == F || newOutput == T)
    {
        if (oldInput == F)
        {
            delay = delayModel.at(0);
        }
        else if (oldInput == T)
        {
            delay = delayModel.at(1);
        }
    }
    else if (oldOutput == T || newOutput == F)
    {
        if (oldInput == F)
        {
            delay = delayModel.at(2);
        }
        else if (oldInput == T)
        {
            delay = delayModel.at(3);
        }
    }

    return delay;
}
