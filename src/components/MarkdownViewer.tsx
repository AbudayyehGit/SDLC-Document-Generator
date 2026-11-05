import React, { useState } from 'react';
import { Copy, Check, HelpCircle } from 'lucide-react';
import { findGlossaryItem } from '../data/glossary';

interface MarkdownViewerProps {
  content: string;
  onOpenGlossary?: (termId: string) => void;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, onOpenGlossary }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderInline = (text: string) => {
    const parts: React.ReactNode[] = [];
    let keyIdx = 0;

    // Pattern for `code`, **bold**, *italic*, [link](url)
    const inlineRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    let match;
    let lastIndex = 0;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('`') && token.endsWith('`')) {
        const codeText = token.slice(1, -1);
        const glossaryMatch = onOpenGlossary ? findGlossaryItem(codeText) : undefined;
        if (glossaryMatch && onOpenGlossary) {
          parts.push(
            <button
              key={`code-${keyIdx++}`}
              type="button"
              onClick={() => onOpenGlossary(glossaryMatch.id)}
              className="px-2 py-0.5 rounded-lg bg-[#eef5fa] text-[#1e537d] font-mono text-xs border border-[#cce1f0] hover:border-[#e59b24] hover:bg-[#fdf8ee] transition-colors inline-flex items-center gap-1 cursor-pointer font-semibold"
              title={`View "${glossaryMatch.term}" in glossary`}
            >
              <span>{codeText}</span>
              <HelpCircle className="w-2.5 h-2.5 text-[#e59b24]" />
            </button>
          );
        } else {
          parts.push(
            <code key={`code-${keyIdx++}`} className="px-1.5 py-0.5 rounded-lg bg-[#eef5fa] text-[#1e537d] font-mono text-xs border border-[#dce6ee]">
              {codeText}
            </code>
          );
        }
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={`bold-${keyIdx++}`} className="font-bold text-[#132b40]">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={`italic-${keyIdx++}`} className="text-[#516b80] italic">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
        const linkMatch = token.match(/^\[(.*)\]\((.*)\)$/);
        if (linkMatch) {
          const href = linkMatch[2];
          if (href.startsWith('glossary:') && onOpenGlossary) {
            const termId = href.replace('glossary:', '');
            parts.push(
              <button
                key={`link-${keyIdx++}`}
                type="button"
                onClick={() => onOpenGlossary(termId)}
                className="text-[#1e537d] font-semibold underline decoration-[#e59b24] hover:text-[#b87e21] transition-colors inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>{linkMatch[1]}</span>
                <HelpCircle className="w-2.5 h-2.5 text-[#e59b24]" />
              </button>
            );
          } else {
            parts.push(
              <a
                key={`link-${keyIdx++}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1e537d] font-semibold underline hover:text-[#b87e21] transition-colors"
              >
                {linkMatch[1]}
              </a>
            );
          }
        }
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const parseMarkdown = (raw: string) => {
    const lines = raw.split('\n');
    const nodes: React.ReactNode[] = [];
    let inCode = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let inTable = false;
    let tableBuffer: string[] = [];

    const flushTable = (k: number) => {
      if (tableBuffer.length === 0) return null;
      const [headerLine, , ...rowLines] = tableBuffer;
      const headers = headerLine
        ? headerLine.split('|').filter(c => c.trim().length > 0).map(c => c.trim())
        : [];
      const rows = rowLines
        .filter(r => r.trim().startsWith('|'))
        .map(r => r.split('|').filter(c => c.trim().length > 0).map(c => c.trim()));

      const tableNode = (
        <div key={`tbl-${k}`} className="overflow-x-auto my-3 border border-[#dce6ee] rounded-2xl shadow-xs bg-white">
          <table className="min-w-full divide-y divide-[#dce6ee] text-xs text-left">
            <thead className="bg-[#1d4869] text-white font-bold uppercase tracking-wider">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-3.5 py-2.5">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaf0f5]">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#f7fafe] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2.5 text-[#3b5972]">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableBuffer = [];
      return tableNode;
    };

    lines.forEach((line, index) => {
      // Code block start/end
      if (line.trim().startsWith('```')) {
        if (inCode) {
          const codeString = codeBuffer.join('\n');
          const codeIdx = index;
          nodes.push(
            <div key={`code-block-${index}`} className="relative group my-3 rounded-2xl overflow-hidden border border-[#2b5e85] bg-[#1d4869] shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-[#122e43] border-b border-[#2b5e85] text-[11px] font-mono text-[#b8d2e8]">
                <span>{codeLanguage || 'code'}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeString, codeIdx)}
                  className="flex items-center gap-1 hover:text-[#e59b24] transition-colors text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[#1e537d] text-white"
                  aria-label="Copy code block"
                >
                  {copiedIndex === codeIdx ? (
                    <>
                      <Check className="w-3 h-3 text-[#e59b24]" />
                      <span className="text-[#e59b24] font-sans">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="font-sans">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-[#fdf6e7] overflow-x-auto leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          codeLanguage = '';
          inCode = false;
        } else {
          if (inTable) {
            nodes.push(flushTable(index));
            inTable = false;
          }
          inCode = true;
          codeLanguage = line.trim().replace(/^```/, '').trim();
        }
        return;
      }

      if (inCode) {
        codeBuffer.push(line);
        return;
      }

      // Tables
      if (line.trim().startsWith('|')) {
        inTable = true;
        tableBuffer.push(line.trim());
        return;
      } else if (inTable) {
        nodes.push(flushTable(index));
        inTable = false;
      }

      // Divider
      if (line.trim() === '---' || line.trim() === '================================================================================') {
        nodes.push(<hr key={index} className="border-[#dce6ee] my-4" />);
        return;
      }

      // Headings
      if (line.startsWith('# ')) {
        nodes.push(
          <h1 key={index} className="text-xl sm:text-2xl font-black text-[#132b40] border-b-2 border-[#1e537d]/20 pb-2.5 mt-5 mb-3 tracking-tight">
            {renderInline(line.replace('# ', ''))}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        nodes.push(
          <h2 key={index} className="text-base sm:text-lg font-bold text-[#1e537d] mt-5 mb-2 flex items-center gap-2">
            <span className="w-2 h-4 rounded-full bg-[#e59b24] inline-block" />
            {renderInline(line.replace('## ', ''))}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        nodes.push(
          <h3 key={index} className="text-xs sm:text-sm font-bold text-[#132b40] uppercase tracking-wider mt-4 mb-1.5">
            {renderInline(line.replace('### ', ''))}
          </h3>
        );
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        nodes.push(
          <blockquote key={index} className="border-l-4 border-[#e59b24] pl-3.5 py-1.5 my-2 text-xs text-[#516b80] bg-[#fdfaf2] rounded-r-xl">
            {renderInline(line.replace('> ', ''))}
          </blockquote>
        );
        return;
      }

      // Bullet lists
      if (line.startsWith('- ')) {
        nodes.push(
          <div key={index} className="flex items-start gap-2 ml-1 my-1 text-xs text-[#334e68]">
            <span className="text-[#e59b24] font-bold mt-0.5">•</span>
            <div className="flex-1 leading-relaxed">{renderInline(line.replace('- ', ''))}</div>
          </div>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const numMatch = line.match(/^(\d+)\.\s(.*)$/);
        if (numMatch) {
          nodes.push(
            <div key={index} className="flex items-start gap-2 ml-1 my-1 text-xs text-[#334e68]">
              <span className="font-mono text-[#1e537d] text-[11px] font-bold mt-0.5">{numMatch[1]}.</span>
              <div className="flex-1 leading-relaxed">{renderInline(numMatch[2])}</div>
            </div>
          );
          return;
        }
      }

      // Regular paragraph or line
      if (line.trim().length > 0) {
        nodes.push(
          <p key={index} className="text-xs text-[#3b5972] leading-relaxed my-1.5">
            {renderInline(line)}
          </p>
        );
      }
    });

    if (inTable) {
      nodes.push(flushTable(lines.length));
    }

    return nodes;
  };

  return <div className="space-y-0.5">{parseMarkdown(content)}</div>;
};
