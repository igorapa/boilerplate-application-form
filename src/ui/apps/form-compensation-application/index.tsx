import * as React from 'react'
import { Box } from '@/ui';
import * as constants from './constants'
import data from './data.json'

import Header from './header'
import FormContainer from './form-container'

export default function FormCompensationApplication(): JSX.Element {
  return (
    <Box backgroundColor="xxLight" height={100}>
      <Header
        title={constants.TEXTS.workerCompApp}
        imageUrlProfile={constants.DEFAULT_IMG_URL}
      />
      <FormContainer steps={data.data} />
    </Box>
  )
}
