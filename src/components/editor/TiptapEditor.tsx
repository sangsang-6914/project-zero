"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, Italic, List, Heading2, Link2, Image as ImageIcon } from "lucide-react";

interface Props {
  value: Record<string, unknown> | null;
  onChange: (json: Record<string, unknown>) => void;
}

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as Record<string, unknown>);
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[#E8E5DE] rounded-[6px] overflow-hidden">
      {/* 툴바 */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#E8E5DE] bg-[#FAFAF8]">
        <ToolbarBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="굵게"
        >
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="기울임"
        >
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="제목"
        >
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="목록"
        >
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("link")}
          onClick={() => {
            const url = prompt("링크 URL 입력");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          title="링크"
        >
          <Link2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          active={false}
          onClick={() => {
            const url = prompt("이미지 URL 입력");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          title="이미지"
        >
          <ImageIcon size={14} />
        </ToolbarBtn>
      </div>

      {/* 에디터 */}
      <EditorContent
        editor={editor}
        className="min-h-[300px] px-4 py-3 text-[14px] text-[#1A1A1A] leading-[1.7] prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  );
}

function ToolbarBtn({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded-[4px] transition-colors"
      style={{
        backgroundColor: active ? "#1A1A1A" : "transparent",
        color: active ? "#ffffff" : "#6B6860",
      }}
    >
      {children}
    </button>
  );
}
