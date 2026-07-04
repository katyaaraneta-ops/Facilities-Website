import React from 'react';
import type { Editor } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  RemoveFormatting,
} from 'lucide-react';
import './blog-rich-text.css';

type Props = {
  initialHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const btn =
  'p-2 rounded-md text-corporate-600 hover:bg-corporate-100 hover:text-corporate-900 transition-colors disabled:opacity-40';
const btnActive = 'bg-corporate-200 text-corporate-900';

function MenuBar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 p-2 border-b border-corporate-200 bg-corporate-50"
      role="toolbar"
      aria-label="Formatting"
    >
      <button
        type="button"
        className={`${btn} ${editor.isActive('heading', { level: 1 }) ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        className={`${btn} ${editor.isActive('heading', { level: 2 }) ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        type="button"
        className={`${btn} ${editor.isActive('heading', { level: 3 }) ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>
      <span className="w-px h-6 bg-corporate-200 mx-1 self-center" />
      <button
        type="button"
        className={`${btn} ${editor.isActive('bold') ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        className={`${btn} ${editor.isActive('italic') ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        className={`${btn} ${editor.isActive('underline') ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>
      <button
        type="button"
        className={`${btn} ${editor.isActive('strike') ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </button>
      <span className="w-px h-6 bg-corporate-200 mx-1 self-center" />
      <button
        type="button"
        className={`${btn} ${editor.isActive('bulletList') ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        className={`${btn} ${editor.isActive('orderedList') ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        className={`${btn} ${editor.isActive('blockquote') ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        <Quote size={18} />
      </button>
      <button
        type="button"
        className={`${btn} ${editor.isActive('codeBlock') ? btnActive : ''}`}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code block"
      >
        <Code size={18} />
      </button>
      <span className="w-px h-6 bg-corporate-200 mx-1 self-center" />
      <button
        type="button"
        className={`${btn} ${editor.isActive('link') ? btnActive : ''}`}
        onClick={setLink}
        title="Link"
      >
        <LinkIcon size={18} />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="Clear formatting"
      >
        <RemoveFormatting size={18} />
      </button>
    </div>
  );
}

export const BlogRichTextEditor: React.FC<Props> = ({
  initialHtml,
  onChange,
  placeholder = 'Write your blog post content here...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-corporate-800 underline decoration-corporate-400' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialHtml || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor min-h-[400px] px-4 py-3 text-corporate-800 text-sm leading-relaxed focus:outline-none',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  if (!editor) {
    return <div className="min-h-[400px] border border-corporate-200 rounded-lg bg-corporate-50 animate-pulse" />;
  }

  return (
    <div className="bg-white border border-corporate-200 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
