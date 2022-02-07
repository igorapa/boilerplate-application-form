import * as React from 'react';
import styled from 'styled-components';

import { colors } from '../../theme';

interface GenericObject {
  [key: string]: string;
}

const backgroundColors: GenericObject = {
  dark: colors.primary_xd,
  light: '#aaa',
  extraLight: colors.gray_xl,
  xxLight: colors.gray_xxl,
  primary: colors.primary,
  transparent: 'transparent',
  white: '#fff',
};

type BorderRadius = 0 | 3 | 6 | 10;
type BoxShadow = 'overlay' | 'card' | 'none';
type BackgroundColors = 'white' | 'light' | 'dark' | 'xxLight';

interface Props {
  id?: string;
  backgroundColor?: BackgroundColors | string;
  border?: number;
  borderTop?: number;
  borderLeft?: number;
  borderRight?: number;
  borderBottom?: number;
  borderRadius?: BorderRadius;
  borderTopRadius?: BorderRadius;
  borderRightRadius?: BorderRadius;
  borderBottomRadius?: BorderRadius;
  borderLeftRadius?: BorderRadius;
  boxShadow?: BoxShadow;
  children: React.ReactNode;
  elementRef?: React.RefObject<HTMLElement>;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

const shadows = {
  card: '0 5px 10px rgba(0,0,0,0.03)',
  overlay: '0 5px 30px rgba(0,0,0,0.2)',
};

export function Box(props: Props): JSX.Element {
  const {
    backgroundColor = 'transparent',
    border = 0,
    borderTop = 0,
    borderLeft = 0,
    borderRight = 0,
    borderBottom = 0,
    borderRadius = 0,
    borderTopRadius = 0,
    borderBottomRadius = 0,
    borderRightRadius = 0,
    borderLeftRadius = 0,
    boxShadow = 'none',
    children,
    id,
    elementRef,
    style,
    width,
    height,
  } = props;

  const boxBackgroundColor = backgroundColors[backgroundColor];

  return (
    <StyledBox
      ref={elementRef as React.RefObject<HTMLDivElement>}
      style={style}
      id={id}
      backgroundColor={boxBackgroundColor || backgroundColor}
      border={border}
      borderTop={borderTop}
      borderLeft={borderLeft}
      borderRight={borderRight}
      borderBottom={borderBottom}
      borderRadius={borderRadius}
      borderTopRadius={borderTopRadius}
      borderBottomRadius={borderBottomRadius}
      borderRightRadius={borderRightRadius}
      borderLeftRadius={borderLeftRadius}
      boxShadow={boxShadow}
      width={width}
      height={height}
    >
      {children}
    </StyledBox>
  );
}

const StyledBox = styled.div`
  background-color: ${({ backgroundColor }: Props) => backgroundColor};
  border-color: #dbdbdb;
  border-style: solid;
  border-top-width: ${({ borderTop, border }: Props) => borderTop || border}px;
  border-left-width: ${({ borderLeft, border }: Props) => borderLeft || border}px;
  border-right-width: ${({ borderRight, border }: Props) => borderRight || border}px;
  border-bottom-width: ${({ borderBottom, border }: Props) => borderBottom || border}px;
  border-top-left-radius: ${({ borderTopRadius, borderLeftRadius, borderRadius }: Props) =>
    borderTopRadius || borderLeftRadius || borderRadius}px;
  border-top-right-radius: ${({ borderTopRadius, borderRightRadius, borderRadius }: Props) =>
    borderTopRadius || borderRightRadius || borderRadius}px;
  border-bottom-left-radius: ${({ borderBottomRadius, borderLeftRadius, borderRadius }: Props) =>
    borderBottomRadius || borderLeftRadius || borderRadius}px;
  border-bottom-right-radius: ${({ borderBottomRadius, borderRightRadius, borderRadius }: Props) =>
    borderBottomRadius || borderRightRadius || borderRadius}px;
  box-shadow: ${({ boxShadow }: Props) => (boxShadow ? `${shadows[boxShadow]}` : 'none')};
  width: ${({ width }: Props) => (width ? `${width}px` : 'auto')};
  height: ${({ height }: Props) => (height ? `${height}%` : 'auto')};
`;
