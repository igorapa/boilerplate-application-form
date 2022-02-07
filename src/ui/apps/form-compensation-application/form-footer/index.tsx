import {
  Button,
  Padding,
  Divider,
  Flexbox,
} from '@/ui';

interface PropsFooter {
  textPrimary: string;
  textSecondary?: string;
  showSecondayButton?: boolean;
  onClickSecondaryButton?: (e: React.MouseEvent) => void;
}

export default function FormFooter(props: PropsFooter): JSX.Element {
  const { textPrimary, textSecondary, showSecondayButton, onClickSecondaryButton } = props
  return (
    <>
      <Divider />
      <Padding y={32} x={48}>
        <Flexbox alignItems="center" justifyContent={showSecondayButton ? 'space-between' : 'flex-end'}>
          {showSecondayButton && <Button type="button" size="secondary" onClick={onClickSecondaryButton}>{textSecondary}</Button>}
          <Button type="submit">{textPrimary}</Button>
        </Flexbox>
      </Padding>
    </>
  )
}

FormFooter.defaultProps = {
  showSecondayButton: false,
}