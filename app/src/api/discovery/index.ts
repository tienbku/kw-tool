import { createRouter } from '../../shared/router';
import { apiListDiscovery } from './apiListDiscovery';
import { apiCreateDiscovery } from './apiCreateDiscovery';
import { apiGetDiscoveryBase } from './apiGetDiscoveryBase';
import { inputCreateDiscovery, outputCreateDiscovery } from './input/inputCreateDiscovery';
import { inputGetDiscoveryBase, outputGetDiscoveryBase } from './input/inputGetDiscoveryBase';
import { inputGetDiscoveryItems, outputGetDiscoveryItems } from './input/inputGetDiscoveryItems';
import { apiGetDiscoveryItems } from './apiGetDiscoveryItems';
import { inputGetDiscoveryTasks, outputGetDiscoveryTasks } from './input/inputGetDiscoveryTasks';
import { apiGetDiscoveryTasks } from './apiGetDiscoveryTasks';
import { inputDeleteDiscovery, outputDeleteDiscovery } from './input/inputDeleteDiscovery';
import { apiDeleteDiscovery } from './apiDeleteDiscovery';
import { inputExpandDiscovery, outputExpandDiscovery } from './input/inputExpandDiscovery';
import { apiExpandDiscovery } from './apiExpandDiscovery';
import { inputDeleteDiscoveryKeywords, outputDeleteDiscoveryKeywords } from './input/inputDeleteDiscoveryKeywords';
import { apiDeleteDiscoveryKeywords } from './apiDeleteDiscoveryKeywords';
import { inputUpdateDiscoveryGroup, outputUpdateDiscoveryGroup } from './input/inputUpdateDiscoveryGroup';
import { apiUpdateDiscoveryGroup } from './apiUpdateDiscoveryGroup';
import { apiDeleteDiscoveryGroup } from './apiDeleteDiscoveryGroup';
import { inputDeleteDiscoveryGroup, outputDeleteDiscoveryGroup } from './input/inputDeleteDiscoveryGroup';
import { inputGetDiscoverySerps, outputGetDiscoverySerps } from './input/inputGetDiscoverySerps';
import { apiGetDiscoverySerps } from './apiGetDiscoverySerps';
import { inputGetDiscoveryClusters, outputGetDiscoveryClusters } from './input/inputGetDiscoveryClusters';
import { apiGetDiscoveryClusters } from './apiGetDiscoveryClusters';
import { inputRunDiscoveryItemAnalysis, outputRunDiscoveryItemAnalysis } from './input/inputRunDiscoveryItemAnalysis';
import { apiRunDiscoveryItemAnalysis } from './apiRunDiscoveryItemAnalysis';
import { inputUpdateDiscoveryCompetitors, outputUpdateDiscoveryCompetitors } from './input/inputUpdateDiscoveryCompetitors';
import { apiUpdateDiscoveryCompetitors } from './apiUpdateDiscoveryCompetitors';
import { inputUpdateDiscoveryEwPatterns, outputUpdateDiscoveryEwPatterns } from './input/inputUpdateDiscoveryEwPatterns';
import { apiUpdateDiscoveryEwPatterns } from './apiUpdateDiscoveryEwPatterns';
import { inputGetTopicMap, outputGetTopicMap } from './input/apiGetTopicMap';
import { apiGetTopicMap } from './apiGetTopicMap';
import { apiCreateTopicMap } from './apiCreateTopicMap';
import { inputCreateTopicMap, outputCreateTopicMap } from './input/apiCreateTopicMap';

export const discoveryRouter = createRouter()
  .query('list', {
    resolve: apiListDiscovery,
  })
  .query('base', {
    input: inputGetDiscoveryBase,
    output: outputGetDiscoveryBase,
    resolve: apiGetDiscoveryBase,
  })
  .query('tasks', {
    input: inputGetDiscoveryTasks,
    output: outputGetDiscoveryTasks,
    resolve: apiGetDiscoveryTasks,
  })
  .query('items', {
    input: inputGetDiscoveryItems,
    output: outputGetDiscoveryItems,
    resolve: apiGetDiscoveryItems,
  })
  .query('clusters', {
    input: inputGetDiscoveryClusters,
    output: outputGetDiscoveryClusters,
    resolve: apiGetDiscoveryClusters,
  })
  .query('get-topic-map', {
    input: inputGetTopicMap,
    output: outputGetTopicMap,
    resolve: apiGetTopicMap,
  })
  .mutation('create', {
    input: inputCreateDiscovery,
    output: outputCreateDiscovery,
    resolve: apiCreateDiscovery,
  })
  .mutation('create-topic-map', {
    input: inputCreateTopicMap,
    output: outputCreateTopicMap,
    resolve: apiCreateTopicMap,
  })
  .mutation('delete-keywords', {
    input: inputDeleteDiscoveryKeywords,
    output: outputDeleteDiscoveryKeywords,
    resolve: apiDeleteDiscoveryKeywords,
  })
  .mutation('expand', {
    input: inputExpandDiscovery,
    output: outputExpandDiscovery,
    resolve: apiExpandDiscovery,
  })
  .mutation('update-group', {
    input: inputUpdateDiscoveryGroup,
    output: outputUpdateDiscoveryGroup,
    resolve: apiUpdateDiscoveryGroup,
  })
  .mutation('delete-group', {
    input: inputDeleteDiscoveryGroup,
    output: outputDeleteDiscoveryGroup,
    resolve: apiDeleteDiscoveryGroup,
  })
  .mutation('get-serps', {
    input: inputGetDiscoverySerps,
    output: outputGetDiscoverySerps,
    resolve: apiGetDiscoverySerps,
  })
  .mutation('item-analysis', {
    input: inputRunDiscoveryItemAnalysis,
    output: outputRunDiscoveryItemAnalysis,
    resolve: apiRunDiscoveryItemAnalysis,
  })
  .mutation('update-competitors', {
    input: inputUpdateDiscoveryCompetitors,
    output: outputUpdateDiscoveryCompetitors,
    resolve: apiUpdateDiscoveryCompetitors,
  })
  .mutation('update-ew-patterns', {
    input: inputUpdateDiscoveryEwPatterns,
    output: outputUpdateDiscoveryEwPatterns,
    resolve: apiUpdateDiscoveryEwPatterns,
  })
  .mutation('delete', {
    input: inputDeleteDiscovery,
    output: outputDeleteDiscovery,
    resolve: apiDeleteDiscovery,
  });
