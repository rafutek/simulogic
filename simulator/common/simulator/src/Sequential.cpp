//
// Created by Luc on 22/07/2019.
//

#include "Sequential.h"

using namespace std;


Sequential::Sequential(Wire *d, Wire* clk,Wire* q, Wire* sS, Wire* sR, Wire* aS, Wire* aR, bool syncSetPiority, bool asyncSetPiority,
        std::map<std::string, std::vector<int>> delay, Bloc *containedBy, std::string name) :
        Gate({d,sS,clk,sR,aS,aR},{q},delay,containedBy,name),m_d(d),m_clk(clk),m_sS(sS),m_sR(sR),m_aS(aS),m_aR(aR),m_syncSetPriority(syncSetPiority),
        m_asyncSetPriority(asyncSetPiority),m_futureOutputState(X)
        {


}



vector<tuple<Wire *, State, int>> Sequential::modifOut(Wire *modifiedInput) {
    tuple<Wire *, State, int> output;
    State outputState = m_outputs[0]->getState(); // Initialize at current output States to get the latch behavior
    //Si la modification à l'origine de l'appel de modiffOut() est sur les entrées asynchrones

    //Les entrées asynchrones ayant la priorité, un changement de leur état a une répercussion imédiate
    if(modifiedInput == m_aS || modifiedInput == m_aR){
        if(m_aS->getState() == F && m_aR->getState() == T){
            outputState = F;
        } else if(m_aS->getState() == T && m_aR->getState() == F) {
            outputState = T;
        } else if(m_aS->getState() == T && m_aR->getState() == T){
            if(m_asyncSetPriority){
                outputState = T;
            } else {
                outputState = F;
            }
        } else if (m_aS->getState() == X || m_aR->getState() == X || m_aS->getState() == Z || m_aR->getState() == Z){
            outputState = X;
        }
    }

    //Les entrées asynchrones ayant la priorité, on test leur état avant de regarder le comportement synchrone
    if(!(m_aS->getState()==T || m_aR->getState() == T)){
        //Si front montnat sur l'horloge
        if(modifiedInput == m_clk && m_clk->getPreviousState()==F && m_clk->getState()==T){

            if(m_syncSetPriority){ //priority sync set
                if(m_sS->getState() == T){
                    outputState = T;
                } else if(m_sS->getState() == Z || m_sS->getState() == X){
                    outputState = X;
                } else if (m_sR->getState() == T){
                    outputState = F;
                } else if(m_sR->getState() == Z || m_sR->getState() == X){
                    outputState = X;
                } else {
                    if(m_d->getState() == Z){
                        outputState = X;
                    }else {// if sS and sR are at 0
                        outputState = m_d->getState();
                    }
                }
            } else {
                if(m_sR->getState() == T){
                    outputState = F;
                } else if(m_sR->getState() == Z || m_sR->getState() == X){
                    outputState = X;
                } else if (m_sS->getState() == T){
                    outputState = T;
                } else if(m_sS->getState() == Z || m_sS->getState() == X){
                    outputState = X;
                } else { // if sS and sR are at 0
                    if(m_d->getState() == Z){
                      outputState = X;
                    }else {
                      outputState = m_d->getState();
                    }
                }
            }

        } else {
            outputState = m_futureOutputState; //Si la clock n'est pas monté on garde l'état
        }
    }

    State oldOutput = m_outputs[0]->getState();
    State newOutput = outputState;

    State oldInput = modifiedInput->getPreviousState();
    State newInput = modifiedInput->getState();
//Permet de filtrer les sorties pour voir le fonctionnement m'est n'est pas exacte. Les sorties doivent être filtée à posteriori
//    if(!(oldOutput == newOutput)){
//        int delay = getDelay(modifiedInput, oldInput, newInput, oldOutput, newInput);
//        output = make_tuple(m_outputs[0],newOutput,delay);
//    }

    int delay = getDelay(modifiedInput, oldInput, newInput, oldOutput, newInput);
    output = make_tuple(m_outputs[0],newOutput,delay);
    m_futureOutputState = outputState;

    return{output};
}

