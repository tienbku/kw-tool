import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface Props {
  title: string;
  isOpen: boolean;
  labelConfirm: string;
  okDisabled?: boolean;
  confirmButtonColor?: string;
  onConfirm: () => void;
  content: React.ReactNode;
  setClose: () => void;
}

const ConfirmModal = ({ okDisabled, confirmButtonColor, onConfirm, title, labelConfirm, isOpen, setClose, content }: Props) => {
  if (!isOpen) {
    return null;
  }

  let color = 'bg-lime-600 hover:bg-lime-700';
  if (okDisabled) {
    color = 'bg-gray-500';
  } else if (confirmButtonColor) {
    color = confirmButtonColor;
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={setClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <div
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    onClick={setClose}
                  >
                    <span className="sr-only">Close</span>
                    <i className="fa-solid fa-times fa-xl text-slate-600" />
                  </div>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i className="fa-solid fa-info fa-xl" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 select-none">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">{content}</div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={okDisabled}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:ml-3 sm:w-auto sm:text-sm`}
                    onClick={() => {
                      onConfirm();
                      setClose();
                    }}
                  >
                    {labelConfirm}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={setClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmModal;
