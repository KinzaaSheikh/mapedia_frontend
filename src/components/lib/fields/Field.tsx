import { Flex, FlexProps, FormControl, FormLabel, Stack } from '@chakra-ui/react';
import React, { forwardRef, PropsWithChildren, ReactNode } from 'react';
import { FormFieldHelperText, FormFieldLabelStyleProps } from '../Typography';

export interface FieldProps extends FlexProps {
  label: string | ReactNode;
  helperText?: string;
  renderRightOfLabel?: ReactNode;
  renderTopRight?: ReactNode;
  isInvalid?: boolean;
  centered?: boolean;
}

export const Field = forwardRef<HTMLDivElement, PropsWithChildren<FieldProps>>(
  ({ label, helperText, children, renderRightOfLabel, renderTopRight, isInvalid, centered, ...props }, ref) => {
    return (
      <FormControl ref={ref} display="flex" flexDir="column" w="unset" isInvalid={isInvalid} {...props}>
        <Flex justifyContent="space-between" pb={1}>
          {centered && <Flex />}
          <Flex direction="row" alignItems="baseline">
            <FormLabel {...FormFieldLabelStyleProps} w="unset" mr={1}>
              {label}
            </FormLabel>
            {renderRightOfLabel}
          </Flex>
          {renderTopRight}
        </Flex>
        <Flex direction="column" pl={centered ? 0 : 4} {...(centered && { alignItems: 'center' })}>
          {helperText && <FormFieldHelperText pb={3}>{helperText}</FormFieldHelperText>}
          {children}
        </Flex>
      </FormControl>
    );
  }
);
