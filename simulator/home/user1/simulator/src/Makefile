# Some variables must be set in command line:
# HEADERS_PATH, PROGRAM, and LIB

CXX = g++
RM = rm -f
WARN = -Wall
DEBUG = -g
FLAGS = #$(WARN) $(DEBUG)
CFLAGS = -c #$(FLAGS)

headers := $(wildcard $(HEADERS_PATH)/*.h)

all: compile clean

compile: Circuit.o
	$(CXX) -o $(PROGRAM) $(FLAGS) $^ $(LIB)

Circuit.o: Circuit.cpp Circuit.h $(headers)
	$(CXX) -o $@ $(CFLAGS) $<

clean:
	$(RM) *.o

deepclean: clean
	$(RM) $(PROGRAM)