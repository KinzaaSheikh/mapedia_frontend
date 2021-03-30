import { NetworkStatus } from '@apollo/client';
import { SettingsIcon } from '@chakra-ui/icons';
import { Box, BoxProps, Flex, Heading, IconButton, Image, Skeleton, Stack, Text } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { RoleAccess } from '../../components/auth/RoleAccess';
import { DomainConceptGraph } from '../../components/concepts/DomainConceptGraph';
import { DomainConceptList } from '../../components/concepts/DomainConceptList';
import { BestXPagesLinks } from '../../components/domains/BestXPagesLinks';
import { DomainLearningGoals } from '../../components/domains/DomainLearningGoals';
import { DomainUserHistory } from '../../components/domains/DomainUserHistory';
import { ParentDomainsNavigationBlock } from '../../components/domains/ParentDomainsNavigationBlock';
import { BasePageLayout } from '../../components/layout/PageLayout';
import { LearningGoalCardData } from '../../components/learning_goals/cards/LearningGoalCard';
import { LearningPathPreviewCardDataFragment } from '../../components/learning_paths/LearningPathPreviewCard.generated';
import { DomainIcon } from '../../components/lib/icons/DomainIcon';
import { LearningGoalIcon } from '../../components/lib/icons/LearningGoalIcon';
import { LearningPathIcon } from '../../components/lib/icons/LearningPathIcon';
import { ResourceIcon } from '../../components/lib/icons/ResourceIcon';
import { PageButtonLink, PageLink } from '../../components/navigation/InternalLink';
import { DomainRecommendedLearningMaterials } from '../../components/resources/DomainRecommendedLearningMaterials';
import { useGetDomainRecommendedLearningMaterialsQuery } from '../../components/resources/DomainRecommendedLearningMaterials.generated';
import { ConceptData, generateConceptData } from '../../graphql/concepts/concepts.fragments';
import { DomainData, DomainLinkData, generateDomainData } from '../../graphql/domains/domains.fragments';
import { ResourcePreviewDataFragment } from '../../graphql/resources/resources.fragments.generated';
import { DomainLearningMaterialsOptions, DomainLearningMaterialsSortingType } from '../../graphql/types';
import { routerPushToPage } from '../PageInfo';
import {
  AddLearningGoalToDomainPageInfo,
  AddResourceToDomainPageInfo,
  ConceptListPageInfo,
  DomainPageInfo,
  ManageDomainPageInfo,
  NewLearningPathPageInfo,
} from '../RoutesPageInfos';
import { GetDomainByKeyDomainPageQuery, useGetDomainByKeyDomainPageQuery } from './DomainPage.generated';

export const getDomainByKeyDomainPage = gql`
  query getDomainByKeyDomainPage($key: String!) {
    getDomainByKey(key: $key) {
      ...DomainData
      concepts(options: { sorting: { entity: relationship, field: index, direction: ASC } }) {
        items {
          concept {
            ...ConceptData
            referencedByConcepts {
              concept {
                _id
              }
            }
            parentConcepts {
              concept {
                _id
              }
            }
          }
          relationship {
            index
          }
        }
      }
      parentDomains {
        domain {
          ...DomainLinkData
        }
      }
      subDomains {
        domain {
          ...DomainLinkData
        }
      }
      learningGoals {
        learningGoal {
          ...LearningGoalCardData
        }
        index
      }
    }
  }
  ${DomainData}
  ${DomainLinkData}
  ${ConceptData}
  ${LearningGoalCardData}
`;

const placeholderDomainData: GetDomainByKeyDomainPageQuery['getDomainByKey'] = {
  ...generateDomainData(),
  concepts: {
    items: [...Array(12)].map(() => ({
      concept: generateConceptData(),
      relationship: {
        index: 0,
      },
    })),
  },
};

