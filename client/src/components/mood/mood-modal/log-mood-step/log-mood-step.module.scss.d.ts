export type Styles = {
  'chosen': string;
  'moodStep_Heading': string;
  'moodStep_List': string;
  'moodStep_List_Option': string;
  'moodStep_List_Option_Input': string;
  'moodStep_List_Option_Label': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
