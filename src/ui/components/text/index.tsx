import classnames from 'classnames';
import styled from 'styled-components';
import * as React from 'react';

import { colors } from '../../theme/colors';

interface GenericObject {
  [key: string]: string;
}
export const textColors: GenericObject = {
  active: colors.brand[400],
  alert: colors.fire[400],
  dark: colors.steel[500],
  default: colors.steel[400],
  disabled: colors.steel[300],
  flow_title: colors.steel[500],
  error: colors.fire[600],
  light: colors.steel[300],
  transparent: 'transparent',
  warning: colors.fire[400],
  white: '#ffffff',
  black: '#000',
};

export type HexColor = string;
export type TextSizes = 'small' | 'regular' | 'large' | 'largeX' | 'extraLarge';
export type TextColors =
  | 'active'
  | 'alert'
  | 'dark'
  | 'default'
  | 'disabled'
  | 'error'
  | 'light'
  | 'warning'
  | 'white'
  | 'black'
  | 'inherit';
export type TextDecoration = 'underline' | 'strikethrough' | 'none';

interface TextProps {
  breakword?: boolean;
  children: React.ReactNode;
  color?: TextColors | HexColor;
  display?: 'inline' | 'block';
  id?: string;
  marginBottom?: number;
  marginTop?: number;
  nowrap?: boolean;
  prewrap?: boolean;
  pre?: boolean;
  size?: TextSizes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
  tabIndex?: number;
  textAlign?: 'center' | 'left' | 'right';
  textDecoration?: TextDecoration;
  truncate?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
  testId?: string;
  onClick?: () => void
}

export function Text(props: TextProps): JSX.Element {
  const {
    breakword = false,
    children,
    color = 'default',
    display = 'block',
    id,
    marginBottom = 0,
    marginTop = 0,
    nowrap = false,
    prewrap = false,
    pre = false,
    size = 'regular',
    style = {},
    tabIndex,
    textAlign = 'left',
    textDecoration = 'none',
    truncate = false,
    weight = '400',
    testId,
    onClick,
  } = props;

  const classNames = classnames({
    alignCenter: textAlign === 'center',
    alignRight: textAlign === 'right',
    breakword: breakword === true,
    extraLarge: size === 'extraLarge',
    largeX: size === 'largeX',
    large: size === 'large',
    nowrap: nowrap === true,
    prewrap: prewrap === true,
    pre: pre === true,
    regular: size === 'regular',
    small: size === 'small',
    text: true,
    truncate: truncate === true,
    underline: textDecoration === 'underline',
  });

  const textColor = textColors[color] || color;

  return (
    <StyledText
      id={id}
      tabIndex={tabIndex}
      className={classNames}
      data-testid={testId}
      onClick={onClick}
      style={{
        ...style,
        fontWeight: weight,
        color: textColor,
        marginBottom,
        marginTop,
        display,
      }}
    >
      {children}
    </StyledText>
  );
}

const StyledText = styled.span`
  font-family: 'Open Sans', sans-serif;

  &.regular {
    font-size: 14px;
    line-height: 21px;
  }
  &.small {
    font-size: 12px;
    line-height: 18px;
  }
  &.large {
    font-size: 16px;
    line-height: 24px;
  }
  &.largeX {
    font-size: 20px;
    line-height: 27.24px;
  }
  &.extraLarge {
    font-size: 24px;
    line-height: 36px;
  }
  &.alignRight {
    text-align: right;
  }
  &.alignCenter {
    text-align: center;
  }
  &.underline {
    text-decoration: underline;
  }
  &.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    word-break: break-word;
  }
  &.breakword {
    word-break: break-word;
  }
  &.nowrap {
    white-space: nowrap;
  }
  &.prewrap {
    white-space: pre-wrap;
  }
  &.pre {
    white-space: pre;
  }
  a {
    cursor: pointer;
    color: ${colors.brand[400]};
    text-decoration: underline !important;
  }
  a:hover {
    color: #3288ff;
  }
  strong {
    font-weight: 600;
    color: #000000;
  }
  em {
    font-style: italic;
  }
`;
