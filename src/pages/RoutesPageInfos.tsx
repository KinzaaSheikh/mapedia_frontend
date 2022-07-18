// Exist mostly because having pageinfos in Pages creates circular dependencies

import { TopicLinkStyleProps } from '../components/lib/Typography';
import { ManageTopicTabIndex } from '../components/topics/ManageTopic';
import { LearningGoalLinkDataFragment } from '../graphql/learning_goals/learning_goals.fragments.generated';
import { LearningPathDataFragment } from '../graphql/learning_paths/learning_paths.fragments.generated';
import { ResourceDataFragment, ResourceLinkDataFragment } from '../graphql/resources/resources.fragments.generated';
import { TopicLinkDataFragment } from '../graphql/topics/topics.fragments.generated';
import { PublicUserDataFragment } from '../graphql/users/users.fragments.generated';
import { PageInfo } from './PageInfo';

// ====Topics====
export const TopicPagePath = (topicKey: string) => `/topics/${topicKey}`;

export const TopicPageInfo = (topic: TopicLinkDataFragment): PageInfo => ({
  name: topic.name,
  path: TopicPagePath(topic.key),
  routePath: TopicPagePath('[topicKey]'),
  breadcrumbLinkProps: TopicLinkStyleProps.topicName,
});

export const NewTopicPagePath = '/topics/new';
export const NewTopicPageInfo: PageInfo = {
  name: 'New Topic',
  path: NewTopicPagePath,
  routePath: NewTopicPagePath,
};

export const ManageTopicPagePath = (topicKey: string) => `/topics/${topicKey}/manage`;
export const ManageTopicPageInfo = (
  topic: TopicLinkDataFragment,
  tab: ManageTopicTabIndex = ManageTopicTabIndex.Data
): PageInfo => ({
  name: `Manage`,
  path: ManageTopicPagePath(topic.key),
  routePath: ManageTopicPagePath('[topicKey]'),
  query: { tab: tab.toString() },
});

export const TopicTreePagePath = (topicKey: string) => `/topics/${topicKey}/tree`;
export const TopicTreePageInfo = (topic: TopicLinkDataFragment): PageInfo => ({
  name: `Tree`,
  path: TopicTreePagePath(topic.key),
  routePath: TopicTreePagePath('[topicKey]'),
});

// // ====Domains====
// export const DomainsListPagePath = '/areas';

// export const DomainsListPageInfo: PageInfo = {
//   name: 'Areas',
//   path: DomainsListPagePath,
//   routePath: DomainsListPagePath,
// };

// export const NewDomainPagePath = '/areas/new';

// export const NewDomainPageInfo: PageInfo = {
//   name: 'New Area',
//   path: NewDomainPagePath,
//   routePath: NewDomainPagePath,
// };

// export const DomainPagePath = (domainKey: string) => `/areas/${domainKey}`;

// export const DomainPageInfo = (domain: DomainLinkDataFragment): PageInfo => ({
//   name: domain.name,
//   path: DomainPagePath(domain.key),
//   routePath: DomainPagePath('[key]'),
//   breadcrumbLinkProps: domainLinkStyleProps,
// });

// export const EditDomainPagePath = (domainKey: string) => `/areas/${domainKey}/edit`;
// export const EditDomainPageInfo = (domain: DomainDataFragment): PageInfo => ({
//   name: 'Edit',
//   path: EditDomainPagePath(domain.key),
//   routePath: EditDomainPagePath('[key]'),
// });

// export const ManageDomainPagePath = (domainKey: string) => `/areas/${domainKey}/manage`;
// export const ManageDomainPageInfo = (domain: DomainDataFragment): PageInfo => ({
//   name: 'Manage',
//   path: ManageDomainPagePath(domain.key),
//   routePath: ManageDomainPagePath('[key]'),
// });

// // ====Concepts====
// export const ConceptListPagePath = (domainKey: string) => `/areas/${domainKey}/subtopics`;
// export const ConceptListPageInfo = (domain: DomainDataFragment): PageInfo => ({
//   name: 'SubTopics',
//   path: ConceptListPagePath(domain.key),
//   routePath: ConceptListPagePath('[key]'),
// });

// export const ConceptPagePath = (domainKey: string, conceptKey: string) => `/areas/${domainKey}/subtopics/${conceptKey}`;
// export const ConceptPageInfo = (domain: DomainLinkDataFragment, concept: ConceptLinkDataFragment): PageInfo => ({
//   name: `${concept.name}`,
//   path: ConceptPagePath(domain.key, concept.key),
//   routePath: ConceptPagePath('[key]', '[conceptKey]'),
// });

// export const EditConceptPagePath = (domainKey: string, conceptKey: string) =>
//   `/areas/${domainKey}/subtopics/${conceptKey}/edit`;
// export const EditConceptPageInfo = (
//   domain: Pick<DomainLinkDataFragment, 'name' | 'key'>,
//   concept: Pick<ConceptLinkDataFragment, 'name' | 'key'>
// ): PageInfo => ({
//   name: `Edit: ${domain.name} - ${concept.name}`,
//   path: EditConceptPagePath(domain.key, concept.key),
//   routePath: EditConceptPagePath('[key]', '[conceptKey]'),
// });

