import React, { useEffect, useMemo, useState } from 'react';

const Courses: React.FC = () => {
  const API_BASE = (process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8000`).replace(/\/$/, '');
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/courses`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const t = await resp.text();
        setText(t);
      } catch (e: any) {
        setError(e?.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    })();
  }, [API_BASE]);

  const sections = useMemo(() => {
    // Split into sections by markdown-style headings (#, ##, ###)
    const lines = text.split(/\r?\n/);
    const result: Array<{ title: string; body: string }> = [];
    let currentTitle = 'Overview';
    let currentLines: string[] = [];
    const flush = () => {
      if (currentLines.length > 0) {
        result.push({ title: currentTitle.trim(), body: currentLines.join('\n').trim() });
      }
      currentLines = [];
    };
    for (const line of lines) {
      const m = line.match(/^#{1,3}\s+(.+)$/);
      if (m) {
        flush();
        currentTitle = m[1];
        continue;
      }
      currentLines.push(line);
    }
    flush();
    return result.length > 0 ? result : [{ title: 'Courses', body: text }];
  }, [text]);

  const renderLightMarkdown = (raw: string) => {
    // Escape HTML
    let html = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Code fences ```
    html = html.replace(/```([\s\S]*?)```/g, (_m, code) => {
      return `<pre class="bg-gray-900 border border-gray-700 rounded p-3 overflow-auto text-xs">${code}</pre>`;
    });
    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-800 border border-gray-700 rounded">$1</code>');
    // Bold **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    html = html.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
    // Lists - lines starting with - or *
    html = html.replace(/(?:^|\n)([-*] .*(?:\n[-*] .*)*)/g, (block) => {
      const items = block
        .trim()
        .split(/\n/)
        .map((l) => l.replace(/^[-*]\s+/, ''))
        .map((c) => `<li class="mb-1">${c}</li>`) 
        .join('');
      return `\n<ul class="list-disc list-inside space-y-0">${items}</ul>`;
    });
    // Paragraphs and line breaks
    html = html
      .split(/\n\n+/)
      .map((para) => `<p class="mb-3">${para.replace(/\n/g, '<br/>')}</p>`) 
      .join('');
    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-black text-white p-6 flex items-center justify-center">
        <p className="text-gray-400">Loading courses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-black text-white p-6">
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">Courses</h2>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black text-white p-6">
      <div className="glass-dark rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Courses</h2>
        </div>
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <details id={`section-${idx}`} key={`${section.title}-${idx}`} className="bg-white/5 border border-white/10 rounded p-4" open={idx < 1}>
              <summary className="cursor-pointer select-none text-sm font-semibold text-white/90">
                {section.title}
              </summary>
              <div className="mt-3 text-sm text-gray-200">
                {renderLightMarkdown(section.body)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;


