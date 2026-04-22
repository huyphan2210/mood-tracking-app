export type Styles = {
  'averageCard_Item_Content': string;
  'averageCard_Item_Content_Description': string;
  'averageCard_Item_Content_Title': string;
  'averageCard_Item_Heading': string;
  'bg-amber': string;
  'bg-blue': string;
  'bg-green': string;
  'bg-indigo': string;
  'bg-light-blue': string;
  'bg-red': string;
  'fullOpacity': string;
  'textWhite': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
