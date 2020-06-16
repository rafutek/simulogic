// Generated from logic.g4 by ANTLR 4.7.2
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class logicParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.7.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9, 
		T__9=10, T__10=11, T__11=12, TRANSITION=13, TIME=14, DEF_TUPLE=15, VAL_TUPLE=16, 
		VALUE=17, ID=18, INV=19, ADD=20, MULT=21, STMT_END=22, SEQ=23, TRI=24, 
		DEF=25, DP=26, WS=27, COMMENT=28;
	public static final int
		RULE_circuit = 0, RULE_library = 1, RULE_function = 2, RULE_bloc = 3, 
		RULE_user_def = 4, RULE_inparam = 5, RULE_outparam = 6, RULE_ioparam = 7, 
		RULE_log_stmt = 8, RULE_biblis = 9, RULE_att_stmt = 10, RULE_expr = 11, 
		RULE_multExpr = 12, RULE_phase = 13, RULE_atom = 14, RULE_param_seq = 15;
	private static String[] makeRuleNames() {
		return new String[] {
			"circuit", "library", "function", "bloc", "user_def", "inparam", "outparam", 
			"ioparam", "log_stmt", "biblis", "att_stmt", "expr", "multExpr", "phase", 
			"atom", "param_seq"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'LIB'", "'{'", "'}'", "'ATTRIBUT'", "'LOGIC'", "'('", "')'", "','", 
			"'['", "']'", "'='", "'.'", null, null, null, null, null, null, "'!'", 
			"'+'", "'*'", "';'", "'@SEQ'", "'@TRI'", "'=>'", "':'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, "TRANSITION", "TIME", "DEF_TUPLE", "VAL_TUPLE", "VALUE", "ID", 
			"INV", "ADD", "MULT", "STMT_END", "SEQ", "TRI", "DEF", "DP", "WS", "COMMENT"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "logic.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public logicParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class CircuitContext extends ParserRuleContext {
		public List<LibraryContext> library() {
			return getRuleContexts(LibraryContext.class);
		}
		public LibraryContext library(int i) {
			return getRuleContext(LibraryContext.class,i);
		}
		public CircuitContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_circuit; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterCircuit(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitCircuit(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitCircuit(this);
			else return visitor.visitChildren(this);
		}
	}

	public final CircuitContext circuit() throws RecognitionException {
		CircuitContext _localctx = new CircuitContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_circuit);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(33); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(32);
				library();
				}
				}
				setState(35); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==T__0 || _la==T__1 );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LibraryContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public List<FunctionContext> function() {
			return getRuleContexts(FunctionContext.class);
		}
		public FunctionContext function(int i) {
			return getRuleContext(FunctionContext.class,i);
		}
		public LibraryContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_library; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterLibrary(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitLibrary(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitLibrary(this);
			else return visitor.visitChildren(this);
		}
	}

	public final LibraryContext library() throws RecognitionException {
		LibraryContext _localctx = new LibraryContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_library);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(39);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__0) {
				{
				setState(37);
				match(T__0);
				setState(38);
				match(ID);
				}
			}

			setState(41);
			match(T__1);
			setState(43); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(42);
				function();
				}
				}
				setState(45); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==ID );
			setState(47);
			match(T__2);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FunctionContext extends ParserRuleContext {
		public User_defContext user_def() {
			return getRuleContext(User_defContext.class,0);
		}
		public BlocContext bloc() {
			return getRuleContext(BlocContext.class,0);
		}
		public FunctionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_function; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterFunction(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitFunction(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitFunction(this);
			else return visitor.visitChildren(this);
		}
	}

	public final FunctionContext function() throws RecognitionException {
		FunctionContext _localctx = new FunctionContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_function);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(49);
			user_def();
			setState(50);
			bloc();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BlocContext extends ParserRuleContext {
		public List<Log_stmtContext> log_stmt() {
			return getRuleContexts(Log_stmtContext.class);
		}
		public Log_stmtContext log_stmt(int i) {
			return getRuleContext(Log_stmtContext.class,i);
		}
		public List<Att_stmtContext> att_stmt() {
			return getRuleContexts(Att_stmtContext.class);
		}
		public Att_stmtContext att_stmt(int i) {
			return getRuleContext(Att_stmtContext.class,i);
		}
		public BlocContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_bloc; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterBloc(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitBloc(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitBloc(this);
			else return visitor.visitChildren(this);
		}
	}

	public final BlocContext bloc() throws RecognitionException {
		BlocContext _localctx = new BlocContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_bloc);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(52);
			match(T__1);
			setState(59);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__3) {
				{
				setState(53);
				match(T__3);
				setState(55); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(54);
					att_stmt();
					}
					}
					setState(57); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==DEF_TUPLE );
				}
			}

			setState(61);
			match(T__4);
			setState(63); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(62);
				log_stmt();
				}
				}
				setState(65); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==ID );
			setState(67);
			match(T__2);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class User_defContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public List<TerminalNode> STMT_END() { return getTokens(logicParser.STMT_END); }
		public TerminalNode STMT_END(int i) {
			return getToken(logicParser.STMT_END, i);
		}
		public OutparamContext outparam() {
			return getRuleContext(OutparamContext.class,0);
		}
		public InparamContext inparam() {
			return getRuleContext(InparamContext.class,0);
		}
		public IoparamContext ioparam() {
			return getRuleContext(IoparamContext.class,0);
		}
		public User_defContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_user_def; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterUser_def(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitUser_def(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitUser_def(this);
			else return visitor.visitChildren(this);
		}
	}

	public final User_defContext user_def() throws RecognitionException {
		User_defContext _localctx = new User_defContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_user_def);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(69);
			match(ID);
			setState(70);
			match(T__5);
			setState(72);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==ID) {
				{
				setState(71);
				inparam();
				}
			}

			setState(74);
			match(STMT_END);
			setState(75);
			outparam();
			setState(78);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==STMT_END) {
				{
				setState(76);
				match(STMT_END);
				setState(77);
				ioparam();
				}
			}

			setState(80);
			match(T__6);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InparamContext extends ParserRuleContext {
		public InparamContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_inparam; }
	 
		public InparamContext() { }
		public void copyFrom(InparamContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class BusInParamContext extends InparamContext {
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public List<TerminalNode> VALUE() { return getTokens(logicParser.VALUE); }
		public TerminalNode VALUE(int i) {
			return getToken(logicParser.VALUE, i);
		}
		public TerminalNode DP() { return getToken(logicParser.DP, 0); }
		public BusInParamContext(InparamContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterBusInParam(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitBusInParam(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitBusInParam(this);
			else return visitor.visitChildren(this);
		}
	}
	public static class EnumInParamContext extends InparamContext {
		public List<TerminalNode> ID() { return getTokens(logicParser.ID); }
		public TerminalNode ID(int i) {
			return getToken(logicParser.ID, i);
		}
		public EnumInParamContext(InparamContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterEnumInParam(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitEnumInParam(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitEnumInParam(this);
			else return visitor.visitChildren(this);
		}
	}

	public final InparamContext inparam() throws RecognitionException {
		InparamContext _localctx = new InparamContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_inparam);
		int _la;
		try {
			setState(96);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
			case 1:
				_localctx = new EnumInParamContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(82);
				match(ID);
				setState(87);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__7) {
					{
					{
					setState(83);
					match(T__7);
					setState(84);
					match(ID);
					}
					}
					setState(89);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
				break;
			case 2:
				_localctx = new BusInParamContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(90);
				match(ID);
				setState(91);
				match(T__8);
				setState(92);
				match(VALUE);
				setState(93);
				match(DP);
				setState(94);
				match(VALUE);
				setState(95);
				match(T__9);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class OutparamContext extends ParserRuleContext {
		public OutparamContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_outparam; }
	 
		public OutparamContext() { }
		public void copyFrom(OutparamContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class EnumOutParamContext extends OutparamContext {
		public List<TerminalNode> ID() { return getTokens(logicParser.ID); }
		public TerminalNode ID(int i) {
			return getToken(logicParser.ID, i);
		}
		public EnumOutParamContext(OutparamContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterEnumOutParam(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitEnumOutParam(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitEnumOutParam(this);
			else return visitor.visitChildren(this);
		}
	}
	public static class BusOutParamContext extends OutparamContext {
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public List<TerminalNode> VALUE() { return getTokens(logicParser.VALUE); }
		public TerminalNode VALUE(int i) {
			return getToken(logicParser.VALUE, i);
		}
		public TerminalNode DP() { return getToken(logicParser.DP, 0); }
		public BusOutParamContext(OutparamContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterBusOutParam(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitBusOutParam(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitBusOutParam(this);
			else return visitor.visitChildren(this);
		}
	}

	public final OutparamContext outparam() throws RecognitionException {
		OutparamContext _localctx = new OutparamContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_outparam);
		int _la;
		try {
			setState(112);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,11,_ctx) ) {
			case 1:
				_localctx = new EnumOutParamContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(98);
				match(ID);
				setState(103);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__7) {
					{
					{
					setState(99);
					match(T__7);
					setState(100);
					match(ID);
					}
					}
					setState(105);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
				break;
			case 2:
				_localctx = new BusOutParamContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(106);
				match(ID);
				setState(107);
				match(T__8);
				setState(108);
				match(VALUE);
				setState(109);
				match(DP);
				setState(110);
				match(VALUE);
				setState(111);
				match(T__9);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IoparamContext extends ParserRuleContext {
		public IoparamContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ioparam; }
	 
		public IoparamContext() { }
		public void copyFrom(IoparamContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class BusIoParamContext extends IoparamContext {
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public List<TerminalNode> VALUE() { return getTokens(logicParser.VALUE); }
		public TerminalNode VALUE(int i) {
			return getToken(logicParser.VALUE, i);
		}
		public TerminalNode DP() { return getToken(logicParser.DP, 0); }
		public BusIoParamContext(IoparamContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterBusIoParam(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitBusIoParam(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitBusIoParam(this);
			else return visitor.visitChildren(this);
		}
	}
	public static class EnumIoParamContext extends IoparamContext {
		public List<TerminalNode> ID() { return getTokens(logicParser.ID); }
		public TerminalNode ID(int i) {
			return getToken(logicParser.ID, i);
		}
		public EnumIoParamContext(IoparamContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterEnumIoParam(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitEnumIoParam(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitEnumIoParam(this);
			else return visitor.visitChildren(this);
		}
	}

	public final IoparamContext ioparam() throws RecognitionException {
		IoparamContext _localctx = new IoparamContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_ioparam);
		int _la;
		try {
			setState(128);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,13,_ctx) ) {
			case 1:
				_localctx = new EnumIoParamContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(114);
				match(ID);
				setState(119);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__7) {
					{
					{
					setState(115);
					match(T__7);
					setState(116);
					match(ID);
					}
					}
					setState(121);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
				break;
			case 2:
				_localctx = new BusIoParamContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(122);
				match(ID);
				setState(123);
				match(T__8);
				setState(124);
				match(VALUE);
				setState(125);
				match(DP);
				setState(126);
				match(VALUE);
				setState(127);
				match(T__9);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Log_stmtContext extends ParserRuleContext {
		public Log_stmtContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_log_stmt; }
	 
		public Log_stmtContext() { }
		public void copyFrom(Log_stmtContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class InstLogStmtContext extends Log_stmtContext {
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public User_defContext user_def() {
			return getRuleContext(User_defContext.class,0);
		}
		public TerminalNode STMT_END() { return getToken(logicParser.STMT_END, 0); }
		public BiblisContext biblis() {
			return getRuleContext(BiblisContext.class,0);
		}
		public InstLogStmtContext(Log_stmtContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterInstLogStmt(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitInstLogStmt(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitInstLogStmt(this);
			else return visitor.visitChildren(this);
		}
	}
	public static class TriLogStmtContext extends Log_stmtContext {
		public Token entree;
		public Token decision;
		public Token sortie;
		public List<TerminalNode> ID() { return getTokens(logicParser.ID); }
		public TerminalNode ID(int i) {
			return getToken(logicParser.ID, i);
		}
		public TerminalNode TRI() { return getToken(logicParser.TRI, 0); }
		public TerminalNode STMT_END() { return getToken(logicParser.STMT_END, 0); }
		public TriLogStmtContext(Log_stmtContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterTriLogStmt(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitTriLogStmt(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitTriLogStmt(this);
			else return visitor.visitChildren(this);
		}
	}
	public static class SeqLogStmtContext extends Log_stmtContext {
		public List<TerminalNode> ID() { return getTokens(logicParser.ID); }
		public TerminalNode ID(int i) {
			return getToken(logicParser.ID, i);
		}
		public TerminalNode SEQ() { return getToken(logicParser.SEQ, 0); }
		public TerminalNode STMT_END() { return getToken(logicParser.STMT_END, 0); }
		public SeqLogStmtContext(Log_stmtContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterSeqLogStmt(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitSeqLogStmt(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitSeqLogStmt(this);
			else return visitor.visitChildren(this);
		}
	}
	public static class EqLogStmtContext extends Log_stmtContext {
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode STMT_END() { return getToken(logicParser.STMT_END, 0); }
		public EqLogStmtContext(Log_stmtContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterEqLogStmt(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitEqLogStmt(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitEqLogStmt(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Log_stmtContext log_stmt() throws RecognitionException {
		Log_stmtContext _localctx = new Log_stmtContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_log_stmt);
		try {
			setState(174);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,15,_ctx) ) {
			case 1:
				_localctx = new InstLogStmtContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(130);
				match(ID);
				setState(132);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,14,_ctx) ) {
				case 1:
					{
					setState(131);
					biblis();
					}
					break;
				}
				setState(134);
				user_def();
				setState(135);
				match(STMT_END);
				}
				break;
			case 2:
				_localctx = new EqLogStmtContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(137);
				match(ID);
				setState(138);
				match(T__10);
				setState(139);
				expr();
				setState(140);
				match(STMT_END);
				}
				break;
			case 3:
				_localctx = new SeqLogStmtContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(142);
				match(ID);
				setState(143);
				match(SEQ);
				setState(144);
				match(T__8);
				setState(145);
				match(ID);
				setState(146);
				match(T__7);
				setState(147);
				match(ID);
				setState(148);
				match(T__7);
				setState(149);
				match(ID);
				setState(150);
				match(T__7);
				setState(151);
				match(ID);
				setState(152);
				match(T__7);
				setState(153);
				match(ID);
				setState(154);
				match(T__7);
				setState(155);
				match(ID);
				setState(156);
				match(T__7);
				setState(157);
				match(ID);
				setState(158);
				match(T__7);
				setState(159);
				match(ID);
				setState(160);
				match(T__7);
				setState(161);
				match(ID);
				setState(162);
				match(T__9);
				setState(163);
				match(STMT_END);
				}
				break;
			case 4:
				_localctx = new TriLogStmtContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(164);
				match(ID);
				setState(165);
				match(TRI);
				setState(166);
				match(T__8);
				setState(167);
				((TriLogStmtContext)_localctx).entree = match(ID);
				setState(168);
				match(T__7);
				setState(169);
				((TriLogStmtContext)_localctx).decision = match(ID);
				setState(170);
				match(T__7);
				setState(171);
				((TriLogStmtContext)_localctx).sortie = match(ID);
				setState(172);
				match(T__9);
				setState(173);
				match(STMT_END);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BiblisContext extends ParserRuleContext {
		public List<TerminalNode> ID() { return getTokens(logicParser.ID); }
		public TerminalNode ID(int i) {
			return getToken(logicParser.ID, i);
		}
		public BiblisContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_biblis; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterBiblis(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitBiblis(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitBiblis(this);
			else return visitor.visitChildren(this);
		}
	}

	public final BiblisContext biblis() throws RecognitionException {
		BiblisContext _localctx = new BiblisContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_biblis);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(178); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(176);
					match(ID);
					setState(177);
					match(T__11);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(180); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,16,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Att_stmtContext extends ParserRuleContext {
		public TerminalNode DEF_TUPLE() { return getToken(logicParser.DEF_TUPLE, 0); }
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public TerminalNode DEF() { return getToken(logicParser.DEF, 0); }
		public TerminalNode VAL_TUPLE() { return getToken(logicParser.VAL_TUPLE, 0); }
		public TerminalNode STMT_END() { return getToken(logicParser.STMT_END, 0); }
		public Att_stmtContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_att_stmt; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterAtt_stmt(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitAtt_stmt(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitAtt_stmt(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Att_stmtContext att_stmt() throws RecognitionException {
		Att_stmtContext _localctx = new Att_stmtContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_att_stmt);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(182);
			match(DEF_TUPLE);
			setState(183);
			match(ID);
			setState(184);
			match(DEF);
			setState(185);
			match(VAL_TUPLE);
			setState(186);
			match(STMT_END);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExprContext extends ParserRuleContext {
		public List<MultExprContext> multExpr() {
			return getRuleContexts(MultExprContext.class);
		}
		public MultExprContext multExpr(int i) {
			return getRuleContext(MultExprContext.class,i);
		}
		public List<TerminalNode> ADD() { return getTokens(logicParser.ADD); }
		public TerminalNode ADD(int i) {
			return getToken(logicParser.ADD, i);
		}
		public ExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expr; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitExpr(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitExpr(this);
			else return visitor.visitChildren(this);
		}
	}

	public final ExprContext expr() throws RecognitionException {
		ExprContext _localctx = new ExprContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_expr);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(188);
			multExpr();
			setState(193);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==ADD) {
				{
				{
				setState(189);
				match(ADD);
				setState(190);
				multExpr();
				}
				}
				setState(195);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MultExprContext extends ParserRuleContext {
		public List<PhaseContext> phase() {
			return getRuleContexts(PhaseContext.class);
		}
		public PhaseContext phase(int i) {
			return getRuleContext(PhaseContext.class,i);
		}
		public List<TerminalNode> MULT() { return getTokens(logicParser.MULT); }
		public TerminalNode MULT(int i) {
			return getToken(logicParser.MULT, i);
		}
		public MultExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_multExpr; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterMultExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitMultExpr(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitMultExpr(this);
			else return visitor.visitChildren(this);
		}
	}

	public final MultExprContext multExpr() throws RecognitionException {
		MultExprContext _localctx = new MultExprContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_multExpr);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(196);
			phase();
			setState(201);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MULT) {
				{
				{
				setState(197);
				match(MULT);
				setState(198);
				phase();
				}
				}
				setState(203);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PhaseContext extends ParserRuleContext {
		public PhaseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_phase; }
	 
		public PhaseContext() { }
		public void copyFrom(PhaseContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class SimplePhaseContext extends PhaseContext {
		public AtomContext atom() {
			return getRuleContext(AtomContext.class,0);
		}
		public SimplePhaseContext(PhaseContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterSimplePhase(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitSimplePhase(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitSimplePhase(this);
			else return visitor.visitChildren(this);
		}
	}
	public static class InvPhaseContext extends PhaseContext {
		public TerminalNode INV() { return getToken(logicParser.INV, 0); }
		public PhaseContext phase() {
			return getRuleContext(PhaseContext.class,0);
		}
		public InvPhaseContext(PhaseContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterInvPhase(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitInvPhase(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitInvPhase(this);
			else return visitor.visitChildren(this);
		}
	}
	public static class ExprPhaseContext extends PhaseContext {
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public ExprPhaseContext(PhaseContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterExprPhase(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitExprPhase(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitExprPhase(this);
			else return visitor.visitChildren(this);
		}
	}

	public final PhaseContext phase() throws RecognitionException {
		PhaseContext _localctx = new PhaseContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_phase);
		try {
			setState(211);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case ID:
				_localctx = new SimplePhaseContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(204);
				atom();
				}
				break;
			case INV:
				_localctx = new InvPhaseContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(205);
				match(INV);
				setState(206);
				phase();
				}
				break;
			case T__5:
				_localctx = new ExprPhaseContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(207);
				match(T__5);
				setState(208);
				expr();
				setState(209);
				match(T__6);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AtomContext extends ParserRuleContext {
		public AtomContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_atom; }
	 
		public AtomContext() { }
		public void copyFrom(AtomContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class SimpleAtomContext extends AtomContext {
		public TerminalNode ID() { return getToken(logicParser.ID, 0); }
		public SimpleAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterSimpleAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitSimpleAtom(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitSimpleAtom(this);
			else return visitor.visitChildren(this);
		}
	}

	public final AtomContext atom() throws RecognitionException {
		AtomContext _localctx = new AtomContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_atom);
		try {
			_localctx = new SimpleAtomContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(213);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Param_seqContext extends ParserRuleContext {
		public Param_seqContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_param_seq; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).enterParam_seq(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof logicListener ) ((logicListener)listener).exitParam_seq(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof logicVisitor ) return ((logicVisitor<? extends T>)visitor).visitParam_seq(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Param_seqContext param_seq() throws RecognitionException {
		Param_seqContext _localctx = new Param_seqContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_param_seq);
		try {
			enterOuterAlt(_localctx, 1);
			{
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\36\u00dc\4\2\t\2"+
		"\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13"+
		"\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\3\2\6\2"+
		"$\n\2\r\2\16\2%\3\3\3\3\5\3*\n\3\3\3\3\3\6\3.\n\3\r\3\16\3/\3\3\3\3\3"+
		"\4\3\4\3\4\3\5\3\5\3\5\6\5:\n\5\r\5\16\5;\5\5>\n\5\3\5\3\5\6\5B\n\5\r"+
		"\5\16\5C\3\5\3\5\3\6\3\6\3\6\5\6K\n\6\3\6\3\6\3\6\3\6\5\6Q\n\6\3\6\3\6"+
		"\3\7\3\7\3\7\7\7X\n\7\f\7\16\7[\13\7\3\7\3\7\3\7\3\7\3\7\3\7\5\7c\n\7"+
		"\3\b\3\b\3\b\7\bh\n\b\f\b\16\bk\13\b\3\b\3\b\3\b\3\b\3\b\3\b\5\bs\n\b"+
		"\3\t\3\t\3\t\7\tx\n\t\f\t\16\t{\13\t\3\t\3\t\3\t\3\t\3\t\3\t\5\t\u0083"+
		"\n\t\3\n\3\n\5\n\u0087\n\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n"+
		"\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3"+
		"\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\3\n\5\n\u00b1\n\n\3\13\3\13"+
		"\6\13\u00b5\n\13\r\13\16\13\u00b6\3\f\3\f\3\f\3\f\3\f\3\f\3\r\3\r\3\r"+
		"\7\r\u00c2\n\r\f\r\16\r\u00c5\13\r\3\16\3\16\3\16\7\16\u00ca\n\16\f\16"+
		"\16\16\u00cd\13\16\3\17\3\17\3\17\3\17\3\17\3\17\3\17\5\17\u00d6\n\17"+
		"\3\20\3\20\3\21\3\21\3\21\2\2\22\2\4\6\b\n\f\16\20\22\24\26\30\32\34\36"+
		" \2\2\2\u00e2\2#\3\2\2\2\4)\3\2\2\2\6\63\3\2\2\2\b\66\3\2\2\2\nG\3\2\2"+
		"\2\fb\3\2\2\2\16r\3\2\2\2\20\u0082\3\2\2\2\22\u00b0\3\2\2\2\24\u00b4\3"+
		"\2\2\2\26\u00b8\3\2\2\2\30\u00be\3\2\2\2\32\u00c6\3\2\2\2\34\u00d5\3\2"+
		"\2\2\36\u00d7\3\2\2\2 \u00d9\3\2\2\2\"$\5\4\3\2#\"\3\2\2\2$%\3\2\2\2%"+
		"#\3\2\2\2%&\3\2\2\2&\3\3\2\2\2\'(\7\3\2\2(*\7\24\2\2)\'\3\2\2\2)*\3\2"+
		"\2\2*+\3\2\2\2+-\7\4\2\2,.\5\6\4\2-,\3\2\2\2./\3\2\2\2/-\3\2\2\2/\60\3"+
		"\2\2\2\60\61\3\2\2\2\61\62\7\5\2\2\62\5\3\2\2\2\63\64\5\n\6\2\64\65\5"+
		"\b\5\2\65\7\3\2\2\2\66=\7\4\2\2\679\7\6\2\28:\5\26\f\298\3\2\2\2:;\3\2"+
		"\2\2;9\3\2\2\2;<\3\2\2\2<>\3\2\2\2=\67\3\2\2\2=>\3\2\2\2>?\3\2\2\2?A\7"+
		"\7\2\2@B\5\22\n\2A@\3\2\2\2BC\3\2\2\2CA\3\2\2\2CD\3\2\2\2DE\3\2\2\2EF"+
		"\7\5\2\2F\t\3\2\2\2GH\7\24\2\2HJ\7\b\2\2IK\5\f\7\2JI\3\2\2\2JK\3\2\2\2"+
		"KL\3\2\2\2LM\7\30\2\2MP\5\16\b\2NO\7\30\2\2OQ\5\20\t\2PN\3\2\2\2PQ\3\2"+
		"\2\2QR\3\2\2\2RS\7\t\2\2S\13\3\2\2\2TY\7\24\2\2UV\7\n\2\2VX\7\24\2\2W"+
		"U\3\2\2\2X[\3\2\2\2YW\3\2\2\2YZ\3\2\2\2Zc\3\2\2\2[Y\3\2\2\2\\]\7\24\2"+
		"\2]^\7\13\2\2^_\7\23\2\2_`\7\34\2\2`a\7\23\2\2ac\7\f\2\2bT\3\2\2\2b\\"+
		"\3\2\2\2c\r\3\2\2\2di\7\24\2\2ef\7\n\2\2fh\7\24\2\2ge\3\2\2\2hk\3\2\2"+
		"\2ig\3\2\2\2ij\3\2\2\2js\3\2\2\2ki\3\2\2\2lm\7\24\2\2mn\7\13\2\2no\7\23"+
		"\2\2op\7\34\2\2pq\7\23\2\2qs\7\f\2\2rd\3\2\2\2rl\3\2\2\2s\17\3\2\2\2t"+
		"y\7\24\2\2uv\7\n\2\2vx\7\24\2\2wu\3\2\2\2x{\3\2\2\2yw\3\2\2\2yz\3\2\2"+
		"\2z\u0083\3\2\2\2{y\3\2\2\2|}\7\24\2\2}~\7\13\2\2~\177\7\23\2\2\177\u0080"+
		"\7\34\2\2\u0080\u0081\7\23\2\2\u0081\u0083\7\f\2\2\u0082t\3\2\2\2\u0082"+
		"|\3\2\2\2\u0083\21\3\2\2\2\u0084\u0086\7\24\2\2\u0085\u0087\5\24\13\2"+
		"\u0086\u0085\3\2\2\2\u0086\u0087\3\2\2\2\u0087\u0088\3\2\2\2\u0088\u0089"+
		"\5\n\6\2\u0089\u008a\7\30\2\2\u008a\u00b1\3\2\2\2\u008b\u008c\7\24\2\2"+
		"\u008c\u008d\7\r\2\2\u008d\u008e\5\30\r\2\u008e\u008f\7\30\2\2\u008f\u00b1"+
		"\3\2\2\2\u0090\u0091\7\24\2\2\u0091\u0092\7\31\2\2\u0092\u0093\7\13\2"+
		"\2\u0093\u0094\7\24\2\2\u0094\u0095\7\n\2\2\u0095\u0096\7\24\2\2\u0096"+
		"\u0097\7\n\2\2\u0097\u0098\7\24\2\2\u0098\u0099\7\n\2\2\u0099\u009a\7"+
		"\24\2\2\u009a\u009b\7\n\2\2\u009b\u009c\7\24\2\2\u009c\u009d\7\n\2\2\u009d"+
		"\u009e\7\24\2\2\u009e\u009f\7\n\2\2\u009f\u00a0\7\24\2\2\u00a0\u00a1\7"+
		"\n\2\2\u00a1\u00a2\7\24\2\2\u00a2\u00a3\7\n\2\2\u00a3\u00a4\7\24\2\2\u00a4"+
		"\u00a5\7\f\2\2\u00a5\u00b1\7\30\2\2\u00a6\u00a7\7\24\2\2\u00a7\u00a8\7"+
		"\32\2\2\u00a8\u00a9\7\13\2\2\u00a9\u00aa\7\24\2\2\u00aa\u00ab\7\n\2\2"+
		"\u00ab\u00ac\7\24\2\2\u00ac\u00ad\7\n\2\2\u00ad\u00ae\7\24\2\2\u00ae\u00af"+
		"\7\f\2\2\u00af\u00b1\7\30\2\2\u00b0\u0084\3\2\2\2\u00b0\u008b\3\2\2\2"+
		"\u00b0\u0090\3\2\2\2\u00b0\u00a6\3\2\2\2\u00b1\23\3\2\2\2\u00b2\u00b3"+
		"\7\24\2\2\u00b3\u00b5\7\16\2\2\u00b4\u00b2\3\2\2\2\u00b5\u00b6\3\2\2\2"+
		"\u00b6\u00b4\3\2\2\2\u00b6\u00b7\3\2\2\2\u00b7\25\3\2\2\2\u00b8\u00b9"+
		"\7\21\2\2\u00b9\u00ba\7\24\2\2\u00ba\u00bb\7\33\2\2\u00bb\u00bc\7\22\2"+
		"\2\u00bc\u00bd\7\30\2\2\u00bd\27\3\2\2\2\u00be\u00c3\5\32\16\2\u00bf\u00c0"+
		"\7\26\2\2\u00c0\u00c2\5\32\16\2\u00c1\u00bf\3\2\2\2\u00c2\u00c5\3\2\2"+
		"\2\u00c3\u00c1\3\2\2\2\u00c3\u00c4\3\2\2\2\u00c4\31\3\2\2\2\u00c5\u00c3"+
		"\3\2\2\2\u00c6\u00cb\5\34\17\2\u00c7\u00c8\7\27\2\2\u00c8\u00ca\5\34\17"+
		"\2\u00c9\u00c7\3\2\2\2\u00ca\u00cd\3\2\2\2\u00cb\u00c9\3\2\2\2\u00cb\u00cc"+
		"\3\2\2\2\u00cc\33\3\2\2\2\u00cd\u00cb\3\2\2\2\u00ce\u00d6\5\36\20\2\u00cf"+
		"\u00d0\7\25\2\2\u00d0\u00d6\5\34\17\2\u00d1\u00d2\7\b\2\2\u00d2\u00d3"+
		"\5\30\r\2\u00d3\u00d4\7\t\2\2\u00d4\u00d6\3\2\2\2\u00d5\u00ce\3\2\2\2"+
		"\u00d5\u00cf\3\2\2\2\u00d5\u00d1\3\2\2\2\u00d6\35\3\2\2\2\u00d7\u00d8"+
		"\7\24\2\2\u00d8\37\3\2\2\2\u00d9\u00da\3\2\2\2\u00da!\3\2\2\2\26%)/;="+
		"CJPYbiry\u0082\u0086\u00b0\u00b6\u00c3\u00cb\u00d5";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}