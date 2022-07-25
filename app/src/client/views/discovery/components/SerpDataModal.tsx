import React from 'react';
import { useRecoilValue } from 'recoil';
import ConfirmModal from '../../../components/ConfirmModal';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';

interface Props {
  serpsFull: boolean;
  doGetSerps: (serpsFull: boolean) => void;
  showConfirmSerpModal: 'full' | 'selected' | '';
  setShowConfirmSerpModal: (show: 'full' | '') => void;
}

const SerpDataModal = ({
  serpsFull,
  doGetSerps,
  showConfirmSerpModal,
  setShowConfirmSerpModal,
}: Props) => {
  const control = useRecoilValue(AtomDiscoveryControl);
  return (
    <ConfirmModal
      title="Get SERPs Data"
      isOpen={showConfirmSerpModal !== ''}
      setClose={() => setShowConfirmSerpModal('')}
      labelConfirm={serpsFull ? 'Analyze ALL' : 'Analyze Selected'}
      confirmButtonColor={serpsFull ? 'bg-lime-600 hover:lime-sky-700' : 'bg-teal-600 hover:bg-teal-700'}
      content={
        <div className="text-sm mt-1">
          <div>
            <span className="text-bold text-red-700 ">Keywords with data older than 1 week will be updated.</span>
            <div className="mt-3 text-gray-700">
              This will
              <ul className="list-disc pl-3 mb-0 pb-1">
                <li>Get SERP data for your keywords</li>
                <li>Check for domains that are easy to outrank</li>
                <li>Cluster keywords by SERP similarity</li>
                <li>Create semantic clusters</li>
                <li>Enable features like ranking check, SERP feature filtering, etc</li>
                <li>Find keyword modifier ideas based on the SERP</li>
                <li>Enable domain filtering for these keywords</li>
                <li>Find PAA questions so you can inject them into the report</li>
              </ul>
            </div>
          </div>
        </div>
      }
      onConfirm={() => {
        if (serpsFull) {
          doGetSerps(true);
        } else {
          doGetSerps(false);
        }
      }}
    />
  );
};

export default SerpDataModal;
