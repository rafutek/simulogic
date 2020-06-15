#include <iostream>
#include <fstream>
#include "Circuit.h"
#include"Gate.h"
#include"Bloc.h"
#include "Wire.h"
#include "Sequential.h"
#include "Timeline.h"

using namespace std;

LatchedAdder::LatchedAdder(vector<Gate*>* gateMapAddr, Timeline* timelineAddr, vector<Wire*> inputBloc, vector<Wire*> outputBloc, Bloc* containedBy, string name)
: Bloc(inputBloc,outputBloc,containedBy,name) {


Wire* x = inputBloc[0];
Wire* y = inputBloc[1];
Wire* cin = inputBloc[2];
Wire* clk = inputBloc[3];
Wire* ss = inputBloc[4];
Wire* sr = inputBloc[5];

Wire* s = outputBloc[0];
Wire* cout = outputBloc[1];

Wire* nd = new Wire("nd",this);

vector<Wire*> adderInput{cin,x,y};
vector<Wire*> adderOutput{s,cout};
FullAdder* adder = new FullAdder(gateMapAddr,timelineAddr,adderInput,adderOutput,this,"adder");

map<string,vector<int>> seqDelay;
seqDelay.insert(pair<string,vector<int>>{cout->getSimpleName(),{42,42,42,42}});
seqDelay.insert(pair<string,vector<int>>{clk->getSimpleName(),{42,42,42,42}});
seqDelay.insert(pair<string,vector<int>>{cin->getSimpleName(),{42,42,42,42}});
seqDelay.insert(pair<string,vector<int>>{ss->getSimpleName(),{42,42,42,42}});
seqDelay.insert(pair<string,vector<int>>{sr->getSimpleName(),{42,42,42,42}});
seqDelay.insert(pair<string,vector<int>>{nd->getSimpleName(),{42,42,42,42}});
seqDelay.insert(pair<string,vector<int>>{nd->getSimpleName(),{42,42,42,42}});

Sequential* seq = new Sequential(cout,clk,cin,ss,sr,nd,nd,true,true,seqDelay,this,"name");
gateMapAddr->push_back(seq);

}

EightBitAdder::EightBitAdder(vector<Gate*>* gateMapAddr, Timeline* timelineAddr, vector<Wire*> inputBloc, vector<Wire*> outputBloc, Bloc* containedBy, string name)
: Bloc(inputBloc,outputBloc,containedBy,name) {


Wire* x0 = inputBloc[0];
Wire* x1 = inputBloc[1];
Wire* x2 = inputBloc[2];
Wire* x3 = inputBloc[3];
Wire* x4 = inputBloc[4];
Wire* x5 = inputBloc[5];
Wire* x6 = inputBloc[6];
Wire* x7 = inputBloc[7];
Wire* y0 = inputBloc[8];
Wire* y1 = inputBloc[9];
Wire* y2 = inputBloc[10];
Wire* y3 = inputBloc[11];
Wire* y4 = inputBloc[12];
Wire* y5 = inputBloc[13];
Wire* y6 = inputBloc[14];
Wire* y7 = inputBloc[15];

Wire* s0 = outputBloc[0];
Wire* s1 = outputBloc[1];
Wire* s2 = outputBloc[2];
Wire* s3 = outputBloc[3];
Wire* s4 = outputBloc[4];
Wire* s5 = outputBloc[5];
Wire* s6 = outputBloc[6];
Wire* s7 = outputBloc[7];
Wire* s8 = outputBloc[8];

Wire* c0 = new Wire("c0",this);
Wire* c1 = new Wire("c1",this);
Wire* c2 = new Wire("c2",this);
Wire* c3 = new Wire("c3",this);
Wire* c4 = new Wire("c4",this);
Wire* c5 = new Wire("c5",this);
Wire* c6 = new Wire("c6",this);

vector<Wire*> adderB0Input{x0,y0};
vector<Wire*> adderB0Output{s0,c0};
HalfAdder* adderB0 = new HalfAdder(gateMapAddr,timelineAddr,adderB0Input,adderB0Output,this,"adderB0");

vector<Wire*> adderB1Input{c0,x1,y1};
vector<Wire*> adderB1Output{s1,c1};
FullAdder* adderB1 = new FullAdder(gateMapAddr,timelineAddr,adderB1Input,adderB1Output,this,"adderB1");

vector<Wire*> adderB2Input{c1,x2,y2};
vector<Wire*> adderB2Output{s2,c2};
FullAdder* adderB2 = new FullAdder(gateMapAddr,timelineAddr,adderB2Input,adderB2Output,this,"adderB2");

vector<Wire*> adderB3Input{c2,x3,y3};
vector<Wire*> adderB3Output{s3,c3};
FullAdder* adderB3 = new FullAdder(gateMapAddr,timelineAddr,adderB3Input,adderB3Output,this,"adderB3");

vector<Wire*> adderB4Input{c3,x4,y4};
vector<Wire*> adderB4Output{s4,c4};
FullAdder* adderB4 = new FullAdder(gateMapAddr,timelineAddr,adderB4Input,adderB4Output,this,"adderB4");

vector<Wire*> adderB5Input{c4,x5,y5};
vector<Wire*> adderB5Output{s5,c5};
FullAdder* adderB5 = new FullAdder(gateMapAddr,timelineAddr,adderB5Input,adderB5Output,this,"adderB5");

vector<Wire*> adderB6Input{c5,x6,y6};
vector<Wire*> adderB6Output{s6,c6};
FullAdder* adderB6 = new FullAdder(gateMapAddr,timelineAddr,adderB6Input,adderB6Output,this,"adderB6");

vector<Wire*> adderB7Input{c6,x7,y7};
vector<Wire*> adderB7Output{s7,s8};
FullAdder* adderB7 = new FullAdder(gateMapAddr,timelineAddr,adderB7Input,adderB7Output,this,"adderB7");

}

