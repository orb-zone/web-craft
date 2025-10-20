import type { ExpressionContext, ResolverContext } from "./types.js";
export declare class ExpressionEvaluator {
    private context;
    constructor(context: ExpressionContext);
    evaluate(expression: string): Promise<any>;
    private hasTemplateLiterals;
    private hasFunctionCalls;
    private resolveScopedValue;
    resolveTreeWalkingValue(property: string): any;
    private resolveParentReference;
    private computeParentReferenceTarget;
    private evaluateTemplateLiteral;
    private executeTemplateExpression;
    private interpolateVariables;
    private executeExpression;
    private handleError;
    private createResolverContext;
    private flattenResolvers;
    private resolvePronounPlaceholder;
}
export declare function createExpressionEvaluator(data: Record<string, any>, resolvers: ResolverContext, path?: string[], options?: any, fullPath?: string, dottedInstance?: any): ExpressionEvaluator;
//# sourceMappingURL=expression-evaluator.d.ts.map