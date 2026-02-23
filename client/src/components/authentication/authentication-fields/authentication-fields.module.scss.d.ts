export type Styles = {
  'authentication-field-set': string;
  'authentication-field-set_field-wrapper': string;
  'authentication-field-set_field-wrapper_input': string;
  'authentication-field-set_field-wrapper_label': string;
  'authentication-field-set_field-wrapper_note': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
