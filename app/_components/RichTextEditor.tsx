"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions/placeholder";
import Toolbar from "./Toolbar";
import ToolbarButton from "./ToolbarButton";
import { Bold, Italic, Strikethrough } from "lucide-react";
import FileHandler from "@tiptap/extension-file-handler";
import "@/app/styles/editor.css";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";

const RichTextEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      Link.configure({
        openOnClick: true,
      }),
      ImageResize.extend({
        name: "image",
      }).configure({
        inline: true,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FileHandler.configure({
        onDrop: (editor, files, pos) => {
          files.forEach((file) => {
            if (file.type.startsWith("image/")) {
              const fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = () => {
                editor
                  .chain()
                  .insertContentAt(pos, {
                    type: "image",
                    attrs: { src: fileReader.result },
                  })
                  .focus()
                  .run();
              };
            } else {
              // Handle as link for PDF/Word documents using a Blob URL
              const url = URL.createObjectURL(file);
              editor
                .chain()
                .insertContentAt(pos, {
                  type: "text",
                  text: file.name,
                  marks: [
                    {
                      type: "link",
                      attrs: { href: url, target: "_blank" },
                    },
                  ],
                })
                .focus()
                .run();
            }
          });
        },
        onPaste: (editor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              return;
            }

            if (file.type.startsWith("image/")) {
              const fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = () => {
                editor
                  .chain()
                  .insertContentAt(editor.state.selection.anchor, {
                    type: "image",
                    attrs: { src: fileReader.result },
                  })
                  .focus()
                  .run();
              };
            } else {
              // Handle as link for PDF/Word documents using a Blob URL
              const url = URL.createObjectURL(file);
              editor
                .chain()
                .insertContentAt(editor.state.selection.anchor, {
                  type: "text",
                  text: file.name,
                  marks: [
                    {
                      type: "link",
                      attrs: { href: url, target: "_blank" },
                    },
                  ],
                })
                .focus()
                .run();
            }
          });
        },
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "application/zip",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        ],
      }),
      ImageUploadNode.configure({
        type: "image",
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => {
          console.error("Image upload error:", error);
        },
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "editor-content focus:outline-none min-h-[150px] p-4 prose max-w-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
      <Toolbar editor={editor} />

      <BubbleMenu editor={editor}>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            label="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            label="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            label="Strike"
          />
        </div>
      </BubbleMenu>

      <div className="border-t border-gray-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
