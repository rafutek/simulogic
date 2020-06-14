// Generated from logic.g4 by ANTLR 4.7.2
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link logicParser}.
 */
public interface logicListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link logicParser#circuit}.
	 * @param ctx the parse tree
	 */
	void enterCircuit(logicParser.CircuitContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#circuit}.
	 * @param ctx the parse tree
	 */
	void exitCircuit(logicParser.CircuitContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#library}.
	 * @param ctx the parse tree
	 */
	void enterLibrary(logicParser.LibraryContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#library}.
	 * @param ctx the parse tree
	 */
	void exitLibrary(logicParser.LibraryContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#function}.
	 * @param ctx the parse tree
	 */
	void enterFunction(logicParser.FunctionContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#function}.
	 * @param ctx the parse tree
	 */
	void exitFunction(logicParser.FunctionContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#bloc}.
	 * @param ctx the parse tree
	 */
	void enterBloc(logicParser.BlocContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#bloc}.
	 * @param ctx the parse tree
	 */
	void exitBloc(logicParser.BlocContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#user_def}.
	 * @param ctx the parse tree
	 */
	void enterUser_def(logicParser.User_defContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#user_def}.
	 * @param ctx the parse tree
	 */
	void exitUser_def(logicParser.User_defContext ctx);
	/**
	 * Enter a parse tree produced by the {@code EnumInParam}
	 * labeled alternative in {@link logicParser#inparam}.
	 * @param ctx the parse tree
	 */
	void enterEnumInParam(logicParser.EnumInParamContext ctx);
	/**
	 * Exit a parse tree produced by the {@code EnumInParam}
	 * labeled alternative in {@link logicParser#inparam}.
	 * @param ctx the parse tree
	 */
	void exitEnumInParam(logicParser.EnumInParamContext ctx);
	/**
	 * Enter a parse tree produced by the {@code BusInParam}
	 * labeled alternative in {@link logicParser#inparam}.
	 * @param ctx the parse tree
	 */
	void enterBusInParam(logicParser.BusInParamContext ctx);
	/**
	 * Exit a parse tree produced by the {@code BusInParam}
	 * labeled alternative in {@link logicParser#inparam}.
	 * @param ctx the parse tree
	 */
	void exitBusInParam(logicParser.BusInParamContext ctx);
	/**
	 * Enter a parse tree produced by the {@code EnumOutParam}
	 * labeled alternative in {@link logicParser#outparam}.
	 * @param ctx the parse tree
	 */
	void enterEnumOutParam(logicParser.EnumOutParamContext ctx);
	/**
	 * Exit a parse tree produced by the {@code EnumOutParam}
	 * labeled alternative in {@link logicParser#outparam}.
	 * @param ctx the parse tree
	 */
	void exitEnumOutParam(logicParser.EnumOutParamContext ctx);
	/**
	 * Enter a parse tree produced by the {@code BusOutParam}
	 * labeled alternative in {@link logicParser#outparam}.
	 * @param ctx the parse tree
	 */
	void enterBusOutParam(logicParser.BusOutParamContext ctx);
	/**
	 * Exit a parse tree produced by the {@code BusOutParam}
	 * labeled alternative in {@link logicParser#outparam}.
	 * @param ctx the parse tree
	 */
	void exitBusOutParam(logicParser.BusOutParamContext ctx);
	/**
	 * Enter a parse tree produced by the {@code EnumIoParam}
	 * labeled alternative in {@link logicParser#ioparam}.
	 * @param ctx the parse tree
	 */
	void enterEnumIoParam(logicParser.EnumIoParamContext ctx);
	/**
	 * Exit a parse tree produced by the {@code EnumIoParam}
	 * labeled alternative in {@link logicParser#ioparam}.
	 * @param ctx the parse tree
	 */
	void exitEnumIoParam(logicParser.EnumIoParamContext ctx);
	/**
	 * Enter a parse tree produced by the {@code BusIoParam}
	 * labeled alternative in {@link logicParser#ioparam}.
	 * @param ctx the parse tree
	 */
	void enterBusIoParam(logicParser.BusIoParamContext ctx);
	/**
	 * Exit a parse tree produced by the {@code BusIoParam}
	 * labeled alternative in {@link logicParser#ioparam}.
	 * @param ctx the parse tree
	 */
	void exitBusIoParam(logicParser.BusIoParamContext ctx);
	/**
	 * Enter a parse tree produced by the {@code InstLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 */
	void enterInstLogStmt(logicParser.InstLogStmtContext ctx);
	/**
	 * Exit a parse tree produced by the {@code InstLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 */
	void exitInstLogStmt(logicParser.InstLogStmtContext ctx);
	/**
	 * Enter a parse tree produced by the {@code EqLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 */
	void enterEqLogStmt(logicParser.EqLogStmtContext ctx);
	/**
	 * Exit a parse tree produced by the {@code EqLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 */
	void exitEqLogStmt(logicParser.EqLogStmtContext ctx);
	/**
	 * Enter a parse tree produced by the {@code SeqLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 */
	void enterSeqLogStmt(logicParser.SeqLogStmtContext ctx);
	/**
	 * Exit a parse tree produced by the {@code SeqLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 */
	void exitSeqLogStmt(logicParser.SeqLogStmtContext ctx);
	/**
	 * Enter a parse tree produced by the {@code TriLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 */
	void enterTriLogStmt(logicParser.TriLogStmtContext ctx);
	/**
	 * Exit a parse tree produced by the {@code TriLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 */
	void exitTriLogStmt(logicParser.TriLogStmtContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#biblis}.
	 * @param ctx the parse tree
	 */
	void enterBiblis(logicParser.BiblisContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#biblis}.
	 * @param ctx the parse tree
	 */
	void exitBiblis(logicParser.BiblisContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#att_stmt}.
	 * @param ctx the parse tree
	 */
	void enterAtt_stmt(logicParser.Att_stmtContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#att_stmt}.
	 * @param ctx the parse tree
	 */
	void exitAtt_stmt(logicParser.Att_stmtContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterExpr(logicParser.ExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitExpr(logicParser.ExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#multExpr}.
	 * @param ctx the parse tree
	 */
	void enterMultExpr(logicParser.MultExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#multExpr}.
	 * @param ctx the parse tree
	 */
	void exitMultExpr(logicParser.MultExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code SimplePhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 */
	void enterSimplePhase(logicParser.SimplePhaseContext ctx);
	/**
	 * Exit a parse tree produced by the {@code SimplePhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 */
	void exitSimplePhase(logicParser.SimplePhaseContext ctx);
	/**
	 * Enter a parse tree produced by the {@code InvPhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 */
	void enterInvPhase(logicParser.InvPhaseContext ctx);
	/**
	 * Exit a parse tree produced by the {@code InvPhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 */
	void exitInvPhase(logicParser.InvPhaseContext ctx);
	/**
	 * Enter a parse tree produced by the {@code ExprPhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 */
	void enterExprPhase(logicParser.ExprPhaseContext ctx);
	/**
	 * Exit a parse tree produced by the {@code ExprPhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 */
	void exitExprPhase(logicParser.ExprPhaseContext ctx);
	/**
	 * Enter a parse tree produced by the {@code SimpleAtom}
	 * labeled alternative in {@link logicParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterSimpleAtom(logicParser.SimpleAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code SimpleAtom}
	 * labeled alternative in {@link logicParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitSimpleAtom(logicParser.SimpleAtomContext ctx);
	/**
	 * Enter a parse tree produced by {@link logicParser#param_seq}.
	 * @param ctx the parse tree
	 */
	void enterParam_seq(logicParser.Param_seqContext ctx);
	/**
	 * Exit a parse tree produced by {@link logicParser#param_seq}.
	 * @param ctx the parse tree
	 */
	void exitParam_seq(logicParser.Param_seqContext ctx);
}