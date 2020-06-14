import java.io.*;
import java.util.*;

public class CircuitData {
	
	private int m_passCount;
	private ArrayList<GateData> m_gates;
	private ArrayList<LogicElementData> m_LogicElements; // either a bloc or a gate
	// Constructeur
	public CircuitData(){
		m_passCount = 0;
		m_LogicElements = new ArrayList();
	}
	
	// Seter
	public void iteratePassCount(){
		m_passCount += 1;
	}
	
	public void addGate(GateData gate){
		m_gates.add(gate);
	}
	
	public void addLogicElement(LogicElementData logicElement){
		m_LogicElements.add(logicElement);
	}
	
	// Geter
	public int getPassCount(){
		return m_passCount;
	}
	
	public ArrayList<GateData> getGates(){
		return m_gates;	
	}
	
	public ArrayList<LogicElementData> getLogicElements(){
		return m_LogicElements;
	}
	
	
	/*
	**************WRITERS***************
	*/
	
	//Write an instance of a gate or bloc
	public String writeInstance(Object objObjName, Object objInstName,Object User_DefObject){
		String objName = String.class.cast(objObjName);
		String instName = String.class.cast(objInstName);
		
		System.out.println(String.format("objName : %s",objName));
		System.out.println(String.format("instName : %s",instName));
		
		LogicElementData elementToWrite = findElementData(objName);
		String capObjName = objName.substring(0, 1).toUpperCase() + objName.substring(1);
		String instanceDeclaration;
		if(elementToWrite != null){
				if(elementToWrite.isGate()){
					instanceDeclaration = GateData.class.cast(elementToWrite).writeGate(instName,User_DefObject);
				} else{ //Declaration d'un bloc
				
				//Parse and Cast User_Def
					List User_DefList = new ArrayList();
					if(User_DefObject instanceof List){
						User_DefList = List.class.cast(User_DefObject);
					}
					
					List<String> inputs=  new ArrayList();
					if(User_DefList.get(1) instanceof List){
						inputs = List.class.cast(User_DefList.get(1));
					}
					
					List<String> outputs =  new ArrayList();
					if(User_DefList.get(2) instanceof List){
						outputs = List.class.cast(User_DefList.get(2));
					}
					
					List<String> ios =  new ArrayList();
					if(User_DefList.get(3) instanceof List){
						ios = List.class.cast(User_DefList.get(3));
					}
				
					// Line 1 est la déclaration d'inputs
					
					String listIn = new String();
					for(int k = 0; k<inputs.size()-1; k++){
						listIn = String.format("%s%s,",listIn,inputs.get(k));
					}
					listIn = String.format("%s%s",listIn,inputs.get(inputs.size()-1));
					String line1 = String.format("vector<Wire*> %sInput{%s};",instName,listIn);
					
					//Line 2 est la declaration d'outputs
					
					String listOut = new String();
					for(int k = 0; k<outputs.size()-1; k++){
						listOut = String.format("%s%s,",listOut,outputs.get(k));
					}
					listOut = String.format("%s%s",listOut,outputs.get(outputs.size()-1));
					String line2 = String.format("vector<Wire*> %sOutput{%s};",instName,listOut);
					
					if(ios.size() != 0){
						String listIo = new String();
						for(int k = 0; k<ios.size()-1; k++){
							listIo = String.format("%s%s,",listIo,ios.get(k));
						}
						listIo = String.format("%s%s",listIo,ios.get(ios.size()-1));
						String line3 = String.format("vector<Wire*> %sIos{%s};",instName,listIo);
						
						String line4 = String.format("%s* %s = new %s(gateMapAddr,timelineAddr,%sInput,%sOutput,%sIos,this,\"%s\");",
						capObjName,instName,capObjName,instName,instName,instName,instName);
						
						instanceDeclaration = String.format("%n%s%n%s%n%s%n%s%n",line1,line2,line3,line4);
					
					} else {
						//Line 3 est la déclaration du blo
						String line3 = String.format("%s* %s = new %s(gateMapAddr,timelineAddr,%sInput,%sOutput,this,\"%s\");",
						capObjName,instName,capObjName,instName,instName,instName);
						
						instanceDeclaration = String.format("%n%s%n%s%n%s%n",line1,line2,line3);
					}
					
				}
				
				
				return instanceDeclaration;
				
		} else {
			System.out.println("Erreur : L'elément à instancier n'a pas été définis");
		}
		
		return "";
	}

