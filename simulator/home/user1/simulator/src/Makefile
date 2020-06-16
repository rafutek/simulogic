CXX = g++
RM = rm -f
WARN = -Wall
DEBUG = -g
FLAGS = #$(WARN) $(DEBUG)
CFLAGS = -c #$(FLAGS)

COMMONPATH = ../../../../common/simulator
LIBPATH = $(COMMONPATH)/lib
SRCPATH = $(COMMONPATH)/src
BINPATH = ../bin

# PROGRAM must be set in command line!

all: compile clean

compile: Circuit.o
	$(CXX) -o $(BINPATH)/$(PROGRAM) $(FLAGS) $^ $(LIBPATH)/simulib.a 

Circuit.o: Circuit.cpp Circuit.h $(SRCPATH)/Gate.h $(SRCPATH)/Bloc.h $(SRCPATH)/Wire.h $(SRCPATH)/Sequential.h $(SRCPATH)/Timeline.h
	$(CXX) -o $@ $(CFLAGS) $<

clean:
	$(RM) *.o

deepclean: clean
	$(RM) $(BINPATH)/$(PROGRAM)