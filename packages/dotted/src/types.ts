export type DottedValue = string | number | boolean | null | undefined | DottedObject | DottedArray;

export interface DottedObject {
  [key: string]: DottedValue;
}

export type DottedArray = DottedValue[];

export interface DottedOptions {
  variant?: string | string[];
  resolvers?: Record<string, (...args: any[]) => any>;
  fallback?: any;
  initial?: Record<string, any>;
  maxEvaluationDepth?: number;
  onError?: (error: Error, path: string) => "throw" | "fallback" | any;
}

export interface GetOptions {
  fresh?: boolean;
  fallback?: any;
}

export interface SetOptions {}

export interface HasOptions {
  fresh?: boolean;
}

export interface VariantContext {
  [key: string]: string;
}

export interface ExpressionContext {
  data: Record<string, any>;
  path: string[];
  resolvers: Record<string, (...args: any[]) => any>;
  options?: DottedOptions;
  fullPath?: string;
  dottedInstance?: any;
}

export interface ResolverContext {
  [key: string]: (...args: any[]) => any;
}

export interface DottedJsonOptions {
  variant?: string | string[];
  separator?: string;
  plugins?: Plugin[];
}

export interface Plugin {
  name: string;
  onGet?: (path: string, value: DottedValue) => DottedValue;
  onSet?: (path: string, value: DottedValue) => DottedValue;
  validate?: (data: DottedObject) => boolean;
}

export interface VariantResolutionOptions {
  preferredVariants?: string[];
  fallbackVariant?: string;
}

export interface StorageProvider {
  load(path: string): Promise<DottedObject>;
  save(path: string, data: DottedObject): Promise<void>;
  exists(path: string): Promise<boolean>;
}

export interface ValidationOptions {
  enabled: boolean;
  validate: (path: string, value: any) => any;
  validateResolver: (name: string, input: any[], output: any) => any;
}
