import {
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import ELEMENT_FORMAT_OPTIONS from '../../../config/textPosition';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
export default function ElementTextAlignDropdown({
  editor,
  value,
  isRTL,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled: boolean;
}) {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];

  return (
    <Menu as='div' className='relative inline-block text-left w-full'>
      <div>
        <MenuButton className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
          Allineamento
          <ChevronDownIcon aria-hidden='true' className='-mr-1 h-5 w-5 text-gray-400' />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className='absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
      >
        <div className='py-1'>
          <MenuItem>
            <a
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
              }}
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Left Align
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
              }}
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Center Align{' '}
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
              }}
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Right Align{' '}
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
              }}
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Justify Align{' '}
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');
              }}
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Start Align{' '}
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');
              }}
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              End Align{' '}
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={() => {
                editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
              }}
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Outdent{' '}
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={() => {
                editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
              }}
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Indent{' '}
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
