import Toggle from '../../../components/Toggle';
import Button from '../../../components/Button';
import React, { Fragment, useState } from 'react';
import Checkbox from '../../../components/Checkbox';
import { useRecoilState, useRecoilValue } from 'recoil';
import InputWithIcon from '../../../components/InputWithIcon';
import { ISerpFeature } from '../../../../types/ISerpFeature';
import { AtomDiscoveryControl, ControlHasFilters } from '../atoms/AtomDiscoveryControl';

interface Props {
  reportNotFinished: boolean;
}

const Filters = ({ reportNotFinished }: Props) => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const hasFilters = useRecoilValue(ControlHasFilters);
  const [localSearch, setLocalSearch] = useState(control.search);
  const [localIgnore, setLocalIgnore] = useState(control.ignore);
  const [localMinVol, setLocalMinVol] = useState<string>((control.minVol || '').toString());
  const [localMaxVol, setLocalMaxVol] = useState<string>((control.maxVol || '').toString());

  const setSerpFeaturesFilter = (features: ISerpFeature[] | undefined) => {
    let serpFeatures: ISerpFeature[];

    if (features === undefined) {
      serpFeatures = [];
    } else {
      const newFilters: ISerpFeature[] = control.serpFeaturesFilter.filter((feature) => !features.includes(feature));
      for (const feature of features) {
        if (!control.serpFeaturesFilter.includes(feature)) {
          newFilters.push(feature);
        }
      }
      serpFeatures = newFilters;
    }

    setControl((prev) => ({
      ...prev,
      itemOffset: 0,
      withoutSerpData: false,
      serpFeaturesFilter: serpFeatures,
    }));
  };

  return (
    <div className="bg-white pt-3 pb-4 rounded shadow select-none">
      {reportNotFinished ? (
        <div className="text-center text-slate-600 py-3">
          <i className="ri-refresh-line" />
        </div>
      ) : (
        <Fragment>
          <div className="px-3">
            <div className="text-base font-medium text-slate-600">Search</div>
            <div className="text-xs text-slate-600 mb-1.5">Use comma for multiple, minus to exclude terms.</div>
            <InputWithIcon
              value={localSearch || ''}
              className="w-full mb-2"
              label="Search Keywords"
              icon="ri-search-line"
              placeholder="Search Keywords"
              onChange={(s) => setLocalSearch(s.toLowerCase())}
            />
            <div className="mb-3 mt-1 flex flex-wrap items-center">
              <Checkbox
                label="Exact Search"
                checked={control.exactSearch}
                onChange={() => {
                  setControl((prev) => ({ ...prev, exactSearch: !control.exactSearch, itemOffset: 0 }));
                }}
              />
              <Checkbox
                label="OR Search"
                className="ml-3"
                checked={control.orSearch}
                onChange={() => {
                  setControl((prev) => ({ ...prev, orSearch: !control.orSearch, itemOffset: 0 }));
                }}
              />
            </div>
            <div className="text-base font-medium text-slate-600">Ignored Terms</div>
            <div className="text-xs text-slate-600 mb-1.5">Use comma for multiple ignored terms.</div>
            <InputWithIcon
              value={localIgnore}
              icon="ri-eye-line"
              label="Ignored Terms"
              className="w-full mb-3"
              placeholder="Ignored Terms"
              onChange={(s) => setLocalIgnore(s)}
            />
            <div className="text-base font-medium text-slate-600">Search Volume</div>
            <div className="mb-3 bg-white rounded-md shadow-sm -space-y-px">
              <div className="flex -space-x-px">
                <div className="w-1/2 flex-1 min-w-0">
                  <label className="sr-only">Min Volume</label>
                  <input
                    min="0"
                    type="number"
                    placeholder="Min Volume"
                    value={localMinVol === undefined ? '' : localMinVol}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setLocalMinVol('');
                      } else {
                        setLocalMinVol(e.target.value);
                      }
                    }}
                    className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-l-md bg-transparent focus:z-10 sm:text-sm border-slate-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="sr-only">Max Volume</label>
                  <input
                    min="0"
                    type="number"
                    placeholder="Max Volume"
                    value={localMaxVol === undefined ? '' : localMaxVol}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setLocalMaxVol('');
                      } else {
                        setLocalMaxVol(e.target.value);
                      }
                    }}
                    className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-r-md bg-transparent focus:z-10 sm:text-sm border-slate-300"
                  />
                </div>
              </div>
            </div>
            <Button
              text="Apply"
              className="mr-2"
              color="text-white bg-sky-600 hover:bg-sky-500"
              onClick={() => {
                setControl((prev) => ({
                  ...prev,
                  selected: [],
                  itemOffset: 0,
                  search: localSearch,
                  ignore: localIgnore,
                  minVol: localMinVol !== '' ? parseInt(localMinVol, 10) : undefined,
                  maxVol: localMaxVol !== '' ? parseInt(localMaxVol, 10) : undefined,
                }));
              }}
            />
            <Button
              text="Clear"
              color={`text-white ${hasFilters ? 'bg-red-400' : 'bg-slate-400'} hover:bg-red-400`}
              onClick={() => {
                setLocalSearch('');
                setLocalIgnore('');
                setLocalMinVol('');
                setLocalMaxVol('');
                setControl((prev) => ({
                  ...prev,
                  search: '',
                  ignore: '',
                  itemOffset: 0,
                  minVol: undefined,
                  maxVol: undefined,
                }));
              }}
            />
          </div>
          <div className="border-0 border-t border-slate-200 mt-3 pt-3">
            <div className="text-slate-600 text-base mb-1 px-4">SERP Features</div>
            <div className="text-xs text-slate-500 px-4 mb-3">Filter by included SERP features</div>
            <div className="flex flex-wrap justify-start pl-4">
              <Toggle
                label="Show All"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.length === 0 && !control.withoutSerpData}
                setEnabled={() => setControl((prev) => ({ ...prev, serpFeaturesFilter: [], itemOffset: 0 }))}
              />
              <Toggle
                label="No SERP Data"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.withoutSerpData}
                setEnabled={() => {
                  setControl((prev) => ({
                    ...prev,
                    itemOffset: 0,
                    serpFeaturesFilter: [],
                    withoutSerpData: !control.withoutSerpData,
                  }));
                }}
              />
              <Toggle
                label="PAA"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('people_also_ask')}
                setEnabled={() => setSerpFeaturesFilter(['people_also_ask'])}
              />
              <Toggle
                label="Video"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.some((s) => ['video', 'youtube'].includes(s))}
                setEnabled={() => {
                  setSerpFeaturesFilter(['video', 'youtube']);
                }}
              />
              <Toggle
                label="Local"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.some((s) => ['map', 'local_pack', 'local_services'].includes(s))}
                setEnabled={() => {
                  setSerpFeaturesFilter(['map', 'local_pack', 'local_services']);
                }}
              />
              <Toggle
                label="Images"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.some((s) => ['images', 'visual_stories'].includes(s))}
                setEnabled={() => {
                  setSerpFeaturesFilter(['images', 'visual_stories']);
                }}
              />
              <Toggle
                label="Shopping"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.some((s) => ['shopping', 'popular_products'].includes(s))}
                setEnabled={() => {
                  setSerpFeaturesFilter(['shopping', 'popular_products']);
                }}
              />
              <Toggle
                label="Feat. Snip."
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('featured_snippet')}
                setEnabled={() => setSerpFeaturesFilter(['featured_snippet'])}
              />
              <Toggle
                label="Ads"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('paid')}
                setEnabled={() => setSerpFeaturesFilter(['paid'])}
              />
              <Toggle
                label="Events"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('events')}
                setEnabled={() => setSerpFeaturesFilter(['events'])}
              />
              <Toggle
                label="Recipes"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('recipes')}
                setEnabled={() => setSerpFeaturesFilter(['recipes'])}
              />
              <Toggle
                label="Travel"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.some((s) => {
                  return ['hotels_pack', 'google_hotels', 'google_flights', 'top_sights'].includes(s);
                })}
                setEnabled={() => {
                  setSerpFeaturesFilter(['hotels_pack', 'google_hotels', 'google_flights', 'top_sights']);
                }}
              />
              <Toggle
                label="Jobs"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('jobs')}
                setEnabled={() => setSerpFeaturesFilter(['jobs'])}
              />
              <Toggle
                label="Twitter"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('twitter')}
                setEnabled={() => setSerpFeaturesFilter(['twitter'])}
              />
              <Toggle
                label="Podcasts"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('podcasts')}
                setEnabled={() => setSerpFeaturesFilter(['podcasts'])}
              />
              <Toggle
                label="Know. Graph"
                className="w-full xl:w-6/12 pb-3"
                enabled={control.serpFeaturesFilter.includes('knowledge_graph')}
                setEnabled={() => setSerpFeaturesFilter(['knowledge_graph'])}
              />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Filters;
