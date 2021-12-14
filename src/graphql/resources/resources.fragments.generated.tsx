import * as Types from '../types';

export type ResourceDataFragment = { __typename?: 'Resource', _id: string, name: string, type: Types.ResourceType, mediaType: Types.ResourceMediaType, url: string, description?: string | null | undefined, durationSeconds?: number | null | undefined, rating?: number | null | undefined, tags?: Array<{ __typename?: 'LearningMaterialTag', name: string }> | null | undefined, consumed?: { __typename?: 'ConsumedResource', openedAt?: any | null | undefined, consumedAt?: any | null | undefined } | null | undefined };

export type ResourceLinkDataFragment = { __typename?: 'Resource', _id: string, name: string };

export type ResourcePreviewCardDataFragment = { __typename?: 'Resource', _id: string, name: string, type: Types.ResourceType, mediaType: Types.ResourceMediaType, url: string, description?: string | null | undefined, durationSeconds?: number | null | undefined, upvotes?: number | null | undefined, rating?: number | null | undefined, tags?: Array<{ __typename?: 'LearningMaterialTag', name: string }> | null | undefined, consumed?: { __typename?: 'ConsumedResource', openedAt?: any | null | undefined, consumedAt?: any | null | undefined } | null | undefined, coveredSubTopics?: { __typename?: 'LearningMaterialCoveredSubTopicsResults', items: Array<{ __typename?: 'Topic', _id: string, key: string, name: string, context?: string | null | undefined }> } | null | undefined, subResourceSeries?: Array<{ __typename?: 'Resource', _id: string, name: string }> | null | undefined, subResources?: Array<{ __typename?: 'Resource', _id: string, name: string }> | null | undefined };

export type ResourceWithCoveredTopicsDataFragment = { __typename?: 'Resource', _id: string, coveredSubTopics?: { __typename?: 'LearningMaterialCoveredSubTopicsResults', items: Array<{ __typename?: 'Topic', _id: string, key: string, name: string, context?: string | null | undefined }> } | null | undefined };
