export type FormStrategies = 'change' | 'input' | 'none';
export interface FormOptions {
  name: string;
  strategy?: FormStrategies;
}

export interface FormInputOptions {
  [key: string]: [string, Function[]];
}
