import React, { useMemo } from 'react';
import katex from 'katex';

interface KatexFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * Merender formula matematika/sains murni menggunakan KaTeX visual.
 * Memiliki fallback aman jika string LaTeX tidak valid.
 */
export const KatexFormula: React.FC<KatexFormulaProps> = ({
  math,
  block = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: block,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml',
      });
    } catch (e) {
      console.warn('KaTeX render error for:', math, e);
      return `<span class="katex-fallback font-mono">${escapeHtml(math)}</span>`;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`my-1.5 overflow-x-auto py-1 max-w-full ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-middle max-w-full overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface MathRendererProps {
  text: string;
  className?: string;
  inline?: boolean;
}

/**
 * Helper untuk merender teks campuran (penjelasan biasa + rumus inline $...$ + rumus blok $$...$$).
 * Jika ada rumus yang belum dibungkus tanda $, tapi memuat notasi LaTeX seperti \frac, \sqrt, \times,
 * komponen ini dapat mengenali dan merendernya dengan indah.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  text,
  className = '',
  inline = false,
}) => {
  if (!text) return null;

  // Split string berdasarkan $$...$$ (blok) dan $...$ (inline)
  // Regex memecah:
  // 1. $$([\s\S]+?)$$ -> display mode
  // 2. $([^$\n]+?)$ -> inline mode
  const parts = useMemo(() => {
    const raw = text;
    // Cek apakah string keseluruhan adalah sebuah formula tanpa tanda dollar
    // Misalnya: "\frac{a}{b}" atau "S_n = \frac{n}{2}(U_1 + U_n)"
    const trimmed = raw.trim();
    if (
      !trimmed.includes('$') &&
      (trimmed.includes('\\frac') ||
        trimmed.includes('\\sqrt') ||
        trimmed.includes('\\times') ||
        trimmed.includes('\\div') ||
        trimmed.includes('\\Delta') ||
        trimmed.includes('\\bar') ||
        /^[a-zA-Z0-9_\^\+\-\*\/\=\(\)\s\.,]+$/.test(trimmed) && (trimmed.includes('_') || trimmed.includes('^')))
    ) {
      // Jika string murni formula
      const isBlockFormula = trimmed.includes('\n') || trimmed.includes('=') || trimmed.length > 25;
      return [
        {
          type: isBlockFormula ? 'math-block' : 'math-inline',
          content: trimmed,
        },
      ];
    }

    const segments: Array<{ type: 'text' | 'math-inline' | 'math-block'; content: string }> = [];
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;

    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(raw)) !== null) {
      const matchStart = match.index;
      const matchText = match[0];

      if (matchStart > lastIdx) {
        segments.push({
          type: 'text',
          content: raw.substring(lastIdx, matchStart),
        });
      }

      if (matchText.startsWith('$$') && matchText.endsWith('$$')) {
        segments.push({
          type: 'math-block',
          content: matchText.slice(2, -2),
        });
      } else if (matchText.startsWith('$') && matchText.endsWith('$')) {
        segments.push({
          type: 'math-inline',
          content: matchText.slice(1, -1),
        });
      }

      lastIdx = matchStart + matchText.length;
    }

    if (lastIdx < raw.length) {
      segments.push({
        type: 'text',
        content: raw.substring(lastIdx),
      });
    }

    return segments;
  }, [text]);

  const renderedContent = parts.map((part, i) => {
    if (part.type === 'math-block') {
      return <KatexFormula key={i} math={part.content} block={true} />;
    }
    if (part.type === 'math-inline') {
      return <KatexFormula key={i} math={part.content} block={false} />;
    }
    // Render text with line breaks preserved
    return (
      <span key={i} className="whitespace-pre-line">
        {part.content}
      </span>
    );
  });

  if (inline) {
    return <span className={className}>{renderedContent}</span>;
  }

  return <div className={`leading-relaxed ${className}`}>{renderedContent}</div>;
};

/**
 * Backward-compatible helper component:
 * Menggantikan FormattedMathFormula lama di seluruh proyek.
 */
export const FormattedMathFormula: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  return <MathRenderer text={text} className={className} />;
};

/**
 * Backward-compatible function helper formatMathSymbols:
 * Masih diekspor agar kode lama tidak rusak, tetapi merapikan notasi jika dibutuhkan.
 */
export function formatMathSymbols(rawText: string): string {
  if (!rawText) return '';
  return rawText;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
