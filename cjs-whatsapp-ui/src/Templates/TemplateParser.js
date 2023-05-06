import {  Node } from 'slate';

const boldTag = "*";
const italicTag = "_";
const strikethroughTag = "~";
const monospaceTag = ["```", "```"];
const paragraphTag = ["", ""];

const SerializeText = (n) => {
    if (n.bold) {
        return `${boldTag}${Node.string(n)}${boldTag}`
    }
    else if (n.italic) {
        return `${italicTag}${Node.string(n)}${italicTag}`
    }
    else if (n.strikethrough) {
        return `${strikethroughTag}${Node.string(n)}${strikethroughTag}`
    }
    else {
        return Node.string(n)
    }
}


export function SerializeSlate(value, isChild = true) {
    return value.map(n => {
        if (n.children) {
            let [start, end] = paragraphTag;
            if(n.type === 'monospace'){
                [start, end] = monospaceTag;
            }
            const childrenText = n.children.map(SerializeText).join('')
            return `${start}${childrenText}${end}`;
        } else {
            return Node.string(n)
        }
    }).join('\n')
}


export function DeserializeSlate(string) {
    return string.split('\n').map(
        line => {
            return {
                children: [{
                    text: line
                }]
            }
        }
    )
}