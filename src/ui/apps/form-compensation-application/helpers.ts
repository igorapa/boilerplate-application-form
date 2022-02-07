import * as constants from './constants'

function isValidText(value: string): boolean {
  return Boolean(value.trim())
}

export function getTextError(value: string, isRequired: boolean) {
  if (isRequired && !isValidText(value)) {
    return constants.TEXTS.validationRequiredField
  }

  return ''
}