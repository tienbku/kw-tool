import React from 'react';
import { useRecoilState } from 'recoil';
import { copyText } from '../../../utils';
import Button from '../../../components/Button';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';
import type { IDiscoveryItemOutput } from '../../../../api/discovery/input/inputGetDiscoveryItems';

interface Props {
  compare: boolean;
  isLoading: boolean;
  hasReachedLimit: boolean;
  hasRunningTasks: boolean;
  canDownloadFiltered: boolean;
  items: IDiscoveryItemOutput[];
  download: (filtered: boolean) => void;
  setCompare: (compare: boolean) => void;
  setShowConfirmSerpModal: (show: 'full' | 'selected' | '') => void;
  setShowConfirmRemoveKwsModal: (show: boolean) => void;
}

const Bar = ({
  items,
  compare,
  download,
  isLoading,
  setCompare,
  hasReachedLimit,
  hasRunningTasks,
  canDownloadFiltered,
  setShowConfirmSerpModal,
  setShowConfirmRemoveKwsModal,
}: Props) => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const hasSelected = control.selected.length > 0;
  const canCompare =
    items &&
    hasSelected &&
    control.selected.length === 2 &&
    items.find((item) => item.keyword === control.selected[0]) !== undefined &&
    items.find((item) => item.keyword === control.selected[1]) !== undefined;

  return (
    <div className="flex flex-wrap items-center mb-3 mt-3 xl:mt-0 bg-white rounded shadow py-1.5 px-1.5 w-full">
      <Button
        smaller
        disabled
        text="Help"
        icon="ri-question-line ri-lg"
        className="mr-2 mb-2 2xl:mb-0"
        color="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
        onClick={() => {
          setControl((prev) => ({ ...prev, sidebarSection: 'help' }));
        }}
      />
      <Button
        smaller
        text="Add Keywords"
        icon="ri-add-line ri-lg"
        className="mr-2 mb-2 2xl:mb-0"
        color="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
        onClick={() => {
          setControl((prev) => ({ ...prev, sidebarSection: 'add-keywords' }));
        }}
      />
      <Button
        smaller
        text="Get All Serp Data"
        icon="ri-database-2-line ri-lg"
        className="mr-2 mb-2 2xl:mb-0"
        color="bg-lime-600 text-white hover:bg-lime-700"
        disabled={isLoading || hasRunningTasks || compare || hasReachedLimit || items.length === 0}
        onClick={() => {
          setShowConfirmSerpModal('full');
        }}
      />
      <Button
        smaller
        icon="ri-database-2-line ri-lg"
        className="mr-2 mb-2 2xl:mb-0"
        text="Get Selected SERP Data"
        color="text-white bg-teal-600 hover:bg-teal-700"
        disabled={isLoading || hasRunningTasks || !hasSelected || compare || hasReachedLimit}
        onClick={() => {
          setShowConfirmSerpModal('selected');
        }}
      />
      <Button
        smaller
        text="Compare SERPs"
        icon="ri-slice-line ri-lg"
        className="mr-2 mb-2 2xl:mb-0"
        onClick={() => setCompare(!compare)}
        color="text-white bg-purple-600 hover:bg-purple-700"
        disabled={isLoading || hasRunningTasks || !canCompare || !hasSelected || control.selected.length !== 2}
      />
      <Button
        smaller
        text="Copy"
        icon="ri-clipboard-line ri-lg"
        className="mr-2 mb-2 2xl:mb-0"
        color="text-white bg-gray-500 hover:bg-gray-600"
        onClick={() => copyText(control.selected.join('\n'))}
        disabled={isLoading || !hasSelected || compare}
      />
      <Button
        smaller
        text="Remove Selected"
        icon="ri-delete-bin-6-line ri-lg"
        className="mr-2 mb-2 2xl:mb-0"
        color="text-white bg-red-600 hover:bg-red-600"
        disabled={isLoading || hasRunningTasks || !hasSelected || compare}
        onClick={() => {
          setShowConfirmRemoveKwsModal(true);
        }}
      />
      <Button
        smaller
        text="Download"
        icon="ri-download-line ri-lg"
        className="mr-2 mb-2 2xl:mb-0"
        disabled={isLoading || hasRunningTasks || compare || items.length === 0}
        color="bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => download(false)}
      />
      {canDownloadFiltered && (
        <Button
          smaller
          text="Download Filtered"
          icon="ri-download-line ri-lg"
          className="mr-2 mb-2 2xl:mb-0"
          disabled={isLoading || hasRunningTasks || compare}
          color="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => download(true)}
        />
      )}
    </div>
  );
};

export default Bar;
