import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/core';
import { useState } from 'react';
import { useLoginGoogle } from '../../graphql/users/users.hooks';
import { useRegisterGoogleMutation, useRegisterMutation } from '../../graphql/users/users.operations.generated';
import { generateUrlKey } from '../../services/url.service';
import { RegisterAuthInfo, RegisterFormAuthInfo } from './RegisterFormAuthInfo';
import { RegisterFormProfileInfo, RegisterProfileInfo } from './RegisterFormProfileInfo';

export const RegisterForm: React.FC<{
  onSuccess: () => void;
}> = ({ onSuccess }) => {
  const [authInfo, setAuthInfo] = useState<RegisterAuthInfo>();
  const [profileInfo, setProfileInfo] = useState<RegisterProfileInfo>();
  const [register, { error, data: registerResult }] = useRegisterMutation();
  const [registerGoogle, { error: googleError, data: registerGoogleResult }] = useRegisterGoogleMutation();
  const { loginGoogle } = useLoginGoogle();

  const onRegister = async (profileData: RegisterProfileInfo) => {
    setProfileInfo(profileInfo);
    if (!authInfo) {
      throw new Error('Unreachable code reached');
    }
    if (authInfo.type === 'basic') {
      const { email, password } = authInfo;
      await register({
        variables: {
          payload: { email, password, ...profileData },
        },
      });
    } else if (authInfo.type === 'google') {
      await registerGoogle({
        variables: {
          payload: { idToken: authInfo.id_token, ...profileData },
        },
      });
      await loginGoogle({
        variables: {
          idToken: authInfo.id_token,
        },
      });
      onSuccess();
    }
  };
  return (
    <Stack spacing={2}>
      {!authInfo && <RegisterFormAuthInfo onNext={setAuthInfo} onSuccessfulLogin={onSuccess} />}
      {authInfo && !registerResult && !registerGoogleResult && (
        <RegisterFormProfileInfo
          defaultProfileInfo={
            authInfo.type === 'google' ? { displayName: authInfo.name, key: generateUrlKey(authInfo.name) } : {}
          }
          onRegister={onRegister}
        />
      )}
      {!!error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Failed to register</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      )}
      {!!googleError && (
        <Box>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Failed to register</AlertTitle>
            <AlertDescription>{googleError.message}</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        </Box>
      )}
      {!!registerResult && (
        <Stack spacing={2}>
          <Heading size="xl" textAlign="center">
            Registration successful !
          </Heading>
          <Heading size="lg">Only one last step: verify your email address</Heading>
          <Text fontStyle="italic">
            We've just sent a mail to {registerResult.register.email}, simply click on the link to activate your
            account.
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