	// Write Bloc header, declares internal wires, and map inputs and outputs wires to bloc
	public String writeBlocHeaderAndMapWires(String blocName){
		String capBlocName = blocName.substring(0, 1).toUpperCase() + blocName.substring(1);
		String blocHeader = String.format("%s::%s(vector<Gate*>* gateMapAddr, Timeline* timelineAddr, vector<Wire*> inputBloc, vector<Wire*> outputBloc, Bloc* containedBy, string name)%n: Bloc(inputBloc,outputBloc,containedBy,name) {",
		capBlocName,capBlocName);
		
		String inputMap = new String();
		ArrayList<String> inputs = findElementData(blocName).getInputs();
		for(int i = 0; i<inputs.size(); i++){
			inputMap = String.format("%s%nWire* %s = inputBloc[%s];",inputMap,inputs.get(i),i);
		}
		
		String outputMap = new String();
		ArrayList<String> outputs = findElementData(blocName).getOutputs();
		for(int i = 0; i<outputs.size(); i++){
			outputMap = String.format("%s%nWire* %s = outputBloc[%s];",outputMap,outputs.get(i),i);
		}
		
		String intWiresDecl = new String();
		ArrayList<String> intWires = findElementData(blocName).getInternalWires();
		for(int i =0; i<intWires.size();i++){
			intWiresDecl = String.format("%s%nWire* %s = new Wire(\"%s\",this);",intWiresDecl,intWires.get(i),intWires.get(i));
		}
		
		return String.format("%s%n%n%s%n%s%n%s%n",blocHeader,inputMap,outputMap,intWiresDecl);
	}
	
	
	
	//Return le LogicElementData associé au nom
	public LogicElementData findElementData(String name) {
 
    for (LogicElementData logicElement : m_LogicElements) {
        if (logicElement.getName().equals(name)) {
            return logicElement;
        }
    }
    return null;
	}
	
	public String writeTriStateInst(ArrayList<String> paramTri, int delay){
		String triStateInstance = String.format("map<string,vector<int>> %sDelay;%n",paramTri.get(0));
		
		triStateInstance = String.format("%s%sDelay.insert(pair<string,vector<int>>{%s->getSimpleName(),{%s,%s,%s,%s}});%n",
		triStateInstance,paramTri.get(0),paramTri.get(1),delay,delay,delay,delay);
		
		triStateInstance = String.format("%s%sDelay.insert(pair<string,vector<int>>{%s->getSimpleName(),{%s,%s,%s,%s}});%n",
		triStateInstance,paramTri.get(0),paramTri.get(2),delay,delay,delay,delay);
		
		triStateInstance = String.format("%sTriState* %s = new TriState(timelineAddr,%s,%s,%s,%sDelay,this,\"%s\");%ngateMapAddr->push_back(%s);%n",
		triStateInstance,paramTri.get(0),paramTri.get(1),paramTri.get(2),paramTri.get(3),paramTri.get(0),paramTri.get(0),paramTri.get(0));
		
		return triStateInstance;
	}
	
	public String writeSeqInst(ArrayList<String> paramSeq, int delay){ // param seq are, in this order, [instName, D, CK, OUT, SS, SR, AS, AR, SP, AP]
		String seqStateInstance = String.format("%nmap<string,vector<int>> %sDelay;%n",paramSeq.get(0));
		for(int k = 1; k<8;k++){
			if(paramSeq.get(k) != "nullptr"){
				seqStateInstance = String.format("%s%sDelay.insert(pair<string,vector<int>>{%s->getSimpleName(),{%s,%s,%s,%s}});%n",
				seqStateInstance,paramSeq.get(0),paramSeq.get(k),delay,delay,delay,delay);
			}
		}
		seqStateInstance = String.format("%s%nSequential* %s = new Sequential(%s,%s,%s,%s,%s,%s,%s,%s,%s,%sDelay,this,\"name\");%ngateMapAddr->push_back(%s);%n",
		seqStateInstance,paramSeq.get(0),paramSeq.get(1),paramSeq.get(2),paramSeq.get(3),paramSeq.get(4),paramSeq.get(5),paramSeq.get(6),
		paramSeq.get(7),paramSeq.get(8),paramSeq.get(9),paramSeq.get(0),paramSeq.get(0));
		
		return seqStateInstance;
	}
}