FullAdder::FullAdder(vector<Gate*>* gateMapAddr, Timeline* timelineAddr, vector<Wire*> inputBloc, vector<Wire*> outputBloc, Bloc* containedBy, string name)
: Bloc(inputBloc,outputBloc,containedBy,name) {


Wire* cin = inputBloc[0];
Wire* e0 = inputBloc[1];
Wire* e1 = inputBloc[2];

Wire* s = outputBloc[0];
Wire* cout = outputBloc[1];

Wire* intW1 = new Wire("intW1",this);
Wire* intW2 = new Wire("intW2",this);
Wire* intW3 = new Wire("intW3",this);

vector<Wire*> halfAdd1Input{e0,e1};
vector<Wire*> halfAdd1Output{intW1,intW2};
HalfAdder* halfAdd1 = new HalfAdder(gateMapAddr,timelineAddr,halfAdd1Input,halfAdd1Output,this,"halfAdd1");

vector<Wire*> halfAdd2Input{cin,intW1};
vector<Wire*> halfAdd2Output{s,intW3};
HalfAdder* halfAdd2 = new HalfAdder(gateMapAddr,timelineAddr,halfAdd2Input,halfAdd2Output,this,"halfAdd2");

vector<Wire*> or1Input{intW2,intW3};
vector<Wire*> or1Output{cout};
vector<EqNode> or1Eq{EqNode(ou),EqNode(intW2),EqNode(intW3)};
map<string,vector<int>> or1Delay;
or1Delay.insert(pair<string,vector<int>>{intW2->getSimpleName(),{100,100,100,100}});
or1Delay.insert(pair<string,vector<int>>{intW3->getSimpleName(),{100,100,100,100}});
Gate* or1 = new Gate(or1Input,or1Output,or1Delay,or1Eq,this,"or1");
gateMapAddr->push_back(or1);

}

