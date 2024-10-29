'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CAN_USE_DOM } from './utils/canUseDOM';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin';
import { useSharedHistoryContext } from './context/SharedHistoryContext';
import editorTheme from './config/theme';
import EditorNodes from './config/editorNodes';
const IS_DEV = process.env.NEXT_PUBLIC_DEV;
const Editor = ({ initialHTML, height }: { initialHTML: string; height?: string }) => {
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
  const [showTreeView, setshowTreeView] = useState<boolean>(false);
  const { historyState } = useSharedHistoryContext();

  const config: InitialConfigType = {
    namespace: 'lexical-editor',
    theme: editorTheme,
    nodes: [...EditorNodes],
    editorState: (editor) => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHTML, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $insertNodes(nodes);
    },

    onError: (error) => {
      console.error(error);
    },
  };
  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport = CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);
  return (
    <>
      {IS_DEV && (
        <>
          <Label htmlFor='dev-mode'>DEV Mode</Label>
          <Switch
            id='dev-mode'
            checked={showTreeView}
            onCheckedChange={() => {
              setshowTreeView(!showTreeView);
            }}
          />
        </>
      )}

      <LexicalComposer initialConfig={config}>
        <div className={`bg-white border rounded-lg ${showTreeView ? 'tree-view' : ''}`}>
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`focus:outline-none w-full px-8 py-4 h-[${height ?? '700px'}] overflow-auto`}
              />
            }
            placeholder={<p></p>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin externalHistoryState={historyState} />
          <MarkdownShortcutPlugin />
          <ListPlugin />
          <LinkPlugin />
          <LayoutPlugin />
          {showTreeView && <TreeViewPlugin />}
        </div>
      </LexicalComposer>
    </>
  );
};

export default Editor;
