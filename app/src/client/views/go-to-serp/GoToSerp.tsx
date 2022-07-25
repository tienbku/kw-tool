import 'antd/dist/antd.css';

import axios from 'axios';
import { debounce } from 'lodash';
import Input from 'antd/es/input';
import Button from '../../components/Button';
import { createRoot } from 'react-dom/client';
import { useLocalStorage } from 'usehooks-ts';
import AutoComplete from 'antd/es/auto-complete';
import Checkbox from '../../components/Checkbox';
import React, { useCallback, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import FreeToolHeader from '../../components/FreeToolHeader';

const GoToSerp = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = React.useState('');
  const [domains, setDomains] = useState<{ value: string }[]>([]);
  const [locations, setLocations] = useState<{ value: string }[]>([]);
  const [languages, setLanguages] = useState<{ value: string }[]>([]);
  const [top100, setTop100] = useLocalStorage('go-to-serp-top100', false);
  const [domain, setDomain] = useLocalStorage('go-to-serp-domain', 'google.com');
  const [language, setLanguage] = useLocalStorage('go-to-serp-language', 'English');
  const [location, setLocation] = useLocalStorage('go-to-serp-location', 'United States');
  const [urls, setUrls] = useLocalStorage<Array<{ google: string; query: string }>>('go-to-serp-urls', []);

  const searchLang = useCallback(
    async (s: string) => {
      try {
        const response = await axios.post('/api/free/languages', {
          search: s,
        });
        if (response && response.data && response.data.languages) {
          setLanguages(response.data.languages);
        }
      } catch (err) {
        setError('Error loading languages');
      }
    },
    [setLanguages, setError],
  );

  const searchLoc = useCallback(
    async (s: string) => {
      try {
        const response = await axios.post('/api/free/locations', {
          search: s,
        });
        if (response && response.data && response.data.locations) {
          setLocations(response.data.locations);
        }
      } catch (err) {
        setError('Error loading locations');
      }
    },
    [setLocations, setError],
  );

  const searchDomain = useCallback(
    async (s: string) => {
      try {
        const response = await axios.post('/api/free/domains', {
          search: s,
        });
        if (response && response.data && response.data.domains) {
          setDomains(response.data.domains);
        }
      } catch (err) {
        setError('Error loading domains');
      }
    },
    [setDomains, setError],
  );

  const getUrl = useCallback(
    async (domain: string, location: string, language: string, query: string) => {
      setLoading(true);

      try {
        const response = await axios.post('/api/free/search', {
          query,
          domain,
          location,
          language,
        });

        if (response && response.data && response.data.google && response.data.bing) {
          setUrls((prev) => [...prev, { google: response.data.google, query }]);
        }
      } catch (err) {
        setError('Error getting our Google URL');
      }

      setLoading(false);
    },
    [setUrls, setLoading, setError],
  );

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Go To SERP by SEO Ruler</title>
        <meta name="description" content="SEO tool to help you quickly go to the right SERP url. You can use it to quickly go to " />
      </Helmet>
      <FreeToolHeader title="GoToSERP" />
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-center">
          <div className="w-[500px] px-3 py-2 rounded bg-slate-100">
            {error && <div className="px-3 py-2 round bg-red-200 text-red-800 font-medium">{error}</div>}
            <div className="text-slate-600 font-medium mb-1">Search query</div>
            <Input placeholder="Query" value={search} onChange={(e) => setSearch(e.target.value || '')} />
            <div className="mt-2">
              <div className="text-slate-600 font-medium mb-1">Select a location</div>
              <AutoComplete
                options={locations}
                defaultValue={location}
                style={{ width: '100%' }}
                onSelect={(s: string) => setLocation(s)}
                placeholder="Type a location, then select"
                onSearch={debounce(searchLoc, 500, { trailing: true })}
              />
            </div>
            <div className="mt-2">
              <div className="text-slate-600 font-medium mb-1">Select a language</div>
              <AutoComplete
                options={languages}
                defaultValue={language}
                style={{ width: '100%' }}
                onSelect={(s: string) => setLanguage(s)}
                placeholder="Type a location, then select"
                onSearch={debounce(searchLang, 500, { trailing: true })}
              />
            </div>
            <div className="mt-2">
              <div className="text-slate-600 font-medium mb-1">Select a Google domain</div>
              <AutoComplete
                options={domains}
                defaultValue={domain}
                style={{ width: '100%' }}
                onSelect={(s: string) => setDomain(s)}
                placeholder="Type a location, then select"
                onSearch={debounce(searchDomain, 500, { trailing: true })}
              />
            </div>
            <div className="mt-2">
              <div className="text-slate-600 font-medium mb-1">Options</div>
              <div className="text-base text-slate-600">
                <Checkbox checked={top100} label="Top 100" onChange={(e) => setTop100(e)} />
              </div>
            </div>
            <Button
              className="mt-3"
              text="Add Search"
              color="bg-sky-700 text-white hover:bg-sky-800"
              disabled={loading || !search || !domain || !location || !language}
              onClick={() => {
                getUrl(domain, location, language, search).then(() => {
                  console.log('Got URL');
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center mt-3">
          <div className="w-[500px] rounded bg-slate-100">
            {urls.length === 0 && <div className="block px-3 py-2 text-sky-800 select-none">Nothing here yet...</div>}
            {urls.length > 0 && (
              <div>
                {urls.map((url, i) => {
                  const googleUrl = `${url.google}&q=${url.query}${top100 ? '&num=100' : ''}`;
                  return (
                    <div key={`${url}-${i}`} className="flex-inline flex items-center py-2 border-b border-slate-300">
                      <div
                        className="text-lg font-medium text-slate-600 hover:text-sky-600 pl-3 cursor-pointer"
                        onClick={() => {
                          window.open(googleUrl, '_blank');
                        }}
                      >
                        {url.query}
                      </div>
                      <div
                        className="flex-1 block pl-2 text-slate-600 hover:text-sky-600 truncate text-sm cursor-pointer"
                        onClick={() => {
                          window.open(googleUrl, '_blank');
                        }}
                      >
                        {url.google}
                      </div>
                      <div>
                        <div
                          className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 ml-2 mr-2 cursor-pointer"
                          onClick={() => {
                            setUrls((prev) => prev.filter((u) => u !== url));
                          }}
                        >
                          <i className="fa-solid fa-trash-can" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <HelmetProvider>
    <GoToSerp />
  </HelmetProvider>,
);
