import java.io.*;
import java.util.*;

public class GateData extends LogicElementData{
	private ArrayList<String> m_equation;
	private int m_delay;
	
	void setEquation(ArrayList<String> equation){
		m_equation = equation;
	}
	
	ArrayList<String> getEquation(){
		return m_equation;
	}
	
	Integer getDelay(){
		return m_delay;
	}
	
	public GateData(){
		super(true); // Create LogicElementData marking it as a gate;
		m_equation = new ArrayList<String>();
		m_delay = 100;
	}
	
	// Write the code for a Gate declaration in cpp Simulator taking as parametter the name of the instance and the user_def of the instance
	public String writeGate(String instName, Object User_DefObject ){
		 
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
		
		// Line1 is input vector
		String listIn = new String();
		for(int k = 0; k<inputs.size()-1; k++){
			listIn += (inputs.get(k) + ",");
		}
		listIn += inputs.get(inputs.size()-1);
		String line1 = String.format("vector<Wire*> %sInput{%s};",instName,listIn);
		
		//Line2 is output vector
		String listOut = new String();
		for(int k = 0; k<outputs.size()-1; k++){
			listOut += (outputs.get(k) + ",");
		}
		listOut += outputs.get(outputs.size()-1);
		String line2 = String.format("vector<Wire*> %sOutput{%s};",instName,listOut);
		
		//Line 3 is equation
		String equation = new String();
		for(int k = 0; k<m_equation.size()-1; k++){
			if(m_equation.get(k) == "ou" || m_equation.get(k) == "et" || m_equation.get(k) == "inv" ){
				equation += String.format("EqNode(%s),",m_equation.get(k));
			} else { //Si ce n'est pas un opérateur il faut faire la correspondance entre les entrées de l'instance et celles de la déclaration
				Integer entryNum = m_inputs.indexOf(m_equation.get(k));
				if(entryNum==-1){
					System.out.println(String.format("Erreure : Un des fils de l'équation de la porte %s ne fait pas partis des fils d'entrees (fil:%s)",instName,m_equation.get(k)));
				} else {
					equation += String.format("EqNode(%s),",inputs.get(entryNum));
				}
			}
		}
		if(m_equation.get(m_equation.size()-1) == "ou" || m_equation.get(m_equation.size()-1) == "et" || m_equation.get(m_equation.size()-1) == "inv" ){
		equation += String.format("EqNode(%s)",m_equation.get(m_equation.size()-1));	
		} else{
			Integer entryNum = m_inputs.indexOf(m_equation.get(m_equation.size()-1));
			if(entryNum==-1){
				System.out.println(String.format("Erreure : Un des fils de l'équation de la porte %s ne fait pas partis des fils d'entrées (fil:%s)",instName,m_equation.get(m_equation.size()-1)));
			} else {
				equation += String.format("EqNode(%s)",inputs.get(entryNum));
			}
		}
		String line3 = String.format("vector<EqNode> %sEq{%s};",instName,equation);
		
		//line 4 is delay model definition (its not a line though, more like a bloc of line)
		String line4 = String.format("map<string,vector<int>> %sDelay;",instName);
		for(int k = 0; k<inputs.size(); k++){
			line4 = String.format("%s%n%sDelay.insert(pair<string,vector<int>>{%s->getSimpleName(),{%s,%s,%s,%s}});",
			line4,instName,inputs.get(k),m_delay,m_delay,m_delay,m_delay);
		}
		
		//Line 5 is Gate construction 
		String line5 = String.format("Gate* %s = new Gate(%sInput,%sOutput,%sDelay,%sEq,this,\"%s\");",instName,instName,instName
		,instName,instName,instName);
		
		//Line 4 is to add the gate into the gateMap wich stores all the gates of simulated circuit
		String line6 = String.format("gateMapAddr->push_back(%s);",instName);
		
		String gateDeclaration = String.format("%n%s%n%s%n%s%n%s%n%s%n%s%n",line1,line2,line3,line4,line5,line6);
		
		return gateDeclaration;
	}
}