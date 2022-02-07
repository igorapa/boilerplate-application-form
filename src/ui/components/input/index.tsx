/* eslint-disable react/jsx-props-no-spreading */
import classnames from 'classnames';
import { isUndefined } from 'lodash';
import React, { useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { IconDate, IconSearch } from './icons';
import { colors, fontFamilies } from '../../theme';
import { useDebouncedCallback } from '../../hooks/debounced-callback';
import { parsePhoneNumberUS } from '../table/lib/formatters';
import { Text } from '../text';
import { Spinner } from '../spinner';
import { parsePhoneNumberFromString, AsYouType, CountryCode } from 'libphonenumber-js';

type CallbackRef = (node: HTMLElement) => void;

interface Props {
  className?: string;
  debounce?: number;
  defaultValue?: string;
  disabled?: boolean;
  fieldId?: string;
  height?: number;
  width?: string;
  innerRef?:
    | CallbackRef
    | React.RefObject<HTMLElement>
    | React.RefObject<HTMLInputElement>
    | React.RefObject<HTMLSelectElement>
    | React.RefObject<HTMLTextAreaElement>;
  invisible?: boolean;
  isInvalid?: boolean;
  maxLength?: number;
  name?: string;
  onChange?: ChangeHandler;
  onFocus?: () => unknown;
  onBlur?: (value?: string) => unknown;
  placeholder?: string;
  isRequired?: boolean;
  testId?: string;
  type: InputType;
  value?: string | number | null;
  autoComplete?: 'on' | 'off' | boolean;
  appendText?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean
  country?: CountryType
}

type ChangeHandler = (value: string, error: string) => void;
type CountryType = 'US'
type InputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'tel'
  | 'select'
  | 'date'
  | 'search'
  | 'react-select'
  | 'password';

function getIcon(type: InputType): React.ReactNode {
  if (type === 'date') return <IconDate />;
  if (type === 'search') return <IconSearch />;
  return null;
}

function isValidText(value: string): boolean {
  return Boolean(value.trim())
}

function isValidPhoneNumber(value: string, country: CountryCode = 'US'): boolean {
  return Boolean(parsePhoneNumberFromString(value, country)?.isValid())
}

function getTextError(value: string, isRequired: boolean) {
  if (isRequired && !isValidText(value)) {
    return 'This field is required'
  }

  return ''
}

function getPhoneError(parsedPhone: string, isRequired: boolean) {
  if (isRequired && !isValidText(parsedPhone)) {
    return 'This field is required'
  }

  if (!isValidPhoneNumber(parsedPhone)) {
    return 'This phone is not valid'
  }

  return ''
}

function InputControl(props: Props): JSX.Element {
  const {
    className,
    debounce = 0,
    defaultValue,
    disabled,
    fieldId,
    height,
    width,
    invisible,
    innerRef,
    isInvalid,
    maxLength,
    name,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    type,
    testId,
    isRequired,
    value,
    autoComplete = true,
    style,
    autoFocus,
    country,
  } = props;
  const isPhone = type === 'tel'
  const debouncedOnChange = useDebouncedCallback(onChange, debounce);
  const isReadOnly = isUndefined(onChange);

  // There are some cases where we're using this component in JavaScript files
  // and null, boolean, and array values may be passed in. This won't throw an error
  // but it will render the value toString in the input, which is bad UX.
  let normalizedValue = typeof value === 'string' || typeof value === 'number' ? value : undefined;
  if (isPhone && normalizedValue !== undefined) {
    normalizedValue = new AsYouType(country).input(String(normalizedValue))
    const parsePhoneNumber = parsePhoneNumberFromString(normalizedValue, 'US')
    if (parsePhoneNumber) {
      normalizedValue = parsePhoneNumber.nationalNumber.length < 4 ? parsePhoneNumber.nationalNumber : normalizedValue
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
    let value = e.target.value.trim()
    if (debounce && debouncedOnChange) {
      debouncedOnChange(value);
    } else {
      if (isPhone) {
        const parsedPhone = parsePhoneNumberUS(value, String(normalizedValue))
        onChange(parsePhoneNumberUS(value, String(normalizedValue)), getPhoneError(parsedPhone, isRequired))
      } else {
        onChange(value, getTextError(value, isRequired))
      }
    }
  }

  function getTestId(): string | false {
    return testId || (fieldId && `${fieldId}-input`) || false;
  }

  const classNames = classnames(
    {
      control: true,
      isInvalid,
      invisible,
    },
    className,
  );

  if (type === 'textarea') {
    return (
      <StyledTextArea
        id={fieldId}
        data-testid={getTestId()}
        name={name}
        ref={innerRef as React.RefObject<HTMLTextAreaElement>}
        className={classNames}
        placeholder={placeholder}
        disabled={disabled || isReadOnly}
        defaultValue={defaultValue}
        value={normalizedValue}
        minHeight={height}
        maxLength={maxLength}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={(e) => {
          if (onBlur) onBlur(e.target.value);
        }}
        style={style}
        autoFocus={autoFocus}
      />
    );
  }

  return (
    <>
      <StyledInput
        id={fieldId}
        data-testid={getTestId()}
        name={name}
        ref={innerRef as React.RefObject<HTMLInputElement>}
        className={classNames}
        type={type === 'date' ? 'text' : type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled || isReadOnly}
        value={normalizedValue}
        readOnly={isReadOnly}
        style={{
          width: width || '100%',
          ...style,
        }}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={(e) => {
          if (onBlur) onBlur(e.target.value);
        }}
        autoComplete={autoComplete === true || autoComplete === 'on' ? 'on' : 'off'}
        autoFocus={autoFocus}
      />
    </>
  );
}

InputControl.defaultProps = {
  autoFocus: false,
  country: 'US',
}

export function Input(props: Props): JSX.Element {
  const { style, type, appendText = null } = props;
  const targetRef = useRef<HTMLDivElement>();
  const [appendedTextWidth, setAppendedTextWidth] = useState<number | null>(null);

  useEffect(() => {
    if (targetRef.current) {
      setAppendedTextWidth(targetRef.current.getBoundingClientRect().width);
    }
  }, [appendText]);

  const icon = getIcon(type);
  const styles = type === 'number' && appendText ? { ...style, paddingRight: `${appendedTextWidth + 8}px` } : style;

  return (
    <StyledInputWrapper type={type}>
      {/* eslint-disable-next-line */}
      <InputControl
        {...props}
        style={styles}
      />
      <div className="input-icon">{icon}</div>
      {appendText ? (
        <StyledAppendedText ref={targetRef}>
          <Text color="disabled">{appendText}</Text>
        </StyledAppendedText>
      ) : null}
    </StyledInputWrapper>
  );
}

export const LoadingTextInput = () => (
  <StyledLoadingTextInput>
    <Spinner color={colors.gray_l} />
  </StyledLoadingTextInput>
);

const StyledInput = styled.input`
  input[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
`;

const StyledInputWrapper = styled.div<{ type: InputType }>`
  position: relative;

  .control {
    font-family: ${fontFamilies.body};
    font-size: 14px;
    border: 1px solid #dbdbdb;
    line-height: 21px;
    color: #000;
    padding: 8px 12px;
    height: 40px;
    box-sizing: border-box;
    width: 100%;
    display: block;
    border-radius: 3px;
    background: white;
    appearance: none;
    ${({ type }) =>
      type === 'search' &&
      css`
        padding-right: 32px;
      `};
  }
  .input-icon {
    color: ${colors.gray};
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .control:focus + .input-icon {
    color: ${colors.primary};
  }
  .control.invisible {
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    border: none;
    padding: 0;
    height: auto;
  }
  .control.invisible::placeholder {
    font-size: inherit;
    line-height: inherit;
  }
  .control.invisible:focus,
  .control.invisible:active:not(:disabled) {
    border: none;
    box-shadow: none;
  }
  .textarea.control {
    resize: vertical;
  }
  .control::placeholder {
    color: ${colors.text_placeholder};
    line-height: 21px;
  }
  .control:focus {
    outline: none;
  }
  .control:disabled {
    background: ${colors.gray_xxl};
  }
  .control:focus,
  .control:active:not(:disabled) {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primary_l}30;
  }
  .control.isInvalid {
    border-color: ${colors.red};
    box-shadow: 0 0 0 3px rgba(189, 73, 50, 0.25);
  }
`;

const StyledLoadingTextInput = styled.div`
  background: #fafafa;
  border: 1px solid ${colors.gray_xl};
  border-radius: 3px;
  cursor: wait;
  height: 38px;
  position: relative;
`;

const StyledTextArea = styled.textarea<{ minHeight?: number }>`
  min-height: ${({ minHeight }) => `${minHeight || 40}px`};
  max-width: 100%;
  min-width: 100%;
`;

const StyledAppendedText = styled.div`
  align-items: center;
  background: #fff;
  border-left: 1px solid #dbdbdb;
  bottom: 1px;
  color: ${colors.gray};
  display: flex;
  justify-content: center;
  padding: 0 8px;
  position: absolute;
  right: 1px;
  top: 1px;
  z-index: 1;
  &:after {
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.75));
    bottom: 0;
    content: '';
    left: -31px;
    position: absolute;
    top: 0;
    width: 30px;
    z-index: 0;
  }
`;
