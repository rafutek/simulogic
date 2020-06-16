//
// Created by Luc on 22/07/2019.
//

#ifndef UNTITLED_SEQUENTIAL_H
#define UNTITLED_SEQUENTIAL_H

#include "Gate.h"


class Sequential : public Gate {
public:
    Sequential(Wire *d, Wire *q, Wire *clk, Wire *sS, Wire *sR, Wire *aS, Wire *aR, bool syncSetPiority,
                   bool asyncSetPiority, std::map<std::string, std::vector<int>> delay, Bloc *containedBy,
                   std::string name);

    std::vector<std::tuple<Wire*,State, int>> modifOut(Wire* modifiedInput);

private:
    Wire* m_d;
    Wire* m_sS;
    Wire* m_sR;
    Wire* m_aS;
    Wire* m_aR;
    Wire* m_clk;
    bool m_syncSetPriority;
    bool m_asyncSetPriority;
    State m_futureOutputState;


};


#endif //UNTITLED_SEQUENTIAL_H
