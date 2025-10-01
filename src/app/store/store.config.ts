import { NgxsDevtoolsOptions } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginOptions } from '@ngxs/logger-plugin';
import { NgxsConfig } from '@ngxs/store';
import { AuthState, ProductsState, RegionsState } from 'projects/medusa-store/src/public-api';
import { KeyboardState } from './keyboard/keyboard.state';
import { LanguageState } from './language/language.state';
import { FormState } from './forms/form.state';
import { ThemeState } from './theme/theme.state';

export const STATES_MODULES = [
  ProductsState,
  RegionsState,
  AuthState,
  LanguageState,
  KeyboardState,
  FormState,
  ThemeState
];

export const STORAGE_MODULES = [
  'products',
  'regions',
  'auth',
  'language',
  'keyboard',
  'form',
  'theme'
];

export const OPTIONS_CONFIG: Partial<NgxsConfig> = {
  developmentMode: true
};

export const DEVTOOLS_REDUX_CONFIG: NgxsDevtoolsOptions = {
  disabled: false
};

export const LOGGER_CONFIG: NgxsLoggerPluginOptions = {
  disabled: true
};
