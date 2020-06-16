CXX = g++
RM = rm -f
WARN = -Wall
DEBUG = -g
FLAGS = #$(WARN) $(DEBUG)
CFLAGS = -c #$(FLAGS)
LIBPATH=../lib
LIBNAME=simulib.a

all: create_lib clean

create_lib: main.o Bloc.o EqNode.o Event.o Gate.o LogicElement.o Sequential.o SimulationCtx.o Timeline.o TriState.o Wire.o
	ar r $(LIBPATH)/$(LIBNAME) $^
	ranlib $(LIBPATH)/$(LIBNAME)

main.o: main.cpp Wire.h Gate.h Event.h EqNode.h createCircuit.h Sequential.h Timeline.h SimulationCtx.h
	$(CXX) $(CFLAGS) $<

Bloc.o: Bloc.cpp Bloc.h
	$(CXX) $(CFLAGS) $<

EqNode.o: EqNode.cpp EqNode.h
	$(CXX) $(CFLAGS) $<

Event.o: Event.cpp Event.h
	$(CXX) $(CFLAGS) $<

Gate.o: Gate.cpp Gate.h EqNode.h
	$(CXX) $(CFLAGS) $<

LogicElement.o: LogicElement.cpp LogicElement.h
	$(CXX) $(CFLAGS) $<

Sequential.o: Sequential.cpp Sequential.h
	$(CXX) $(CFLAGS) $<

SimulationCtx.o: SimulationCtx.cpp SimulationCtx.h
	$(CXX) $(CFLAGS) $<

Timeline.o: Timeline.cpp Timeline.h Wire.h
	$(CXX) $(CFLAGS) $<

TriState.o: TriState.cpp TriState.h
	$(CXX) $(CFLAGS) $<

Wire.o: Wire.cpp Wire.h
	$(CXX) $(CFLAGS) $<

clean:
	$(RM) *.o

deepclean: clean
	$(RM) $(LIBPATH)/$(LIBNAME)