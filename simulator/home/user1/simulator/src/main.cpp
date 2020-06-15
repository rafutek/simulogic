#include <iostream>
#include <map>
#include <iterator>
#include <utility>
#include <vector>
#include <set>
#include <tuple>
#include <algorithm>
#include <sys/stat.h>

#include "Wire.h"
#include "Gate.h"
#include "Event.h"
#include "EqNode.h"
#include "Circuit.h"
#include "Sequential.h"
#include "Timeline.h"
#include "SimulationCtx.h"

using namespace std;

bool exists(const string &name)
{
    struct stat buffer;
    return (stat(name.c_str(), &buffer) == 0);
}

int main(int argc, char **argv)
{
    if (argc != 2)
    {
        cout << "You must pass one argument: the simulation file path" << endl;
        return 1;
    }

    const string simulation_filepath = argv[1];
    if (!exists(simulation_filepath))
    {
        cout << "The simulation file does not exist" << endl;
        return 1;
    }

    SimulationCtx *simulationCtx = new SimulationCtx(simulation_filepath);

    Timeline *timelineAddr = simulationCtx->getTimelineAddr();

    while (timelineAddr->getSimulationState())
    {
        vector<const Event *> nextEventVector(timelineAddr->nextEvent()); // Vecteur d'event au prochain timestamp
        for (int i(0); i < (int)nextEventVector.size(); i++)
        { // pour chaque event
            // si l'état du fil est différent du nouvel état ou s'il est produit par des triStates
            if (nextEventVector[i]->getState() != nextEventVector[i]->getWire()->getState() ||
                nextEventVector[i]->getWire()->getConnectedTriStates().size() != 0)
            {
                nextEventVector[i]->getWire()->changeState(
                    nextEventVector[i]); //Change l'etat du fil concerné et le rajoute dans la liste d'event
                vector<Gate *> affectedGate(
                    nextEventVector[i]->getWire()->getConnectedGate()); // Reccupère les portes affectées
                for (int k(0); k < (int)affectedGate.size(); k++)
                { // Pour chacune de ces portes
                    vector<tuple<Wire *, State, int>> newOutputs;
                    if (TriState *triState = dynamic_cast<TriState *>(affectedGate[k]))
                    {
                        newOutputs = triState->modifOut(nextEventVector[i]->getWire());
                    }
                    else if (Sequential *sequential = dynamic_cast<Sequential *>(affectedGate[k]))
                    {
                        newOutputs = sequential->modifOut(nextEventVector[i]->getWire());
                    }
                    else
                    {
                        newOutputs = affectedGate[k]->modifOut(
                            nextEventVector[i]->getWire()); // Reccupère le nouvel etat des ses sorties
                    }
                    for (int j(0); j < (int)newOutputs.size(); j++)
                    {
                        if (get<0>(newOutputs[j]) != nullptr)
                        {
                            timelineAddr->addEvent(get<0>(newOutputs[j]), get<1>(newOutputs[j]),
                                                   get<2>(newOutputs[j])); // ajoute les évènements
                        }
                    }
                }

                // cout << "Nouvel event sur fil : " << nextEventVector[i]->getWire()->getName() << " A t = "
                //      << nextEventVector[i]->getTime()
                //      << " Avec Etat : " << nextEventVector[i]->getStateStr() << endl;
            }
        }
    }

    simulationCtx->displayWatchedWires();
    
    return 0;
}
