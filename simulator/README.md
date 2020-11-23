## Simulator

This logic circuit simulator has a Java part used to generate circuit C++ code from a descriptor file (.logic).
And a second part, used to generate the circuit simulator from C++ code. This executable will take a simulation input file (.simu) as parameter.

So first you must compile the Java code:
- go to **./common/circuitCreator/**
- run `javac src/*.java -d bin`

Then you can generate the user's circuit's C++ code:
- go to **bin/** where all the *.class* have been created
- run `java LogicToCpp headers_path output_path circuit_filepath` where circuit_filepath is the path to the circuit (.logic) to generate a simulator from, output_path is the path to the directory where circuit C++ files will be created, and headers_path is the path (from that output_path) to the C++ source headers.

Now, output_path should contain the new circuit C++ files.
The circuit simulator can be compiled with `make LIB="lib_filepath" HEADERS_PATH="headers_path" PROGRAM="simulator_filepath"`, where simulator_filepath is the path to the executable to create, headers_path is the path to the C++ headers directory, and lib_filepath is the path to the C++ simulator library.

Finally, to execute and save simulation, run `./simulator_filepath input_filepath > output_filepath` where input_filepath is the path to the simulation input file (.simu) and output_filepath is the path to the simulation output file to create.

**All the steps are managed by server app simulator service (simulator.service.ts)**

### Dependencies
- Library [ANTLR4](https://www.antlr.org/)
- JAVA environment (for javac and java commands)
- make and g++

#### Install ANTLR4
- go to `~/.local/lib`
- run `curl -O https://www.antlr.org/download/antlr-4.7.2-complete.jar`
- add `export CLASSPATH=".:$HOME/.local/lib/antlr-4.7.2-complete.jar:$CLASSPATH"` at the end of ~/.bashrc.
- open a new terminal or run `source ~/.bashrc`
