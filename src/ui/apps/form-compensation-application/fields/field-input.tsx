import * as React from 'react'
import {
  Field,
  Input,
} from '@/ui';

export default function FieldInput(props): JSX.Element {
  const { id, type, label, onChange, error, isInvalid, value, autoFocus, isRequired  } = props;
  return (
    <Field fieldId={id} label={label} error={isInvalid ? error : ''}>
      <Input
        autoFocus={autoFocus}
        defaultValue={value}
        value={value}
        fieldId={id}
        type={type}
        onChange={(value, error) => onChange(id, value, error)}
        isRequired={isRequired}
        isInvalid={isInvalid}
      />
    </Field>
  )
}