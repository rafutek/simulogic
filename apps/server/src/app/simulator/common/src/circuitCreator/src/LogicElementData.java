import java.io.*;
import java.util.*;

public class LogicElementData{ // Transformer en LogicElement"
	
	protected String m_name;
	protected Boolean m_isGate;
	protected ArrayList<String> m_inputs;
	protected ArrayList<String> m_outputs;
	protected ArrayList<String> m_ios;
	protected ArrayList<String> m_internalWires;
	protected ArrayList<String> m_allWires;

	
	//Constructeur
	public LogicElementData(Boolean isGate){
		m_isGate = isGate;
		m_inputs = new ArrayList();
		m_outputs = new ArrayList();
		m_ios = new ArrayList();
		m_internalWires = new ArrayList();
		m_allWires = new ArrayList();
	}
	
	//Setters
	void setName(String name){
		m_name = name;
	}
	
	void addInput(String inputName){
		m_inputs.add(inputName);
	}
	
	void addOutput(String outputName){
		m_outputs.add(outputName);
	}
	
	void addIo(String ioName){
		m_ios.add(ioName);
	}
	
	void setInternalWires(){
		for(int i=0; i<m_allWires.size();i++){
			// A wire is saved as an internal wire if it is not i/o/io nor already contained in internalWires list
			if(!(m_inputs.contains(m_allWires.get(i)) | m_outputs.contains(m_allWires.get(i)) 
				| m_ios.contains(m_allWires.get(i)) | m_internalWires.contains(m_allWires.get(i)))){
				m_internalWires.add(m_allWires.get(i));
			}
		}
	}
	
	void setAllWires(ArrayList<String> allWires){
		m_allWires = allWires;
	}
	
	
	// Getters
	public String getName(){
		return m_name;
	}
	
	public ArrayList<String> getInputs(){
		return m_inputs;
	}
	
	public ArrayList<String> getOutputs(){
		return m_outputs;
	}
	
	public ArrayList<String> getIos(){
		return m_ios;
	}
	
	public ArrayList<String> getInternalWires(){
		return m_internalWires;
	}
	
	public Boolean isGate(){
		return m_isGate;
	}
	
	//Divers
	

	

}