HalfAdder::HalfAdder(vector<Gate*>* gateMapAddr, Timeline* timelineAddr, vector<Wire*> inputBloc, vector<Wire*> outputBloc, Bloc* containedBy, string name)
: Bloc(inputBloc,outputBloc,containedBy,name) {


Wire* e0 = inputBloc[0];
Wire* e1 = inputBloc[1];

Wire* s = outputBloc[0];
Wire* c = outputBloc[1];


vector<Wire*> xor1Input{e0,e1};
vector<Wire*> xor1Output{s};
vector<EqNode> xor1Eq{EqNode(et),EqNode(ou),EqNode(e0),EqNode(e1),EqNode(inv),EqNode(et),EqNode(e0),EqNode(e1)};
map<string,vector<int>> xor1Delay;
xor1Delay.insert(pair<string,vector<int>>{e0->getSimpleName(),{100,100,100,100}});
xor1Delay.insert(pair<string,vector<int>>{e1->getSimpleName(),{100,100,100,100}});
Gate* xor1 = new Gate(xor1Input,xor1Output,xor1Delay,xor1Eq,this,"xor1");
gateMapAddr->push_back(xor1);

vector<Wire*> and1Input{e0,e1};
vector<Wire*> and1Output{c};
vector<EqNode> and1Eq{EqNode(et),EqNode(e0),EqNode(e1)};
map<string,vector<int>> and1Delay;
and1Delay.insert(pair<string,vector<int>>{e0->getSimpleName(),{100,100,100,100}});
and1Delay.insert(pair<string,vector<int>>{e1->getSimpleName(),{100,100,100,100}});
Gate* and1 = new Gate(and1Input,and1Output,and1Delay,and1Eq,this,"and1");
gateMapAddr->push_back(and1);

}

