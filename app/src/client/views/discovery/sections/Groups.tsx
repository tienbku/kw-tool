import React, { Fragment } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';
import { useRecoilState } from 'recoil';

interface Props {
  isLoading: boolean;
  groups: Array<{ name: string; count: number }>;
  doAddGroup: (group: string) => void;
  doRemoveGroup: (group: string) => void;
  doUpdateGroupKeywords: (group: string, action: 'add' | 'remove') => void;
}

const Groups = ({ doAddGroup, isLoading, doRemoveGroup, groups, doUpdateGroupKeywords }: Props) => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const [groupName, setGroupName] = React.useState('');
  const [groupToRemove, setGroupToRemove] = React.useState('');
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  return (
    <div className="bg-white rounded shadow select-none">
      <ConfirmModal
        title="Get SERPs Data"
        labelConfirm="Delete Group"
        isOpen={showDeleteModal}
        setClose={() => setShowDeleteModal(false)}
        confirmButtonColor="bg-red-500 hover:bg-red-600"
        content={
          <div>
            <span className="text-sm text-bold text-red-700 mt-1">Are you sure you want to delete this group?</span>
          </div>
        }
        onConfirm={() => {
          doRemoveGroup(groupToRemove);
          setGroupToRemove('');
        }}
      />
      <div className="py-3 px-3">
        <div className="flex items-center">
          <div className="flex items-center text-sky-600">
            <i className="ri-question-line" />
            <span className="text-slate-500 text-xs pl-2">Group your keywords however you like.</span>
          </div>
        </div>
        <input
          type="text"
          minLength={1}
          maxLength={25}
          value={groupName}
          placeholder="New Group"
          onChange={(e) => setGroupName(e.target.value || '')}
          className={`w-full text-sm mt-3 bg-white relative border border-gray-300 rounded-md px-2 py-1 shadow-sm focus-within:ring-1 focus-within:ring-sky-600 focus-within:border-sky-600`}
          onKeyUp={(e) => {
            if (e.key === 'Enter' && groupName.length > 0) {
              doAddGroup(groupName);
              setGroupName('');
            }
          }}
        />
      </div>
      <ul className="mb-0">
        {isLoading && (
          <li className="text-center text-gray-600 py-3">
            <i className="ri-refresh-line" />
          </li>
        )}
        {!isLoading && groups.length === 0 && <li className="text-gray-500 pl-4 pb-3">No groups created yet...</li>}
        {!isLoading &&
          groups.length > 0 &&
          groups.map((group) => (
            <GroupItem
              group={group}
              key={group.name}
              hasSelected={control.selected.length > 0}
              isCurrent={group.name === control.group}
              setSelectedGroup={(g) => {
                if (g === control.group) {
                  setControl((prev) => ({ ...prev, group: '', itemOffset: 0 }));
                } else {
                  setControl((prev) => ({ ...prev, group: g, itemOffset: 0 }));
                }
              }}
              onRemove={() => {
                setGroupToRemove(group.name);
                setShowDeleteModal(true);
              }}
              doUpdateGroupKeywords={doUpdateGroupKeywords}
            />
          ))}
      </ul>
    </div>
  );
};

interface GroupItemProps {
  group: {
    name: string;
    count: number;
  };
  isCurrent: boolean;
  hasSelected: boolean;
  onRemove: () => void;
  setSelectedGroup: (s: string) => void;
  doUpdateGroupKeywords: (group: string, action: 'add' | 'remove') => void;
}

const GroupItem = ({ onRemove, isCurrent, group, setSelectedGroup, doUpdateGroupKeywords, hasSelected }: GroupItemProps) => {
  return (
    <li className="flex items-center border-0 border-t border-slate-200 py-1 px-3 text-sm select-none">
      <div className="flex-grow flex items-center pr-3">
        <div className={`flex-grow ${isCurrent ? 'text-sky-700 font-semibold' : 'text-gray-700'}`}>{group.name}</div>
        {group.count > 0 && <span className="text-purple-500 text-xs pl-2">{group.count}</span>}
      </div>
      <div className="flex items-center">
        {hasSelected ? (
          <Fragment>
            <div
              className={`text-green-500 hover:text-sky-600 cursor-pointer flex items-center`}
              onClick={() => {
                doUpdateGroupKeywords(group.name, 'add');
              }}
            >
              <i className="ri-add-line ri-lg text-sm mr-2" />
            </div>
            <div
              className={`text-red-500 hover:text-sky-600 cursor-pointer flex items-center`}
              onClick={() => {
                doUpdateGroupKeywords(group.name, 'remove');
              }}
            >
              <i className="ri-close-line ri-lg text-sm mr-2" />
            </div>
          </Fragment>
        ) : undefined}
        {isCurrent ? (
          <div className={`text-red-500 hover:text-red-600 cursor-pointer`} onClick={() => setSelectedGroup('')}>
            <i className="ri-search-line text-sm mr-2" />
          </div>
        ) : (
          <div className={`text-gray-500 hover:text-sky-600 cursor-pointer`} onClick={() => setSelectedGroup(group.name)}>
            <i className="ri-search-line text-sm mr-2" />
          </div>
        )}
        <div className={`text-gray-500 hover:text-red-600 cursor-pointer`}>
          <i className="ri-delete-bin-line text-sm" onClick={() => onRemove()} />
        </div>
      </div>
    </li>
  );
};

export default Groups;
