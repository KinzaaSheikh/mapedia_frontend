import * as Types from '../types';

export type TopicLinkDataFragment = { __typename?: 'Topic', _id: string, key: string, name: string, context?: string | null | undefined };

export type TopicFullDataFragment = { __typename?: 'Topic', _id: string, name: string, key: string, context?: string | null | undefined, isDisambiguation?: boolean | null | undefined, description?: string | null | undefined, createdAt: any };