LogicElement* createCircuit(std::vector<Gate*>* gateMapAddr,Timeline* timelineAddr,std::string name){
ifstream inFile;
inFile.open("inputFile.txt");
if(name == "latchedAdder" || name == "LatchedAdder" ){
Wire* x = new Wire("x",nullptr);
Wire* y = new Wire("y",nullptr);
Wire* cin = new Wire("cin",nullptr);
Wire* clk = new Wire("clk",nullptr);
Wire* ss = new Wire("ss",nullptr);
Wire* sr = new Wire("sr",nullptr);
vector<Wire*> inputCircuit{x,y,cin,clk,ss,sr};

Wire* s = new Wire("s",nullptr);
Wire* cout = new Wire("cout",nullptr);
vector<Wire*> outputCircuit{s,cout};

LatchedAdder* circuit = new LatchedAdder(gateMapAddr,timelineAddr,inputCircuit,outputCircuit, nullptr,"LatchedAdder");

return circuit ;
}
if(name == "eightBitAdder" || name == "EightBitAdder" ){
Wire* x0 = new Wire("x0",nullptr);
Wire* x1 = new Wire("x1",nullptr);
Wire* x2 = new Wire("x2",nullptr);
Wire* x3 = new Wire("x3",nullptr);
Wire* x4 = new Wire("x4",nullptr);
Wire* x5 = new Wire("x5",nullptr);
Wire* x6 = new Wire("x6",nullptr);
Wire* x7 = new Wire("x7",nullptr);
Wire* y0 = new Wire("y0",nullptr);
Wire* y1 = new Wire("y1",nullptr);
Wire* y2 = new Wire("y2",nullptr);
Wire* y3 = new Wire("y3",nullptr);
Wire* y4 = new Wire("y4",nullptr);
Wire* y5 = new Wire("y5",nullptr);
Wire* y6 = new Wire("y6",nullptr);
Wire* y7 = new Wire("y7",nullptr);
vector<Wire*> inputCircuit{x0,x1,x2,x3,x4,x5,x6,x7,y0,y1,y2,y3,y4,y5,y6,y7};

Wire* s0 = new Wire("s0",nullptr);
Wire* s1 = new Wire("s1",nullptr);
Wire* s2 = new Wire("s2",nullptr);
Wire* s3 = new Wire("s3",nullptr);
Wire* s4 = new Wire("s4",nullptr);
Wire* s5 = new Wire("s5",nullptr);
Wire* s6 = new Wire("s6",nullptr);
Wire* s7 = new Wire("s7",nullptr);
Wire* s8 = new Wire("s8",nullptr);
vector<Wire*> outputCircuit{s0,s1,s2,s3,s4,s5,s6,s7,s8};

EightBitAdder* circuit = new EightBitAdder(gateMapAddr,timelineAddr,inputCircuit,outputCircuit, nullptr,"EightBitAdder");

return circuit ;
}
if(name == "fullAdder" || name == "FullAdder" ){
Wire* cin = new Wire("cin",nullptr);
Wire* e0 = new Wire("e0",nullptr);
Wire* e1 = new Wire("e1",nullptr);
vector<Wire*> inputCircuit{cin,e0,e1};

Wire* s = new Wire("s",nullptr);
Wire* cout = new Wire("cout",nullptr);
vector<Wire*> outputCircuit{s,cout};

FullAdder* circuit = new FullAdder(gateMapAddr,timelineAddr,inputCircuit,outputCircuit, nullptr,"FullAdder");

return circuit ;
}
if(name == "halfAdder" || name == "HalfAdder" ){
Wire* e0 = new Wire("e0",nullptr);
Wire* e1 = new Wire("e1",nullptr);
vector<Wire*> inputCircuit{e0,e1};

Wire* s = new Wire("s",nullptr);
Wire* c = new Wire("c",nullptr);
vector<Wire*> outputCircuit{s,c};

HalfAdder* circuit = new HalfAdder(gateMapAddr,timelineAddr,inputCircuit,outputCircuit, nullptr,"HalfAdder");

return circuit ;
}
if(name == "orGate" || name == "OrGate" ){
Wire* in1 = new Wire("in1",nullptr);
Wire* in2 = new Wire("in2",nullptr);
vector<Wire*> inputCircuit{in1,in2};

Wire* out = new Wire("out",nullptr);
vector<Wire*> outputCircuit{out};

map<string,vector<int>> delay;
delay.insert(pair<string,vector<int>>{in1->getSimpleName(),{100,100,100,100}});
delay.insert(pair<string,vector<int>>{in2->getSimpleName(),{100,100,100,100}});
vector<EqNode> circuitEq{EqNode(ou),EqNode(in1),EqNode(in2)};
Gate* circuit = new Gate{inputCircuit,outputCircuit,delay,circuitEq, nullptr,"OrGate"};

return circuit ;

gateMapAddr->push_back(circuit);}
if(name == "andGate" || name == "AndGate" ){
Wire* in1 = new Wire("in1",nullptr);
Wire* in2 = new Wire("in2",nullptr);
vector<Wire*> inputCircuit{in1,in2};

Wire* out = new Wire("out",nullptr);
vector<Wire*> outputCircuit{out};

map<string,vector<int>> delay;
delay.insert(pair<string,vector<int>>{in1->getSimpleName(),{100,100,100,100}});
delay.insert(pair<string,vector<int>>{in2->getSimpleName(),{100,100,100,100}});
vector<EqNode> circuitEq{EqNode(et),EqNode(in1),EqNode(in2)};
Gate* circuit = new Gate{inputCircuit,outputCircuit,delay,circuitEq, nullptr,"AndGate"};

return circuit ;

gateMapAddr->push_back(circuit);}
if(name == "xorGate" || name == "XorGate" ){
Wire* in1 = new Wire("in1",nullptr);
Wire* in2 = new Wire("in2",nullptr);
vector<Wire*> inputCircuit{in1,in2};

Wire* out = new Wire("out",nullptr);
vector<Wire*> outputCircuit{out};

map<string,vector<int>> delay;
delay.insert(pair<string,vector<int>>{in1->getSimpleName(),{100,100,100,100}});
delay.insert(pair<string,vector<int>>{in2->getSimpleName(),{100,100,100,100}});
vector<EqNode> circuitEq{EqNode(et),EqNode(ou),EqNode(in1),EqNode(in2),EqNode(inv),EqNode(et),EqNode(in1),EqNode(in2)};
Gate* circuit = new Gate{inputCircuit,outputCircuit,delay,circuitEq, nullptr,"XorGate"};

return circuit ;

gateMapAddr->push_back(circuit);}
else{
std::cout << "Le Bloc demandé n'est pas définis";
return nullptr;
}
}