export const DomainPage: React.FC<{ domainKey: string }> = ({ domainKey }) => {
  const { data, loading, error } = useGetDomainByKeyDomainPageQuery({
    variables: { key: domainKey },
  });

  const [learningMaterialsOptions, setLearningMaterialsOptions] = useState<DomainLearningMaterialsOptions>({
    sortingType: DomainLearningMaterialsSortingType.Recommended,
    filter: { completedByUser: false },
  });

  const [learningMaterialPreviews, setLearningMaterialPreviews] = useState<
    (ResourcePreviewDataFragment | LearningPathPreviewCardDataFragment)[]
  >([]);

  const {
    data: learningMaterialsData,
    networkStatus,
    refetch: refetchLearningMaterials,
  } = useGetDomainRecommendedLearningMaterialsQuery({
    variables: { key: domainKey, learningMaterialsOptions: learningMaterialsOptions },
    fetchPolicy: 'network-only',
    ssr: false,
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      if (data?.getDomainByKey.learningMaterials?.items) {
        setLearningMaterialPreviews(data?.getDomainByKey.learningMaterials?.items);
      }
    },
  });
  const [resourcesLoading, setResourcesLoading] = useState(networkStatus === NetworkStatus.loading);

  useEffect(() => {
    setResourcesLoading(
      [NetworkStatus.refetch, NetworkStatus.setVariables, NetworkStatus.loading, NetworkStatus].indexOf(networkStatus) >
        -1
    );
  }, [networkStatus]);

  const learningMaterials = learningMaterialsData?.getDomainByKey?.learningMaterials?.items || learningMaterialPreviews; // ? after getDomainByKey because of https://github.com/apollographql/apollo-client/issues/6986

  const domain = data?.getDomainByKey || placeholderDomainData;

  if (error) return null;
  return (
    <BasePageLayout
      marginSize="md"
      renderHeader={(layoutProps) => <DomainPageHeader domain={domain} isLoading={loading} layoutProps={layoutProps} />}
    >
      <>
        {(loading || (domain.learningGoals && !!domain.learningGoals.length)) && (
          <DomainLearningGoals learningGoalItems={domain.learningGoals || []} isLoading={loading} />
        )}
        <Flex direction={{ base: 'column-reverse', md: 'row' }} mb="100px">
          <Flex direction="column" flexShrink={1} flexGrow={1}>
            <DomainRecommendedLearningMaterials
              domain={domain}
              learningMaterialsPreviews={learningMaterials}
              isLoading={resourcesLoading}
              reloadRecommendedResources={() => refetchLearningMaterials()}
              learningMaterialsOptions={learningMaterialsOptions}
              setLearningMaterialsOptions={setLearningMaterialsOptions}
            />
            <DomainConceptGraph domain={domain} isLoading={loading} minNbRelationships={5} />
            {/* <DomainLearningPaths domain={domain} /> */}
            {/* {mockedFeaturesEnabled && <DomainLearningPaths domain={domain} />} */}
          </Flex>
          <Stack
            spacing={4}
            alignItems={{ base: 'start', md: 'stretch' }}
            direction={{ base: 'row', md: 'column' }}
            flexShrink={0}
            ml={{ base: 0, md: 8 }}
          >
            <RoleAccess accessRule="loggedInUser">
              <DomainUserHistory maxH={{ md: '210px' }} domainKey={domainKey} />
            </RoleAccess>
            <DomainConceptList
              minWidth="260px"
              domain={domain}
              isLoading={loading}
              onConceptToggled={() => refetchLearningMaterials()}
            />
            {domain.subDomains?.length && (
              <Flex
                direction="column"
                alignItems="stretch"
                backgroundColor="gray.100"
                borderRadius={5}
                px={5}
                pt={1}
                pb={2}
              >
                <Text fontSize="xl" textAlign="center" fontWeight={600} color="gray.600" pb={2}>
                  SubAreas
                </Text>
                <Stack>
                  {(domain.subDomains || []).map(({ domain }) => (
                    <Box key={domain._id}>
                      <PageLink fontWeight={600} color="gray.700" pageInfo={DomainPageInfo(domain)}>
                        {domain.name}
                      </PageLink>
                    </Box>
                  ))}
                </Stack>
              </Flex>
            )}
            <BestXPagesLinks domainKey={domain.key} />
          </Stack>
        </Flex>
      </>
    </BasePageLayout>
  );
};

