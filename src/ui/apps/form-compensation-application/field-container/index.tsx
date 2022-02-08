import * as React from 'react';
import FieldInput from '../fields/field-input';
import FieldCheckbox from '../fields/field-chekbox';
import FieldSelectableRow from '../fields/field-selectable-row';

const MAPPER_FIELDS = {
  text: FieldInput,
  number: FieldInput,
  tel: FieldInput,
  checkbox: FieldCheckbox,
  selectable: FieldSelectableRow,
};

interface PropsFieldContainer {
  shouldRender: boolean;
  isFirstField?: boolean;
  id: string;
  type: string;
  label?: string;
  value: string | number | boolean;
  isInvalid: boolean;
  autoFocus: boolean;
  onChange: () => void;
}

export default function FieldContainer(props: PropsFieldContainer): JSX.Element {
  const { id, type, shouldRender, ...rest } = props;

  if (!shouldRender) {
    return null;
  }

  const FieldComponent = MAPPER_FIELDS[type];

  return <FieldComponent key={id} id={id} type={type} {...rest} />;
}

FieldContainer.defaultProps = {
  isFirstField: false,
  shouldRender: true,
};
