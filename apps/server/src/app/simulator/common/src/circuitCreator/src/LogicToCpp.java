import org.antlr.v4.misc.OrderedHashMap;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;

import java.io.*;
import java.util.*;

public class LogicToCpp {

	public static class logicVisitor extends logicBaseVisitor<Object> {

		CircuitData circuitData;
		FileWriter circuitCpp; // File to write Cpp circuit description
		FileWriter circuith;

		public String visitCircuit(logicParser.CircuitContext ctx) {

			if (circuitData.getPassCount() == 0) {
				System.out.println("Première visite");
				if (ctx.library() != null) {
					int nbLib = ctx.library().size();
					for (int i = 0; i < nbLib; i++) {
						this.visit(ctx.library(i));
					}
				}
				circuitData.iteratePassCount(); // A la fin de chaque visite, on itere le passCount
			}

			else if (circuitData.getPassCount() == 1) {
				System.out.println("Deuxième visite");
				try {
					System.out.println("Ecriture!");
					circuitCpp.write(String.format(
							"#include <iostream>%n#include <fstream>%n#include \"Circuit.h\"%n#include\"Gate.h\"%n#include\"Bloc.h\"%n#include \"Wire.h\"%n#include \"Sequential.h\"%n#include \"Timeline.h\"%n%nusing namespace std;%n%n"));
				} catch (IOException e) {
					e.printStackTrace();
				}

				// This is the writing phase for .cpp
				if (ctx.library() != null) {
					int nbLib = ctx.library().size();
					for (int i = 0; i < nbLib; i++) {
						this.visit(ctx.library(i));
					}
				}

				// At the end of the writting phase, creates the function to choos the Element
				// to simulate, create a function

				try {
					circuitCpp.write(String.format(
							"LogicElement* createCircuit(std::vector<Gate*>* gateMapAddr,Timeline* timelineAddr,std::string name){%nifstream inFile;%ninFile.open(\"inputFile.txt\");%n"));
				} catch (IOException e) {
					e.printStackTrace();
				}

				// Write .h file
				try {
					circuith.write(String.format(
							"#ifndef SIMULATION_CIRCUIT_H%n#define SIMULATION_CIRCUIT_H%n%n#include <iostream>%n#include <string>%n#include \"vector\"%n#include \"Wire.h\"%n#include \"EqNode.h\"%n#include \"Gate.h\"%n#include \"Timeline.h\"%n#include \"Bloc.h\"%n#include \"LogicElement.h\"%n #include \"TriState.h\"%n%n"));
				} catch (IOException e) {
					e.printStackTrace();
				}

				// Cerate an if statement for all logic elements
				ArrayList<LogicElementData> logicElements = circuitData.getLogicElements();
				for (int i = 0; i < logicElements.size(); i++) {
					LogicElementData logicElement = logicElements.get(i);
					String name = logicElement.getName();
					String capName = name.substring(0, 1).toUpperCase() + name.substring(1);

					// Declare in .h
					if (!logicElement.isGate()) {
						try {
							circuith.write(String.format(
									"class %s : public Bloc {%npublic:%n%s(std::vector<Gate*>* gateMapAddr, Timeline* timelineAddr, std::vector<Wire*> inputBloc, std::vector<Wire*> outputBloc, Bloc* containedBy,%nstd::string name);%n};%n%n",
									capName, capName));
						} catch (IOException e) {
							e.printStackTrace();
						}
					}

					// Define in .cpp
					try {
						circuitCpp.write(String.format("if(name == \"%s\" || name == \"%s\" ){%n", name, capName));
					} catch (IOException e) {
						e.printStackTrace();
					}

					ArrayList<String> inputs = logicElement.getInputs();
					String listIn = new String();
					for (int k = 0; k < inputs.size(); k++) {
						// Create inputs Wire
						try {
							circuitCpp.write(String.format("Wire* %s = new Wire(\"%s\",nullptr);%n", inputs.get(k),
									inputs.get(k)));
						} catch (IOException e) {
							e.printStackTrace();
						}
						if (k != inputs.size() - 1) {
							listIn += String.format("%s,", inputs.get(k));
						} else if (k == inputs.size() - 1) {
							listIn += String.format("%s", inputs.get(k));
						}
					}
					// Create input vector
					try {
						circuitCpp.write(String.format("vector<Wire*> inputCircuit{%s};%n%n", listIn));
					} catch (IOException e) {
						e.printStackTrace();
					}

					// Create output wires
					ArrayList<String> outputs = logicElement.getOutputs();
					String listOut = new String();
					for (int k = 0; k < outputs.size(); k++) {
						// Create the Wire
						try {
							circuitCpp.write(String.format("Wire* %s = new Wire(\"%s\",nullptr);%n", outputs.get(k),
									outputs.get(k)));
						} catch (IOException e) {
							e.printStackTrace();
						}
						if (k != outputs.size() - 1) {
							listOut += String.format("%s,", outputs.get(k));
						} else if (k == outputs.size() - 1) {
							listOut += String.format("%s", outputs.get(k));
						}
					}
					// Create Output vector
					try {
						circuitCpp.write(String.format("vector<Wire*> outputCircuit{%s};%n%n", listOut));
					} catch (IOException e) {
						e.printStackTrace();
					}

					// Create ios wires
					ArrayList<String> ios = logicElement.getIos();
					if (ios.size() != 0) {
						String listIo = new String();
						for (int k = 0; k < ios.size(); k++) {
							// Create the Wire
							try {
								circuitCpp.write(String.format("Wire* %s = new Wire(\"%s\",nullptr);%n", ios.get(k),
										ios.get(k)));
							} catch (IOException e) {
								e.printStackTrace();
							}
							if (k != ios.size() - 1) {
								listIo += String.format("%s,", ios.get(k));
							} else if (k == ios.size() - 1) {
								listIo += String.format("%s", ios.get(k));
							}
						}
						// Create Output vector
						try {
							circuitCpp.write(String.format("vector<Wire*> iosCircuit{%s};%n%n", listOut));
						} catch (IOException e) {
							e.printStackTrace();
						}
					}

					// Create Bloc
					if (logicElement.isGate()) {
						// Define equation
						String objName = logicElement.getName();
						Integer delay = GateData.class.cast(logicElement).getDelay();
						ArrayList<String> equation = GateData.class.cast(logicElement).getEquation();
						String equationStr = new String();
						for (int k = 0; k < equation.size() - 1; k++) {
							equationStr += String.format("EqNode(%s),", equation.get(k));
						}
						equationStr += String.format("EqNode(%s)", equation.get(equation.size() - 1));

						String line3 = String.format("vector<EqNode> circuitEq{%s};", equationStr);

						String line4 = String.format("map<string,vector<int>> delay;");
						for (int k = 0; k < inputs.size(); k++) {
							line4 = String.format(
									"%s%ndelay.insert(pair<string,vector<int>>{%s->getSimpleName(),{%s,%s,%s,%s}});",
									line4, inputs.get(k), delay, delay, delay, delay);
						}

						// Write Equation, delay and Gate declaration
						try {
							circuitCpp.write(String.format(
									"%s%n%s%nGate* circuit = new Gate{inputCircuit,outputCircuit,delay,circuitEq, nullptr,\"%s\"};%n%nreturn circuit ;%n%ngateMapAddr->push_back(circuit);}%n",
									line4, line3, capName));
						} catch (IOException e) {
							e.printStackTrace();
						}
					} else {
						if (ios.size() != 0) {
							try {
								circuitCpp.write(String.format(
										"%s* circuit = new %s(gateMapAddr,timelineAddr,inputCircuit,outputCircuit,iosCircuit, nullptr,\"%s\");%n%nreturn circuit ;%n}%n",
										capName, capName, capName));
							} catch (IOException e) {
								e.printStackTrace();
							}
						} else {
							try {
								circuitCpp.write(String.format(
										"%s* circuit = new %s(gateMapAddr,timelineAddr,inputCircuit,outputCircuit, nullptr,\"%s\");%n%nreturn circuit ;%n}%n",
										capName, capName, capName));
							} catch (IOException e) {
								e.printStackTrace();
							}
						}
					}

				}

				// End h file with circuit selection function declaration
				try {
					circuith.write(String.format(
							"LogicElement* createCircuit(std::vector<Gate*>* gateMapAddr,Timeline* timelineAddr,std::string name);%n%n#endif"));
				} catch (IOException e) {
					e.printStackTrace();
				}

				// close h file
				try {
					circuith.close();
				} catch (IOException e) {
					e.printStackTrace();
				}

				try {
					circuitCpp.write(String.format(
							"else{%nstd::cout << \"Le Bloc demandé n'est pas définis\";%nreturn nullptr;%n}%n}%n"));
				} catch (IOException e) {
					e.printStackTrace();
				}

				try {
					circuitCpp.close();
				} catch (IOException e) {
					e.printStackTrace();
				}

			}

			return ("");
		}

