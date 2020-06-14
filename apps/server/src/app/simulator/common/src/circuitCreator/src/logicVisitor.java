// Generated from logic.g4 by ANTLR 4.7.2
import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link logicParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
public interface logicVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by {@link logicParser#circuit}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCircuit(logicParser.CircuitContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#library}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitLibrary(logicParser.LibraryContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#function}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFunction(logicParser.FunctionContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#bloc}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBloc(logicParser.BlocContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#user_def}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitUser_def(logicParser.User_defContext ctx);
	/**
	 * Visit a parse tree produced by the {@code EnumInParam}
	 * labeled alternative in {@link logicParser#inparam}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEnumInParam(logicParser.EnumInParamContext ctx);
	/**
	 * Visit a parse tree produced by the {@code BusInParam}
	 * labeled alternative in {@link logicParser#inparam}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBusInParam(logicParser.BusInParamContext ctx);
	/**
	 * Visit a parse tree produced by the {@code EnumOutParam}
	 * labeled alternative in {@link logicParser#outparam}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEnumOutParam(logicParser.EnumOutParamContext ctx);
	/**
	 * Visit a parse tree produced by the {@code BusOutParam}
	 * labeled alternative in {@link logicParser#outparam}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBusOutParam(logicParser.BusOutParamContext ctx);
	/**
	 * Visit a parse tree produced by the {@code EnumIoParam}
	 * labeled alternative in {@link logicParser#ioparam}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEnumIoParam(logicParser.EnumIoParamContext ctx);
	/**
	 * Visit a parse tree produced by the {@code BusIoParam}
	 * labeled alternative in {@link logicParser#ioparam}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBusIoParam(logicParser.BusIoParamContext ctx);
	/**
	 * Visit a parse tree produced by the {@code InstLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInstLogStmt(logicParser.InstLogStmtContext ctx);
	/**
	 * Visit a parse tree produced by the {@code EqLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEqLogStmt(logicParser.EqLogStmtContext ctx);
	/**
	 * Visit a parse tree produced by the {@code SeqLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitSeqLogStmt(logicParser.SeqLogStmtContext ctx);
	/**
	 * Visit a parse tree produced by the {@code TriLogStmt}
	 * labeled alternative in {@link logicParser#log_stmt}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTriLogStmt(logicParser.TriLogStmtContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#biblis}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBiblis(logicParser.BiblisContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#att_stmt}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAtt_stmt(logicParser.Att_stmtContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#expr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitExpr(logicParser.ExprContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#multExpr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMultExpr(logicParser.MultExprContext ctx);
	/**
	 * Visit a parse tree produced by the {@code SimplePhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitSimplePhase(logicParser.SimplePhaseContext ctx);
	/**
	 * Visit a parse tree produced by the {@code InvPhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInvPhase(logicParser.InvPhaseContext ctx);
	/**
	 * Visit a parse tree produced by the {@code ExprPhase}
	 * labeled alternative in {@link logicParser#phase}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitExprPhase(logicParser.ExprPhaseContext ctx);
	/**
	 * Visit a parse tree produced by the {@code SimpleAtom}
	 * labeled alternative in {@link logicParser#atom}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitSimpleAtom(logicParser.SimpleAtomContext ctx);
	/**
	 * Visit a parse tree produced by {@link logicParser#param_seq}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitParam_seq(logicParser.Param_seqContext ctx);
}