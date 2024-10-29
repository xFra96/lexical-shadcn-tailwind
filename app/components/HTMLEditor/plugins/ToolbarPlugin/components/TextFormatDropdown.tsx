import blockTypeToBlockName from '../../../config/blockTypes';
import rootTypeToRootName from '../../../config/rootTypes';
import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
export default function TextFormatDropdown({
  editor,
  blockType,
  title,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  title: string;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  return (
    <Menu as='div' className='relative inline-block text-left w-full'>
      <div>
        <MenuButton className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
          {title}
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
              onClick={(e) => {
                e.preventDefault();
                formatParagraph();
              }}
              href='#'
              className='group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Paragrafo
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                formatHeading('h1');
              }}
              href='#'
              className='group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Heading 1
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                formatHeading('h2');
              }}
              href='#'
              className='group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Heading 2
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                formatHeading('h3');
              }}
              href='#'
              className='group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Heading 3
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                formatBulletList();
              }}
              href='#'
              className='group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Lista non ordinata
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                formatNumberedList();
              }}
              href='#'
              className='group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Lista ordinata
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                formatQuote();
              }}
              href='#'
              className='group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Citazione
            </a>
          </MenuItem>
          <MenuItem>
            <a
              onClick={(e) => {
                e.preventDefault();
                formatCode();
              }}
              href='#'
              className='group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
            >
              Codice
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