		public String visitLibrary(logicParser.LibraryContext ctx) {

			if (ctx.function() != null) {
				int nbFunct = ctx.function().size();
				for (int i = 0; i < nbFunct; i++) {
					this.visit(ctx.function(i));
				}
			}

			return "";
		}

		public String visitFunction(logicParser.FunctionContext ctx) {

			Object User_DefObject = this.visit(ctx.user_def()); // Reprend Récuprère la liste de UserDef et la parse
																// pour print
			List User_DefList = new ArrayList();
			if (User_DefObject instanceof List) {
				User_DefList = List.class.cast(User_DefObject);
			}

			if (circuitData.getPassCount() == 0) {
				Object blocDataObject = this.visit(ctx.bloc());
				LogicElementData blocData;
				if (blocDataObject instanceof LogicElementData) {
					blocData = LogicElementData.class.cast(blocDataObject);
				} else {
					blocData = new LogicElementData(false);
				} // Has to be initialized to compile

				// Set le nom du LogicElementData
				blocData.setName(String.class.cast(User_DefList.get(0)));

				// Add les entrées du LogicElementData
				List<String> listIn = new ArrayList();
				if (User_DefList.get(1) instanceof List) {
					listIn = List.class.cast(User_DefList.get(1));
				}
				if (listIn.size() != 0) {
					for (int i = 0; i < listIn.size(); i++) {
						blocData.addInput(listIn.get(i));
					}
				}

				// Add les sorties du LogicElementData
				List<String> listOut = new ArrayList();
				if (User_DefList.get(2) instanceof List) {
					listOut = List.class.cast(User_DefList.get(2));
				}
				if (listOut.size() != 0) {
					for (int i = 0; i < listOut.size(); i++) {
						blocData.addOutput(listOut.get(i));
					}
				}

				// Add les ios du LogicElementData
				List<String> listIo = new ArrayList();
				if (User_DefList.get(3) instanceof List) {
					listIo = List.class.cast(User_DefList.get(3));
				}
				if (listIo.size() != 0) {
					for (int i = 0; i < listIo.size(); i++) {
						blocData.addIo(listIo.get(i));
					}
				}

				// Crée la liste des fils internes
				blocData.setInternalWires();

				// L'element logique (bloc ou porte) est ajouté à la liste des éléments logique
				// du circuit
				circuitData.addLogicElement(blocData);

			}

			if (circuitData.getPassCount() == 1) {

				if (!isGate(ctx.bloc())) {
					try {
						String blocName = String.class.cast(User_DefList.get(0));
						circuitCpp.write(circuitData.writeBlocHeaderAndMapWires(blocName));
					} catch (IOException e) {
						e.printStackTrace();
					}

					this.visit(ctx.bloc()); // Visit the bloc to write instances

				}
			}

			return "";
		}

