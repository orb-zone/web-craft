import { getProperty as dotGet } from "dot-prop";
import {
  resolvePronoun,
  isPronounPlaceholder,
  extractPronounForm,
  type Gender,
} from "./pronouns.js";
import { typeCoercionHelpers } from "./helpers/type-coercion.js";
import type { ExpressionContext, ResolverContext } from "./types.js";

const VARIABLE_REFERENCE_PATTERN =
  /(?:\.{1,}[a-zA-Z_$][a-zA-Z0-9_$.]*|[a-zA-Z_$][a-zA-Z0-9_$.]*)(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*/g;
const SIMPLE_PATH_PATTERN = /^\.{0,}[a-zA-Z_$][a-zA-Z0-9_$.]*$/;

export class ExpressionEvaluator {
  private context: ExpressionContext;

  constructor(context: ExpressionContext) {
    this.context = context;
  }

  async evaluate(expression: string): Promise<any> {
    const hasTemplateLiterals = this.hasTemplateLiterals(expression);
    const hasFunctionCalls = this.hasFunctionCalls(expression);

    if (!hasTemplateLiterals && !hasFunctionCalls) {
      return expression;
    }

    if (hasTemplateLiterals && !hasFunctionCalls) {
      return await this.evaluateTemplateLiteral(expression);
    } else {
      const interpolatedExpression = this.interpolateVariables(expression);
      const pathStr =
        this.context.fullPath ||
        (this.context.path.length > 0 ? this.context.path.join(".") : "unknown");
      return await this.executeExpression(interpolatedExpression, pathStr);
    }
  }

  private hasTemplateLiterals(expression: string): boolean {
    return typeof expression === "string" && expression.includes("${");
  }

  private hasFunctionCalls(expression: string): boolean {
    return /[a-zA-Z_$][a-zA-Z0-9_$.]*\s*\(/.test(expression);
  }

  private resolveScopedValue(varPath: string): any {
    const leadingDots = varPath.match(/^\.+/)?.[0].length ?? 0;

    if (leadingDots > 1) {
      return this.resolveParentReference(varPath, leadingDots);
    }

    if (leadingDots === 1) {
      return this.resolveTreeWalkingValue(varPath.substring(1));
    }

    if (this.context.path && this.context.path.length > 0) {
      const scopedPath = `${this.context.path.join(".")}.${varPath}`;
      const scopedValue = dotGet(this.context.data, scopedPath);

      if (scopedValue !== undefined) {
        return scopedValue;
      }
    }

    return dotGet(this.context.data, varPath) ?? undefined;
  }

  public resolveTreeWalkingValue(property: string): any {
    const currentPath = this.context.path || [];

    for (let depth = currentPath.length; depth >= 0; depth--) {
      const pathSegments = currentPath.slice(0, depth);
      const testPath =
        pathSegments.length > 0
          ? `${pathSegments.join(".")}.${property}`
          : property;

      const value = dotGet(this.context.data, testPath);
      if (value !== undefined) {
        return value;
      }
    }

    return undefined;
  }

  private resolveParentReference(varPath: string, leadingDots: number): any {
    const { targetPath, propertySegments, propertyPath } =
      this.computeParentReferenceTarget(varPath, leadingDots);

    const value = targetPath
      ? dotGet(this.context.data, targetPath)
      : this.context.data;

    if (value !== undefined) {
      return value;
    }

    if (propertySegments.length === 1) {
      const [property] = propertySegments;
      const targetPathSegments = targetPath ? targetPath.split(".") : [];
      for (let depth = targetPathSegments.length; depth >= 0; depth--) {
        const pathSegments = targetPathSegments.slice(0, depth);
        const testPath =
          pathSegments.length > 0
            ? `${pathSegments.join(".")}.${property}`
            : property;

        const treeValue = dotGet(this.context.data, testPath!);
        if (treeValue !== undefined) {
          return treeValue;
        }
      }
    }

    const currentPathStr =
      this.context.path && this.context.path.length > 0
        ? this.context.path.join(".")
        : "(root)";
    const resolvedPath = targetPath || propertyPath || "(root)";
    throw new Error(
      `Parent reference '${varPath}' at '${currentPathStr}' resolved to undefined path '${resolvedPath}'`
    );
  }

  private computeParentReferenceTarget(
    varPath: string,
    leadingDots: number
  ): {
    targetPath: string;
    parentLevels: number;
    availableLevels: number;
    baseSegments: string[];
    propertySegments: string[];
    propertyPath: string;
  } {
    const currentPathSegments = Array.isArray(this.context.path)
      ? [...this.context.path]
      : [];
    const currentPathStr =
      currentPathSegments.length > 0
        ? currentPathSegments.join(".")
        : "(root)";

    const parentSegments = currentPathSegments.slice(0, -1);
    const parentLevels = leadingDots - 1;
    const availableLevels = currentPathSegments.length;

    if (availableLevels < parentLevels) {
      throw new Error(
        `Parent reference '${varPath}' at '${currentPathStr}' goes beyond root (requires ${parentLevels} parent levels, only ${availableLevels} available)`
      );
    }

    const baseSegments =
      parentLevels > 0
        ? parentSegments.slice(0, availableLevels - parentLevels)
        : parentSegments;
    const propertyPath = varPath.substring(leadingDots);
    const propertySegments = propertyPath ? propertyPath.split(".") : [];
    const targetSegments = [...baseSegments, ...propertySegments];
    const targetPath = targetSegments.filter(Boolean).join(".");

    return {
      targetPath,
      parentLevels,
      availableLevels,
      baseSegments,
      propertySegments,
      propertyPath,
    };
  }

  private async evaluateTemplateLiteral(expression: string): Promise<any> {
    const singleVarMatch = expression.trim().match(/^\$\{([^}]+)\}$/);
    if (singleVarMatch && singleVarMatch[1]) {
      const varPath = singleVarMatch[1].trim();

      if (isPronounPlaceholder(varPath)) {
        return this.resolvePronounPlaceholder(varPath);
      }

      if (!SIMPLE_PATH_PATTERN.test(varPath)) {
        return this.executeTemplateExpression(expression);
      }

      return this.resolveScopedValue(varPath);
    }

    const isQuotedString = /^["'].*["']$/.test(expression.trim());

    const sanitizedExpression = expression.replace(/\$\{(:[a-z]+)\}/g, "${PRONOUN}");

    const hasOperatorsInside = /\$\{[^}]*[+\-*/()[\]<>!=&|?:][^}]*\}/g.test(
      sanitizedExpression
    );
    const hasOperatorsOutside =
      /\$\{[^}]+\}\s*[+\-*/()[\]<>!=&|?:]/.test(sanitizedExpression) ||
      /[+\-*/()[\]<>!=&|?:]\s*\$\{[^}]+\}/.test(sanitizedExpression);

    if (isQuotedString || hasOperatorsInside || hasOperatorsOutside) {
      return this.executeTemplateExpression(expression);
    }

    return expression.replace(/\$\{([^}]+)\}/g, (_match, path) => {
      const trimmedPath = path.trim();

      if (isPronounPlaceholder(trimmedPath)) {
        return this.resolvePronounPlaceholder(trimmedPath);
      }

      if (trimmedPath.startsWith(":")) {
        return `\${${trimmedPath}}`;
      }

      const value = this.resolveScopedValue(trimmedPath);

      if (value === undefined || value === null) {
        return "undefined";
      }

      return String(value);
    });
  }

  private executeTemplateExpression(expression: string): any {
    try {
      let processedExpression = expression;
      const pronounMatches = expression.matchAll(/\$\{(:[a-z]+)\}/g);

      for (const match of pronounMatches) {
        const placeholder = match[1];
        const fullMatch = match[0];
        if (placeholder && fullMatch && isPronounPlaceholder(placeholder)) {
          const resolved = this.resolvePronounPlaceholder(placeholder);
          processedExpression = processedExpression.replace(fullMatch, resolved);
        }
      }

      const variables: Record<string, any> = {};
      const matches = processedExpression.matchAll(/\$\{([^}]+)\}/g);

      for (const match of matches) {
        const expr = match[1];
        if (!expr) continue;

        const varNames = expr.match(VARIABLE_REFERENCE_PATTERN) || [];

        for (const varName of varNames) {
          if (!(varName in variables)) {
            const value = this.resolveScopedValue(varName);

            if (value !== undefined) {
              variables[varName] = value;

              const actualVarName = varName.startsWith(".")
                ? varName.substring(1)
                : varName;
              if (actualVarName.includes(".")) {
                const safeName = actualVarName.replace(/\./g, "_");
                variables[safeName] = value;
              }
            }
          }
        }
      }

      const hasTemplateLiterals = processedExpression.includes("${");

      const safeVariables: Record<string, any> = {};
      let safeExpression = processedExpression;

      for (const [varName, value] of Object.entries(variables)) {
        let safeName = varName;
        if (varName.startsWith(".")) {
          const normalizedName = varName.substring(1).replace(/\./g, "_");
          safeName = `_dot_${normalizedName}`;
          safeExpression = safeExpression.replace(
            new RegExp(varName.replace(/\./g, "\\.") + "\\b", "g"),
            safeName
          );
        } else if (varName.includes(".")) {
          safeName = varName.replace(/\./g, "_");
          safeExpression = safeExpression.replace(
            new RegExp(varName.replace(/\./g, "\\."), "g"),
            safeName
          );
        } else {
          safeVariables[varName] = value;
          continue;
        }
        safeVariables[safeName] = value;
      }

      let result;
      if (hasTemplateLiterals) {
        const isQuotedExpression = /^["'].*["']$/.test(expression.trim());

        let templateResult;
        if (isQuotedExpression) {
          const asTemplateLiteral = safeExpression
            .replace(/^["']/, "`")
            .replace(/["']$/, "`");
          const func = new Function(
            ...Object.keys(safeVariables),
            "return " + asTemplateLiteral
          );
          templateResult = func(...Object.values(safeVariables));
        } else {
          const func = new Function(
            ...Object.keys(safeVariables),
            "return `" + safeExpression + "`"
          );
          templateResult = func(...Object.values(safeVariables));
        }

        const templateCount = (
          processedExpression.match(/\$\{[^}]+\}/g) || []
        ).length;
        const withoutTemplates = processedExpression.replace(/\$\{[^}]+\}/g, "");
        const hasOperatorsOutsideTemplates = /[+\-*/()[\]<>=!&|?:]/.test(
          withoutTemplates
        );

        if (
          templateCount === 1 &&
          hasOperatorsOutsideTemplates &&
          typeof templateResult === "string" &&
          /^[\d\s+\-*/().]+$/.test(templateResult)
        ) {
          try {
            const evalFunc = new Function("return " + templateResult);
            result = evalFunc();
          } catch {
            result = templateResult;
          }
        } else {
          result = templateResult;
        }
      } else {
        const func = new Function(
          ...Object.keys(safeVariables),
          "return " + safeExpression
        );
        result = func(...Object.values(safeVariables));
      }

      const numResult = Number(result);
      if (!isNaN(numResult) && String(numResult) === String(result).trim()) {
        return numResult;
      }

      return result;
    } catch (_error) {
      return expression;
    }
  }

  private interpolateVariables(expression: string): string {
    return expression.replace(/\$\{([^}]+)\}/g, (_match, pathStr) => {
      const trimmedPath = pathStr.trim();

      const value = this.resolveScopedValue(trimmedPath);

      if (value === undefined || value === null) {
        return SIMPLE_PATH_PATTERN.test(trimmedPath) ? "undefined" : trimmedPath;
      }

      if (typeof value === "string") {
        const strValue = value;
        return `"${strValue.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
      } else if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
      } else if (typeof value === "object") {
        return JSON.stringify(value);
      }

      return String(value);
    });
  }

  private async executeExpression(
    expression: string,
    path?: string
  ): Promise<any> {
    const resolverContext = this.createResolverContext();

    try {
      const func = new Function(
        ...Object.keys(resolverContext),
        `return ${expression}`
      );
      const result = func(...Object.values(resolverContext));

      if (result && typeof result.then === "function") {
        return await result;
      }

      return result;
    } catch (_error) {
      const error =
        _error instanceof Error
          ? _error
          : new Error(
              `Expression execution failed: ${expression} - ${String(_error)}`
            );

      return this.handleError(error, path || "unknown");
    }
  }

  private handleError(error: Error, path: string): any {
    const options = this.context.options;

    if (options?.onError) {
      const result = options.onError(error, path);

      if (result === "throw") {
        throw error;
      }

      return result;
    }

    throw error;
  }

  private createResolverContext(): Record<string, any> {
    const context: Record<string, any> = {};

    Object.assign(context, typeCoercionHelpers);

    if (this.context.dottedInstance) {
      context.fresh = async (path: string) => {
        return await this.context.dottedInstance.get(path, { fresh: true });
      };
    }

    this.flattenResolvers(this.context.resolvers, context);

    return context;
  }

  private flattenResolvers(
    resolvers: ResolverContext,
    target: Record<string, any>,
    prefix = ""
  ): void {
    for (const [key, value] of Object.entries(resolvers)) {
      const fullKey = prefix ? `${prefix}_${key}` : key;

      if (typeof value === "function") {
        target[fullKey] = value;
      } else if (typeof value === "object" && value !== null) {
        target[key] = value;
        this.flattenResolvers(value, target, fullKey);
      } else {
        target[fullKey] = value;
      }
    }
  }

  private resolvePronounPlaceholder(placeholder: string): string {
    const form = extractPronounForm(placeholder);
    if (!form) return placeholder;

    const gender = (this.resolveTreeWalkingValue("gender") || "x") as Gender;
    const lang = (this.resolveTreeWalkingValue("lang") || "en") as string;

    return resolvePronoun(form, gender, lang);
  }
}

export function createExpressionEvaluator(
  data: Record<string, any>,
  resolvers: ResolverContext,
  path: string[] = [],
  options?: any,
  fullPath?: string,
  dottedInstance?: any
): ExpressionEvaluator {
  return new ExpressionEvaluator({
    data,
    resolvers,
    path,
    fullPath,
    options,
    dottedInstance,
  });
}
