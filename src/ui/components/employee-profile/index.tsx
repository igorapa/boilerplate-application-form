import React from 'react';
import styled from 'styled-components';
import { SmallCaps } from '../small-caps';
import { Flexbox } from '../flexbox';
import { MiniIconPerson } from '../mini-icons';
import { Padding } from '../padding';
import { Stack } from '../stack';
import { Text } from '../text';
import { EmployeeThumbnail, squircleClipPath } from '../employee-thumbnail';
import { colors } from '../../theme/colors';

interface Props {
  name?: string;
  imageUrl?: string | null;
  title?: string;
  variant?: 'inline' | 'stacked' | 'round';
}

function abbreviateTitle(title: string): string {
  switch (title) {
    case 'Account manager':
      return 'AM';
    case 'Operations':
      return 'CSR';
    case 'Producer':
      return 'PROD';
    default:
      return title;
  }
}

export function EmployeeProfile(props: Props): JSX.Element {
  const { imageUrl, name, title, variant = 'stacked' } = props;

  // smaller inline version
  if (variant === 'inline') {
    return (
      <Flexbox alignItems="center">
        {imageUrl ? (
          <EmployeeThumbnail sizeInPixels={24} imageUrl={imageUrl} variant="round" />
        ) : (
          <StyledFallback variant="round" size={24}>
            <MiniIconPerson color={colors.steel[200]} />
          </StyledFallback>
        )}
        {name && (
          <Padding left={8}>
            <Text>
              {name}
              {title && `, ${abbreviateTitle(title)}`}
            </Text>
          </Padding>
        )}
      </Flexbox>
    );
  }

  return (
    <Flexbox alignItems="center">
      {imageUrl ? (
        <EmployeeThumbnail sizeInPixels={40} imageUrl={imageUrl} variant={variant === 'round' ? 'round' : 'squircle'} />
      ) : (
        <StyledFallback variant="squircle">
          <MiniIconPerson color={colors.steel[200]} />
        </StyledFallback>
      )}
      <Padding left={12}>
        <Stack direction="vertical" gap={0}>
          {title && <SmallCaps>{title}</SmallCaps>}
          <Text color="dark">{name}</Text>
        </Stack>
      </Padding>
    </Flexbox>
  );
}

const StyledFallback = styled.div<{ variant?: string; size?: number }>`
  height: ${({ size }) => (size ? `${size}px` : '40px')};
  width: ${({ size }) => (size ? `${size}px` : '40px')};
  background-color: ${colors.steel[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ variant }) => (variant === 'squircle' ? `clip-path: polygon(${squircleClipPath(6)});` : 'border-radius: 50%;')};
`;
