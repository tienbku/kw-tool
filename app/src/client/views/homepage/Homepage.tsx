import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createReactQueryHooks } from '@trpc/react';

import Nav from '../../components/Nav';
import { API_URL } from '../../../constants';
import { AppRouter } from '../../../shared/appRouter';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import longTailKeywords from '../../../assets/screenshots/long-tail-keywords.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import questionKeywords from '../../../assets/screenshots/question-keywords.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import keywordClusters from '../../../assets/screenshots/keyword-clusters.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import domains from '../../../assets/screenshots/domains-keywords.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import keywordModifiers from '../../../assets/screenshots/keyword-modifier-ideas.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import keywordGroups from '../../../assets/screenshots/keyword-groups.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import keywordsEasyWins from '../../../assets/screenshots/keywords-easy-to-win.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import keywordVolume from '../../../assets/screenshots/keyword-volume.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rankingCheck from '../../../assets/screenshots/ranking-check.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bulkSerpAnalysis from '../../../assets/screenshots/bulk-serp-analysis.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import paaQuestions from '../../../assets/screenshots/paa-questions.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import compareKeywords from '../../../assets/screenshots/compare-keywords.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import semanticClustering from '../../../assets/screenshots/semantic-clusters-keywords.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rankingTop100 from '../../../assets/screenshots/ranking-top-100.png';

const features: FeatureProps[] = [
  {
    name: 'Find long-tail keywords & topics',
    icon: 'fa-solid fa-check',
    description: 'With our keyword research tools you will always find new keywords and topics to write content',
  },
  {
    name: 'Low-hanging fruits',
    icon: 'fa-solid fa-check',
    description: 'Find where there is low competition and start from there, then move on to the next step',
  },
  {
    name: 'Analyze the SERP',
    icon: 'fa-solid fa-check',
    description: 'Compare keywords before you take action, not all similar keywords have the same intent',
  },
  {
    name: 'Keyword Clustering',
    icon: 'fa-solid fa-check',
    description: 'We create clusters for your keywords based on the SERP, save time doing the manual work',
  },
  {
    name: 'Content Analysis',
    icon: 'fa-solid fa-check',
    description: 'We are working on new tools to help you with Entity SEO and content optimization',
  },
  {
    name: 'Intent & Modifier ideas',
    icon: 'fa-solid fa-check',
    description: 'Discover new modifiers/topics for your keywords and different intents',
  },
];

const trpc = createReactQueryHooks<AppRouter>();

