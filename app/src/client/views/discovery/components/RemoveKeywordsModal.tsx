import React from 'react';
import message from 'antd/es/message';
import { useRecoilState } from 'recoil';
import ConfirmModal from '../../../components/ConfirmModal';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  doRemoveKeywords: (keywords: string[]) => void;
}

const RemoveKeywordsModal = ({ show, setShow, doRemoveKeywords }: Props) => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  return (
    <ConfirmModal
      title="Remove Keywords"
      labelConfirm="Remove"
      isOpen={show}
      setClose={() => setShow(false)}
      confirmButtonColor="bg-red-500 hover:bg-red-600"
      content={
        <div className="select-none">
          <span className="text-sm text-bold text-red-700 mt-1">
            Are you sure you want to remove {control.selected.length} selected keywords?
          </span>
          <br />
          <span className="text-sm text-slate-600 mt-1">
            Clusters will be re-calculated so this might take a minute. <br /> Removed keywords will also be removed from groups.
          </span>
        </div>
      }
      onConfirm={() => {
        doRemoveKeywords(control.selected);
        setControl((prev) => ({
          ...prev,
          selected: [],
        }));
        message.success(<span>Keywords removed</span>);
      }}
    />
  );
};

export default RemoveKeywordsModal;
