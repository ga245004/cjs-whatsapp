import { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';

import { createEditor, Editor, Transforms, Element, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: 'This is a sample text message for your Whatsapp template message. Use this a reference for your template message' }],
    },
]

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

const CodeElement = props => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    )
}

const MonospaceElement = props => {
    return (
        <tt {...props.attributes}>
            {props.children}
        </tt>
    )
}
const Leaf = props => {
    return (
        <span
            {...props.attributes}
            style={{
                fontWeight: props.leaf.bold ? 'bold' : 'normal',
                fontStyle: props.leaf.italic ? 'italic' : 'normal',
                textDecoration: props.leaf.strikethrough ? 'line-through' : 'none;'
            }}
        >
            {props.children}
        </span>
    )
}

const TemplateEditorCommands = (editor) => {
    const commands = {
        match(cmd) {
            const [match] = Editor.nodes(editor, {
                match: cmd,
                universal: true,
            });
            return match;
        },
        runKeyboardCommands(event) {
            const list = [
                ["b", true, commands.toggleBoldMark, true],
                ["i", true, commands.toggleItalicMark, true],
                ["s", true, commands.toggleStrikethroughMark, true],
                ["`", true, commands.toggleMonospaceBlock, true]
            ];
            const matchList = list.filter(([key, isCtrl]) => {
                return event.key === key && event.ctrlKey === isCtrl
            });
            matchList.forEach(([_, __, callback, isPreventDefault]) => {
                isPreventDefault && event.preventDefault();
                callback(event);
            });
        },
        isBoldMarkActive() {
            return !!commands.match(n => n.bold === true);
        },
        isItalicMarkActive() {
            return !!commands.match(n => n.italic === true);
        },
        isStrikethroughMarkActive() {
            return !!commands.match(n => n.strikethrough === true);
        },
        isCodeBlockActive() {
            return !!commands.match(n => n.type === 'code');
        },
        isMonospaceActive() {
            return !!commands.match(n => n.type === 'monospace');
        },
        toggleBoldMark() {
            const isActive = commands.isBoldMarkActive();
            Transforms.setNodes(editor,
                { bold: isActive ? null : true },
                { match: n => Text.isText(n), split: true }
            )
        },
        toggleItalicMark() {
            const isActive = commands.isItalicMarkActive();
            Transforms.setNodes(editor,
                { italic: isActive ? null : true },
                { match: n => Text.isText(n), split: true }
            )
        },
        toggleStrikethroughMark() {
            const isActive = commands.isStrikethroughMarkActive();
            Transforms.setNodes(editor,
                { strikethrough: isActive ? null : true },
                { match: n => Text.isText(n), split: true }
            )
        },
        toggleCodeBlock() {
            const isActive = commands.isCodeBlockActive();
            Transforms.setNodes(editor,
                { type: isActive ? null : 'code' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        },
        toggleMonospaceBlock() {
            const isActive = commands.isMonospaceActive();
            Transforms.setNodes(editor,
                { type: isActive ? null : 'monospace' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        },
    }

    return commands;
}

export function TemplateEditor({ value, onChange }) {
    const [editor] = useState(() => withReact(createEditor()));
    const commands = useMemo(() => TemplateEditorCommands(editor), [editor]);
    const editorValue = useMemo(() => value || initialValue, [value])

    const renderElements = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />;
            case 'monospace':
                return <MonospaceElement {...props} />;
            default:
                return <DefaultElement {...props} />
        }
    }, []);

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, []);

    return (
        <Box>
            <Slate
                editor={editor}
                value={editorValue}
                onChange={value => {
                    const isAstChange = editor.operations.some(
                        op => 'set_selection' !== op.type
                    )
                    if (isAstChange && onChange) onChange(value);
                }}
            >
                <div>
                    <button type='button'
                        onMouseDown={event => {
                            event.preventDefault();
                            commands.toggleBoldMark();
                        }}
                    > Bold </button>
                    <button type='button'
                        onMouseDown={event => {
                            event.preventDefault();
                            commands.toggleItalicMark();
                        }}
                    > Italic </button>
                    <button type='button'
                        onMouseDown={event => {
                            event.preventDefault();
                            commands.toggleStrikethroughMark();
                        }}
                    > Strikethrough </button>
                    <button type='button'
                        onMouseDown={event => {
                            event.preventDefault()
                            commands.toggleMonospaceBlock()
                        }}
                    >
                        Monospace
                    </button>
                </div>
                <Editable
                    renderElement={renderElements}
                    renderLeaf={renderLeaf}
                    onKeyDown={commands.runKeyboardCommands}
                />
            </Slate>
        </Box>
    )
}