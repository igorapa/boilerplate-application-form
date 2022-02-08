import * as React from 'react';
import { CheckboxRow } from '@/ui';

export default function FieldCheckbox(props): JSX.Element {
  const { id, label, onChange, value, children } = props;
  return <CheckboxRow label={label} isActive={value} onClick={(value) => onChange(id, value, '', children)} />;
}
