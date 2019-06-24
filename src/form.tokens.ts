export type FormStrategies = 'change' | 'input' | 'none';
export interface FormOptions {
  name: string;
  strategy?: FormStrategies;
}
