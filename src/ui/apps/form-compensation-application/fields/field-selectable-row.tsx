import * as React from 'react';
import { SelectableRow } from '@/ui';

export default function FieldSelectableRow(props): JSX.Element {
  const { id, options, defaultValue, onChange, value } = props;
  const [selected, setSelected] = React.useState(value || defaultValue);

  const handleOnClick = (_, value) => {
    setSelected(value);
    onChange(id, value);
  };

  return options.map((item) => (
    <SelectableRow
      key={item.id}
      id={item.id}
      title={item.title}
      subtitle={item.subtitle}
      isSelected={selected === item.id}
      categoryLabel={item.categoryLabel}
      categoryType={item.categoryType}
      onClick={handleOnClick}
    />
  ));
}
