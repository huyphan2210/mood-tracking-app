export type Styles = {
  'appear': string;
  'header': string;
  'headerProfile': string;
  'headerProfileAvatar': string;
  'headerProfileMenu': string;
  'headerProfileMenuActions': string;
  'headerProfileMenuActionsItemBtn': string;
  'headerProfileMenuActionsItemBtnName': string;
  'headerProfileMenuEmail': string;
  'headerProfileMenuName': string;
  'open': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
