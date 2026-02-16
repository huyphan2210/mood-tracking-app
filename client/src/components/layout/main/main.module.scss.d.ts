export type Styles = {
  'main': string;
  'main--authentication': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
