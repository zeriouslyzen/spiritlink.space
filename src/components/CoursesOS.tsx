import React, { useEffect, useMemo, useState } from 'react';

interface Lesson { title: string; content: string; }
interface Module { title: string; lessons: Lesson[]; }

const DEFAULT_GLYPHS = [5,10,7,8,12,6,9,15,8,5,10];

function lightRenderMarkdown(rawText: string): string {
  let html = rawText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/```([\s\S]*?)```/g, (_m, code) => `<pre class="bg-gray-900 border border-gray-700 rounded p-3 overflow-auto text-xs">${code}</pre>`);
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-800 border border-gray-700 rounded">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  html = html.replace(/(?:^|\n)([-*] .*(?:\n[-*] .*)*)/g, (block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((l) => l.replace(/^[-*]\s+/, ''))
      .map((c) => `<li class="mb-1">${c}</li>`) 
      .join('');
    return `\n<ul class="list-disc list-inside space-y-0">${items}</ul>`;
  });
  html = html.split(/\n\n+/).map((p) => `<p class="mb-3">${p.replace(/\n/g, '<br/>')}</p>`).join('');
  return html;
}

const CoursesOS: React.FC = () => {
  const API_BASE = (process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8000`).replace(/\/$/, '');
  const [raw, setRaw] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'entry' | 'dashboard' | 'courses' | 'community' | 'settings'>('entry');
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [glyphs, setGlyphs] = useState<number>(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const userId = 'DEMO_USER';

  useEffect(() => {
    (async () => {
      try {
        // Prefer static file from public
        const local = await fetch('/Courses.txt');
        if (local.ok) {
          setRaw(await local.text());
          return;
        }
        // Fallback to backend
        const r = await fetch(`${API_BASE}/api/courses`);
        setRaw(await r.text());
      } catch {
        setRaw('');
      }
    })();
  }, [API_BASE]);

  const modules: Module[] = useMemo(() => {
    if (!raw) return [];
    // Detect if full HTML document
    const isHtmlDoc = /<!DOCTYPE|<html[\s>]/i.test(raw) || /<head[\s>]|<body[\s>]/i.test(raw);
    if (isHtmlDoc) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(raw, 'text/html');
        doc.querySelectorAll('script,style').forEach((el) => el.remove());
        const h2s = Array.from(doc.querySelectorAll('h2')) as HTMLElement[];
        if (h2s.length) {
          const mods: Module[] = [];
          h2s.forEach((h2, idx) => {
            const mod: Module = { title: h2.textContent?.trim() || `Module ${idx + 1}`, lessons: [] };
            let node: Element | null = h2.nextElementSibling;
            let current: Lesson | null = null;
            const push = () => { if (current && current.content.trim()) { mod.lessons.push({ ...current, content: current.content.trim() }); } current = null; };
            while (node && node.tagName.toLowerCase() !== 'h2') {
              const tag = node.tagName.toLowerCase();
              if (tag === 'h3') { push(); current = { title: (node as HTMLElement).innerText.trim() || 'Lesson', content: '' }; }
              else if (['p','ul','ol'].includes(tag)) {
                const text = (node as HTMLElement).innerText.trim();
                if (text) { if (!current) current = { title: 'Lesson', content: '' }; current.content += (current.content ? '\n\n' : '') + text; }
              }
              node = node.nextElementSibling;
            }
            push();
            if (mod.lessons.length === 0) {
              const summary = (h2.nextElementSibling as HTMLElement)?.innerText?.trim() || '';
              mod.lessons.push({ title: 'Overview', content: summary });
            }
            mods.push(mod);
          });
          return mods;
        }
        // Fallback: generic containers
        const cards = Array.from(doc.querySelectorAll('section, article, .card, .module, .course, .module-card, .course-card'));
        if (cards.length) {
          return cards.map((el, i) => {
            const titleEl = el.querySelector('h1, h2, h3, .card-title, .title, strong');
            const title = (titleEl?.textContent || `Module ${i + 1}`).trim();
            const parts: string[] = [];
            el.querySelectorAll('p, li').forEach((p) => { const t = (p as HTMLElement).innerText.trim(); if (t) parts.push(t); });
            const content = parts.join('\n\n') || (el as HTMLElement).innerText.trim();
            return { title, lessons: [{ title: 'Overview', content }] };
          }).filter((m) => m.lessons[0].content);
        }
        const textOnly = (parser.parseFromString(raw, 'text/html').body?.innerText || '').trim();
        return [{ title: 'Overview', lessons: [{ title: 'Intro', content: textOnly }] }];
      } catch {
        // fall through to markdown parsing
      }
    }
    // Markdown-like parsing: ## module, ### lesson
    const lines = raw.split(/\r?\n/);
    const mods: Module[] = [];
    let currentModule: Module | null = null;
    let currentLesson: Lesson | null = null;
    const flushLesson = () => { if (currentLesson && currentModule) { currentLesson.content = currentLesson.content.trim(); currentModule.lessons.push(currentLesson); } currentLesson = null; };
    const flushModule = () => { if (currentModule) { flushLesson(); mods.push(currentModule); } currentModule = null; };
    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      const m2 = line.match(/^##\s+(.+)$/);
      if (m2) { flushModule(); currentModule = { title: m2[1].trim(), lessons: [] }; currentLesson = null; continue; }
      const m3 = line.match(/^###\s+(.+)$/);
      if (m3) { flushLesson(); if (!currentModule) currentModule = { title: 'Overview', lessons: [] }; currentLesson = { title: m3[1].trim(), content: '' }; continue; }
      if (!currentModule) currentModule = { title: 'Overview', lessons: [] };
      if (!currentLesson) currentLesson = { title: 'Intro', content: '' };
      currentLesson.content += (currentLesson.content ? '\n' : '') + line;
    }
    flushModule();
    return mods.length ? mods : [{ title: 'Courses', lessons: [{ title: 'Intro', content: raw }] }];
  }, [raw]);

  const visibleCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = modules.map((m, i) => ({ index: i, title: m.title, description: (m.lessons?.[0]?.content || '').slice(0, 180) }));
    if (!q) return list;
    return list.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [modules, search]);

  const markComplete = (idx: number, glyphReward: number) => {
    if (!completed.includes(idx)) {
      setCompleted((c) => [...c, idx]);
      setGlyphs((g) => g + glyphReward);
    }
  };

  const mainTitle = activeSection === 'entry' ? 'Welcome' : activeSection === 'dashboard' ? 'Dashboard' : activeSection === 'courses' ? 'Courses' : activeSection === 'community' ? 'Community' : 'Settings';

  const ModuleShell: React.FC<{ id: number; title: string; glyphReward: number; children: React.ReactNode }> = ({ id, title, glyphReward, children }) => (
    <div className="max-w-4xl w-full mx-auto">
      <button className="glow-button px-4 py-2 rounded-lg text-white font-medium text-sm mb-6" onClick={() => setActiveModule(null)}>← Back to Courses</button>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{title}</h2>
      <div>{children}</div>
      <button className="glow-button px-8 py-3 rounded-lg text-white text-xl font-semibold mt-8" onClick={() => markComplete(id, glyphReward)}>Complete Module</button>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sidebar flex flex-col p-4 text-gray-300">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-white mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            <span className="text-xl font-bold text-white">SpiritLink</span>
          </div>
        </div>
        <nav className="flex-grow">
          <ul>
            <li className={`sidebar-item ${activeSection==='dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}><span className="text">Dashboard</span></li>
            <li className={`sidebar-item ${activeSection==='courses' ? 'active' : ''}`} onClick={() => { setActiveSection('courses'); setActiveModule(null); }}><span className="text">Courses</span></li>
            <li className={`sidebar-item ${activeSection==='community' ? 'active' : ''}`} onClick={() => setActiveSection('community')}><span className="text">Community</span></li>
            <li className={`sidebar-item ${activeSection==='settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}><span className="text">Settings</span></li>
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <ul>
            <li className="sidebar-item" onClick={() => setActiveSection('settings')}>
              <span className="text">Profile</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow flex flex-col bg-gradient-to-br from-[#0a0a0a] to-[#000000] p-4 sm:p-8">
        {/* Top bar */}
        <header className="top-nav flex items-center justify-between p-4 rounded-xl mb-8 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{mainTitle}</h1>
          <div className="flex items-center space-x-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search courses..." className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white" />
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold relative">
              <span>JL</span>
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold rounded-full px-2 py-1">{glyphs} Glyphs</div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">User ID: {userId}</div>
            </div>
          </div>
        </header>

        {/* Entry screen */}
        {activeSection === 'entry' && (
          <section className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 rounded-2xl glassmorphism shadow-xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Welcome to SpiritLink OS</h2>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl">Prepare to embark on a journey of consciousness development, deprogramming, and true history. Your path to escaping the matrix begins here.</p>
            <button className="glow-button px-8 py-3 rounded-lg text-white text-xl font-semibold" onClick={() => { setActiveSection('courses'); setActiveModule(null); }}>Enter Courses</button>
          </section>
        )}

        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <section className="flex flex-col flex-grow p-4 sm:p-8 rounded-2xl glassmorphism shadow-xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Dashboard</h2>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">Your central hub for progress, insights, and quick access to your journey.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
              <div className="p-6 rounded-xl glassmorphism text-left">
                <h3 className="text-xl font-semibold text-gray-100 mb-3">Recent Progress</h3>
                <p className="text-gray-300">Completed <span>{completed.length}</span> courses.</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                  <div className="bg-white h-2.5 rounded-full" style={{ width: `${modules.length ? Math.round((completed.length / modules.length) * 100) : 0}%` }} />
                </div>
                <p className="text-sm text-gray-400 mt-1">{modules.length ? Math.round((completed.length / modules.length) * 100) : 0}% of Deprogrammer Archetype completed</p>
              </div>
              <div className="p-6 rounded-xl glassmorphism text-left">
                <h3 className="text-xl font-semibold text-gray-100 mb-3">Next Steps</h3>
                <p className="text-gray-300">Continue with your journey or explore new modules.</p>
                <button className="glow-button px-4 py-2 rounded-lg text-white font-medium text-sm mt-4" onClick={() => setActiveSection('courses')}>Go to Courses</button>
              </div>
            </div>
          </section>
        )}

        {/* Courses */}
        {activeSection === 'courses' && (
          <section className="flex flex-col flex-grow p-4 sm:p-8 rounded-2xl glassmorphism shadow-xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Courses</h2>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">A new curriculum is being composed.</p>
            <div className="max-w-3xl w-full mx-auto p-8 rounded-2xl glassmorphism border border-white/10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 18h16M4 14h16M4 10h10" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Coming soon</h3>
                <p className="text-gray-400">Insert new modules and lessons here when ready.</p>
              </div>
            </div>
          </section>
        )}

        {/* Community & Settings placeholders */}
        {activeSection === 'community' && (
          <section className="flex flex-col flex-grow p-4 sm:p-8 rounded-2xl glassmorphism shadow-xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Community</h2>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">Connect with other seekers on the path to awakening.</p>
            <div className="p-6 rounded-xl glassmorphism text-left max-w-2xl w-full mx-auto">
              <h3 className="text-xl font-semibold text-gray-100 mb-3">Community Forum (Placeholder)</h3>
              <p className="text-gray-300 mb-4">Engage in discussions and collaborate.</p>
              <button className="glow-button px-4 py-2 rounded-lg text-white font-medium text-sm">Access Forum</button>
            </div>
          </section>
        )}

        {activeSection === 'settings' && (
          <section className="flex flex-col flex-grow p-4 sm:p-8 rounded-2xl glassmorphism shadow-xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Settings & Profile</h2>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">Manage your account and personalize your experience.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
              <div className="p-6 rounded-xl glassmorphism text-left">
                <h3 className="text-xl font-semibold text-gray-100 mb-3">Personal Information</h3>
                <p className="text-gray-300 mb-2">Initials: <span className="font-bold">JL</span></p>
                <p className="text-gray-300">User ID: <span className="font-bold">{userId}</span></p>
                <button className="glow-button px-4 py-2 rounded-lg text-white font-medium text-sm mt-4">Edit Profile</button>
              </div>
              <div className="p-6 rounded-xl glassmorphism text-left">
                <h3 className="text-xl font-semibold text-gray-100 mb-3">Account Security</h3>
                <p className="text-gray-300 mb-4">Review and update your security settings.</p>
                <button className="glow-button px-4 py-2 rounded-lg text-white font-medium text-sm">Security Settings</button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CoursesOS;