//====Resources====
export const NewResourcePagePath = '/resources/new';
export const NewResourcePageInfo = {
  name: `Create Resource`,
  path: NewResourcePagePath,
  routePath: NewResourcePagePath,
};

export const ResourcePagePath = (resourceKey: string) => `/resources/${resourceKey}`;
export const ResourcePageInfo = (resource: ResourceLinkDataFragment): PageInfo => ({
  name: `${resource.name}`,
  path: ResourcePagePath(resource.key),
  routePath: ResourcePagePath('[key]'),
});

export const EditResourcePagePath = (resourceKey: string) => `/resources/${resourceKey}/edit`;
export const EditResourcePageInfo = (resource: ResourceLinkDataFragment): PageInfo => ({
  name: `Edit - ${resource.name}`,
  path: EditResourcePagePath(resource.key),
  routePath: EditResourcePagePath('[key]'),
});

// export const DomainResourceListPagePath = (domainKey: string) => `/areas/${domainKey}/resources`;
// export const DomainResourceListPageInfo = (domain: DomainDataFragment): PageInfo => ({
//   name: 'Resources',
//   path: DomainResourceListPagePath(domain.key),
//   routePath: DomainResourceListPagePath('[key]'),
// });

//====Learning Goals====
export const NewLearningGoalPagePath = '/goals/new';
export const NewLearningGoalPageInfo: PageInfo = {
  name: 'New Learning Goal',
  path: NewLearningGoalPagePath,
  routePath: NewLearningGoalPagePath,
};

export const LearningGoalPagePath = (learningGoalKey: string) => '/goals/' + learningGoalKey;
export const LearningGoalPageInfo = (learningGoal: LearningGoalLinkDataFragment): PageInfo => ({
  name: learningGoal.name,
  path: LearningGoalPagePath(learningGoal.key),
  routePath: LearningGoalPagePath('[learningGoalKey]'),
});

// export const AddLearningGoalToDomainPagePath = (domainKey: string) => `/areas/${domainKey}/goals/new`;

// export const AddLearningGoalToDomainPageInfo = (domain: DomainLinkDataFragment): PageInfo => ({
//   name: `Add goal to ${domain.name}`,
//   path: AddLearningGoalToDomainPagePath(domain.key),
//   routePath: AddLearningGoalToDomainPagePath('[key]'),
// });

// export const DomainLearningGoalPagePath = (domainKey: string, learningGoalKey: string) =>
//   `/areas/${domainKey}/goals/${learningGoalKey}`;
// export const DomainLearningGoalPageInfo = (
//   domain: DomainLinkDataFragment,
//   learningGoal: LearningGoalLinkDataFragment
// ): PageInfo => ({
//   name: `${domain.name} - ${learningGoal.name}`,
//   path: DomainLearningGoalPagePath(domain.key, learningGoal.key),
//   routePath: DomainLearningGoalPagePath('[key]', '[learningGoalKey]'),
// });

//====Learning Paths====
export const NewLearningPathPagePath = `/learning_paths/new`;

export const NewLearningPathPageInfo: PageInfo = {
  name: 'New Learning Path',
  path: NewLearningPathPagePath,
  routePath: NewLearningPathPagePath,
};

export const LearningPathPagePath = (learningPathKey: string) => `/learning_paths/${learningPathKey}`;
export const LearningPathPageInfo = (learningPath: Pick<LearningPathDataFragment, 'key' | 'name'>): PageInfo => ({
  name: learningPath.name,
  path: LearningPathPagePath(learningPath.key),
  routePath: LearningPathPagePath('[learningPathKey]'),
});

//====Auth====
export const RegisterPagePath = '/register';

export const RegisterPageInfo: PageInfo = {
  name: 'Register',
  path: RegisterPagePath,
  routePath: RegisterPagePath,
};

export const LoginPagePath = '/login';

export const LoginPageInfo: PageInfo = {
  name: 'Login',
  path: LoginPagePath,
  routePath: LoginPagePath,
};

//====User Profile====
export const UserProfilePagePath = (userKey: string) => `/profile/${userKey}`;

export const UserProfilePageInfo = (user: Pick<PublicUserDataFragment, '_id' | 'key' | 'displayName'>): PageInfo => ({
  name: `Profile of ${user.displayName} (@${user.key})`,
  path: UserProfilePagePath(user.key),
  routePath: UserProfilePagePath('[key]'),
});

export const CurrentUserLearningGoalsPagePath = '/profile/goals';
export const CurrentUserLearningGoalsPageInfo: PageInfo = {
  name: 'My Goals',
  path: CurrentUserLearningGoalsPagePath,
  routePath: CurrentUserLearningGoalsPagePath,
};

//====Other====
export const ExploreMapPagePath = '/explore';
export const ExploreMapPagePageInfo = {
  name: 'Explore',
  path: ExploreMapPagePath,
  routePath: ExploreMapPagePath,
};

export const ResetPasswordPagePath = '/reset_pwd';
export const ResetPasswordPageInfo: PageInfo = {
  name: 'Reset Password',
  path: ResetPasswordPagePath,
  routePath: ResetPasswordPagePath,
};
