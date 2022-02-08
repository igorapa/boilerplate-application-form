import React from 'react';
import { Flexbox } from '../flexbox';
import { Checkbox } from '../checkbox';
import { Text } from '../text';
import { Padding } from '../padding';

interface Props {
  label: string;
  isActive?: boolean;
  onClick?: (isActive: boolean) => unknown;
  disabled?: boolean;
  count?: number;
  testId?: string;
}

export function CheckboxRow(props: Props): JSX.Element {
  const { label, isActive, disabled, onClick, count, testId } = props;
  return (
    <Flexbox>
      <Checkbox testId={testId} isActive={isActive} onClick={onClick} disabled={disabled} />
      <Padding left={8} right={4}>
        <Text color={disabled ? 'light' : 'default'} onClick={() => onClick(!isActive)}>
          {label}
        </Text>
      </Padding>
      {count ? <Text color="light">({count})</Text> : null}
    </Flexbox>
  );
}