		public LogicElementData visitBloc(logicParser.BlocContext ctx) {

			// if(ctx.att_stmt() != null){
			// int nbAtt = ctx.att_stmt().size();
			// for(int i = 0; i < nbAtt ; i++){
			// this.visit(ctx.att_stmt().get(i));
			// }
			// }

			/*
			 * On the first pass, collect the data we will need to write gate and instances
			 * If the Element is a gate we create a specific GateObject that has a equation
			 * attribute During first pass we also collect the list of all wire declared in
			 * the Element
			 *
			 */
			ArrayList<String> blocWireList = new ArrayList();
			LogicElementData elementData = new LogicElementData(false);
			if (circuitData.getPassCount() == 0) {
				if (ctx.log_stmt() != null) {
					if (isGate(ctx)) {
						GateData gateElementData = new GateData();
						// If it is a gate ther will be only EqlogStatement, doesnt deal with bloc that
						// contains multiple equation
						gateElementData.setEquation(ArrayList.class.cast(this.visit(ctx.log_stmt(0))));
						elementData = gateElementData;
					}

					// On boucle sur tout les logStatement pour reccuperer la liste de tout les fils
					// du bloc
					ArrayList<String> wireToAdd;
					for (int k = 0; k < ctx.log_stmt().size(); k++) {
						// At the first pass visit function will return an Arraylist off all wire's name
						wireToAdd = ArrayList.class.cast(this.visit(ctx.log_stmt(k)));
						for (int i = 0; i < wireToAdd.size(); i++) {
							// Si la liste de fil vient d'un EqLogStatement il faut filtrer les opérateurs
							if (wireToAdd.get(i) != "et" && wireToAdd.get(i) != "ou" && wireToAdd.get(i) != "inv") {
								blocWireList.add(wireToAdd.get(i));
							}
						}
					}

				}

				elementData.setAllWires(blocWireList);
			}

			/*
			 * On the second pass (Writing pass), loop over instance statement to write them
			 * into the circuit file Eq log statement in bloc should be delt with later It
			 * is to note that Gate will not be visited on second pass
			 */
			if (circuitData.getPassCount() == 1) {
				// Boucle sur les Logic Statement
				for (int k = 0; k < ctx.log_stmt().size(); k++) {
					// If it it an instance statement, visit it to get object and instance name then
					// write the instance in .cpp
					if (ctx.log_stmt(k) instanceof logicParser.InstLogStmtContext) {
						System.out.println("InstLogStmt");
						Object[] instData = new Object[3];
						if (this.visit(ctx.log_stmt(k)) instanceof Object[]) {
							instData = Object[].class.cast(this.visit(ctx.log_stmt(k)));
						} else {
							System.out.println("Error : line 236, logstmt return not instance of String[]");// Mettre
																											// exeption
							instData[0] = "";
							instData[1] = "";

						}
						// Write the instance in cpp
						try {
							circuitCpp.write(circuitData.writeInstance(instData[0], instData[1], instData[2]));
						} catch (IOException e) {
							e.printStackTrace();
						}

					}

					// If there are TriStates stmt get parameters and declares TriStates Object in
					// .cpp
					if (ctx.log_stmt(k) instanceof logicParser.TriLogStmtContext) {
						ArrayList<String> paramTri = ArrayList.class.cast(this.visit(ctx.log_stmt(k)));

						try {
							circuitCpp.write(circuitData.writeTriStateInst(paramTri, 13)); // Delay is arbitrary set to
																							// 13 but could be
																							// determined from attribut
																							// statement
						} catch (IOException e) {
							e.printStackTrace();
						}
					}

					// If it is a Seq Element, write it down
					if (ctx.log_stmt(k) instanceof logicParser.SeqLogStmtContext) {
						ArrayList<String> paramSeq = ArrayList.class.cast(this.visit(ctx.log_stmt(k)));
						try {
							circuitCpp.write(circuitData.writeSeqInst(paramSeq, 42)); // Delay is arbitrary set to 42
																						// but could be determined from
																						// attribut statement
						} catch (IOException e) {
							e.printStackTrace();
						}
					}

				}
				// Close the bloc
				try {
					circuitCpp.write(String.format("%n}%n%n"));
				} catch (IOException e) {
					e.printStackTrace();
				}

			}

			return (elementData);
		}

