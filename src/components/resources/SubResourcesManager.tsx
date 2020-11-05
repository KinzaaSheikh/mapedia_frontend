import { Center, Flex, Heading, IconButton, Stack, Text, Wrap } from '@chakra-ui/core';
import { AddIcon } from '@chakra-ui/icons';
import gql from 'graphql-tag';
import { DomainDataFragment } from '../../graphql/domains/domains.fragments.generated';
import { ResourceData } from '../../graphql/resources/resources.fragments';
import { ResourceDataFragment } from '../../graphql/resources/resources.fragments.generated';
import { shortenString } from '../../util/utils';
import { DeleteButtonWithConfirmation } from '../lib/buttons/DeleteButtonWithConfirmation';
import { InternalLink } from '../navigation/InternalLink';
import { ResourceSelectorModal } from './ResourceSelector';
import { useAddSubResourceMutation } from './SubResourcesManager.generated';

interface StatelessSubResourcesManagerProps {
  subResources: ResourceDataFragment[];
  domains?: DomainDataFragment[];
  addSubResource?: (subResource: ResourceDataFragment) => void;
  removeSubResource?: (subResource: ResourceDataFragment) => void;
}

export const StatelessSubResourcesManager: React.FC<StatelessSubResourcesManagerProps> = ({
  subResources,
  domains,
  addSubResource,
  removeSubResource,
}) => {
  return (
    <Stack direction="column" spacing={3}>
      <Heading size="sm" textAlign="center">
        Sub Resources
      </Heading>
      <Wrap>
        {subResources.map((subResource) => (
          <SubResourceCard key={subResource._id} subResource={subResource} onRemove={removeSubResource} />
        ))}
        {addSubResource && (
          <CardFrame>
            <ResourceSelectorModal
              onSelect={(subResource) => addSubResource(subResource)}
              defaultAttachedDomains={domains}
              renderButton={({ openModal }) => (
                <IconButton
                  aria-label="add subResource"
                  icon={<AddIcon />}
                  size="lg"
                  isRound
                  mb={3}
                  onClick={() => openModal()}
                />
              )}
            />
            <Text fontWeight={500}>Add sub resource</Text>
          </CardFrame>
        )}
      </Wrap>
    </Stack>
  );
};

export const addSubResource = gql`
  mutation addSubResource($parentResourceId: String!, $subResourceId: String!) {
    addSubResource(parentResourceId: $parentResourceId, subResourceId: $subResourceId) {
      parentResource {
        ...ResourceData
        subResources {
          _id
        }
      }
      subResource {
        ...ResourceData
        parentResources {
          _id
        }
      }
    }
  }
  ${ResourceData}
`;

interface ResourceSubResourcesManagerProps {
  resourceId: string;
  subResources: ResourceDataFragment[];
  domains?: DomainDataFragment[];
}

export const ResourceSubResourcesManager: React.FC<ResourceSubResourcesManagerProps> = ({
  resourceId,
  subResources,
  domains,
}) => {
  const [addSubResource] = useAddSubResourceMutation();
  return (
    <StatelessSubResourcesManager
      subResources={subResources}
      addSubResource={(subResource) =>
        addSubResource({ variables: { subResourceId: subResource._id, parentResourceId: resourceId } })
      }
    />
  );
};

const CardFrame: React.FC<{}> = ({ children }) => {
  return (
    <Flex
      backgroundColor="whiteAlpha.500"
      boxSize="10rem"
      direction="column"
      alignItems="center"
      justifyContent="center"
      borderWidth="1px"
      borderColor="gray.400"
      p={2}
      mb={4}
      mx={2}
      borderRadius={4}
    >
      {children}
    </Flex>
  );
};

const SubResourceCard: React.FC<{
  subResource: ResourceDataFragment;
  onRemove?: (subResource: ResourceDataFragment) => void;
}> = ({ subResource, onRemove }) => {
  return (
    <CardFrame>
      <Flex direction="column" w="100%" h="100%" justifyContent="stretch" alignItems="stretch">
        {onRemove && (
          <Flex direction="row" justifyContent="flex-end">
            <DeleteButtonWithConfirmation
              mode="iconButton"
              modalBodyText="Confirm removing this resource ?"
              modalHeaderText="Remove resource"
              confirmButtonText="Remove"
              justifySelf="start"
              alignSelf="flex-end"
              size="xs"
              aria-label="remove sub resource"
              onConfirmation={() => onRemove(subResource)}
            />
          </Flex>
        )}

        <Center flexGrow={1}>
          <InternalLink
            textAlign="center"
            fontSize="sm"
            routePath="/resources/[_id]"
            asHref={`/resources/${subResource._id}`}
          >
            {shortenString(subResource.name, 90)}
          </InternalLink>
        </Center>
      </Flex>
    </CardFrame>
  );
};
