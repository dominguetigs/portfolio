import { LOADING_CODE_PT, LOADING_CODE_ES, LOADING_CODE_EN } from './constants';

export function getLoadingCode(locale: string) {
  if (locale === 'pt') {
    return LOADING_CODE_PT;
  }
  if (locale === 'es') {
    return LOADING_CODE_ES;
  }
  if (locale === 'en') {
    return LOADING_CODE_EN;
  }

  return LOADING_CODE_EN;
}
