import gql from 'graphql-tag';
import { DomainLinkData } from '../domains/domains.fragments';
import { LearningGoalType } from '../types';

export const LearningGoalData = gql`
  fragment LearningGoalData on LearningGoal {
    _id
    key
    name
    type
    description
    publishedAt
  }
`;

export const LearningGoalLinkData = gql`
  fragment LearningGoalLinkData on LearningGoal {
    _id
    key
    name
    type
    domain {
      domain {
        ...DomainLinkData
      }
    }
  }
  ${DomainLinkData}
`;

export const generateLearningGoalData = () => ({
  _id: Math.random().toString(),
  key: Math.random().toString(),
  type: LearningGoalType.Roadmap,
  name: 'Learning Goal',
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
});
