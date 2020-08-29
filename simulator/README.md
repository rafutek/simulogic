## Simulator

This logic circuit simulator has a Java part used to generate circuit C++ code from a descriptor file (.logic).
And a second part, used to generate the circuit simulator from C++ code. This executable will take a simulation file (.simu) as parameter.

So first you must compile the java code:
- go to *./common/circuitCreator/src*
- run `javac src/*.java -d bin`

Then you can generate the user's circuit's C++ code:
- go to `bin` where all the .class have been created
- run `java LogicToCpp username circuit-filename.logic` where circuit file is in *./home/username/circuitCreator/data/*.

Now *./home/username/simulator/src/* must contain the new circuit C++ files.
The circuit simulator can be compiled with `make PROGRAM=executable-name`.
To do a simulation:
- go to *./home/username/simulator/bin/* where the executable is stored
- run `./executable-name simulation-filename.simu` where simulation file is in *./home/username/simulator/data/*.

**All the steps above are managed by create_simulator.sh and simulate_save.sh that you can find in *./common/scripts***

### Dependencies
- Library [ANTLR4](https://www.antlr.org/)
- JAVA environment (for javac and java commands)
- make and g++

#### Install ANTLR4
- go to `~/.local/lib`
- run `curl -O https://www.antlr.org/download/antlr-4.7.2-complete.jar`
- add `export CLASSPATH=".:$HOME/.local/lib/antlr-4.7.2-complete.jar:$CLASSPATH"` at the end of ~/.bashrc.
- open a new terminal or run `source ~/.bashrc`