const Homepage = () => {
  return (
    <div>
      <Nav />
      <div className="container mx-auto pt-10">
        <div className="text-3xl font-semibold text-slate-600 mb-1 lg:text-center pl-3 lg:pl-0">
          SEO Ruler <span className="pl-1 text-sm uppercase text-lime-600">BETA</span>
        </div>
        <h1 className="text-5xl px-3 lg:px-0 font-extrabold text-slate-700 roboto lg:text-center leading-none mt-4">
          Advanced Keyword Research Tool
        </h1>
        <div className="px-3 py-2 mx-3 lg:mx-0 rounded bg-slate-800 text-lime-200 mt-2 text-lg text-center">
          SEO Ruler Tools is Open Source with AGPL v3 License, currently in <strong>BETA</strong>
        </div>
        <div className="mt-5">
          <div className="py-12 bg-white rounded">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Tools for Keyword Research and SERP Analysis
                </div>
              </div>
              <div className="mt-10">
                <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
                  {features.map((feature, i) => (
                    <Feature key={`feature-${i}`} {...feature} />
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-3xl text-sky-800 text-center font-bold">Keyword Tool Features</div>
        <div className="mt-3 mb-2 flex items-center justify-center">
          <div className="px-3 py-1.5 bg-slate-600 font-semibold text-white rounded">Wildcard Search</div>
          <div className="px-3 py-1.5 bg-slate-600 font-semibold text-white rounded ml-3">Automatic Clustering</div>
          <div className="px-3 py-1.5 bg-slate-600 font-semibold text-white rounded ml-3">Bulk SERP Analysis</div>
          <div className="px-3 py-1.5 bg-slate-600 font-semibold text-white rounded ml-3">People Also Ask Keywords</div>
          <div className="px-3 py-1.5 bg-slate-600 font-semibold text-white rounded ml-3">Keyword Search Volume</div>
          <div className="px-3 py-1.5 bg-slate-600 font-semibold text-white rounded ml-3">Low-Hanging Fruits</div>
        </div>
        <div className="grid grid-col-1 lg:grid-cols-3 gap-4 mt-5 mb-5">
          <FeatureBox text="Find thousands of new long-tail keywords to drive traffic." image={longTailKeywords} alt="long-tail keywords" />
          <FeatureBox text="Filter by questions and other modifiers for quick access" image={questionKeywords} alt="question modifiers" />
          <FeatureBox text="Get SERP clusters of keywords automatically from your keyword list" image={keywordClusters} alt="clusters" />
          <FeatureBox text="Filter keywords by domains, check your competitors" image={domains} alt="keywords by domain" />
          <FeatureBox text="Find modifier ideas and use them to find even more keywords" image={keywordModifiers} alt="keyword modifiers" />
          <FeatureBox text="Group keywords into keyword lists and then export them" image={keywordGroups} alt="keyword groups" />
          <FeatureBox text="Find long-tail keywords that area easy to win over" image={keywordsEasyWins} alt="keyword groups" />
          <FeatureBox text="Get keyword volume/cpc for all your keywords" image={keywordVolume} alt="keyword volume" />
          <FeatureBox text="Quickly check your ranking position for all your keywords" image={rankingCheck} alt="keyword ranking check" />
          <FeatureBox text="Check where you or your competitors are in the SERP" image={rankingTop100} alt="check rankings" />
          <FeatureBox text="Do SERP analysis in bulk, and save tons of manual work" image={bulkSerpAnalysis} alt="bulk serp analysis" />
          <FeatureBox text="Find all People Also Ask questions from your keywords" image={paaQuestions} alt="people also ask keywords" />
          <FeatureBox
            className="col-span-2"
            alt="compare keywords"
            image={compareKeywords}
            text="Compare the SERPs to avoid targeting the wrong keywords"
          />
          <FeatureBox alt="semantic clusters" image={semanticClustering} text="Find topics by using our automated semantic clustering" />
        </div>
        <div className="pb-20 text-lg lg:text-3xl text-slate-700 font-semibold lg:text-center pl-3 lg:pl-0">
          And many more features coming soon!
        </div>
      </div>
    </div>
  );
};

interface FeatureBoxProps {
  alt: string;
  text: string;
  image: string;
  className?: string;
}

const FeatureBox = ({ className, text, image, alt }: FeatureBoxProps) => (
  <div className={`p-3 rounded shadow bg-slate-50 ${className}`}>
    <div className="mb-2 text-[14px] text-slate-500 font-semibold text-center">{text}</div>
    <img
      className="w-full h-[210px] object-cover border-solid border-2 rounded overflow-hidden border-slate-400 object-top"
      alt={alt}
      src={image}
    />
  </div>
);

interface FeatureProps {
  name: string;
  icon: string;
  description: string;
}

const Feature = ({ name, description, icon }: FeatureProps) => {
  return (
    <div className="relative">
      <dt>
        <div className="absolute h-6 w-6 flex items-center">
          <i className={`text-lime-500 ${icon} fa-xl`} aria-hidden="true" />
        </div>
        <p className="ml-9 text-lg leading-6 font-medium text-gray-900">{name}</p>
      </dt>
      <dd className="mt-2 ml-9 text-base text-gray-500">{description}</dd>
    </div>
  );
};

const HomepageWrapper = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({ url: API_URL + '/__t' }));
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Homepage />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<HomepageWrapper />, document.getElementById('root'));
