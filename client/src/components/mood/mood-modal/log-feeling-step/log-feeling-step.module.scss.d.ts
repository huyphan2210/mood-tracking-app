export type Styles = {
  'chosen': string;
  'disabled': string;
  'feelingStep_Heading': string;
  'feelingStep_Instruction': string;
  'feelingStep_List': string;
  'feelingStep_List_Option': string;
  'feelingStep_List_Option_Input': string;
  'feelingStep_List_Option_Label': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
