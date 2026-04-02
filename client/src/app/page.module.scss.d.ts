export type Styles = {
  'homeGreeting': string;
  'homeGreetingSection': string;
  'homeHeading': string;
  'homeTime': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