const DomainPageHeader: React.FC<{
  domain: GetDomainByKeyDomainPageQuery['getDomainByKey'];
  isLoading?: boolean;
  layoutProps: BoxProps;
}> = ({ domain, layoutProps, isLoading }) => {
  return (
    <Flex
      w="100%"
      h="300px"
      direction="row"
      position="relative"
      overflow="hidden"
      justifyContent="space-between"
      {...layoutProps}
      // backgroundImage="linear-gradient(rgba(0,122,122,0.2), rgba(255,255,255,1), rgba(255,255,255,0.1))"
    >
      <Image
        position="absolute"
        src="/static/tourist.svg"
        bottom={0}
        right="0%"
        // right={{ base: '-30px', md: '-160px' }}
        // bottom={{ base: '-30px', md: '10px' }}
        // h={{ base: '300px', md: '320px' }}
        h="280px"
        zIndex={1}
      />
      <Image
        position="absolute"
        src="/static/topostain_green_domain_page.svg"
        zIndex={0}
        top="-30%"
        right="-5%"
        opacity={0.6}
        // right={{ base: '-20px', md: '-200px' }}
        // bottom={{ base: '-120px', md: '-80px' }}
        // opacity={0.8}

        h={{ base: '300px', md: '500px' }}
      />
      <Flex direction="column" maxW="60%">
        <ParentDomainsNavigationBlock domains={(domain.parentDomains || []).map(({ domain }) => domain)} />

        <Stack spacing={1} pt={10} zIndex={2} alignItems="flex-start">
          <Stack direction="row" spacing={1} alignItems="center">
            <DomainIcon boxSize={6} />
            <Text fontSize="xl" fontWeight={400}>
              Area
            </Text>
          </Stack>
          <Skeleton isLoaded={!isLoading}>
            <Heading
              fontSize="5xl"
              // pt={1}
              // pb={3}
              fontWeight={500}
              color="blackAlpha.800"
              // color="black"
              backgroundImage="linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0.1))"
            >
              Learn {domain.name}
            </Heading>
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <Stack direction="row" alignItems="baseline">
              <RoleAccess accessRule="contributorOrAdmin">
                <IconButton
                  size="xs"
                  isDisabled={isLoading}
                  variant="solid"
                  aria-label="manage_domain"
                  icon={<SettingsIcon />}
                  onClick={() => routerPushToPage(ManageDomainPageInfo(domain))}
                />
              </RoleAccess>
              <PageLink
                color="gray.600"
                _hover={{ color: 'gray.700', textDecoration: 'underline' }}
                fontWeight={600}
                pageInfo={ConceptListPageInfo(domain)}
                isDisabled={isLoading}
              >
                {domain.concepts?.items.length ? domain.concepts?.items.length + ' Concepts ' : 'No concepts yet'}
              </PageLink>
            </Stack>
          </Skeleton>
          {domain && domain.description && (
            <Skeleton mt={2} isLoaded={!isLoading}>
              <Box
                backgroundImage="linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0.1))"
                fontWeight={250}
              >
                {domain.description}
              </Box>
            </Skeleton>
          )}
        </Stack>
      </Flex>
      <Flex direction="column-reverse" w="40%">
        <Stack direction="column" spacing={4} pl={10} pb={12} pr={10} alignItems="flex-start">
          <PageButtonLink
            leftIcon={<ResourceIcon boxSize={8} />}
            variant="solid"
            colorScheme="blue"
            pageInfo={AddResourceToDomainPageInfo(domain)}
            loggedInOnly
            isDisabled={isLoading}
          >
            Add Resource
          </PageButtonLink>
          <PageButtonLink
            leftIcon={<LearningPathIcon boxSize={7} />}
            variant="solid"
            colorScheme="teal"
            pageInfo={NewLearningPathPageInfo}
            loggedInOnly
            isDisabled={isLoading}
          >
            Add Learning Path
          </PageButtonLink>
          <PageButtonLink
            variant="solid"
            leftIcon={<LearningGoalIcon boxSize={5} />}
            colorScheme="orange"
            pageInfo={AddLearningGoalToDomainPageInfo(domain)}
            loggedInOnly
            isDisabled={isLoading}
          >
            Add Goal
          </PageButtonLink>
        </Stack>
      </Flex>
    </Flex>
  );
};
