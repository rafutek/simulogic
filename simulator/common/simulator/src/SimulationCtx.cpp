//
// Created by Luc on 03/07/2019.
//

#include "SimulationCtx.h"

using namespace std;

SimulationCtx::SimulationCtx(string inputFilePath)
{

    int startTime = getStartSimTime(inputFilePath);
    cout << "START_TIME " << startTime << endl;

    int maxTime = getMaxSimTime(inputFilePath);
    cout << "END_TIME " << maxTime << endl;

    string circuitName = getCircuitName(inputFilePath);
    vector<string> watchlist = getWatchList(inputFilePath);

    // cout << circuitName << endl;

    m_gateMap = new vector<Gate *>();

    m_watchList = watchlist;

    m_timeline = new Timeline(startTime, maxTime);

    m_wireList = new vector<Wire *>();

    m_circuitAddr = createCircuit(m_gateMap, m_timeline, circuitName);

    // A la fin de l'initialisation, attribut à chaque fil les portes connectées et les enregistre dans la wireList
    for (int i(0); i < (int)m_gateMap->size(); i++)
    {
        Gate *concernedGate(m_gateMap->at(i));
        vector<Wire *> inputs(concernedGate->getInputs());
        for (int k(0); k < (int)inputs.size(); k++)
        {
            m_wireList->push_back(inputs[k]);
            inputs[k]->addGate(m_gateMap->at(i));
        }
    }

    //Add circuit outputs to the wirelist
    vector<Wire *> outputsCircuit = m_circuitAddr->getOutputs();
    for (int i(0); i < (int)outputsCircuit.size(); i++)
    {
        m_wireList->push_back(outputsCircuit[i]);
    }

    //initialize events
    initializeFromFile(inputFilePath);

    // decrease time by 1 so the simulation takes into acount first events
    m_timeline->increaseTime(-1);
}

Timeline *SimulationCtx::getTimelineAddr()
{
    return m_timeline;
}

/* m_watchList contient le nom des fils à observer, on parcours ensuite la liste des fils du circuit
    * pour réccuperer et afficher les vecteurs d'events de ces fils.
   */

void SimulationCtx::displayWatchedWires()
{
    vector<string> alreadyDisp;
    for (int i(0); i < (int)m_wireList->size(); i++)
    {
        //Si le nom du fil fait partis de la watchList et ne fait pas partis de ceux déjà affiché
        if (find(m_watchList.begin(), m_watchList.end(), m_wireList->at(i)->getName()) != m_watchList.end() && find(alreadyDisp.begin(), alreadyDisp.end(), m_wireList->at(i)->getName()) == alreadyDisp.end())
        {
            // Reccupere le vecteur d'event
            vector<const Event *> eventsOutputs(m_wireList->at(i)->getEventList());
            // cout << "Output " << m_wireList->at(i)->getName() << endl;
            string output_name = m_wireList->at(i)->getName();
            //Affiche les events 1 à 1
            for (int i(0); i < (int)eventsOutputs.size(); i++)
            {
                cout << "EVENT "+ output_name+" "+eventsOutputs[i]->getStateStr()+" " << eventsOutputs[i]->getTime() << endl;
            }
            alreadyDisp.push_back(m_wireList->at(i)->getName());
        }
    }
}

Wire *SimulationCtx::getWireByName(std::string wireName)
{
    for (int i(0); i < (int)m_wireList->size(); i++)
    {
        if (m_wireList->at(i)->getName() == wireName)
        {
            return m_wireList->at(i);
        }
    }
    return nullptr;
}

std::vector<std::string> SimulationCtx::parseLine(string line)
{
    std::vector<std::string> parsedLine;
    std::istringstream iss(line);
    for (std::string line; iss >> line;)
        parsedLine.push_back(line);
    return parsedLine;
}

int SimulationCtx::getStartSimTime(std::string inputFilePath)
{
    string line;
    ifstream infile;
    infile.open(inputFilePath);
    while (!infile.eof()) // To get you all the lines.
    {
        getline(infile, line);
        if (line != "\r")
        {
            vector<string> parsedLine = parseLine(line);
            if (parsedLine[0] == "START_TIME")
            {
                return stoi(parsedLine[1]);
            }
        }
    }
    infile.close();
    return 0;
}

int SimulationCtx::getMaxSimTime(std::string inputFilePath)
{
    string line;
    ifstream infile;
    infile.open(inputFilePath);
    while (!infile.eof()) // To get you all the lines.
    {
        getline(infile, line);
        if (line != "\r")
        {
            vector<string> parsedLine = parseLine(line);
            if (parsedLine[0] == "END_TIME")
            {
                return stoi(parsedLine[1]);
            }
        }
    }
    infile.close();
    return 10000;
}

std::string SimulationCtx::getCircuitName(std::string inputFilePath)
{
    string line;
    ifstream infile;
    infile.open(inputFilePath);
    while (!infile.eof()) // To get you all the lines.
    {
        getline(infile, line);
        if (line != "\r")
        {
            vector<string> parsedLine = parseLine(line);
            if (parsedLine[0] == "CIRCUIT_NAME")
            {
                return parsedLine[1];
            }
        }
    }
    infile.close();
    return "circuit";
}

std::vector<std::string> SimulationCtx::getWatchList(std::string inputFilePath)
{
    string line;
    ifstream infile;
    infile.open(inputFilePath);
    while (!infile.eof()) // To get you all the lines.
    {
        getline(infile, line);
        if (line != "\r")
        {
            vector<string> parsedLine = parseLine(line);
            if (parsedLine[0] == "WATCHLIST")
            {
                parsedLine.erase(parsedLine.begin());
                return parsedLine;
            }
        }
    }
    infile.close();
    return vector<string>();
}

void SimulationCtx::initializeFromFile(std::string inputFilePath)
{
    string line;
    ifstream infile;
    infile.open(inputFilePath);
    int startTime = getStartSimTime(inputFilePath);
    while (!infile.eof()) // To get you all the lines.
    {
        getline(infile, line);
        if (line != "\r")
        {
            vector<string> parsedLine = parseLine(line);
            if (parsedLine[0] == "EVENT")
            {
                Wire *wire = getWireByName(parsedLine[1]);
                State state;
                if (parsedLine[2] == "T")
                {
                    state = T;
                }
                else if (parsedLine[2] == "F")
                {
                    state = F;
                }
                else if (parsedLine[2] == "Z")
                {
                    state = Z;
                }
                else
                {
                    state = X;
                }
                // cout << "EVENT : " << parsedLine[1] << " " << parsedLine[2] << " " << parsedLine[3] << endl;
                m_timeline->addEvent(wire, state, stoi(parsedLine[3]) - startTime);
            }
            else if (parsedLine[0] == "CLOCK")
            {
                cout << line << endl; // print clock line

                // 1st element of clock definition is the name of the wire, 2nd the time o first rise, 3rd the period
                // and 4th the duty cycle (in percentage)
                Wire *wire = getWireByName(parsedLine[1]);
                int time = stoi(parsedLine[2]);
                int timeUp = int(round(stoi(parsedLine[4]) * stoi(parsedLine[3]) / 100));
                int timeDown = stoi(parsedLine[3]) - timeUp;
                int maxSimTime = getMaxSimTime(inputFilePath);

                m_timeline->addEvent(wire, F, 0); // initialize clock to false at the beggining of the simulation
                while (time < maxSimTime)
                {
                    m_timeline->addEvent(wire, T, time - startTime);
                    time += timeUp;
                    m_timeline->addEvent(wire, F, time - startTime);
                    time += timeDown;
                }
            }
        }
    }
    infile.close();
}
