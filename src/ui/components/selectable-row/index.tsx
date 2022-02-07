import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

import { colors } from '../../theme';
import { Padding } from '../padding';
import { Flexbox } from '../flexbox';
import { Text } from '../text';
import { IconRadioButton } from '../icons';
import { Badge, BadgeType } from '../badge';

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  isSelected: boolean;
  categoryLabel?: string;
  categoryType?: BadgeType;
  onClick: (isSelected: boolean, id: string) => void;
}

interface CategoryLabelProps {
  label: string;
  type?: BadgeType;
}

function CategoryLabel(props: CategoryLabelProps): JSX.Element {
  const { label, type } = props;
  if (!type) {
    return (
      <Text color="light" nowrap>
        {label}
      </Text>
    );
  }
  return <Badge type={type}>{label}</Badge>;
}

export function SelectableRow(props: Props): JSX.Element {
  const { title, subtitle, isSelected, categoryLabel, categoryType, onClick, id } = props;

  const className = classnames({
    SelectableRow: true,
    isSelected,
  });

  function toggle(): void {
    onClick(!isSelected, id);
  }

  function onKeyDown(e: React.KeyboardEvent): void {
    if (e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }

  return (
    <StyledDiv
      className={className}
      onClick={toggle}
      onKeyDown={onKeyDown}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
    >
      <Padding y={24} x={16}>
        <Flexbox justifyContent="space-between" alignItems="center">
          <Flexbox>
            <div style={{ width: 20 }}>
              <IconRadioButton isActive={isSelected} />
            </div>
            <Padding left={12}>
              <Text color="dark">{title}</Text>
              {subtitle ? <Text marginTop={2}>{subtitle}</Text> : null}
            </Padding>
          </Flexbox>
          <div>{categoryLabel ? <CategoryLabel label={categoryLabel} type={categoryType} /> : null}</div>
        </Flexbox>
      </Padding>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  border-bottom: 1px solid #dbdbdb;
  cursor: pointer;

  :focus {
    background: ${colors.primary_xxxl};
    outline: none;
  }

  &.isSelected {
    background: ${colors.primary_xxxl};
  }
`;
