/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import ago from 's-ago';
import moment from 'moment';
import { parsePhoneNumberFromString, AsYouType, validatePhoneNumberLength } from 'libphonenumber-js';
import formatDate from 'date-fns/format';
import { Cell, Formatter } from './types';
import { DatePicker } from '../../date-picker';
import { Padding } from '../../padding';
import { Stack } from '../../stack';
import { Text } from '../../text';
import { Flexbox } from '../../flexbox';
import { TogglePopover, PopoverMenu } from '../../popover-menu';
import { TextLink } from '../../text-link';

import { AlertIcon } from './icons';
import { Badge, BadgeType } from '../../badge';

export function text(value: Cell): JSX.Element {
  return (
    <Text truncate nowrap>
      {value}
    </Text>
  );
}

export function addressInEntity(value: Cell, row: any): JSX.Element {
  const { address: addressEntity } = row.entity;
  if (!addressEntity) {
    return (
      <Text key={String(value)} weight={300} color="dark">
        Invalid address
      </Text>
    );
  }
  const { address: oneLineAddress, street, city, state, zip } = addressEntity;
  if (street && city && state && zip) {
    const cityStateZip = `${city}, ${state} ${zip}`;
    return (
      <Stack direction="vertical" gap={2}>
        {[street, cityStateZip].map((line: string) => (
          <Text key={line} weight={300} color="dark">
            {line}
          </Text>
        ))}
      </Stack>
    );
  }
  return (
    <Text key={String(value)} weight={300} color="dark">
      {typeof value === 'string' ? value : oneLineAddress || 'Invalid address'}
    </Text>
  );
}

export function address(value: Cell, row: any): JSX.Element {
  const { address: oneLineAddress, street, city, state, zip } = row;
  if (street && city && state && zip) {
    const cityStateZip = `${city}, ${state} ${zip}`;
    return (
      <Stack direction="vertical" gap={2}>
        {[street, cityStateZip].map((line: string) => (
          <Text key={line} weight={300} color="dark">
            {line}
          </Text>
        ))}
      </Stack>
    );
  }
  return (
    <Text key={String(value)} weight={300} color="dark">
      {typeof value === 'string' ? value : oneLineAddress || 'Invalid address'}
    </Text>
  );
}

export function paragraph(value: Cell): JSX.Element {
  return <Text>{value}</Text>;
}

export function email(value: Cell): JSX.Element {
  return <TextLink href={`mailto:${value}`}>{value}</TextLink>;
}

export function number(value: Cell): JSX.Element {
  return (
    <Text textAlign="right" truncate>
      {value}
    </Text>
  );
}

export function relativeTime(value: Cell): JSX.Element {
  if (!value) {
    return <div />;
  }
  return <Text truncate>{ago(new Date(String(value)))}</Text>;
}

export function textLink<T>(textLinkAction: (row: T) => void): Formatter<T> {
  return (value: Cell, row: T): JSX.Element => (
    <TextLink tabIndex={0} href="#" onClick={() => textLinkAction(row)}>
      {value}
    </TextLink>
  );
}

interface ActionMenuElementProps<T> {
  renderMenu: (row: T, toggle: TogglePopover) => JSX.Element;
  row: T;
}

export function ActionMenuElement<T>({ renderMenu, row }: ActionMenuElementProps<T>): JSX.Element {
  return (
    <Flexbox justifyContent="center">
      <PopoverMenu
        type="more"
        options={{
          attachment: 'bottom right',
          targetAttachment: 'bottom left',
          constraints: [
            {
              attachment: 'together',
              to: 'scrollParent',
              pin: false,
            },
          ],
        }}
      >
        {(toggle: TogglePopover) => renderMenu(row, toggle)}
      </PopoverMenu>
    </Flexbox>
  );
}

export function actionMenu<T>(renderMenu: (row: T, toggle: TogglePopover) => JSX.Element): Formatter<T> {
  return (_value, row: T): JSX.Element => <ActionMenuElement renderMenu={renderMenu} row={row} />;
}

export function groupedText(titles: string | string[], subtitles?: string | string[]): JSX.Element {
  const boldText = (value: string): JSX.Element => (
    <Text weight={600} color="dark">
      <StyledGroupedText>{value}</StyledGroupedText>
    </Text>
  );
  const regularText = (value: string): JSX.Element => (
    <Text weight={300} color="default">
      <StyledGroupedText>{value}</StyledGroupedText>
    </Text>
  );
  return (
    <StyledGroupedTextWrapper>
      {Array.isArray(titles) ? <div>{titles.map((v) => boldText(v))}</div> : boldText(titles)}
      {subtitles &&
        (Array.isArray(subtitles) ? <div>{subtitles.map((v) => regularText(v))}</div> : regularText(subtitles))}
    </StyledGroupedTextWrapper>
  );
}
const StyledGroupedTextWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

