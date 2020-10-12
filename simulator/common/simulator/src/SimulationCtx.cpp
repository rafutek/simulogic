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
    getClock(inputFilePath, startTime, maxTime);
    getEvents(inputFilePath, startTime);

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
            string output_name = m_wireList->at(i)->getName();
            //Affiche les events 1 à 1
            for (int i(0); i < (int)eventsOutputs.size(); i++)
            {
                cout << "EVENT " + output_name + " " + eventsOutputs[i]->getStateStr() + " " << eventsOutputs[i]->getTime() << endl;
            }
            alreadyDisp.push_back(m_wireList->at(i)->getName());
        }
    }
}

Wire *SimulationCtx::getWireByName(string wireName)
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

vector<string> SimulationCtx::parseLine(string line)
{
    vector<string> parsedLine;
    istringstream iss(line);
    for (string line; iss >> line;)
        parsedLine.push_back(line);
    return parsedLine;
}

void printParsedLine(vector<string> parsed_line)
{
    for (size_t i = 0; i < parsed_line.size(); i++)
    {
        if (i != parsed_line.size() - 1)
        {
            cout << parsed_line[i] << ' ';
        }
        else
        {
            cout << parsed_line[i] << '\n';
        }
    }
}

vector<vector<string>> SimulationCtx::findAndParseLines(string file_path, string line_name)
{
    vector<vector<string>> parsed_lines;
    string line;
    ifstream infile;
    infile.open(file_path);
    while (!infile.eof())
    {
        getline(infile, line);
        if (!line.empty())
        {
            vector<string> parsed_line = parseLine(line);
            if (!parsed_line.empty() && parsed_line[0] == line_name)
            {
                parsed_lines.push_back(parsed_line);
            }
        }
    }
    infile.close();
    return parsed_lines;
}

vector<string> SimulationCtx::findAndParseLine(string file_path, string line_name)
{
    vector<string> parsed_line;
    vector<vector<string>> parsed_lines = findAndParseLines(file_path, line_name);
    if (!parsed_lines.empty())
    {
        parsed_line = parsed_lines[parsed_line.size()];
    }
    return parsed_line;
}

string SimulationCtx::findString(string file_path, string string_name)
{
    string s;
    vector<string> parsed_line = findAndParseLine(file_path, string_name);
    if (parsed_line.size() > 1 && !parsed_line[1].empty())
    {
        s = parsed_line[1];
    }
    return s;
}

int SimulationCtx::findValue(string file_path, string value_name)
{
    int value = -1;
    string val_str = findString(file_path, value_name);
    int val = stoi(val_str);
    if (!isnan(val))
    {
        value = val;
    }
    return value;
}

int SimulationCtx::getStartSimTime(string inputFilePath)
{
    int start = findValue(inputFilePath, "START_TIME");
    if (start == -1)
    {
        start = 0;
    }
    return start;
}

int SimulationCtx::getMaxSimTime(string inputFilePath)
{
    int end = findValue(inputFilePath, "END_TIME");
    if (end == -1)
    {
        end = 10000;
    }
    return end;
}

string SimulationCtx::getCircuitName(string inputFilePath)
{
    string circuit = findString(inputFilePath, "CIRCUIT_NAME");
    if (circuit.empty())
    {
        circuit = "circuit";
    }
    return circuit;
}

vector<string> SimulationCtx::getWatchList(string inputFilePath)
{
    vector<string> parsed_line = findAndParseLine(inputFilePath, "WATCHLIST");
    if (!parsed_line.empty())
    {
        parsed_line.erase(parsed_line.begin());
    }
    return parsed_line;
}

void SimulationCtx::getEvents(string inputFilePath, int start_time)
{
    vector<vector<string>> event_parsed_lines = findAndParseLines(inputFilePath, "EVENT");
    for (auto &&parsed_line : event_parsed_lines)
    {
        if (parsed_line.size() == 4) // ex: EVENT s1 T 200
        {
            Wire *wire = getWireByName(parsed_line[1]);
            string state_str = parsed_line[2];
            State state;
            if (state_str == "T")
                state = T;
            else if (state_str == "F")
                state = F;
            else if (state_str == "Z")
                state = Z;
            else
                state = X;
            int time = stoi(parsed_line[3]) - start_time;
            m_timeline->addEvent(wire, state, time);
        }
    }
}

void SimulationCtx::getClock(string inputFilePath, int start_time, int end_time)
{
    vector<vector<string>> parsed_lines = findAndParseLines(inputFilePath, "CLOCK");
    for (auto &&parsed_line : parsed_lines)
    {
        if (parsed_line.size() == 5)
        {
            printParsedLine(parsed_line);

            // 1st element of clock definition is the name of the wire
            Wire *wire = getWireByName(parsed_line[1]);

            // 2nd is the time of first rise
            int time = stoi(parsed_line[2]);

            // 3rd is the period and 4th is the duty cycle (in percentage)
            int timeUp = int(round(stoi(parsed_line[4]) * stoi(parsed_line[3]) / 100));
            int timeDown = stoi(parsed_line[3]) - timeUp;

            // initialize clock to false at the beggining of the simulation
            m_timeline->addEvent(wire, F, 0);
            while (time < end_time)
            {
                m_timeline->addEvent(wire, T, time - start_time);
                time += timeUp;
                m_timeline->addEvent(wire, F, time - start_time);
                time += timeDown;
            }
        }
    }
}