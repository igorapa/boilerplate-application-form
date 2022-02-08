import * as React from 'react'
import { getTextError } from '../helpers'

import {
  Text,
  Stack,
  Padding,
} from '@/ui';
import FieldContainer from '../field-container';

interface PropsFormBody {
  isFirstField?: boolean;
  title: string;
  subtitle?: string;
  onChangeDrafts: () => {}
  onChangeErrors: () => {}
}

export default function FormBody(props: PropsFormBody): JSX.Element {
  const { title, subtitle, fields, draft, errors, onChangeDrafts, onChangeErrors } = props

  const handleOnChangeField = (id, value, errorMsg = '', children = []) => {
    let childrenErrors = {}
    const newDraft = { ...draft, [id]: value }
    const error = errors[id]

    if (children.length > 0) {
      childrenErrors = children.reduce((prev, next) => {
        return {
          ...prev,
          [next]: {
            error: newDraft[id] ? getTextError(newDraft[next] || '', fields.find(field => field.id === next)?.isRequired) : '',
            isInvalid: false
          }
        }
      }, [])
    }
      
    onChangeDrafts(newDraft)
    onChangeErrors({ ...errors, ...childrenErrors, [id]: { ...error, error: errorMsg, isInvalid: false }})
  }

  return (
    <Padding y={40} x={48}>
      <Text size="largeX" color="black">{title}</Text>
      {Boolean(subtitle) && <Text marginTop={10}>{subtitle}</Text>}
      <Padding top={24}>
        <Stack gap={20} direction="vertical">
          {fields.map((field, index) => (
            <FieldContainer
              {...field}
              id={field.id}
              key={field.id}
              value={draft[field.id]}
              onChange={handleOnChangeField}
              error={errors[field.id]?.error}
              isInvalid={errors[field.id]?.isInvalid}
              autoFocus={!draft[field.id] && index === 0}
              shouldRender={field?.dependsOn ? field?.dependsOn.map(key => draft[key]).every(item => item) : true}
            />
          ))}
        </Stack>
      </Padding>
    </Padding>
  )
}