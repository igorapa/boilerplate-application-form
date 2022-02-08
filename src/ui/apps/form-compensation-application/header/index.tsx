import { Text, Box, Padding, Flexbox, EmployeeProfile, NewfrontLogo, FlexCell } from '@/ui';

interface PropsHeader {
  title: string;
  imageUrlProfile?: string;
}

export default function Header(props: PropsHeader): JSX.Element {
  const { title, imageUrlProfile } = props;

  return (
    <Box borderBottom={1} backgroundColor="white">
      <Padding size={20}>
        <Flexbox alignItems="center" justifyContent="space-between">
          <NewfrontLogo />
          <FlexCell flex={1}>
            <Padding left={20}>
              <Text color="black">{title}</Text>
            </Padding>
          </FlexCell>
          {Boolean(imageUrlProfile) && <EmployeeProfile variant="round" imageUrl={imageUrlProfile} />}
        </Flexbox>
      </Padding>
    </Box>
  );
}
