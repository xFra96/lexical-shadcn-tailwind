const editorTheme = {
  placeholder: 'editor-placeholder',
  paragraph: 'mb-2 relative',
  quote: 'editor-quote',
  layoutContainer: 'grid',
  heading: {
    h1: 'text-3xl',
    h2: 'text-2xl',
    h3: 'text-xl',
    h4: 'text-lg',
    h5: 'text-md',
  },
  list: {
    nested: {
      listitem: 'pl-5 mt-2 space-y-1 list-decimal list-inside ',
    },
    ol: 'space-y-1 list-decimal list-inside ',
    ul: 'space-y-1 list-disc list-inside ',
    listitem: '',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'font-mono text-[94%] bg-gray-300 p-1 rounded',
  },
};

export default editorTheme;
