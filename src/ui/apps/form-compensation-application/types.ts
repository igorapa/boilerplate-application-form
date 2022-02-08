export type StepType = {
  id: string;
  title: string;
  subtitle: string;
  fields: FieldType[];
};

export type FieldType = {
  id: string;
  label: string;
  isRequired: boolean;
  type: string;
  dependsOn?: string[];
};

export type DraftType<PropertyName extends string> = {
  [P in PropertyName]: string | number | boolean;
};

export type ErrorType = {
  error: string;
  isInvalid: boolean;
};

export type ErrorsType<PropertyName extends string> = {
  [P in PropertyName]: ErrorType;
};
