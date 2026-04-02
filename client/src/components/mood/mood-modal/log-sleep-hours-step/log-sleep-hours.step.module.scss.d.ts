export type Styles = {
  'chosen': string;
  'moodStep_List_Option_Label': string;
  'sleepHoursStep_Heading': string;
  'sleepHoursStep_List': string;
  'sleepHoursStep_List_Option': string;
  'sleepHoursStep_List_Option_Input': string;
  'sleepHoursStep_List_Option_Label': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