		public String visitAtt_stmt(logicParser.Att_stmtContext ctx) {
			String att_Stmt = ctx.DEF_TUPLE().getText();
			att_Stmt += ctx.ID();
			att_Stmt += ctx.DEF();
			att_Stmt += ctx.VAL_TUPLE();
			att_Stmt += ";";
			System.out.println(att_Stmt);
			return "";
		}

		public Object visitInstLogStmt(logicParser.InstLogStmtContext ctx) {

			// Lors de la première passe on liste les in/out/io des instance statement pour
			// determiner les fils internes

			Object User_DefObject = this.visit(ctx.user_def()); // Reccupere la liste de fil de l'UserDef
			List User_DefList = new ArrayList();
			if (User_DefObject instanceof List) {
				User_DefList = List.class.cast(User_DefObject);
			}
			// Stock tout les fils lors de la première passe, reste vide lors de la deuxième
			// (passe d'ecriture))
			ArrayList<String> wireList = new ArrayList();

			if (circuitData.getPassCount() == 0) {
				for (int k = 1; k < 4; k++) { // Boucle sur les entrées, sorties et ios du UserDef
					List<String> wireToAdd = new ArrayList();
					if (User_DefList.get(k) instanceof List) {
						wireToAdd = List.class.cast(User_DefList.get(k));
					}
					if (wireToAdd.size() != 0) {
						for (int i = 0; i < wireToAdd.size(); i++) {
							wireList.add(wireToAdd.get(i));
						}
					}
				}

				return wireList;

			}

			/*
			 * Lors deuxième passe on return le nom de lobjet instancié et le nom de
			 * l'instance pour pouvoir l'écrire dans le bloc.
			 */
			if (circuitData.getPassCount() == 1) {

				// instData a la forme {Nom de l'objet instancié, nom de l'instance,User_def}
				Object[] instData = { String.class.cast(User_DefList.get(0)), ctx.ID().getText(), User_DefObject };

				return instData;
			}

			return null;
		}