const StyledGroupedText = styled.div`
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export function datePickerPopover<T>(
  onChange: (row: T, selectedDate: string | undefined) => Promise<void>,
): Formatter<T> {
  return (value, row: T): JSX.Element => (
    <Flexbox justifyContent="center">
      <PopoverMenu
        type="clock"
        options={{
          attachment: 'bottom right',
          targetAttachment: 'bottom left',
          constraints: [
            {
              attachment: 'together',
              to: 'scrollParent',
              pin: true,
            },
          ],
        }}
      >
        {(toggle) => (
          <Padding size={8}>
            <DatePicker
              value={value ? String(value) : undefined}
              onChange={(selectedDate) => {
                onChange(row, selectedDate);
                toggle(false);
              }}
            />
          </Padding>
        )}
      </PopoverMenu>
    </Flexbox>
  );
}

export function dueDate(dateAlert: number): Formatter<unknown> {
  return (value: Cell): JSX.Element => {
    if (!value) {
      return <div />;
    }

    const mdate = moment.utc(String(value));
    const daysLeft = mdate.diff(moment().startOf('day'), 'days');

    if (daysLeft === 0) {
      return (
        <Stack gap={4} direction="horizontal" alignItems="flex-end">
          <Text truncate nowrap color="alert">
            Today
          </Text>
          <AlertIcon color="alert" />
        </Stack>
      );
    }

    if (daysLeft < 0) {
      return (
        <Stack gap={4} direction="horizontal" alignItems="flex-end">
          <Text truncate nowrap color="alert">
            {Math.abs(daysLeft)} {daysLeft === -1 ? 'day' : 'days'} ago
          </Text>
          <AlertIcon color="alert" />
        </Stack>
      );
    }

    if (daysLeft < dateAlert) {
      return (
        <Stack gap={4} direction="horizontal" alignItems="flex-end">
          <Text truncate nowrap color="warning">
            {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
          </Text>
          <AlertIcon color="warning" />
        </Stack>
      );
    }

    return (
      <Text nowrap truncate>
        {mdate.format('MMM D')}
      </Text>
    );
  };
}

export function dollars(value: Cell): JSX.Element {
  const formatter = new Intl.NumberFormat('en', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
    currency: 'USD',
  });
  const numberValue = Number(value);
  if (_.isNaN(numberValue)) {
    return <Text>-</Text>;
  }
  return <Text truncate>{formatter.format(numberValue)}</Text>;
}

export function phoneNumber(value: Cell): JSX.Element {
  if (!value) {
    return <span />;
  }

  const parsedPhone = parsePhoneNumberFromString(String(value), 'US');
  if (parsedPhone && parsedPhone.isValid()) {
    return <TextLink href={parsedPhone.getURI()}>{parsedPhone.formatNational()}</TextLink>;
  }
  return <Text>{value}</Text>;
}

export function parsePhoneNumberUS(newValue?: string, oldValue?: string): string {
  if (!newValue) {
    return '';
  }

  if (validatePhoneNumberLength(newValue, 'US') === 'TOO_LONG') {
    return oldValue
  }

  return parsePhoneNumberFromString(newValue, 'US')?.nationalNumber || new AsYouType('US').input(newValue)
}

type Label<T> = (
  row: T,
) => {
  label: string;
  href: string;
  isExternal?: boolean;
};

export function link<T>(getLabel: Label<T>): Formatter<T> {
  return (_value: Cell, row: T): JSX.Element => {
    const { href, label, isExternal } = getLabel(row);
    const target = isExternal ? '_blank' : undefined;
    return (
      <a href={href} style={{ overflow: 'hidden' }} target={target}>
        <Text color="active" truncate textDecoration="underline">
          {label}
        </Text>
      </a>
    );
  };
}

interface BadgeMapping {
  [key: string]: BadgeType;
}

interface LabelValueMapping {
  [key: string]: string;
}

export function badge<T>(
  badgeMapping: BadgeMapping,
  valueLabelMapping?: LabelValueMapping,
  width?: number,
): Formatter<T> {
  return (value: Cell) => {
    if (!value) {
      return <div />;
    }
    let label = _.upperFirst(String(value));
    if (valueLabelMapping) {
      label = valueLabelMapping[String(value)];
    }
    return (
      <Badge size="regular" type={badgeMapping[String(value)]} width={width}>
        {label}
      </Badge>
    );
  };
}

export function date(value: Cell): JSX.Element {
  let formattedDate;
  if (typeof value === 'string') {
    formattedDate = moment(value).format('YYYY-MM-DD');
  }
  return <Text>{formattedDate}</Text>;
}

export function longDateFormat(value: Cell): JSX.Element {
  const formattedDate = typeof value === 'string' ? formatDate(value, 'ddd M/D/YY h:mm A') : '';
  return <Text>{formattedDate}</Text>;
}
