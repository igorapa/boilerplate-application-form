import * as React from 'react'
import * as constants from '../constants'
import {
  Box,
  Padding,
  Flexbox,
  FadeIn,
} from '@/ui';
import FormBody from '../form-body';
import FormFooter from '../form-footer'
import { getTextError } from '../helpers'

export default function FormContainer(props): JSX.Element {
  const { steps } = props

  const [step, setStep] = React.useState(0)
  const { fields, title, subtitle } = steps[step]
  const [formData, setFormData] = React.useState({})
  const [draft, setDraft] = React.useState({})
  const [errors, setErrors] = React.useState({})

  const isFirstStep = step === 0
  const isLastStep = step === steps.length - 1

  React.useEffect(() => {
    const newDraft = { ...draft, ...fields.reduce((prev, next) => ({ ...prev, [next.id]: formData[next.id] || next.defaultValue || ''}), {}) }
    setDraft(newDraft)
    setErrors(fields.reduce((prev, next) => {
      let error = next.isRequired ? getTextError(formData[next.id] || '', next.isRequired) : '';
      if (next.dependsOn) {
        error = next.dependsOn.some(item => newDraft[item]) ? getTextError(formData[next.id] || '', next.isRequired) : '';
      }
      return {
        ...prev,
        [next.id]: {
          error,
          isInvalid: false
        }
      }
    }, {}))
  }, [fields])

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const finalData = { ...formData, ...draft }
    console.log(finalData)
    setFormData({})
    setDraft({})
    setErrors({})
    setStep(0)
  }

  const getCurrentValid = () => {
    const errorsList = fields.filter(field => errors[field.id]?.error)
    const newErrors = errorsList.reduce((prev, next) => ({ ...prev, [next.id]: { ...errors[next.id], isInvalid: true } }), {})
    setErrors({ ...errors, ...newErrors })
    return errorsList.length === 0
  }

  const handleOnClickBack = (e) => {
    e.preventDefault()
    setStep(step - 1)
  }

  const handleOnClickNext = (e) => {
    e.preventDefault()
    const stepIsValid = getCurrentValid()
    if (stepIsValid) {
      setFormData({ ...formData, ...draft })
      setErrors({})
      setStep(step + 1)
    }
  }

  return (
    <Padding top={80}>
      <Flexbox alignItems="center" justifyContent="center">
        <FadeIn
          duration="500ms"
          yOffset="30px"
        >
          <Box
            border={1}
            borderRadius={10}
            width={640}
            backgroundColor="white"
          >
            <form onSubmit={isLastStep ? handleOnSubmit : handleOnClickNext}>
              <FormBody
                fields={fields}
                title={title}
                subtitle={subtitle}
                draft={draft}
                errors={errors}
                onChangeDrafts={setDraft}
                onChangeErrors={setErrors}
              />
              <FormFooter
                textPrimary={isLastStep ? constants.TEXTS.buttonSubmit : constants.TEXTS.buttonNext}
                textSecondary={constants.TEXTS.buttonBack}
                showSecondayButton={!isFirstStep}
                onClickSecondaryButton={handleOnClickBack}
              />
            </form>
          </Box>
        </FadeIn>
      </Flexbox>
    </Padding>
  )
}