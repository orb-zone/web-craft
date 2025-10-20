import { Plugin, DottedValue } from "@orb-zone/dotted";

export interface PiniaColadaPluginOptions {
  useColada?: any;
}

export function withPiniaColada(options: PiniaColadaPluginOptions = {}): Plugin {
  return {
    name: "pinia-colada",
    onGet: (path: string, value: DottedValue) => {
      return value;
    }
  };
}
