'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { cleanHtmlContent, isEmptyHtmlContent } from '@/lib/utils/htmlCleaner'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Table as TableIcon,
  Plus,
  Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showHeadingMenu, setShowHeadingMenu] = useState(false)
  const [showTableMenu, setShowTableMenu] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6 | 0) => {
    if (editor) {
      if (level === 0) {
        editor.chain().focus().setParagraph().run()
      } else {
        editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
      }
      setShowHeadingMenu(false)
    }
  }

  const getCurrentHeadingLevel = () => {
    if (!editor) return 0
    if (editor.isActive('paragraph')) return 0
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) return i
    }
    return 0
  }

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run()
      setShowTableMenu(false)
    }
  }

  const addColumnBefore = () => {
    if (editor) {
      editor.chain().focus().addColumnBefore().run()
    }
  }

  const addColumnAfter = () => {
    if (editor) {
      editor.chain().focus().addColumnAfter().run()
    }
  }

  const deleteColumn = () => {
    if (editor) {
      editor.chain().focus().deleteColumn().run()
    }
  }

  const addRowBefore = () => {
    if (editor) {
      editor.chain().focus().addRowBefore().run()
    }
  }

  const addRowAfter = () => {
    if (editor) {
      editor.chain().focus().addRowAfter().run()
    }
  }

  const deleteRow = () => {
    if (editor) {
      editor.chain().focus().deleteRow().run()
    }
  }

  const deleteTable = () => {
    if (editor) {
      editor.chain().focus().deleteTable().run()
    }
  }



  // Close heading menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showHeadingMenu && !(event.target as Element).closest('.heading-dropdown')) {
        setShowHeadingMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showHeadingMenu])

  // Close table menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTableMenu && !(event.target as Element).closest('.table-dropdown')) {
        setShowTableMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTableMenu])

  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-gray-200 p-3 bg-gray-50 rounded-t-2xl">
      {/* All toolbar items in one row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Text Level & Formatting */}
        <div className="flex items-center gap-1">
          {/* Heading Dropdown */}
          <div className="relative heading-dropdown">
            <Button
              type="button"
              variant={getCurrentHeadingLevel() > 0 ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="h-8 px-3 rounded-xl hover:bg-gray-200 flex items-center gap-1"
            >
              <span className="text-xs font-medium">
                {getCurrentHeadingLevel() === 0 ? 'P' : `H${getCurrentHeadingLevel()}`}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            
            {/* Heading Menu */}
            {showHeadingMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                <button
                  onClick={() => setHeading(0)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    getCurrentHeadingLevel() === 0 ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Paragraph
                </button>
                <button
                  onClick={() => setHeading(1)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    getCurrentHeadingLevel() === 1 ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Heading 1
                </button>
                <button
                  onClick={() => setHeading(2)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    getCurrentHeadingLevel() === 2 ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Heading 2
                </button>
                <button
                  onClick={() => setHeading(3)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    getCurrentHeadingLevel() === 3 ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Heading 3
                </button>
                <button
                  onClick={() => setHeading(4)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    getCurrentHeadingLevel() === 4 ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Heading 4
                </button>
                <button
                  onClick={() => setHeading(5)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    getCurrentHeadingLevel() === 5 ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Heading 5
                </button>
                <button
                  onClick={() => setHeading(6)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    getCurrentHeadingLevel() === 6 ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Heading 6
                </button>
              </div>
            )}
          </div>

          {/* Text Formatting */}
          <Button
            type="button"
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Strikethrough (Ctrl+Shift+X)"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Lists & Blocks */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Bullet List (Ctrl+Shift+8)"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Numbered List (Ctrl+Shift+7)"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Blockquote (Ctrl+Shift+Q)"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Code Block (Ctrl+Shift+C)"
          >
            <Code className="h-4 w-4" />
          </Button>
          
          {/* Table Button */}
          <div className="relative table-dropdown">
            <Button
              type="button"
              variant={editor.isActive('table') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowTableMenu(!showTableMenu)}
              className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
              title="Insert Table"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            
            {/* Table Menu */}
            {showTableMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] p-3">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Table Size</div>
                  
                  {/* Rows Input */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">Rows:</label>
                    <div className="flex items-center border border-gray-200 rounded">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTableRows(Math.max(1, tableRows - 1))}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-2 text-sm font-mono min-w-[2rem] text-center">{tableRows}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTableRows(tableRows + 1)}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Columns Input */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">Columns:</label>
                    <div className="flex items-center border border-gray-200 rounded">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTableCols(Math.max(1, tableCols - 1))}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-2 text-sm font-mono min-w-[2rem] text-center">{tableCols}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTableCols(tableCols + 1)}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Insert Button */}
                  <Button
                    type="button"
                    onClick={insertTable}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg"
                  >
                    Insert Table
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Table Controls - Only show when table is active */}
        {editor.isActive('table') && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addColumnBefore}
              className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
              title="Add Column Before"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addColumnAfter}
              className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
              title="Add Column After"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deleteColumn}
              className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
              title="Delete Column"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addRowBefore}
              className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
              title="Add Row Before"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addRowAfter}
              className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
              title="Add Row After"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deleteRow}
              className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
              title="Delete Row"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deleteTable}
              className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200 text-red-600 hover:text-red-700"
              title="Delete Table"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Media - Compact Layout */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageInput(!showImageInput)}
            className="h-8 w-8 p-0 rounded-xl hover:bg-gray-200"
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-white rounded-xl border">
          <Input
            type="url"
            placeholder="Masukkan URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 rounded-xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && addLink()}
          />
          <Button
            type="button"
            size="sm"
            onClick={addLink}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-3"
          >
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowLinkInput(false)}
            className="rounded-xl px-3"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-white rounded-xl border">
          <Input
            type="url"
            placeholder="Masukkan URL gambar..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 rounded-xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && addImage()}
          />
          <Button
            type="button"
            size="sm"
            onClick={addImage}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-3"
          >
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowImageInput(false)}
            className="rounded-xl px-3"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])



  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-red-500 pl-4 py-2 my-4 bg-red-50 rounded-r-lg'
          }
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 border border-gray-200 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto'
          }
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-600 underline cursor-pointer hover:text-red-700'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full'
        }
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-gray-300'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-3 py-2 text-sm'
        }
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-3 py-2 text-sm font-semibold bg-gray-50'
        }
      }),
      
    ],
    content: cleanHtmlContent(value || ''),
    onUpdate: ({ editor }) => {
      // Debounce updates to prevent excessive calls
      const html = editor.getHTML()
      if (html.length < 1000000) { // Check if content is reasonable size
        // Clean HTML content to remove unwanted tags and normalize structure
        const cleanedHtml = cleanHtmlContent(html)
        onChange(cleanedHtml)
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] cursor-text'
      },
      handleKeyDown: (view, event) => {
        // Shortcut untuk bullet list: Ctrl+Shift+8 atau Ctrl+Shift+*
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '8') {
          event.preventDefault()
          if (editor) {
            editor.chain().focus().toggleBulletList().run()
          }
          return true
        }
        // Shortcut untuk ordered list: Ctrl+Shift+7 atau Ctrl+Shift+&
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '7') {
          event.preventDefault()
          if (editor) {
            editor.chain().focus().toggleOrderedList().run()
          }
          return true
        }
        // Shortcut untuk blockquote: Ctrl+Shift+Q
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Q') {
          event.preventDefault()
          if (editor) {
            editor.chain().focus().toggleBlockquote().run()
          }
          return true
        }
        // Shortcut untuk code block: Ctrl+Shift+C
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
          event.preventDefault()
          if (editor) {
            editor.chain().focus().toggleCodeBlock().run()
          }
          return true
        }
        // Shortcut untuk heading levels: Ctrl+1 sampai Ctrl+6
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key >= '1' && event.key <= '6') {
          event.preventDefault()
          if (editor) {
            const level = parseInt(event.key) as 1 | 2 | 3 | 4 | 5 | 6
            editor.chain().focus().toggleHeading({ level }).run()
          }
          return true
        }
        // Shortcut untuk paragraph: Ctrl+0
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key === '0') {
          event.preventDefault()
          if (editor) {
            editor.chain().focus().setParagraph().run()
          }
          return true
        }
        return false
      }
    },
    immediatelyRender: false,
    // Performance optimizations
    enableCoreExtensions: true,
    parseOptions: {
      preserveWhitespace: 'full'
    }
  })

  // Sync editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      const cleanedValue = cleanHtmlContent(value || '')
      if (cleanedValue !== editor.getHTML()) {
        editor.commands.setContent(cleanedValue)
      }
    }
  }, [editor, value])

  // Add custom CSS to ensure clickable area
  useEffect(() => {
    if (isMounted && editor) {
      // Add custom styles to make entire editor area clickable
      const style = document.createElement('style')
      style.textContent = `
        .ProseMirror {
          cursor: text !important;
          min-height: 200px !important;
          outline: none !important;
        }
        .ProseMirror p {
          cursor: text !important;
          margin: 0.5em 0 !important;
        }
        .ProseMirror:focus {
          outline: none !important;
        }
        .ProseMirror .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5em !important;
          margin: 0.5em 0 !important;
        }
        .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5em !important;
          margin: 0.5em 0 !important;
        }
        .ProseMirror li {
          margin: 0.25em 0 !important;
          cursor: text !important;
        }
        .ProseMirror li p {
          margin: 0 !important;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #ef4444 !important;
          padding-left: 1rem !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
          margin: 1rem 0 !important;
          background-color: #fef2f2 !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
          font-style: italic !important;
        }
        .ProseMirror pre {
          background-color: #f3f4f6 !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.5rem !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace !important;
          font-size: 0.875rem !important;
          overflow-x: auto !important;
          white-space: pre !important;
        }
        .ProseMirror code {
          background-color: #f3f4f6 !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace !important;
          font-size: 0.875rem !important;
        }
        .ProseMirror h1 {
          font-size: 2.25rem !important;
          font-weight: 800 !important;
          margin: 1.5rem 0 1rem 0 !important;
          color: #111827 !important;
        }
        .ProseMirror h2 {
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          margin: 1.25rem 0 0.75rem 0 !important;
          color: #111827 !important;
        }
        .ProseMirror h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          color: #374151 !important;
        }
        .ProseMirror h4 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 0.5rem 0 !important;
          color: #374151 !important;
        }
        .ProseMirror h5 {
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          margin: 0.5rem 0 0.25rem 0 !important;
          color: #6b7280 !important;
        }
        .ProseMirror h6 {
          font-size: 1rem !important;
          font-weight: 600 !important;
          margin: 0.5rem 0 0.25rem 0 !important;
          color: #6b7280 !important;
        }
        .ProseMirror table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1rem 0 !important;
          border: 1px solid #d1d5db !important;
          border-radius: 0.5rem !important;
          overflow: hidden !important;
        }
        .ProseMirror th {
          background-color: #f9fafb !important;
          font-weight: 600 !important;
          text-align: left !important;
          padding: 0.75rem !important;
          border: 1px solid #d1d5db !important;
          font-size: 0.875rem !important;
        }
        .ProseMirror td {
          padding: 0.75rem !important;
          border: 1px solid #d1d5db !important;
          font-size: 0.875rem !important;
        }
        .ProseMirror tr:nth-child(even) {
          background-color: #f9fafb !important;
        }
        .ProseMirror tr:hover {
          background-color: #f3f4f6 !important;
        }
      `
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [isMounted, editor])

  if (!isMounted) {
    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">
          Loading editor...
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="p-3 min-h-[150px] max-h-[300px] overflow-y-auto focus:outline-none cursor-text"
        placeholder={placeholder}
      />
    </div>
  )
}