		public ArrayList<String> visitSeqLogStmt(logicParser.SeqLogStmtContext ctx) {
			ArrayList<String> output = new ArrayList<String>();
			// On the first pass, just return the wire
			if (circuitData.getPassCount() == 0) {
				for (int k = 1; k < ctx.ID().size() - 2; k++) {
					output.add(ctx.ID(k).getText());
				}
			}

			// On second pass, also return instName and SP/AP parameters
			if (circuitData.getPassCount() == 1) {
				for (int k = 0; k < ctx.ID().size(); k++) {
					output.add(ctx.ID(k).getText()); // Output will contain, in this order, [instName, D, CK, OUT, SS,
														// SR, AS, AR, SP, AP]
				}
			}

			return output;
		}

		public ArrayList<String> visitTriLogStmt(logicParser.TriLogStmtContext ctx) {
			ArrayList<String> output = new ArrayList<String>();
			ArrayList<String> paramTri = new ArrayList<String>(3);
			paramTri.add(0, ctx.entree.getText());
			paramTri.add(1, ctx.decision.getText());
			paramTri.add(2, ctx.sortie.getText());
			// On first pass return entrance, decision and output wire
			if (circuitData.getPassCount() == 0) {

				for (int k = 0; k < paramTri.size(); k++) {
					output.add(paramTri.get(k));
				}
			}
			// On second pass also return the name on first position
			if (circuitData.getPassCount() == 1) {
				output.add(ctx.ID(0).getText());

				for (int k = 0; k < paramTri.size(); k++) {
					output.add(paramTri.get(k));
				}
			}
			return output;
		}

		public ArrayList<String> visitEqLogStmt(logicParser.EqLogStmtContext ctx) {

			ArrayList<String> equation = ArrayList.class.cast(this.visit(ctx.expr()));

			return equation;
		}

		public String visitBiblis(logicParser.BiblisContext ctx) {
			int nbBiblis = ctx.ID().size();
			String biblis = "";
			for (int i = 0; i < nbBiblis; i++) {
				biblis += ctx.ID().get(i).getText();
				biblis += ".";
			}
			return biblis;
		}

		public List<Object> visitUser_def(logicParser.User_defContext ctx) { // Crée un tableau des In, Out et IO, la
																				// première slot du tableau contient le
																				// nom de la fonction
			List<Object> user_Def = new ArrayList<Object>(4); // [nom,[in],[out],[io]]

			user_Def.add(0, ctx.ID().getText());
			if (ctx.inparam() != null) {
				user_Def.add(1, this.visit(ctx.inparam()));
			} else {
				List<String> empty = new ArrayList<String>();
				user_Def.add(1, empty);
			}
			user_Def.add(2, this.visit(ctx.outparam()));
			if (ctx.ioparam() != null) {
				user_Def.add(3, this.visit(ctx.ioparam()));
			} else {
				List<String> empty = new ArrayList<String>();
				user_Def.add(3, empty);
			}
			return user_Def;
		}

		public Object visitEnumInParam(logicParser.EnumInParamContext ctx) { // On ajoute chaque param dans une liste
																				// que l'on traite dans user_Def
			List<String> inParam = new ArrayList<String>();
			int nbParams = ctx.ID().size();
			for (int i = 0; i < nbParams; i++) {
				inParam.add(ctx.ID().get(i).toString());
			}
			return inParam;
		}

		public String visitBusInParam(logicParser.BusInParamContext ctx) {

			return "";
		}

		public Object visitEnumOutParam(logicParser.EnumOutParamContext ctx) {
			List<String> outParam = new ArrayList<String>();
			int nbParams = ctx.ID().size();
			for (int i = 0; i < nbParams; i++) {
				outParam.add(ctx.ID().get(i).toString());
			}
			return outParam;
		}

		public String visitBusOutParam(logicParser.BusOutParamContext ctx) {

			return "";
		}

