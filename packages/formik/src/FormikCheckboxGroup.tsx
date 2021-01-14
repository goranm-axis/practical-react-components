// Libraries
import React, { useMemo } from 'react'
import { FieldConfig, useField } from 'formik'
import { Checkbox, spacing, withField } from 'practical-react-components-core'
import styled, { css } from 'styled-components'

export interface ICheckboxGroupOption<V extends string | number> {
  readonly value: V
  readonly label: string
  readonly disabled?: boolean
}

interface IFormikCheckboxGroupProps<V extends string | number>
  extends Pick<FieldConfig, 'name' | 'validate'> {
  readonly options: ReadonlyArray<ICheckboxGroupOption<V>>
}

interface ICheckboxContainer {
  readonly halfOptionLength: number
}

const CheckboxContainer = styled.div<ICheckboxContainer>`
  ${({ halfOptionLength }) =>
    css`
      display: grid;
      grid-template-columns: auto auto;
      grid-template-rows: repeat(${halfOptionLength}, auto);
      grid-row-gap: ${spacing.medium};
      grid-auto-flow: column;
    `}
`

/**
 * Component that creates a group of checkboxes from the options prop.
 * The checkboxes is ordered in two columns, the first half of options in the first checkbox column,
 * last half of options in the right column.
 *
 * Eg:
 *
 * Options: [option1, option2, option3, option4]
 *
 * `[X] option1 [ ] option3`
 *
 * `[ ] option2 [X] option4`
 */
export function FormikCheckboxGroup<V extends string | number>({
  name,
  validate,
  options,
}: IFormikCheckboxGroupProps<V>): JSX.Element {
  const [{ value }, , { setValue }] = useField<ReadonlyArray<V>>({
    name,
    validate,
  })

  /**
   * Number used to stack the first half of the options in left checkbox column
   * and the last half in the right column.
   */
  const halfOptionLength = useMemo(() => Math.ceil(options.length / 2), [
    options,
  ])
  const onChanges = useMemo(
    () =>
      options.map(option => () => {
        if (!value.includes(option.value)) {
          setValue([...value, option.value])
        } else {
          setValue(value.filter(v => v !== option.value))
        }
      }),
    [options, value, setValue]
  )

  return (
    <CheckboxContainer halfOptionLength={halfOptionLength}>
      {options.map((option, i) => (
        <Checkbox
          key={option.value}
          name={name}
          label={option.label}
          value={option.value}
          checked={value.includes(option.value)}
          onChange={onChanges[i]}
        />
      ))}
    </CheckboxContainer>
  )
}

export const FormikCheckboxGroupField = withField(FormikCheckboxGroup)
