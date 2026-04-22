export type Styles = {
  'fullHeight': string;
  'logMoodBtn': string;
  'moodDashboard': string;
  'moodDashboard_Average': string;
  'moodDashboard_Feeling': string;
  'moodDashboard_Reflection': string;
  'moodDashboard_Sleep': string;
  'moodDashboard_Trends': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
