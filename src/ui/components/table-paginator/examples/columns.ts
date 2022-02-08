import { Column } from '../../table/lib/types';
import { formatters } from '../../table/index';
import { ExampleDataItem } from './types';

export const COLUMNS: Column<ExampleDataItem>[] = [
  {
    label: 'Id',
    dataField: 'id',
    format: formatters.text,
  },
  {
    label: 'Name',
    dataField: 'name',
    format: formatters.text,
  },
  {
    label: 'Age',
    dataField: 'age',
    format: formatters.text,
  },
  {
    label: 'Email',
    dataField: 'email',
    format: formatters.text,
  },
  {
    label: 'Carrier',
    dataField: 'carrier',
    format: formatters.text,
  },
  {
    label: 'Status',
    dataField: 'status',
    format: formatters.badge({
      Active: 'success',
    }),
  },
];

export const STICKYCOLUMNS: Column<ExampleDataItem>[] = [
  {
    label: 'Carrier',
    dataField: 'carrier',
    format: formatters.text,
  },
  {
    label: 'Id',
    dataField: 'id',
    format: formatters.text,
  },
  {
    label: 'Name',
    dataField: 'name',
    format: formatters.text,
  },
  {
    label: 'Age',
    dataField: 'age',
    format: formatters.text,
  },
  {
    label: 'Email',
    dataField: 'email',
    format: formatters.text,
  },
  {
    label: 'Status',
    dataField: 'status',
    format: formatters.badge({
      Active: 'success',
    }),
  },
];
