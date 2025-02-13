import { Box, Button, Flex, Link, Skeleton, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { useUnauthentificatedModal } from '../../../components/auth/UnauthentificatedModal';
import { RandomPrompt } from '../../../components/collaborative/RandomPrompt';
import { PageLayout } from '../../../components/layout/PageLayout';
import { TopicPageLayout } from '../../../components/layout/TopicPageLayout';
import { LearningPathIcon } from '../../../components/lib/icons/LearningPathIcon';
import { ResourceIcon } from '../../../components/lib/icons/ResourceIcon';
import { TopicIcon } from '../../../components/lib/icons/TopicIcon';
import { TopicLink } from '../../../components/lib/links/TopicLink';
import { PageTitle } from '../../../components/lib/Typography';
import { PageButtonLink } from '../../../components/navigation/InternalLink';
import { NewResourceModal } from '../../../components/resources/NewResource';
import { Discussion, DiscussionData } from '../../../components/social/comments/Discussion';
import { AlsoPartOfTopicsViewer } from '../../../components/topics/AlsoPartOfTopicsViewer';
import { EditablePartOfTopicsData } from '../../../components/topics/EditablePartOfTopics';
import { TopicDescription } from '../../../components/topics/fields/TopicDescription';
import { NewTopicModal } from '../../../components/topics/NewTopic';
import {
  ParentTopicsBreadcrumbs,
  ParentTopicsBreadcrumbsData,
} from '../../../components/topics/ParentTopicsBreadcrumbs';
import { MapTopicData } from '../../../components/topics/map/map.utils';
import { Minimap } from '../../../components/topics/map/Minimap';
import { TopicSubHeader, TopicSubHeaderData } from '../../../components/topics/TopicSubHeader';
import { generateTopicData, TopicLinkData } from '../../../graphql/topics/topics.fragments';
import { DiscussionLocation, TopicLearningMaterialsSortingType } from '../../../graphql/types';
import { useCurrentUser } from '../../../graphql/users/users.hooks';
import { routerPushToPage } from '../../PageInfo';
import { NewLearningPathPageInfo, ResourcePageInfo } from '../../RoutesPageInfos';
import { SeeAlso, SeeAlsoData } from './SeeAlso';
import { SubTopicFilterDataFragment } from './SubTopicFilter.generated';
import { GetTopicByKeyTopicPageQuery, useGetTopicByKeyTopicPageQuery } from './TopicPage.generated';
import {
  TopicPageLearningMaterialsFeed,
  TopicPageLearningMaterialsFeedOptions,
  useTopicPageLearningMaterialsFeed,
} from './TopicPageLearningMaterialsFeed';

export const getTopicByKeyTopicPage = gql`
  query getTopicByKeyTopicPage($key: String!) {
    getTopicByKey(topicKey: $key) {
      _id
      name
      description
      wikipediaPageUrl
      isDisambiguation
      ...MapTopicData
      subTopics {
        subTopic {
          ...MapTopicData
        }
      }
      contextualisedTopics {
        ...TopicLinkData
      }
      ...ParentTopicsBreadcrumbsData
      ...TopicSubHeaderData
      ...EditablePartOfTopicsData
      ...SeeAlsoData
      comments(options: { pagination: {} }) {
        ...DiscussionData
      }
    }
  }
  ${MapTopicData}
  ${TopicLinkData}
  ${ParentTopicsBreadcrumbsData}
  ${TopicSubHeaderData}
  ${EditablePartOfTopicsData}
  ${SeeAlsoData}
  ${DiscussionData}
`;

const placeholderTopicData: GetTopicByKeyTopicPageQuery['getTopicByKey'] = {
  ...generateTopicData(),
};

export const TopicPage: React.FC<{ topicKey: string }> = ({ topicKey }) => {
  const contributionButtonSize = useBreakpointValue({ base: 'sm', md: 'md' }) || 'md';
  const topicSubHeaderSize = useBreakpointValue({ base: 'sm' as const, sm: 'md' as const }, 'md');
  const { data, loading, error, refetch } = useGetTopicByKeyTopicPageQuery({
    variables: { key: topicKey },
  });
  const topic = data?.getTopicByKey || placeholderTopicData;
  const { currentUser } = useCurrentUser();
  const { onOpen: onOpenUnauthentificatedModal } = useUnauthentificatedModal();

  const [learningMaterialsFeedOptions, setLearningMaterialsFeedOptions] =
    useState<TopicPageLearningMaterialsFeedOptions>({
      mainTopicKey: topicKey,
      selectedSubTopicKey: null,
      sorting: TopicLearningMaterialsSortingType.MostRecommended,
      page: 1,
      typeFilters: {},
      tagsFilters: [],
    });

  useEffect(() => {
    // Behaviour when switching page -- maybe keep same sorting/type filters ?
    setLearningMaterialsFeedOptions({
      mainTopicKey: topicKey,
      selectedSubTopicKey: null,
      sorting: TopicLearningMaterialsSortingType.MostRecommended,
      page: 1,
      typeFilters: {},
      tagsFilters: [],
    });
  }, [topicKey]);

  const {
    loading: learningMaterialsFeedLoading,
    initialLoading: learningMaterialsFeedInitialLoading,
    isReloading: learningMaterialsFeedReloading,
    isRefetching: learningMaterialsFeedIsRefetching,
    lastSelectedTopic,
    learningMaterials,
    totalPages,
    feedAvailableFilters,
  } = useTopicPageLearningMaterialsFeed(learningMaterialsFeedOptions);

  const selectedSubTopic =
    learningMaterialsFeedOptions.selectedSubTopicKey &&
    !!lastSelectedTopic &&
    learningMaterialsFeedOptions.selectedSubTopicKey === lastSelectedTopic.key
      ? lastSelectedTopic
      : null;

  if (error) return null;

  if (topic.isDisambiguation)
    return (
      <PageLayout>
        <Box mt={8}>
          <Text fontSize="2xl" fontWeight={600} color="teal.600">
            Disambiguation:
          </Text>
          <PageTitle pl={12}>{topic.name}</PageTitle>
        </Box>
        <Box mt={16}>
          <Text>
            <Text as="span" fontWeight={600} fontStyle="italic">
              {topic.name}
            </Text>{' '}
            may refer to:
          </Text>
          <Stack ml={8} mt={2}>
            {topic.contextualisedTopics?.map((contextualisedTopic) => (
              <TopicLink key={contextualisedTopic._id} topic={contextualisedTopic} size="lg" showContext />
            ))}
          </Stack>
        </Box>
      </PageLayout>
    );
  return (
    <TopicPageLayout
      renderTopLeftNavigation={<ParentTopicsBreadcrumbs topic={topic} isLoading={loading} />}
      renderTopRightNavigation={<AlsoPartOfTopicsViewer topic={topic} />}
      renderTitle={
        <PageTitle backgroundImage="linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.7), rgba(255,255,255,0.7), rgba(255,255,255,0.1))">
          {topic.name}
        </PageTitle>
      }
      renderBlockBelowTitle={
        <Flex direction="column" pb={{ base: 4, md: 0 }}>
          <Box pt="2px" pb={3}>
            <TopicSubHeader topic={topic} size={topicSubHeaderSize} mt={2} displayManage />
          </Box>
          {topic && topic.description && (
            <Skeleton isLoaded={!loading}>
              <TopicDescription
                topicDescription={topic.description}
                mt={3}
                backgroundImage="linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.7), rgba(255,255,255,0.7), rgba(255,255,255,0.1))"
                noOfLines={5}
              />
            </Skeleton>
          )}
          {topic.wikipediaPageUrl && (
            <Link
              alignSelf="flex-end"
              href={topic.wikipediaPageUrl}
              color="blue.500"
              fontSize="sm"
              fontWeight={500}
              textDecor="underline"
              isExternal
            >
              Wikipedia
            </Link>
          )}
        </Flex>
      }
      renderMinimap={(pxWidth, pxHeight) => (
        <Minimap
          topic={topic}
          isLoading={!!loading}
          subTopics={(topic.subTopics || []).map(({ subTopic }) => subTopic)}
          parentTopic={topic.parentTopic || undefined}
          pxWidth={pxWidth}
          pxHeight={pxHeight}
        />
      )}
      isLoading={loading}
    >
      <Flex direction={{ base: 'column', lg: 'row' }} mb="60px" mt={10} width="100%">
        <Flex direction="column" flexGrow={1}>
          <RandomPrompt mb={10} />
          <TopicPageLearningMaterialsFeed
            mainTopic={topic}
            selectedSubTopic={selectedSubTopic}
            feedOptions={learningMaterialsFeedOptions}
            setFeedOptions={setLearningMaterialsFeedOptions}
            subTopics={topic.subTopics?.map(({ subTopic }) => subTopic) || []}
            feedAvailableFilters={feedAvailableFilters}
            learningMaterials={learningMaterials}
            totalPages={totalPages}
            isLoading={learningMaterialsFeedLoading}
            initialLoading={learningMaterialsFeedInitialLoading}
            isReloading={learningMaterialsFeedReloading || learningMaterialsFeedIsRefetching}
          />
        </Flex>
        <Stack
          ml={{ base: 0, lg: 10 }}
          mt={{ base: 10, lg: 0 }}
          direction={{ base: 'column', md: 'row', lg: 'column' }}
          w={{ base: '100%', lg: '270px' }}
          spacing={{ base: 4, md: 'auto', lg: 10 }}
          flexBasis={{ base: '100%', lg: '270px' }}
          flexGrow={0}
          flexShrink={0}
        >
          <Stack direction="column" spacing={4} alignItems="flex-end">
            <NewResourceModal
              defaultResourceCreationData={{
                showInTopics: [topic],
              }}
              validationRules={['at least one showIn Topic']}
              onResourceCreated={(createdResource) => routerPushToPage(ResourcePageInfo(createdResource))}
              renderButton={(openModal) => (
                <Button
                  leftIcon={<ResourceIcon boxSize={6} />}
                  size={contributionButtonSize}
                  variant="solid"
                  colorScheme="teal"
                  isDisabled={loading}
                  onClick={() => {
                    if (!currentUser) return onOpenUnauthentificatedModal();
                    openModal();
                  }}
                >
                  Share new Resource
                </Button>
              )}
            />

            <NewTopicModal
              parentTopic={topic}
              renderButton={(openModal) => (
                <Button
                  leftIcon={<TopicIcon />}
                  size={contributionButtonSize}
                  variant="solid"
                  colorScheme="blue"
                  isDisabled={loading}
                  onClick={() => {
                    if (!currentUser) return onOpenUnauthentificatedModal();
                    openModal();
                  }}
                >
                  Suggest SubTopic
                </Button>
              )}
              onCreated={() => refetch()}
              onSubTopicConnected={() => refetch()}
            />
            <PageButtonLink
              leftIcon={<LearningPathIcon boxSize={7} />}
              size={contributionButtonSize}
              variant="solid"
              colorScheme="teal"
              pageInfo={NewLearningPathPageInfo}
              loggedInOnly
              isDisabled={loading}
            >
              Share your Path
            </PageButtonLink>
          </Stack>
          <SeeAlso topic={topic} />
        </Stack>
      </Flex>
      <Flex direction="column" alignItems="stretch" pt={20}>
        <Discussion
          title="Ask a Question"
          discussionLocation={DiscussionLocation.TopicPage}
          discussionEntityId={topic._id}
          commentResults={topic.comments || undefined}
          refetch={() => refetch()}
          isLoading={loading}
        />
      </Flex>
    </TopicPageLayout>
  );
};
