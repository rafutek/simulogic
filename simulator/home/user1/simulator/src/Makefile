CXX = g++
RM = rm -f
WARN = -Wall
DEBUG = -g
FLAGS = #$(WARN) $(DEBUG)
CFLAGS = -c #$(FLAGS)

LIBPATH = ../../../../common/lib
BINPATH = ../bin

# PROGRAM has to be set in command line

all: $(BINPATH)/$(PROGRAM)

$(BINPATH)/$(PROGRAM): main.o Circuit.o
	$(CXX) -o $@ $(FLAGS) $^ $(LIBPATH)/simulib.a 

main.o: main.cpp Wire.h Gate.h Event.h EqNode.h Circuit.h Sequential.h Timeline.h SimulationCtx.h
	$(CXX) -o $@ $(CFLAGS) $<

Circuit.o: Circuit.cpp Circuit.h Gate.h Bloc.h Wire.h Sequential.h Timeline.h
	$(CXX) -o $@ $(CFLAGS) $<

clean:
	$(RM) *.o

deepclean: clean
	$(RM) $(BINPATH)/$(PROGRAM)