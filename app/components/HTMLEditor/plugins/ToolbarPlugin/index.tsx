/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $isLinkNode } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty, $isParentElementRTL, $patchStyleText } from '@lexical/selection';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { Button } from '@/components/ui/button';
import { Toggle } from '@radix-ui/react-toggle';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon, BoldIcon, ItalicIcon, TrashIcon } from '@heroicons/react/20/solid';
import { CodeIcon, UnderlineIcon } from '@radix-ui/react-icons';
import { IS_APPLE } from '../../utils/environment';
import { getSelectedNode } from '../../utils/getSelectedNode';
import rootTypeToRootName from '../../config/rootTypes';
import blockTypeToBlockName from '../../config/blockTypes';
//import { FontFamilyDropDown } from './components/FontFamilyDropdown';

import LayoutDialog from './components/LayoutDialog';
import TextFontSize from './components/TextFontSize';
import TextFormatDropdown from './components/TextFormatDropdown';
import ElementTextAlignDropdown from './components/ElementTextAlignDropdown';
import DropdownColorPicker from './components/DropdownColorPicker';

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root');
  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
      // Handle buttons
      setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000'));
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#fff'));
      setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left'
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // Update text format
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
        setIsSubscript(selection.hasFormat('subscript'));
        setIsSuperscript(selection.hasFormat('superscript'));
        setIsCode(selection.hasFormat('code'));
        setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '15px'));
      }
    }
  }, [activeEditor, editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {}
      );
    },
    [activeEditor]
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || $isTableSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();
        const extractedNodes = selection.extract();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0];
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  return (
    <div className='w-full p-2 bg-slate-200 border-b rounded-t-lg'>
      <div className='gap-3 grid grid-cols-12'>
        <div className='flex items-center justify-evenly'>
          <Button
            variant='outline'
            disabled={!canUndo || !isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
            title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
            type='button'
            aria-label='Undo'
          >
            <ArrowUturnLeftIcon className='h-5 w-5' />
          </Button>
          <Button
            variant='outline'
            disabled={!canRedo || !isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(REDO_COMMAND, undefined);
            }}
            title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
            type='button'
            aria-label='Redo'
          >
            <ArrowUturnRightIcon className='h-5 w-5' />
          </Button>
        </div>
        {/*
        <div className='flex items-center'>
          <FontDropDown disabled={!isEditable} style={'font-family'} value={fontFamily} editor={activeEditor} />
        </div>
        */}
        <div className='flex items-center'>
          <TextFontSize selectionFontSize={fontSize.slice(0, -2)} editor={activeEditor} disabled={!isEditable} />
        </div>
        <div className='flex col-span-2 items-center justify-evenly'>
          <Toggle
            disabled={!isEditable}
            pressed={isBold}
            onPressedChange={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              setIsBold(!isBold);
            }}
            title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
            type='button'
            aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}
          >
            <BoldIcon className='h-5 w-5' />
          </Toggle>
          <Toggle
            disabled={!isEditable}
            pressed={isItalic}
            onPressedChange={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              setIsItalic(!isItalic);
            }}
            title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
            aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'}`}
          >
            <ItalicIcon className='h-5 w-5' />
          </Toggle>
          <Toggle
            disabled={!isEditable}
            pressed={isUnderline}
            onPressedChange={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              setIsUnderline(!isUnderline);
            }}
            title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
            type='button'
            aria-label={`Format text to underlined. Shortcut: ${IS_APPLE ? '⌘U' : 'Ctrl+U'}`}
          >
            <UnderlineIcon className='h-5 w-5' />
          </Toggle>
          <Toggle
            disabled={!isEditable}
            pressed={isCode}
            onPressedChange={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              setIsCode(!isCode);
            }}
            title='Insert code block'
            type='button'
            aria-label='Insert code block'
          >
            <CodeIcon className='h-5 w-5' />
          </Toggle>
          <LayoutDialog editor={activeEditor} />
          <Button
            onClick={clearFormatting}
            title='Clear text formatting'
            aria-label='Clear all text formatting'
            disabled={!isEditable}
            type='button'
          >
            <TrashIcon className='h-5 w-5' />
          </Button>
        </div>
        {blockType in blockTypeToBlockName && activeEditor === editor && (
          <div className='flex items-center col-span-2'>
            <TextFormatDropdown
              title='Tipo testo'
              disabled={!isEditable}
              blockType={blockType}
              rootType={rootType}
              editor={activeEditor}
            />
          </div>
        )}
        <div className='flex items-center col-span-2'>
          <DropdownColorPicker color={fontColor} onChange={onFontColorSelect} title='Colore testo' />
        </div>
        <div className='flex items-center col-span-2'>
          <DropdownColorPicker color={bgColor} onChange={onBgColorSelect} title='Colore BG testo' />
        </div>
        <div className='flex items-center'>
          <ElementTextAlignDropdown disabled={!isEditable} value={elementFormat} editor={activeEditor} isRTL={isRTL} />
        </div>
      </div>
    </div>
  );
}
