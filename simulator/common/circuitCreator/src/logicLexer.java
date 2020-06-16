// Generated from logic.g4 by ANTLR 4.7.2
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class logicLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.7.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9, 
		T__9=10, T__10=11, T__11=12, TRANSITION=13, TIME=14, DEF_TUPLE=15, VAL_TUPLE=16, 
		VALUE=17, ID=18, INV=19, ADD=20, MULT=21, STMT_END=22, SEQ=23, TRI=24, 
		DEF=25, DP=26, WS=27, COMMENT=28;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "T__8", 
			"T__9", "T__10", "T__11", "TRANSITION", "TIME", "DEF_TUPLE", "VAL_TUPLE", 
			"VALUE", "INT", "FLOAT", "ID", "BOOL", "STRING", "INV", "ADD", "MULT", 
			"STMT_END", "SEQ", "TRI", "DEF", "DP", "WS", "COMMENT"
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


	public logicLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "logic.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\36\u00f0\b\1\4\2"+
		"\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4"+
		"\13\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22"+
		"\t\22\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31"+
		"\t\31\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t"+
		" \4!\t!\3\2\3\2\3\2\3\2\3\3\3\3\3\4\3\4\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3"+
		"\5\3\5\3\6\3\6\3\6\3\6\3\6\3\6\3\7\3\7\3\b\3\b\3\t\3\t\3\n\3\n\3\13\3"+
		"\13\3\f\3\f\3\r\3\r\3\16\3\16\3\16\3\16\3\16\3\16\3\16\3\16\5\16q\n\16"+
		"\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17"+
		"\3\17\5\17\u0082\n\17\3\20\3\20\3\20\3\20\7\20\u0088\n\20\f\20\16\20\u008b"+
		"\13\20\3\20\3\20\3\21\3\21\3\21\3\21\7\21\u0093\n\21\f\21\16\21\u0096"+
		"\13\21\3\21\3\21\3\22\3\22\5\22\u009c\n\22\3\23\6\23\u009f\n\23\r\23\16"+
		"\23\u00a0\3\24\3\24\3\24\3\24\3\25\3\25\3\26\3\26\3\27\3\27\7\27\u00ad"+
		"\n\27\f\27\16\27\u00b0\13\27\3\30\3\30\3\31\3\31\3\32\3\32\3\33\3\33\3"+
		"\34\3\34\3\34\3\34\3\34\3\35\3\35\3\35\3\35\3\35\3\36\3\36\3\36\3\37\3"+
		"\37\3 \6 \u00ca\n \r \16 \u00cb\3 \3 \3!\3!\3!\3!\7!\u00d4\n!\f!\16!\u00d7"+
		"\13!\3!\3!\3!\3!\3!\7!\u00de\n!\f!\16!\u00e1\13!\3!\3!\3!\3!\7!\u00e7"+
		"\n!\f!\16!\u00ea\13!\3!\5!\u00ed\n!\3!\3!\5\u00d5\u00df\u00e8\2\"\3\3"+
		"\5\4\7\5\t\6\13\7\r\b\17\t\21\n\23\13\25\f\27\r\31\16\33\17\35\20\37\21"+
		"!\22#\23%\2\'\2)\24+\2-\2/\25\61\26\63\27\65\30\67\319\32;\33=\34?\35"+
		"A\36\3\2\5\5\2C\\aac|\6\2\62<C\\aac|\5\2\13\f\17\17\"\"\2\u00f8\2\3\3"+
		"\2\2\2\2\5\3\2\2\2\2\7\3\2\2\2\2\t\3\2\2\2\2\13\3\2\2\2\2\r\3\2\2\2\2"+
		"\17\3\2\2\2\2\21\3\2\2\2\2\23\3\2\2\2\2\25\3\2\2\2\2\27\3\2\2\2\2\31\3"+
		"\2\2\2\2\33\3\2\2\2\2\35\3\2\2\2\2\37\3\2\2\2\2!\3\2\2\2\2#\3\2\2\2\2"+
		")\3\2\2\2\2/\3\2\2\2\2\61\3\2\2\2\2\63\3\2\2\2\2\65\3\2\2\2\2\67\3\2\2"+
		"\2\29\3\2\2\2\2;\3\2\2\2\2=\3\2\2\2\2?\3\2\2\2\2A\3\2\2\2\3C\3\2\2\2\5"+
		"G\3\2\2\2\7I\3\2\2\2\tK\3\2\2\2\13T\3\2\2\2\rZ\3\2\2\2\17\\\3\2\2\2\21"+
		"^\3\2\2\2\23`\3\2\2\2\25b\3\2\2\2\27d\3\2\2\2\31f\3\2\2\2\33p\3\2\2\2"+
		"\35\u0081\3\2\2\2\37\u0083\3\2\2\2!\u008e\3\2\2\2#\u009b\3\2\2\2%\u009e"+
		"\3\2\2\2\'\u00a2\3\2\2\2)\u00a6\3\2\2\2+\u00a8\3\2\2\2-\u00aa\3\2\2\2"+
		"/\u00b1\3\2\2\2\61\u00b3\3\2\2\2\63\u00b5\3\2\2\2\65\u00b7\3\2\2\2\67"+
		"\u00b9\3\2\2\29\u00be\3\2\2\2;\u00c3\3\2\2\2=\u00c6\3\2\2\2?\u00c9\3\2"+
		"\2\2A\u00ec\3\2\2\2CD\7N\2\2DE\7K\2\2EF\7D\2\2F\4\3\2\2\2GH\7}\2\2H\6"+
		"\3\2\2\2IJ\7\177\2\2J\b\3\2\2\2KL\7C\2\2LM\7V\2\2MN\7V\2\2NO\7T\2\2OP"+
		"\7K\2\2PQ\7D\2\2QR\7W\2\2RS\7V\2\2S\n\3\2\2\2TU\7N\2\2UV\7Q\2\2VW\7I\2"+
		"\2WX\7K\2\2XY\7E\2\2Y\f\3\2\2\2Z[\7*\2\2[\16\3\2\2\2\\]\7+\2\2]\20\3\2"+
		"\2\2^_\7.\2\2_\22\3\2\2\2`a\7]\2\2a\24\3\2\2\2bc\7_\2\2c\26\3\2\2\2de"+
		"\7?\2\2e\30\3\2\2\2fg\7\60\2\2g\32\3\2\2\2hi\7T\2\2ij\7K\2\2jk\7U\2\2"+
		"kq\7G\2\2lm\7H\2\2mn\7C\2\2no\7N\2\2oq\7N\2\2ph\3\2\2\2pl\3\2\2\2q\34"+
		"\3\2\2\2rs\7C\2\2st\7T\2\2tu\7T\2\2uv\7K\2\2vw\7X\2\2wx\7C\2\2x\u0082"+
		"\7N\2\2yz\7T\2\2z{\7G\2\2{|\7S\2\2|}\7W\2\2}~\7K\2\2~\177\7T\2\2\177\u0080"+
		"\7G\2\2\u0080\u0082\7F\2\2\u0081r\3\2\2\2\u0081y\3\2\2\2\u0082\36\3\2"+
		"\2\2\u0083\u0084\7*\2\2\u0084\u0089\5-\27\2\u0085\u0086\7.\2\2\u0086\u0088"+
		"\5-\27\2\u0087\u0085\3\2\2\2\u0088\u008b\3\2\2\2\u0089\u0087\3\2\2\2\u0089"+
		"\u008a\3\2\2\2\u008a\u008c\3\2\2\2\u008b\u0089\3\2\2\2\u008c\u008d\7+"+
		"\2\2\u008d \3\2\2\2\u008e\u008f\7*\2\2\u008f\u0094\5#\22\2\u0090\u0091"+
		"\7.\2\2\u0091\u0093\5#\22\2\u0092\u0090\3\2\2\2\u0093\u0096\3\2\2\2\u0094"+
		"\u0092\3\2\2\2\u0094\u0095\3\2\2\2\u0095\u0097\3\2\2\2\u0096\u0094\3\2"+
		"\2\2\u0097\u0098\7+\2\2\u0098\"\3\2\2\2\u0099\u009c\5%\23\2\u009a\u009c"+
		"\5\'\24\2\u009b\u0099\3\2\2\2\u009b\u009a\3\2\2\2\u009c$\3\2\2\2\u009d"+
		"\u009f\4\62;\2\u009e\u009d\3\2\2\2\u009f\u00a0\3\2\2\2\u00a0\u009e\3\2"+
		"\2\2\u00a0\u00a1\3\2\2\2\u00a1&\3\2\2\2\u00a2\u00a3\5%\23\2\u00a3\u00a4"+
		"\7\60\2\2\u00a4\u00a5\5%\23\2\u00a5(\3\2\2\2\u00a6\u00a7\5-\27\2\u00a7"+
		"*\3\2\2\2\u00a8\u00a9\4\62\63\2\u00a9,\3\2\2\2\u00aa\u00ae\t\2\2\2\u00ab"+
		"\u00ad\t\3\2\2\u00ac\u00ab\3\2\2\2\u00ad\u00b0\3\2\2\2\u00ae\u00ac\3\2"+
		"\2\2\u00ae\u00af\3\2\2\2\u00af.\3\2\2\2\u00b0\u00ae\3\2\2\2\u00b1\u00b2"+
		"\7#\2\2\u00b2\60\3\2\2\2\u00b3\u00b4\7-\2\2\u00b4\62\3\2\2\2\u00b5\u00b6"+
		"\7,\2\2\u00b6\64\3\2\2\2\u00b7\u00b8\7=\2\2\u00b8\66\3\2\2\2\u00b9\u00ba"+
		"\7B\2\2\u00ba\u00bb\7U\2\2\u00bb\u00bc\7G\2\2\u00bc\u00bd\7S\2\2\u00bd"+
		"8\3\2\2\2\u00be\u00bf\7B\2\2\u00bf\u00c0\7V\2\2\u00c0\u00c1\7T\2\2\u00c1"+
		"\u00c2\7K\2\2\u00c2:\3\2\2\2\u00c3\u00c4\7?\2\2\u00c4\u00c5\7@\2\2\u00c5"+
		"<\3\2\2\2\u00c6\u00c7\7<\2\2\u00c7>\3\2\2\2\u00c8\u00ca\t\4\2\2\u00c9"+
		"\u00c8\3\2\2\2\u00ca\u00cb\3\2\2\2\u00cb\u00c9\3\2\2\2\u00cb\u00cc\3\2"+
		"\2\2\u00cc\u00cd\3\2\2\2\u00cd\u00ce\b \2\2\u00ce@\3\2\2\2\u00cf\u00d0"+
		"\7\61\2\2\u00d0\u00d1\7\61\2\2\u00d1\u00d5\3\2\2\2\u00d2\u00d4\13\2\2"+
		"\2\u00d3\u00d2\3\2\2\2\u00d4\u00d7\3\2\2\2\u00d5\u00d6\3\2\2\2\u00d5\u00d3"+
		"\3\2\2\2\u00d6\u00d8\3\2\2\2\u00d7\u00d5\3\2\2\2\u00d8\u00ed\7\f\2\2\u00d9"+
		"\u00da\7\61\2\2\u00da\u00db\7,\2\2\u00db\u00df\3\2\2\2\u00dc\u00de\13"+
		"\2\2\2\u00dd\u00dc\3\2\2\2\u00de\u00e1\3\2\2\2\u00df\u00e0\3\2\2\2\u00df"+
		"\u00dd\3\2\2\2\u00e0\u00e2\3\2\2\2\u00e1\u00df\3\2\2\2\u00e2\u00e3\7,"+
		"\2\2\u00e3\u00ed\7\61\2\2\u00e4\u00e8\7%\2\2\u00e5\u00e7\13\2\2\2\u00e6"+
		"\u00e5\3\2\2\2\u00e7\u00ea\3\2\2\2\u00e8\u00e9\3\2\2\2\u00e8\u00e6\3\2"+
		"\2\2\u00e9\u00eb\3\2\2\2\u00ea\u00e8\3\2\2\2\u00eb\u00ed\7\f\2\2\u00ec"+
		"\u00cf\3\2\2\2\u00ec\u00d9\3\2\2\2\u00ec\u00e4\3\2\2\2\u00ed\u00ee\3\2"+
		"\2\2\u00ee\u00ef\b!\3\2\u00efB\3\2\2\2\17\2p\u0081\u0089\u0094\u009b\u00a0"+
		"\u00ae\u00cb\u00d5\u00df\u00e8\u00ec\4\2\3\2\b\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}