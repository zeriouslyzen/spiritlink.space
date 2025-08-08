import React, { useEffect, useMemo, useState } from 'react';

interface Lesson { title: string; content: string; }
interface Module { title: string; lessons: Lesson[]; }

const CoursesAdvanced: React.FC = () => {
  const API_BASE = (process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8000`).replace(/\/$/, '');
  const [raw, setRaw] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [selected, setSelected] = useState<{ m: number; l: number }>({ m: 0, l: 0 });
  const userKey = useMemo(() => localStorage.getItem('sl-user-id') || 'anon', []);
  const [progress, setProgress] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(`courses-progress:${userKey}`) || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    (async () => {
      try {
        // Prefer static file from public to avoid backend dependency
        const primary = await fetch('/Courses.txt');
        if (primary.ok) {
          setRaw(await primary.text());
          setLoading(false);
          return;
        }
        // Fallback to backend proxy
        const resp = await fetch(`${API_BASE}/api/courses`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const text = await resp.text();
        setRaw(text);
      } catch (e: any) {
        setError(e?.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    })();
  }, [API_BASE]);

  // If the source is full HTML, render the body content (no code shown)
  const isHtmlDoc = useMemo(() => /<!DOCTYPE|<html[\s>]/i.test(raw) || /<head[\s>]|<body[\s>]/i.test(raw), [raw]);
  const htmlContent = useMemo(() => {
    if (!isHtmlDoc) return { styles: '', body: '' };
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'text/html');
      // Remove scripts for safety
      doc.querySelectorAll('script').forEach((el) => el.remove());
      const styles = Array.from(doc.head?.querySelectorAll('style') || [])
        .map((el) => el.textContent || '')
        .join('\n');
      const body = doc.body?.innerHTML || '';
      return { styles, body };
    } catch {
      return { styles: '', body: '' };
    }
  }, [isHtmlDoc, raw]);

  const modules: Module[] = useMemo(() => {
    if (isHtmlDoc) {
      // Parse modules from <h2>, lessons from <h3>, text from <p>/<li>
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'text/html');
      doc.querySelectorAll('script,style').forEach((el) => el.remove());
      const h2s = Array.from(doc.querySelectorAll('h2')) as HTMLElement[];
      if (h2s.length > 0) {
        const mods: Module[] = [];
        h2s.forEach((h2, idx) => {
          const mod: Module = { title: h2.textContent?.trim() || `Module ${idx + 1}`, lessons: [] };
          let node: Element | null = h2.nextElementSibling;
          let currentLesson: Lesson | null = null;
          const pushLesson = () => {
            if (currentLesson && currentLesson.content.trim()) {
              mod.lessons.push({ ...currentLesson, content: currentLesson.content.trim() });
            }
            currentLesson = null;
          };
          while (node && node.tagName.toLowerCase() !== 'h2') {
            if (node.tagName.toLowerCase() === 'h3') {
              pushLesson();
              currentLesson = { title: node.textContent?.trim() || 'Lesson', content: '' };
            } else if (['p','ul','ol'].includes(node.tagName.toLowerCase())) {
              const text = (node as HTMLElement).innerText.trim();
              if (text) {
                if (!currentLesson) currentLesson = { title: 'Lesson', content: '' };
                currentLesson.content += (currentLesson.content ? '\n\n' : '') + text;
              }
            }
            node = node.nextElementSibling;
          }
          pushLesson();
          if (mod.lessons.length === 0) {
            const summary = (h2.nextElementSibling as HTMLElement)?.innerText?.trim() || '';
            mod.lessons.push({ title: 'Overview', content: summary });
          }
          mods.push(mod);
        });
        return mods;
      }
      // Fallback: try common section/card containers
      const cardSelectors = 'section, article, .card, .module, .course, .module-card, .course-card';
      const cards = Array.from(doc.querySelectorAll(cardSelectors));
      if (cards.length > 0) {
        const mods2: Module[] = cards.map((el, idx) => {
          const titleEl = el.querySelector('h1, h2, h3, .card-title, .title, strong');
          const title = (titleEl?.textContent || `Module ${idx + 1}`).trim();
          const parts: string[] = [];
          el.querySelectorAll('p, li').forEach((p) => {
            const t = (p as HTMLElement).innerText.trim();
            if (t) parts.push(t);
          });
          const content = parts.join('\n\n') || (el as HTMLElement).innerText.trim();
          return { title, lessons: [{ title: 'Overview', content }] };
        }).filter((m) => m.lessons[0].content);
        if (mods2.length > 0) return mods2;
      }
      const textOnly = (parser.parseFromString(raw, 'text/html').body?.innerText || '').trim();
      return [{ title: 'Overview', lessons: [{ title: 'Intro', content: textOnly }] }];
    }
    const lines = raw.split(/\r?\n/);
    const mods: Module[] = [];
    let currentModule: Module | null = null;
    let currentLesson: Lesson | null = null;
    const flushLesson = () => { if (currentLesson && currentModule) { currentLesson.content = currentLesson.content.trim(); currentModule.lessons.push(currentLesson); } currentLesson = null; };
    const flushModule = () => { if (currentModule) { flushLesson(); mods.push(currentModule); } currentModule = null; };
    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      const m2 = line.match(/^##\s+(.+)$/); // Module
      if (m2) { flushModule(); currentModule = { title: m2[1].trim(), lessons: [] }; currentLesson = null; continue; }
      const m3 = line.match(/^###\s+(.+)$/); // Lesson
      if (m3) { flushLesson(); if (!currentModule) currentModule = { title: 'Overview', lessons: [] }; currentLesson = { title: m3[1].trim(), content: '' }; continue; }
      if (!currentModule) currentModule = { title: 'Overview', lessons: [] };
      if (!currentLesson) currentLesson = { title: 'Intro', content: '' };
      currentLesson.content += (currentLesson.content ? '\n' : '') + line;
    }
    flushModule();
    return mods.length ? mods : [{ title: 'Courses', lessons: [{ title: 'Intro', content: raw }] }];
  }, [raw]);

  const keyFor = (m: number, l: number) => `${m}:${l}`;
  const markComplete = (m: number, l: number) => setProgress((p) => ({ ...p, [keyFor(m, l)]: true }));
  const isComplete = (m: number, l: number) => !!progress[keyFor(m, l)];

  useEffect(() => {
    localStorage.setItem(`courses-progress:${userKey}`, JSON.stringify(progress));
  }, [progress, userKey]);

  const renderLightMarkdown = (rawText: string) => {
    let html = rawText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/```([\s\S]*?)```/g, (_m, code) => `<pre class="bg-gray-900 border border-gray-700 rounded p-3 overflow-auto text-xs">${code}</pre>`);
    html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-800 border border-gray-700 rounded">$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
    html = html.replace(/(?:^|\n)([-*] .*(?:\n[-*] .*)*)/g, (block) => {
      const items = block.trim().split(/\n/).map((l) => l.replace(/^[-*]\s+/, '')).map((c) => `<li class="mb-1">${c}</li>`).join('');
      return `\n<ul class="list-disc list-inside space-y-0">${items}</ul>`;
    });
    html = html.split(/\n\n+/).map((p) => `<p class="mb-3">${p.replace(/\n/g, '<br/>')}</p>`).join('');
    // Auto-link Sigil Entry → Module jump
    html = html.replace(/Sigil Entry:\s*Begin Module\s*(\d+)/gi, (_m, n) => `<a href="#" data-go="${Number(n) - 1}" class="underline text-purple-300">Sigil Entry: Begin Module ${n}</a>`);
    return (
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={(e) => {
          const t = e.target as HTMLElement;
          const go = t.getAttribute?.('data-go');
          if (go) {
            const mIdx = Number(go);
            if (!isNaN(mIdx) && modules[mIdx]) setSelected({ m: mIdx, l: 0 });
            e.preventDefault();
          }
        }}
      />
    );
  };

  const filteredModules = useMemo(() => {
    if (!query.trim()) return modules;
    const q = query.toLowerCase();
    return modules
      .map((mod) => ({
        ...mod,
        lessons: mod.lessons.filter((ls) => ls.title.toLowerCase().includes(q) || ls.content.toLowerCase().includes(q))
      }))
      .filter((m) => m.lessons.length > 0 || m.title.toLowerCase().includes(q));
  }, [modules, query]);

  if (loading) return <div className="w-full h-full bg-black text-white p-6 flex items-center justify-center"><p className="text-gray-400">Loading courses…</p></div>;
  if (error) return <div className="w-full h-full bg-black text-white p-6"><div className="glass-dark rounded-2xl p-6"><h2 className="text-lg font-semibold mb-2">Courses</h2><p className="text-sm text-red-400">{error}</p></div></div>;

  const selMod = filteredModules[selected.m] || filteredModules[0];
  const selLesson = selMod?.lessons[selected.l] || selMod?.lessons[0];

  return (
    <div className="w-full h-full bg-black text-white p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <aside className="md:col-span-4 lg:col-span-3 glass-dark rounded-2xl p-4 h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Courses</h2>
          </div>
          <input
            aria-label="Search courses"
            className="w-full glass-input rounded px-3 py-2 text-sm mb-3"
            placeholder="Search modules or lessons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
            {filteredModules.map((mod, mi) => {
              const total = mod.lessons.length || 1;
              const completed = mod.lessons.filter((_, li) => isComplete(mi, li)).length;
              const pct = Math.round((completed / total) * 100);
              return (
                <div key={mod.title + mi} className="bg-white/5 border border-white/10 rounded p-3 transition-transform duration-200 hover:translate-x-0.5">
                  <button className="text-left w-full" onClick={() => setSelected({ m: mi, l: 0 })}>
                    <div className="font-medium text-sm text-white/90">{mod.title}</div>
                    <div className="text-xs text-gray-400 mb-2">{completed}/{total} complete</div>
                    <div className="w-full bg-white/10 h-1 rounded">
                      <div className="bg-white/70 h-1 rounded" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                  {mi === selected.m && (
                    <div className="mt-2 space-y-1">
                      {mod.lessons.map((ls, li) => (
                        <button key={ls.title + li} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-white/10 flex items-center justify-between" onClick={() => setSelected({ m: mi, l: li })}>
                          <span className="truncate">{ls.title}</span>
                          <span className={`ml-2 text-[10px] ${isComplete(mi, li) ? 'text-white/80' : 'text-gray-500'}`}>{isComplete(mi, li) ? '✓' : ''}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="md:col-span-8 lg:col-span-9 glass-dark rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-gray-400">{selMod?.title}</div>
              <h3 className="text-lg font-semibold">{selLesson?.title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 rounded bg-white/10 border border-white/10 text-sm hover:bg-white/15" onClick={() => { if (selMod) markComplete(selected.m, selected.l); }}>
                Mark complete
              </button>
              <button className="px-3 py-1.5 rounded bg-white/10 border border-white/10 text-white text-sm hover:bg-white/15" onClick={() => {
                const mod = filteredModules[selected.m];
                if (!mod) return;
                const next = mod.lessons.findIndex((_, li) => !isComplete(selected.m, li));
                if (next !== -1) setSelected({ m: selected.m, l: next });
              }}>
                Continue
              </button>
            </div>
          </div>
          <div className="prose prose-invert max-w-none">{selLesson && renderLightMarkdown(selLesson.content)}</div>
        </main>
      </div>
    </div>
  );
};

export default CoursesAdvanced;