		public Object visitEnumIoParam(logicParser.EnumIoParamContext ctx) {
			List<String> ioParam = new ArrayList<String>();
			int nbParams = ctx.ID().size();
			for (int i = 0; i < nbParams; i++) {
				ioParam.add(ctx.ID().get(i).toString());
			}
			return ioParam;
		}

		public String visitBusIoParam(logicParser.BusIoParamContext ctx) {

			return "";
		}

		public ArrayList<String> visitExpr(logicParser.ExprContext ctx) {
			ArrayList<String> equation = new ArrayList();
			for (int i = 0; i < ctx.multExpr().size() - 1; i++) {
				equation.add("ou");
				equation.addAll(ArrayList.class.cast(this.visit(ctx.multExpr().get(i))));
			}
			equation.addAll(ArrayList.class.cast(this.visit(ctx.multExpr().get(ctx.multExpr().size() - 1)))); // Get
																												// last
																												// element
			return equation;
		}

		public ArrayList<String> visitMultExpr(logicParser.MultExprContext ctx) {
			ArrayList<String> multExprEq = new ArrayList();
			for (int i = 0; i < ctx.phase().size() - 1; i++) { // Visite toute les phases de multExpr une à une
				multExprEq.add("et");
				// Cast the object returned by visiting the phase into Arraylist to use adAll()
				// method
				multExprEq.addAll(ArrayList.class.cast(this.visit(ctx.phase().get(i))));
			}
			multExprEq.addAll(ArrayList.class.cast(this.visit(ctx.phase().get(ctx.phase().size() - 1))));
			return multExprEq;
		}

		public ArrayList<String> visitSimplePhase(logicParser.SimplePhaseContext ctx) {
			ArrayList<String> phaseEq = new ArrayList();
			phaseEq.addAll(ArrayList.class.cast(this.visit(ctx.atom())));
			return phaseEq;
		}

		public ArrayList<String> visitInvPhase(logicParser.InvPhaseContext ctx) {
			ArrayList<String> phaseEq = new ArrayList();
			phaseEq.add("inv");
			// Cast Object into ArrayList
			if (this.visit(ctx.phase()) instanceof ArrayList) {
				phaseEq.addAll(ArrayList.class.cast(this.visit(ctx.phase())));
			}
			return phaseEq;
		}

		public ArrayList<String> visitExprPhase(logicParser.ExprPhaseContext ctx) {
			ArrayList<String> phaseEq = new ArrayList();
			Object phaseEqObject = this.visit(ctx.expr());

			if (phaseEqObject instanceof ArrayList) {
				phaseEq = ArrayList.class.cast(phaseEqObject);
			}

			return phaseEq;
		}

		public ArrayList<String> visitSimpleAtom(logicParser.SimpleAtomContext ctx) {
			ArrayList<String> id = new ArrayList();
			id.add(ctx.ID().getText());
			return (id);
		}

		public boolean isGate(logicParser.BlocContext ctx) {
			boolean isGate = true;
			if (ctx.log_stmt() != null) {
				int nbLog = ctx.log_stmt().size();
				for (int i = 0; i < nbLog; i++) {
					// If there is at least one Instance Statement it isn't a gate
					if (!(ctx.log_stmt(i) instanceof logicParser.EqLogStmtContext)) {
						isGate = false;
					}

				}
			}
			return (isGate);
		}

		public logicVisitor(String user) {
			super();
			circuitData = new CircuitData();
			// Create .h file
			try {
				circuith = new FileWriter("../../../../home/"+user+"/simulator/src/Circuit.h");
			} catch (IOException e) {
				e.printStackTrace();
			}

			// Create .cpp file
			try {
				circuitCpp = new FileWriter("../../../../home/"+user+"/simulator/src/Circuit.cpp");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

	public static void main(String[] args) throws Exception {
		String user = null;
		String inputFile = null;
		if (args.length == 2) {
			user = args[0];
			inputFile = args[1];
		} else {
			throw new Exception("The program needs two parameters: user and circuit file");
		}

		InputStream is = System.in;
		if (inputFile != null) {
			is = new FileInputStream(inputFile);
		}
		ANTLRInputStream input = new ANTLRInputStream(is);
		logicLexer lexer = new logicLexer(input);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		logicParser parser = new logicParser(tokens);
		ParseTree tree = parser.circuit();

		logicVisitor loader = new logicVisitor(user);

		loader.visit(tree);

		loader.visit(tree);
		System.out.println("fin"); // print results
	}
}
