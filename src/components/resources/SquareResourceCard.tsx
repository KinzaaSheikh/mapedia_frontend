import { Center, Flex, Link, Stack, Text } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { ReactElement } from 'react';
import { routerPushToPage } from '../../pages/PageInfo';
import { ResourcePageInfo } from '../../pages/resources/ResourcePage';
import { shortenString } from '../../util/utils';
import { StarsRatingViewer } from '../learning_materials/LearningMaterialStarsRating';
import { DeleteButtonWithConfirmation } from '../lib/buttons/DeleteButtonWithConfirmation';
import { InternalLink } from '../navigation/InternalLink';
import { ResourceTypeBadge } from './elements/ResourceType';
import { ResourceUrlLink } from './elements/ResourceUrl';
import { BoxBlockDefaultClickPropagation } from './ResourcePreviewCard';
import { SquareResourceCardDataFragment } from './SquareResourceCard.generated';

export const SquareResourceCardData = gql`
  fragment SquareResourceCardData on Resource {
    _id
    name
    type
    rating
    consumed {
      openedAt
    }
    url
  }
`;

interface SquareResourceCardProps {
  resource: SquareResourceCardDataFragment;
  onRemove?: (resource: SquareResourceCardDataFragment) => void;
}

export const SquareResourceCard: React.FC<SquareResourceCardProps> = ({ resource, onRemove }) => {
  return (
    <SquareResourceCardContainer
      onClick={() => routerPushToPage(ResourcePageInfo(resource))}
      renderTopRight={
        onRemove && (
          <DeleteButtonWithConfirmation
            mode="iconButton"
            modalBodyText="Confirm removing this resource ? This will not delete the resource in itself."
            modalHeaderText="Remove resource"
            confirmButtonText="Remove"
            justifySelf="start"
            alignSelf="flex-end"
            size="xs"
            aria-label="remove sub resource"
            onConfirmation={() => onRemove(resource)}
          />
        )
      }
      renderBottom={
        <Stack direction="row">
          <StarsRatingViewer value={resource.rating} pxSize={13} />
          <ResourceTypeBadge type={resource.type} />
        </Stack>
      }
    >
      <BoxBlockDefaultClickPropagation display="flex" justifyContent="center" alignItems="center">
        <Link display="flex" alignItems="stretch" flexDirection="column" href={resource.url} isExternal>
          <Text mr={1} as="span" textAlign="center" fontSize="sm" noOfLines={3}>
            {/* @ts-ignore */}
            {resource.name}
          </Text>
          <Center>
            <ResourceUrlLink resource={resource} as="span" maxLength={15} />
          </Center>
        </Link>
      </BoxBlockDefaultClickPropagation>
    </SquareResourceCardContainer>
  );
};
interface SquareResourceCardContainerProps {
  renderTopRight?: ReactElement;
  renderBottom?: ReactElement;
  onClick: () => void;
}

export const SquareResourceCardContainer: React.FC<SquareResourceCardContainerProps> = ({
  children,
  renderTopRight,
  renderBottom,
  onClick,
}) => {
  return (
    <Flex
      backgroundColor="whiteAlpha.500"
      boxSize="10rem"
      direction="column"
      alignItems="center"
      justifyContent="center"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ cursor: 'pointer', borderColor: 'gray.400' }}
      p={2}
      mb={4}
      mx={2}
      borderRadius={4}
      onClick={() => onClick()}
    >
      <Flex direction="column" w="100%" h="100%" justifyContent="stretch" alignItems="stretch">
        {renderTopRight && (
          <Flex direction="row" justifyContent="flex-end">
            {renderTopRight}
          </Flex>
        )}
        <Center flexGrow={1}>{children}</Center>
        {renderBottom}
      </Flex>
    </Flex>
  );
};
