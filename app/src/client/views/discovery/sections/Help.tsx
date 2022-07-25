import React from 'react';

interface ItemProps {
  url: string;
  title: string;
}

const Item = ({ title, url }: ItemProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block py-2 px-3 text-sky-700 hover:text-sky-800 font-medium hover:bg-sky-50"
    >
      <i className="fa-brands fa-youtube mr-2" />
      {title}
    </a>
  );
};

const Help = () => {
  return (
    <div className="bg-white pt-3 pb-1 rounded shadow select-none">
      <div className="text-sky-600 pl-3">
        <i className="fa-solid fa-circle-question" />
        <span className="text-slate-500 text-xs pl-2">Learn how to use the KW tool</span>
      </div>
      <div className="block border-t border-slate-200 mt-2 pt-1 cursor-pointer">
        <Item title="How to search for keywords (or, ignore, exact, volume)" url="https://youtu.be/lMx_Opjr1VU" />
        <Item title="How to check for Rankings (+ tricks)" url="https://youtu.be/EJYwHGAtGoo" />
        <Item title="How to create keyword Groups" url="https://youtu.be/WWnsPBDu4ko" />
        <Item title="How to use Modifiers for filtering & ideas" url="https://youtu.be/7p-1_v2o4dQ" />
        <Item title="How to filter by Intent" url="https://youtu.be/qD7mYwBz_g4" />
        <Item title="How to filter by Competitors (+ tricks)" url="https://youtu.be/RWK2eueav8Y" />
        <Item title="How to filter Domains" url="https://youtu.be/UBZKiM_YMpU" />
        <Item title="How to filter and get ideas using Verbs section (intent/actions)" url="https://youtu.be/WB1psVHHJFo" />
        <Item title="How to use the Ideas section and its purpose" url="https://youtu.be/WAIJPIapp10" />
        <Item title="EasyWins Score and how to set your own patters (+ trick)" url="https://youtu.be/KQ2K40FkO9w" />
        <Item title="Using the SERP Clusters section (and how to compare kws)" url="https://youtu.be/zG0dlYaAVqw" />
        <Item title="How to compare SERPS for insight on intent" url="https://youtu.be/kCTGPJszPdo" />
        <Item title="Using the Semantic Clusters section" url="https://youtu.be/QO5zKpwr2Ho" />
        <Item title="Comparing Semantic Clusters with SERP Clusters" url="https://youtu.be/fHSYrSHMZB8" />
        <Item title="Checking for partial match and exact match in SERP titles" url="https://youtu.be/8S3psbvjUvI" />
      </div>
    </div>
  );
};

export default Help;
