import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import './code_snippet.scss'

interface CodeSnippetProps {
    code: string;
}

class CodeSnippet extends React.Component<CodeSnippetProps> {
    render() {
        return (
            <SyntaxHighlighter
                className='code_snippet'
                language='javascript'
                style={vs2015}
                codeTagProps={{style: {fontFamily: 'Roboto Mono'}}}
                children={this.props.code}
            />
        );
    }
}

export default CodeSnippet;