// ============ QUOTES ============
const QUOTES = [
    { text: "Post the damn thing.", author: "Everyone who ever succeeded" },
    { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
    { text: "Your competitors are posting right now.", author: "The Algorithm" },
    { text: "Stop overthinking. Start posting.", author: "Your future self" },
    { text: "Excuses don't get likes.", author: "Your future followers" },
    { text: "The best time to post was yesterday. Second best time is now.", author: "Ancient Instagram wisdom" },
    { text: "Be so good they can't ignore you.", author: "Steve Martin" },
    { text: "Nobody remembers the person who almost did it.", author: "The Internet" },
    { text: "Ship it.", author: "Every successful creator" },
    { text: "The algorithm doesn't care about your feelings. Post anyway.", author: "Hard truth" },
    { text: "Work hard in silence. Let the engagement do the talking.", author: "Ron, eventually" },
    { text: "You don't have to be great to start. But you have to start to be great.", author: "Zig Ziglar" },
    { text: "Haters are just confused fans. Give them more content to be confused about.", author: "Unknown" },
    { text: "If they're talking about you, you're doing something right.", author: "Coco Chanel" },
    { text: "Safe posts get safe results. Stop playing it safe.", author: "Hard truth #2" },
    { text: "They can't stop what they can't see coming.", author: "Ron's future enemies" },
    { text: "The only bad post is the one you never made.", author: "Creator Proverbs" },
    { text: "Fear is boring. Post anyway.", author: "Elizabeth Gilbert" },
    { text: "You miss 100% of the posts you don't post.", author: "Wayne Gretzky (adapted by Ron)" },
    { text: "Your content doesn't need to be perfect. It needs to exist.", author: "Also hard truth" },
    { text: "Winners focus on posting. Losers focus on what people might think.", author: "The Scoreboard" },
    { text: "Someday is not a day of the week.", author: "Janet Daily" },
    { text: "Every post is a lottery ticket. Buy more tickets.", author: "Marketing math" },
    { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
    { text: "Stop waiting to feel ready. You'll wait forever.", author: "The void" },
    { text: "Reels get 3x the reach. Just saying.", author: "Instagram, screaming into the void" },
    { text: "Consistency beats perfection. Every. Single. Time.", author: "The algorithm, probably" },
    { text: "Good things come to those who post on schedule.", author: "Ancient creator wisdom" },
    { text: "If your content is good, post it twice. Different day.", author: "Repurpose or perish" },
    { text: "Your audience can't engage with content that doesn't exist.", author: "Captain Obvious" },
    { text: "The graveyard is full of people who were going to start tomorrow.", author: "Some wise jerk" },
    { text: "Other people's opinions of your content are none of your business.", author: "Eleanor Roosevelt (adapted)" },
    { text: "Don't half-ass two things. Whole-ass one post at a time.", author: "Ron Swanson (adapted)" },
    { text: "Ideas are worthless without execution. Post or shut up.", author: "Silicon Valley, unfiltered" },
    { text: "Success is just consistency with a good attitude.", author: "Ron's eventual Wikipedia page" },
];

// ============ CONSTANTS ============
const TIPS = [
    { title: "📸 Photo Posts", text: "High contrast, good lighting, and a clear focal point. Edit before posting — even just brightness/contrast makes a difference." },
    { title: "🎬 Reels", text: "Reels get 3x more reach than photos. Hook in the first 2 seconds. Use trending audio when it fits your brand." },
    { title: "📝 Captions", text: "First line matters most — it's all that shows before 'more'. Ask a question to drive comments. Put hashtags at the end or in a comment." },
    { title: "#️⃣ Hashtags", text: "Use 5-10 targeted hashtags, not 30 generic ones. Mix popular (#carsofinstagram) with niche (#r34gtr) for best reach." },
    { title: "⏰ Best Times", text: "Tuesday–Friday, between 11am–1pm and 7pm–9pm tend to perform best. Check your Insights to confirm for your audience." },
    { title: "📊 Stories vs Feed", text: "Stories are for behind-the-scenes, polls, and Q&A. Feed posts are for evergreen content you want people to find later." },
    { title: "💬 Engagement", text: "Reply to every comment in the first hour. The algorithm notices and boosts your post. Even a simple 'Thanks!' counts." },
    { title: "🔄 Consistency", text: "3-4 posts per week is better than 10 posts one week and nothing the next. Pick a schedule and stick to it." },
];

const TYPE_ICONS = { photo: '📸', reel: '🎬', story: '📖', carousel: '🖼️' };
const STATUS_LABELS = { idea: '💡 Ideas', drafting: '✏️ Drafting', ready: '✅ Ready', posted: '📤 Posted' };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ============ SUPABASE ============
const SUPABASE_URL = 'https://mzjicrhoyftmzeqqjzbj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16amljcmhveWZ0bXplcXFqemJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTA2MjIsImV4cCI6MjA4OTY2NjYyMn0.AnCmuMZQhvBg_vU5tx4oaNo18eJdieX02d4uawfeEI0';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function postToDb(p) {
    return {
        id: p.id, title: p.title, type: p.type, status: p.status,
        caption: p.caption || null, hashtags: p.hashtags || null,
        notes: p.notes || null, scheduled_date: p.scheduledDate || null,
        scheduled_time: p.scheduledTime || null, posted_date: p.postedDate || null,
        analytics: p.analytics || null, tagged_product: p.taggedProduct || null,
        slides: p.slides || null, created_at: p.createdAt,
    };
}

function postFromDb(p) {
    return {
        id: p.id, title: p.title, type: p.type, status: p.status,
        caption: p.caption, hashtags: p.hashtags, notes: p.notes,
        scheduledDate: p.scheduled_date, scheduledTime: p.scheduled_time,
        postedDate: p.posted_date, analytics: p.analytics, taggedProduct: p.tagged_product,
        slides: p.slides || [],
        createdAt: p.created_at,
    };
}

// ============ STATE ============
let state = { posts: [], hashtagSets: [], captionTemplates: [], reminders: [], products: [], config: {} };
let catalog = null;
let catalogLoading = false;

async function loadCatalog() {
    if (catalog) return catalog;
    if (catalogLoading) return null;
    catalogLoading = true;
    try {
        const res = await fetch('catalog.json');
        catalog = await res.json();
    } catch(e) {
        catalog = [];
    }
    catalogLoading = false;
    return catalog;
}
let currentView = 'dashboard';
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();
let analyticsCharts = {};
let quoteIndex = Math.floor(Math.random() * QUOTES.length);
let reminderInterval = null;

async function loadState() {
    const [p, h, c, r, pr, cfg] = await Promise.all([
        sb.from('gramhub_posts').select('*').order('created_at', { ascending: false }),
        sb.from('gramhub_hashtag_sets').select('*').order('created_at', { ascending: false }),
        sb.from('gramhub_caption_templates').select('*').order('created_at', { ascending: false }),
        sb.from('gramhub_reminders').select('*').order('created_at', { ascending: false }),
        sb.from('gramhub_products').select('*').order('name', { ascending: true }),
        sb.from('gramhub_config').select('*'),
    ]);
    state.posts = (p.data || []).map(postFromDb);
    state.hashtagSets = h.data || [];
    state.captionTemplates = c.data || [];
    state.reminders = (r.data || []).map(rem => ({ ...rem, days: rem.days || [] }));
    state.products = pr.data || [];
    state.config = Object.fromEntries((cfg.data || []).map(row => [row.key, row.value]));
}

async function saveConfig(key, value) {
    state.config[key] = value;
    const { error } = await sb.from('gramhub_config').upsert({ key, value });
    if (error) showToast('Save failed — check connection');
}

function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ============ ROUTER ============
function navigate(view) {
    currentView = view;
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.view === view);
    });
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    renderView(view);
}

function renderView(view) {
    const main = document.getElementById('main');
    main.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'view active';
    el.id = `view-${view}`;
    main.appendChild(el);

    if (view === 'dashboard') renderDashboard(el);
    else if (view === 'board') renderBoard(el);
    else if (view === 'calendar') renderCalendar(el);
    else if (view === 'analytics') renderAnalytics(el);
    else if (view === 'library') renderLibrary(el);
    else if (view === 'reminders') renderReminders(el);
    else if (view === 'studio') renderStudio(el);
    else if (view === 'planner') renderPlanner(el);
    else if (view === 'help') renderHelp(el);
}

// ============ DASHBOARD ============
function renderDashboard(el) {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const todayStr = toDateStr(now);
    const todayPosts = state.posts.filter(p => p.scheduledDate === todayStr && p.status !== 'posted');
    const readyPosts = state.posts.filter(p => p.status === 'ready');
    const thisWeek = getWeekPosts();
    const postedPosts = state.posts.filter(p => p.status === 'posted');

    const avgEngagement = postedPosts.length
        ? Math.round(postedPosts.reduce((s, p) => s + ((p.analytics?.likes || 0) + (p.analytics?.comments || 0)), 0) / postedPosts.length)
        : 0;
    const shopPosts = state.posts.filter(p => p.taggedProduct?.name);

    const tip = TIPS[Math.floor(Math.random() * TIPS.length)];

    el.innerHTML = `
        <div class="dash-greeting">
            <h1>${greeting}, <span>Ron.</span></h1>
            <div class="dash-date">${dateStr}</div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Posts</div>
                <div class="stat-value grad">${state.posts.length}</div>
                <div class="stat-sub">all time</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Posted</div>
                <div class="stat-value grad">${postedPosts.length}</div>
                <div class="stat-sub">went live</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Ready to Post</div>
                <div class="stat-value grad">${readyPosts.length}</div>
                <div class="stat-sub">in the queue</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Avg Engagement</div>
                <div class="stat-value grad">${avgEngagement}</div>
                <div class="stat-sub">likes + comments</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Shop Posts</div>
                <div class="stat-value grad">${shopPosts.length}</div>
                <div class="stat-sub">products tagged</div>
            </div>
        </div>

        <div class="dash-cols">
            <div>
                <div class="dash-section-title">📅 Today's Schedule</div>
                ${todayPosts.length
                    ? todayPosts.map(p => dashPostItem(p)).join('')
                    : `<div class="empty-state"><span class="empty-state-icon">😴</span>Nothing scheduled for today.<br><a href="#" onclick="openPostModal()" style="color: var(--purple);">Add a post idea</a></div>`
                }

                ${(() => {
                    const needsStats = state.posts.filter(p => p.status === 'posted' && !p.analytics?.likes);
                    return needsStats.length ? `
                        <div class="dash-section-title mt-16" style="color:var(--orange)">🔴 Log Your Stats (${needsStats.length})</div>
                        ${needsStats.slice(0,3).map(p => `
                            <div class="dash-post-item" style="border-color:rgba(252,176,69,0.4)" data-id="${p.id}" onclick="event.stopPropagation();openAnalyticsModal('${p.id}')">
                                <div class="dash-post-type">${TYPE_ICONS[p.type]||'📝'}</div>
                                <div class="dash-post-info">
                                    <div class="dash-post-title">${esc(p.title)}</div>
                                    <div class="dash-post-meta">Tap to log stats — takes 30 seconds</div>
                                </div>
                                <button class="btn btn-ghost btn-sm" style="flex-shrink:0">Log it</button>
                            </div>`).join('')}
                    ` : '';
                })()}

                <div class="dash-section-title mt-16">✅ Ready to Post</div>
                ${readyPosts.length
                    ? readyPosts.slice(0, 4).map(p => dashPostItem(p)).join('')
                    : `<div class="empty-state"><span class="empty-state-icon">📋</span>Nothing ready yet. Move ideas forward in the <a href="#" onclick="navigate('board')" style="color: var(--purple);">Content Board</a>.</div>`
                }
            </div>
            <div>
                <div class="dash-section-title">⚡ Quick Actions</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">
                    <button class="btn btn-primary" onclick="openPostModal()">+ New Idea</button>
                    <button class="btn btn-ghost" onclick="navigate('board')">View Board</button>
                    <button class="btn btn-ghost" onclick="navigate('calendar')">Calendar</button>
                </div>

                <div class="dash-section-title">💡 Pro Tip</div>
                <div class="tip-card">
                    <div class="tip-title">${tip.title}</div>
                    <div class="tip-text">${tip.text}</div>
                </div>

                <div class="dash-section-title mt-16">📅 This Week</div>
                ${thisWeek.length
                    ? thisWeek.map(p => dashPostItem(p)).join('')
                    : `<div class="empty-state"><span class="empty-state-icon">📆</span>Nothing scheduled this week yet.</div>`
                }
            </div>
        </div>
    `;

    el.querySelectorAll('.dash-post-item').forEach(item => {
        item.addEventListener('click', () => openPostModal(item.dataset.id));
    });
}

function dashPostItem(p) {
    const icon = TYPE_ICONS[p.type] || '📝';
    const dateLabel = p.scheduledDate ? formatDateLabel(p.scheduledDate) : '';
    const timeLabel = p.scheduledTime ? ` @ ${formatTime(p.scheduledTime)}` : '';
    return `
        <div class="dash-post-item" data-id="${p.id}">
            <div class="dash-post-type">${icon}</div>
            <div class="dash-post-info">
                <div class="dash-post-title">${esc(p.title)}</div>
                <div class="dash-post-meta">${dateLabel}${timeLabel} · <span class="badge badge-${p.status}" style="vertical-align:middle">${p.status}</span></div>
            </div>
        </div>
    `;
}

function getWeekPosts() {
    const now = new Date();
    const start = new Date(now); start.setDate(now.getDate() - now.getDay());
    const end = new Date(start); end.setDate(start.getDate() + 6);
    return state.posts.filter(p => {
        if (!p.scheduledDate) return false;
        const d = new Date(p.scheduledDate + 'T00:00:00');
        return d >= start && d <= end;
    });
}

// ============ BOARD ============
function renderBoard(el) {
    el.innerHTML = `
        <div class="view-header">
            <div>
                <div class="view-title">Content Board</div>
                <div class="view-sub">Drag cards between columns to update status</div>
            </div>
            <button class="btn btn-primary" onclick="openPostModal()">+ New Idea</button>
        </div>
        <div class="board-wrap" id="board-wrap"></div>
    `;

    const wrap = el.querySelector('#board-wrap');
    ['idea','drafting','ready','posted'].forEach(status => {
        const posts = state.posts.filter(p => p.status === status);
        const col = document.createElement('div');
        col.className = 'board-col';
        col.dataset.status = status;
        col.innerHTML = `
            <div class="board-col-header">
                <div class="board-col-title">
                    ${STATUS_LABELS[status]}
                    <span class="col-count">${posts.length}</span>
                </div>
                <button class="btn btn-ghost btn-sm btn-icon" onclick="openPostModal(null, '${status}')" title="Add to this column">+</button>
            </div>
            <div class="board-col-body" id="col-${status}">
                ${posts.length ? posts.map(postCard).join('') : `<div class="empty-state" style="padding:20px 10px;font-size:12px;">Drop cards here</div>`}
            </div>
        `;
        wrap.appendChild(col);
    });

    initDragDrop();
}

function parseReelNotes(notes) {
    if (!notes) return {};
    try { const p = JSON.parse(notes); return typeof p === 'object' ? p : {}; } catch(e) { return { shots: notes }; }
}

function postCard(p) {
    const icon = TYPE_ICONS[p.type] || '📝';
    const dateStr = p.scheduledDate ? `<span class="post-date">${formatDateLabel(p.scheduledDate)}</span>` : '';
    const isReel = p.type === 'reel';
    const reelNotes = isReel ? parseReelNotes(p.notes) : {};
    const reelPreview = isReel && (reelNotes.shots || reelNotes.audio) ? `
        <div class="post-card-reel-notes">
            ${reelNotes.shots ? `<div class="reel-note-row">🎬 <span>${esc(reelNotes.shots.slice(0,80))}${reelNotes.shots.length>80?'…':''}</span></div>` : ''}
            ${reelNotes.audio ? `<div class="reel-note-row">🎵 <span>${esc(reelNotes.audio)}</span></div>` : ''}
        </div>` : '';
    const hasActions = p.caption || p.hashtags || p.slides?.length;
    return `
        <div class="post-card" draggable="true" data-id="${p.id}">
            <div class="post-card-top">
                <div class="post-card-title">${esc(p.title)}</div>
                <div class="post-card-actions">
                    <button class="post-card-btn" onclick="event.stopPropagation();openPostModal('${p.id}')" title="Edit">✏️</button>
                    <button class="post-card-btn" onclick="event.stopPropagation();editInStudio('${p.id}')" title="Edit in Studio">🎨</button>
                    <button class="post-card-btn" onclick="event.stopPropagation();deletePost('${p.id}')" title="Delete">🗑️</button>
                </div>
            </div>
            ${p.caption ? `<div class="post-card-caption">${esc(p.caption.slice(0,100))}${p.caption.length>100?'…':''}</div>` : ''}
            ${reelPreview}
            ${hasActions ? `
            <div class="post-card-copy-bar">
                ${p.caption ? `<button class="copy-btn" onclick="event.stopPropagation();copyToClipboard(${JSON.stringify(p.caption)});showToast('Caption copied 📋')" title="Copy caption">📋 Caption</button>` : ''}
                ${p.hashtags ? `<button class="copy-btn" onclick="event.stopPropagation();copyToClipboard(${JSON.stringify(p.hashtags)});showToast('Hashtags copied')" title="Copy hashtags">🏷️ Tags</button>` : ''}
                ${p.slides?.length ? `<button class="copy-btn" onclick="event.stopPropagation();downloadPostImage(${JSON.stringify(p.slides[0])})" title="Download image">⬇️ Image</button>` : ''}
            </div>` : ''}
            <div class="post-card-footer">
                <span class="badge badge-${p.type}">${icon} ${p.type}</span>
                ${p.taggedProduct?.name ? `<span class="badge" style="background:rgba(52,199,89,0.15);color:#34c759">🛍️ ${esc(p.taggedProduct.name)}</span>` : ''}
                ${p.status === 'posted' ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openAnalyticsModal('${p.id}')">📊 Log stats</button>` : dateStr}
            </div>
        </div>
    `;
}

window.downloadPostImage = function(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'post-image.jpg';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 100);
};

function initDragDrop() {
    let dragId = null;

    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('dragstart', e => {
            dragId = card.dataset.id;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });

    document.querySelectorAll('.board-col-body').forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault();
            col.classList.add('drag-over');
        });
        col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
        col.addEventListener('drop', e => {
            e.preventDefault();
            col.classList.remove('drag-over');
            if (!dragId) return;
            const newStatus = col.id.replace('col-', '');
            const post = state.posts.find(p => p.id === dragId);
            if (post && post.status !== newStatus) {
                post.status = newStatus;
                if (newStatus === 'posted' && !post.postedDate) post.postedDate = toDateStr(new Date());
                sb.from('gramhub_posts').upsert(postToDb(post)).then(({error}) => { if(error) showToast('Save failed — check connection'); });
                renderView('board');
                if (newStatus === 'posted') {
                    setTimeout(() => openAnalyticsModal(post.id), 200);
                } else {
                    showToast(`Moved to ${STATUS_LABELS[newStatus]}`);
                }
            }
            dragId = null;
        });
    });
}

function deletePost(id) {
    state.posts = state.posts.filter(p => p.id !== id);
    sb.from('gramhub_posts').delete().eq('id', id).then(({error}) => { if(error) showToast('Delete failed — check connection'); });
    renderView(currentView);
    showToast('Post deleted');
}

// ============ CALENDAR ============
function renderCalendar(el) {
    el.innerHTML = `
        <div class="view-header">
            <div>
                <div class="view-title">Calendar</div>
                <div class="view-sub">Click any day to schedule a post</div>
            </div>
            <button class="btn btn-primary" onclick="openPostModal()">+ New Post</button>
        </div>
        <div class="cal-nav">
            <button class="btn btn-ghost btn-sm" id="cal-prev">← Prev</button>
            <div class="cal-month" id="cal-month-label">${MONTHS[calMonth]} ${calYear}</div>
            <button class="btn btn-ghost btn-sm" id="cal-next">Next →</button>
        </div>
        <div class="cal-grid" id="cal-grid"></div>
    `;

    el.querySelector('#cal-prev').addEventListener('click', () => {
        calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
        renderView('calendar');
    });
    el.querySelector('#cal-next').addEventListener('click', () => {
        calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
        renderView('calendar');
    });

    buildCalGrid(el.querySelector('#cal-grid'));
}

function buildCalGrid(grid) {
    const today = new Date();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const prevDays = new Date(calYear, calMonth, 0).getDate();

    DAYS.forEach(d => {
        const h = document.createElement('div');
        h.className = 'cal-day-header';
        h.textContent = d;
        grid.appendChild(h);
    });

    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        let day, month, year, isOther = false;

        if (i < firstDay) {
            day = prevDays - firstDay + i + 1;
            month = calMonth - 1; year = calYear;
            if (month < 0) { month = 11; year--; }
            isOther = true;
        } else if (i >= firstDay + daysInMonth) {
            day = i - firstDay - daysInMonth + 1;
            month = calMonth + 1; year = calYear;
            if (month > 11) { month = 0; year++; }
            isOther = true;
        } else {
            day = i - firstDay + 1;
            month = calMonth; year = calYear;
        }

        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

        if (isOther) cell.classList.add('other-month');
        if (isToday) cell.classList.add('today');

        const dayPosts = state.posts.filter(p => p.scheduledDate === dateStr);

        cell.innerHTML = `<div class="cal-day-num">${day}</div>` +
            dayPosts.map(p => `<span class="cal-post-dot" data-id="${p.id}" title="${esc(p.title)}">${TYPE_ICONS[p.type] || '📝'} ${esc(p.title)}</span>`).join('');

        cell.addEventListener('click', e => {
            if (e.target.classList.contains('cal-post-dot')) {
                openPostModal(e.target.dataset.id);
            } else {
                openPostModal(null, null, dateStr);
            }
        });

        grid.appendChild(cell);
    }
}

// ============ ANALYTICS ============
function renderAnalytics(el) {
    const posted = state.posts.filter(p => p.status === 'posted' && p.analytics);

    el.innerHTML = `
        <div class="view-header">
            <div>
                <div class="view-title">Analytics</div>
                <div class="view-sub">Log stats after each post to track what's working</div>
            </div>
        </div>
        <div class="analytics-grid">
            <div class="chart-card">
                <div class="chart-title">Engagement Over Time (Likes + Comments)</div>
                <canvas id="chart-timeline" height="200"></canvas>
            </div>
            <div class="chart-card">
                <div class="chart-title">Avg Engagement by Post Type</div>
                <canvas id="chart-type" height="200"></canvas>
            </div>
        </div>
        <div class="card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                <div class="dash-section-title" style="margin:0">Posted Content</div>
            </div>
            ${posted.length ? `
            <table class="analytics-table">
                <thead><tr>
                    <th>Post</th><th>Type</th><th>Date</th>
                    <th>❤️ Likes</th><th>💬 Comments</th><th>👁️ Reach</th><th>🔖 Saves</th><th>Actions</th>
                </tr></thead>
                <tbody>
                    ${posted.sort((a,b) => (b.postedDate||'') > (a.postedDate||'') ? 1 : -1).map(p => `
                    <tr>
                        <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600">${esc(p.title)}</td>
                        <td><span class="badge badge-${p.type}">${TYPE_ICONS[p.type]} ${p.type}</span></td>
                        <td style="color:var(--text2)">${p.postedDate ? formatDateLabel(p.postedDate) : '—'}</td>
                        <td class="num-cell">${p.analytics?.likes ?? '—'}</td>
                        <td class="num-cell">${p.analytics?.comments ?? '—'}</td>
                        <td class="num-cell">${p.analytics?.reach ?? '—'}</td>
                        <td class="num-cell">${p.analytics?.saves ?? '—'}</td>
                        <td><button class="btn btn-ghost btn-sm" onclick="openAnalyticsModal('${p.id}')">Update</button></td>
                    </tr>`).join('')}
                </tbody>
            </table>` : `<div class="empty-state"><span class="empty-state-icon">📊</span>No posted content yet. Mark posts as Posted in the board to track analytics.</div>`}
        </div>
    `;

    const shopPosted = posted.filter(p => p.taggedProduct?.name);
    if (shopPosted.length) {
        el.innerHTML += `
        <div class="card" style="margin-top:20px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                <div class="dash-section-title" style="margin:0">🛍️ Shop Post Performance</div>
                <div style="font-size:12px;color:var(--text3)">Posts with tagged products</div>
            </div>
            <table class="analytics-table">
                <thead><tr>
                    <th>Product</th><th>Post</th><th>Type</th><th>Date</th>
                    <th>❤️ Likes</th><th>💬 Comments</th><th>👁️ Reach</th>
                </tr></thead>
                <tbody>
                    ${shopPosted.sort((a,b) => {
                        const ea = (a.analytics?.likes||0)+(a.analytics?.comments||0);
                        const eb = (b.analytics?.likes||0)+(b.analytics?.comments||0);
                        return eb - ea;
                    }).map(p => `
                    <tr>
                        <td style="font-weight:600;color:#34c759">
                            ${p.taggedProduct.url
                                ? `<a href="${esc(p.taggedProduct.url)}" target="_blank" style="color:#34c759;text-decoration:none">${esc(p.taggedProduct.name)} ↗</a>`
                                : esc(p.taggedProduct.name)}
                        </td>
                        <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.title)}</td>
                        <td><span class="badge badge-${p.type}">${TYPE_ICONS[p.type]} ${p.type}</span></td>
                        <td style="color:var(--text2)">${p.postedDate ? formatDateLabel(p.postedDate) : '—'}</td>
                        <td class="num-cell">${p.analytics?.likes ?? '—'}</td>
                        <td class="num-cell">${p.analytics?.comments ?? '—'}</td>
                        <td class="num-cell">${p.analytics?.reach ?? '—'}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    }

    if (posted.length) {
        renderCharts(posted);
    }
}

function renderCharts(posted) {
    const sorted = posted.filter(p => p.postedDate).sort((a,b) => a.postedDate > b.postedDate ? 1 : -1).slice(-12);

    const timeCtx = document.getElementById('chart-timeline');
    if (timeCtx) {
        if (analyticsCharts.timeline) analyticsCharts.timeline.destroy();
        analyticsCharts.timeline = new Chart(timeCtx, {
            type: 'line',
            data: {
                labels: sorted.map(p => formatDateLabel(p.postedDate)),
                datasets: [{
                    label: 'Engagement',
                    data: sorted.map(p => (p.analytics?.likes || 0) + (p.analytics?.comments || 0)),
                    borderColor: '#833ab4',
                    backgroundColor: 'rgba(131,58,180,0.12)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fd1d1d',
                    pointRadius: 4,
                }]
            },
            options: chartOptions()
        });
    }

    const typeCtx = document.getElementById('chart-type');
    if (typeCtx) {
        const types = ['photo','reel','story','carousel'];
        const avgs = types.map(t => {
            const items = posted.filter(p => p.type === t && p.analytics);
            if (!items.length) return 0;
            return Math.round(items.reduce((s,p) => s + (p.analytics?.likes || 0) + (p.analytics?.comments || 0), 0) / items.length);
        });
        if (analyticsCharts.type) analyticsCharts.type.destroy();
        analyticsCharts.type = new Chart(typeCtx, {
            type: 'bar',
            data: {
                labels: ['Photo', 'Reel', 'Story', 'Carousel'],
                datasets: [{
                    label: 'Avg Engagement',
                    data: avgs,
                    backgroundColor: ['rgba(10,132,255,0.6)','rgba(131,58,180,0.6)','rgba(52,199,89,0.6)','rgba(255,214,10,0.6)'],
                    borderRadius: 6,
                }]
            },
            options: chartOptions(false)
        });
    }
}

function chartOptions(showLegend = true) {
    return {
        responsive: true,
        plugins: {
            legend: { display: showLegend, labels: { color: '#a0a0a8', font: { size: 12 } } }
        },
        scales: {
            x: { ticks: { color: '#606068', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#606068', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
    };
}

// ============ LIBRARY ============
function renderLibrary(el) {
    el.innerHTML = `
        <div class="view-header">
            <div class="view-title">Library</div>
        </div>

        <div class="lib-section">
            <div class="lib-section-header">
                <div class="lib-section-title">🛍️ Featured Products</div>
                <button class="btn btn-primary btn-sm" onclick="openProductModal()">+ Add Product</button>
            </div>
            <div class="lib-grid" id="product-grid">
                ${state.products.length
                    ? state.products.map(productCard).join('')
                    : `<div class="empty-state"><span class="empty-state-icon">🛍️</span>Save products you feature often.<br>Pick them quickly when creating posts.</div>`
                }
            </div>
        </div>

        <div class="divider"></div>

        <div class="lib-section">
            <div class="lib-section-header">
                <div class="lib-section-title">#️⃣ Hashtag Sets</div>
                <button class="btn btn-primary btn-sm" onclick="openHashtagModal()">+ New Set</button>
            </div>
            <div class="lib-grid" id="hashtag-grid">
                ${state.hashtagSets.length
                    ? state.hashtagSets.map(hashtagCard).join('')
                    : `<div class="empty-state"><span class="empty-state-icon">#️⃣</span>Save hashtag sets you use often.<br>No more typing them every time.</div>`
                }
            </div>
        </div>

        <div class="divider"></div>

        <div class="lib-section">
            <div class="lib-section-header">
                <div class="lib-section-title">📝 Caption Templates</div>
                <button class="btn btn-primary btn-sm" onclick="openCaptionModal()">+ New Template</button>
            </div>
            <div class="lib-grid" id="caption-grid">
                ${state.captionTemplates.length
                    ? state.captionTemplates.map(captionCard).join('')
                    : `<div class="empty-state"><span class="empty-state-icon">📝</span>Save caption formats you like.<br>Copy and customize for each post.</div>`
                }
            </div>
        </div>
    `;
}

function hashtagCard(set) {
    return `
        <div class="lib-card">
            <div class="lib-card-name">${esc(set.name)}</div>
            <div class="lib-card-body">${esc(set.hashtags)}</div>
            <div class="lib-card-actions">
                <button class="btn btn-ghost btn-sm" onclick="copyToClipboard('${esc(set.hashtags)}')">📋 Copy</button>
                <button class="btn btn-ghost btn-sm" onclick="openHashtagModal('${set.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteHashtag('${set.id}')">✕</button>
            </div>
        </div>
    `;
}

function captionCard(tmpl) {
    return `
        <div class="lib-card">
            <div class="lib-card-name">${esc(tmpl.name)}</div>
            <div class="lib-card-body" style="white-space:pre-wrap">${esc(tmpl.content)}</div>
            <div class="lib-card-actions">
                <button class="btn btn-ghost btn-sm" onclick="copyToClipboard(${JSON.stringify(tmpl.content)})">📋 Copy</button>
                <button class="btn btn-ghost btn-sm" onclick="openCaptionModal('${tmpl.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCaption('${tmpl.id}')">✕</button>
            </div>
        </div>
    `;
}

function deleteHashtag(id) {
    state.hashtagSets = state.hashtagSets.filter(s => s.id !== id);
    sb.from('gramhub_hashtag_sets').delete().eq('id', id).then(({error}) => { if(error) showToast('Delete failed — check connection'); });
    renderView('library');
    showToast('Deleted');
}

function deleteCaption(id) {
    state.captionTemplates = state.captionTemplates.filter(t => t.id !== id);
    sb.from('gramhub_caption_templates').delete().eq('id', id).then(({error}) => { if(error) showToast('Delete failed — check connection'); });
    renderView('library');
    showToast('Deleted');
}

// ============ PRODUCTS ============
function productCard(pr) {
    return `
        <div class="lib-card">
            <div class="lib-card-name">${esc(pr.name)}</div>
            ${pr.sku ? `<div style="font-size:11px;color:var(--text3);margin-bottom:4px">SKU: ${esc(pr.sku)}</div>` : ''}
            ${pr.url ? `<div class="lib-card-body"><a href="${esc(pr.url)}" target="_blank" style="color:var(--purple);font-size:12px;text-decoration:none">View product ↗</a></div>` : ''}
            <div class="lib-card-actions">
                <button class="btn btn-ghost btn-sm" onclick="openProductModal('${pr.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${pr.id}')">✕</button>
            </div>
        </div>
    `;
}

function openProductModal(id = null) {
    const pr = id ? state.products.find(p => p.id === id) : null;
    const body = `
        <div class="form-group">
            <label class="form-label">Product Name *</label>
            <input class="form-input" id="p-name" placeholder="e.g. Project Mu NS brake pads" value="${esc(pr?.name || '')}">
        </div>
        <div class="form-group">
            <label class="form-label">Product URL</label>
            <input class="form-input" id="p-url" placeholder="https://enjukuracing.com/products/..." value="${esc(pr?.url || '')}">
        </div>
        <div class="form-group">
            <label class="form-label">SKU <span style="color:var(--text3);font-weight:400">(optional)</span></label>
            <input class="form-input" id="p-sku" placeholder="e.g. PM-NS-BF5-F" value="${esc(pr?.sku || '')}">
        </div>
    `;
    openModal(pr ? 'Edit Product' : 'Add Product', body, function() {
        const name = document.getElementById('p-name').value.trim();
        const url = document.getElementById('p-url').value.trim();
        const sku = document.getElementById('p-sku').value.trim();
        if (!name) { showToast('Product name required'); return; }
        if (pr) {
            const existing = state.products.find(p => p.id === id);
            existing.name = name; existing.url = url; existing.sku = sku;
            sb.from('gramhub_products').upsert({ id: existing.id, name, url, sku }).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        } else {
            const newPr = { id: genId(), name, url, sku };
            state.products.push(newPr);
            sb.from('gramhub_products').insert(newPr).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        }
        closeModal();
        renderView('library');
        showToast('Product saved 🛍️');
    });
}

function deleteProduct(id) {
    state.products = state.products.filter(p => p.id !== id);
    sb.from('gramhub_products').delete().eq('id', id).then(({error}) => { if(error) showToast('Delete failed — check connection'); });
    renderView('library');
    showToast('Product removed');
}

window.fillProductFromLibrary = function() {
    const sel = document.getElementById('f-product-select');
    if (!sel || !sel.value) return;
    const pr = state.products.find(p => p.id === sel.value);
    if (pr) {
        const nameEl = document.getElementById('f-product-name');
        const urlEl = document.getElementById('f-product-url');
        if (nameEl) nameEl.value = pr.name;
        if (urlEl) urlEl.value = pr.url || '';
    }
};

window.initCatalogSearch = async function() {
    if (catalog) return;
    const searchEl = document.getElementById('f-product-search') || document.getElementById('st-product-search');
    if (searchEl) searchEl.placeholder = 'Loading catalog...';
    await loadCatalog();
    if (searchEl) searchEl.placeholder = 'Search by SKU or product name...';
};

let _postMatches = [];

window.searchCatalog = function(query) {
    const results = document.getElementById('f-catalog-results');
    if (!results) return;
    const q = query.trim().toLowerCase();
    if (!q || !catalog || q.length < 2) { results.style.display = 'none'; return; }

    _postMatches = [];
    for (const item of catalog) {
        if (_postMatches.length >= 8) break;
        if (item.s.toLowerCase().includes(q) || item.n.toLowerCase().includes(q)) {
            _postMatches.push(item);
        }
    }

    if (!_postMatches.length) { results.style.display = 'none'; return; }
    results.style.display = 'block';
    results.innerHTML = _postMatches.map((item, i) => `
        <div onclick="selectCatalogProductByIndex(${i})"
            style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border)"
            onmouseover="this.style.background='rgba(131,58,180,0.1)'" onmouseout="this.style.background=''">
            <span style="color:var(--purple);font-weight:600">${esc(item.s)}</span>
            <span style="color:var(--text2);margin-left:8px">${esc(item.n)}</span>
        </div>
    `).join('');
};

window.selectCatalogProductByIndex = function(i) {
    const item = _postMatches[i];
    if (item) selectCatalogProduct(item.s, item.n, item.u);
};

window.selectCatalogProduct = function(sku, name, url) {
    document.getElementById('f-product-name').value = name;
    document.getElementById('f-product-url').value = url;
    document.getElementById('f-product-search').value = name;
    document.getElementById('f-catalog-results').style.display = 'none';
    const sel = document.getElementById('f-product-selected');
    if (sel) {
        sel.style.display = 'block';
        sel.innerHTML = `🛍️ <strong>${esc(sku)}</strong> — ${esc(name)} — <a href="${esc(url)}" target="_blank" style="color:#34c759">view ↗</a>
            <button onclick="clearProductTag()" style="background:none;border:none;color:var(--text3);cursor:pointer;float:right">✕ clear</button>`;
        sel.style.cssText += ';padding:6px 10px;background:rgba(52,199,89,0.1);border-radius:6px;font-size:12px;color:#34c759;margin-top:6px;';
    }
};

window.clearProductTag = function() {
    document.getElementById('f-product-name').value = '';
    document.getElementById('f-product-url').value = '';
    document.getElementById('f-product-search').value = '';
    const sel = document.getElementById('f-product-selected');
    if (sel) sel.style.display = 'none';
};

// ============ REMINDERS ============
function renderReminders(el) {
    const emailVal = esc(state.config['notification_email'] || '');
    const tzVal = esc(state.config['timezone'] || Intl.DateTimeFormat().resolvedOptions().timeZone);
    el.innerHTML = `
        <div class="view-header">
            <div>
                <div class="view-title">Reminders</div>
                <div class="view-sub">Email notifications — works even when the tab is closed</div>
            </div>
            <button class="btn btn-primary" onclick="openReminderModal()">+ New Reminder</button>
        </div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 20px;margin-bottom:18px">
            <div style="font-size:13px;font-weight:600;margin-bottom:12px">📧 Email Notifications</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
                <div class="form-group" style="margin:0;flex:1;min-width:200px">
                    <label class="form-label">Notification Email</label>
                    <input class="form-input" id="cfg-email" type="email" placeholder="you@example.com" value="${emailVal}">
                </div>
                <div class="form-group" style="margin:0;flex:1;min-width:200px">
                    <label class="form-label">Your Timezone</label>
                    <input class="form-input" id="cfg-tz" placeholder="America/New_York" value="${tzVal}">
                </div>
                <button class="btn btn-primary" style="white-space:nowrap" onclick="saveNotifConfig()">Save</button>
            </div>
            <div style="font-size:11px;color:var(--text3);margin-top:8px">Reminders fire via a server-side email — no need to keep the tab open. Requires the Supabase Edge Function to be deployed (see setup guide).</div>
        </div>
        <div class="reminder-list" id="reminder-list">
            ${state.reminders.length
                ? state.reminders.map(reminderItem).join('')
                : `<div class="empty-state"><span class="empty-state-icon">🔔</span>No reminders yet.<br>Set one so you never forget to post.</div>`
            }
        </div>
    `;
}

window.saveNotifConfig = async function() {
    const email = document.getElementById('cfg-email').value.trim();
    const tz = document.getElementById('cfg-tz').value.trim();
    if (!email) { showToast('Enter an email address'); return; }
    if (!tz) { showToast('Enter a timezone'); return; }
    await saveConfig('notification_email', email);
    await saveConfig('timezone', tz);
    showToast('Notification settings saved 📧');
};

function reminderItem(r) {
    const allDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return `
        <div class="reminder-item">
            <div class="reminder-time">${formatTime(r.time)}</div>
            <div class="reminder-info">
                <div class="reminder-label">${esc(r.label)}</div>
                <div class="reminder-days">
                    ${allDays.map(d => `<span class="day-chip ${r.days.includes(d) ? '' : 'off'}">${d}</span>`).join('')}
                </div>
            </div>
            <button class="toggle ${r.active ? 'on' : ''}" onclick="toggleReminder('${r.id}')" title="${r.active ? 'Disable' : 'Enable'}"></button>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="openReminderModal('${r.id}')" title="Edit">✏️</button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="deleteReminder('${r.id}')" title="Delete">🗑️</button>
        </div>
    `;
}

function toggleReminder(id) {
    const r = state.reminders.find(r => r.id === id);
    if (r) {
        r.active = !r.active;
        sb.from('gramhub_reminders').update({ active: r.active }).eq('id', id).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        renderView('reminders');
    }
}

function deleteReminder(id) {
    state.reminders = state.reminders.filter(r => r.id !== id);
    sb.from('gramhub_reminders').delete().eq('id', id).then(({error}) => { if(error) showToast('Delete failed — check connection'); });
    renderView('reminders');
    showToast('Reminder deleted');
}

// ============ MODALS ============
let _modalSaveCallback = null;

function openModal(title, bodyHtml, onSave, saveLabel = 'Save') {
    _modalSaveCallback = onSave;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-footer').innerHTML = `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="if(_modalSaveCallback) _modalSaveCallback()">💾 ${saveLabel}</button>
    `;
    document.getElementById('modal-backdrop').classList.remove('hidden');
}

function closeModal() {
    _modalSaveCallback = null;
    document.getElementById('modal-backdrop').classList.add('hidden');
}

function openPostModal(id = null, defaultStatus = 'idea', defaultDate = null) {
    const post = id ? state.posts.find(p => p.id === id) : null;
    const title = post ? 'Edit Post' : 'New Post Idea';
    const types = ['photo','reel','story','carousel'];
    const statuses = ['idea','drafting','ready','posted'];
    const isReel = (post?.type || 'photo') === 'reel';
    const rn = isReel ? parseReelNotes(post?.notes) : {};
    const generalNotes = !isReel ? (post?.notes || '') : '';

    const hashtagOptions = state.hashtagSets.length
        ? `<div class="form-hint" style="margin-top:4px">Quick insert: ${state.hashtagSets.map(s => `<a href="#" style="color:var(--purple);margin-right:6px" onclick="event.preventDefault();insertHashtags('${esc(s.hashtags)}')">${esc(s.name)}</a>`).join('')}</div>`
        : '';

    const body = `
        <div class="form-group">
            <label class="form-label">Post Title / Idea *</label>
            <input class="form-input" id="f-title" placeholder="e.g. Behind the scenes prep for weekend event" value="${esc(post?.title || '')}">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Post Type</label>
                <select class="form-select" id="f-type" onchange="toggleReelNotes(this.value)">
                    ${types.map(t => `<option value="${t}" ${(post?.type||'photo')===t?'selected':''}>${TYPE_ICONS[t]} ${t.charAt(0).toUpperCase()+t.slice(1)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-select" id="f-status">
                    ${statuses.map(s => `<option value="${s}" ${(post?.status||defaultStatus)===s?'selected':''}>${STATUS_LABELS[s]}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Caption Draft</label>
            <textarea class="form-textarea" id="f-caption" placeholder="Write your caption here... (optional at idea stage)">${esc(post?.caption || '')}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Hashtags</label>
            <textarea class="form-textarea" id="f-hashtags" style="min-height:60px" placeholder="#yourhashtags #here">${esc(post?.hashtags || '')}</textarea>
            ${hashtagOptions}
        </div>
        <div class="form-group" id="f-notes-wrap">
            <label class="form-label">Image / Content Notes</label>
            <textarea class="form-textarea" id="f-notes" placeholder="Which photo to use, references, reminders..." style="min-height:60px">${esc(generalNotes)}</textarea>
        </div>
        <div id="f-reel-notes" style="display:${isReel ? 'block' : 'none'}">
            <div class="reel-notes-header">🎬 Reel Shot Planner</div>
            <div class="form-group">
                <label class="form-label">Shot List</label>
                <textarea class="form-textarea" id="f-shots" placeholder="Every shot you need to capture — wide, close-up, action, b-roll..." style="min-height:80px">${esc(rn.shots||'')}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Audio / Sound</label>
                <input class="form-input" id="f-audio" placeholder="Trending sound name, original audio, voiceover idea..." value="${esc(rn.audio||'')}">
            </div>
            <div class="form-group">
                <label class="form-label">Editing Notes</label>
                <textarea class="form-textarea" id="f-edit-notes" placeholder="Hook idea, pacing, transitions, effects, target length..." style="min-height:60px">${esc(rn.edit||'')}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">B-Roll / Extra Shots</label>
                <input class="form-input" id="f-broll" placeholder="Supporting footage — shop environment, tools, team, atmosphere..." value="${esc(rn.broll||'')}">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">🛍️ Tagged Product <span style="color:var(--text3);font-weight:400">(optional — for shoppable posts)</span></label>
            <input class="form-input" id="f-product-search" placeholder="Search by SKU or product name..." autocomplete="off"
                value="${esc(post?.taggedProduct?.name || '')}"
                oninput="searchCatalog(this.value)" onfocus="initCatalogSearch()">
            <div id="f-catalog-results" style="display:none;background:var(--card);border:1px solid var(--border);border-radius:8px;max-height:180px;overflow-y:auto;margin-top:4px;font-size:13px"></div>
            <input type="hidden" id="f-product-name" value="${esc(post?.taggedProduct?.name || '')}">
            <input type="hidden" id="f-product-url" value="${esc(post?.taggedProduct?.url || '')}">
            ${post?.taggedProduct?.name ? `<div id="f-product-selected" style="margin-top:6px;padding:6px 10px;background:rgba(52,199,89,0.1);border-radius:6px;font-size:12px;color:#34c759">
                🛍️ ${esc(post.taggedProduct.name)} — <a href="${esc(post.taggedProduct.url)}" target="_blank" style="color:#34c759">view ↗</a>
                <button onclick="clearProductTag()" style="background:none;border:none;color:var(--text3);cursor:pointer;float:right">✕ clear</button>
            </div>` : '<div id="f-product-selected" style="display:none"></div>'}
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Schedule Date</label>
                <input class="form-input" type="date" id="f-date" value="${post?.scheduledDate || defaultDate || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Schedule Time</label>
                <input class="form-input" type="time" id="f-time" value="${post?.scheduledTime || ''}">
            </div>
        </div>
    `;

    openModal(title, body, function() {
        const titleVal = document.getElementById('f-title').value.trim();
        if (!titleVal) { showToast('Title is required'); return; }

        const productName = (document.getElementById('f-product-name')?.value || '').trim();
        const productUrl = (document.getElementById('f-product-url')?.value || '').trim();
        const newPost = {
            id: post?.id || genId(),
            title: titleVal,
            type: document.getElementById('f-type').value,
            status: document.getElementById('f-status').value,
            caption: document.getElementById('f-caption').value.trim(),
            hashtags: document.getElementById('f-hashtags').value.trim(),
            notes: getPostNotesValue(),
            scheduledDate: document.getElementById('f-date').value,
            scheduledTime: document.getElementById('f-time').value,
            analytics: post?.analytics || null,
            taggedProduct: productName ? { name: productName, url: productUrl } : null,
            postedDate: post?.postedDate || (document.getElementById('f-status').value === 'posted' ? toDateStr(new Date()) : null),
            createdAt: post?.createdAt || new Date().toISOString(),
        };

        if (post) {
            const idx = state.posts.findIndex(p => p.id === post.id);
            state.posts[idx] = newPost;
        } else {
            state.posts.unshift(newPost);
        }

        sb.from('gramhub_posts').upsert(postToDb(newPost)).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        closeModal();
        renderView(currentView);
        showToast(post ? 'Post updated' : 'Idea saved! 💡');
    });
}

window.getPostNotesValue = function() {
    const type = document.getElementById('f-type') ? document.getElementById('f-type').value : '';
    if (type === 'reel') {
        return JSON.stringify({
            shots: (document.getElementById('f-shots') || {value:''}).value.trim(),
            audio: (document.getElementById('f-audio') || {value:''}).value.trim(),
            edit:  (document.getElementById('f-edit-notes') || {value:''}).value.trim(),
            broll: (document.getElementById('f-broll') || {value:''}).value.trim(),
        });
    }
    return (document.getElementById('f-notes') || {value:''}).value.trim();
};

window.toggleReelNotes = function(type) {
    const reelEl = document.getElementById('f-reel-notes');
    const notesEl = document.getElementById('f-notes-wrap');
    if (!reelEl) return;
    reelEl.style.display = type === 'reel' ? 'block' : 'none';
    if (notesEl) notesEl.style.display = type === 'reel' ? 'none' : 'block';
};

window.insertHashtags = function(tags) {
    const el = document.getElementById('f-hashtags');
    if (el) el.value = el.value ? el.value + ' ' + tags : tags;
};

function openAnalyticsModal(id) {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;
    const a = post.analytics || {};

    const statField = (emoji, label, fieldId, val) => `
        <div class="quick-stat-field">
            <div class="quick-stat-label">${emoji} ${label}</div>
            <div class="quick-stat-row">
                <button class="quick-adj" onclick="adjustStat('${fieldId}',-1)">−</button>
                <input class="quick-stat-input" type="number" id="${fieldId}" min="0" value="${val ?? 0}">
                <button class="quick-adj" onclick="adjustStat('${fieldId}',1)">+</button>
            </div>
            <div class="quick-bumps">
                ${[10,50,100,500].map(n=>`<button class="bump-btn" onclick="bumpStat('${fieldId}',${n})">+${n}</button>`).join('')}
            </div>
        </div>
    `;

    const body = `
        <div style="text-align:center;margin-bottom:18px;">
            <div style="font-size:28px;margin-bottom:6px">🎉</div>
            <div style="font-weight:700;font-size:15px">${esc(post.title)}</div>
            <div style="color:var(--text3);font-size:12px;margin-top:4px">Open Instagram, check the post, type what you see.</div>
        </div>
        <div class="quick-stats-grid">
            ${statField('❤️','Likes','a-likes', a.likes)}
            ${statField('💬','Comments','a-comments', a.comments)}
            ${statField('👁️','Reach','a-reach', a.reach)}
        </div>
        <details style="margin-top:14px">
            <summary style="cursor:pointer;font-size:12px;color:var(--text3);user-select:none">More stats (optional)</summary>
            <div class="quick-stats-grid" style="margin-top:12px">
                ${statField('🔖','Saves','a-saves', a.saves)}
                ${statField('↗️','Shares','a-shares', a.shares)}
            </div>
        </details>
    `;

    openModal('How\'d it do?', body, function() {
        const idx = state.posts.findIndex(p => p.id === id);
        state.posts[idx].analytics = {
            likes:    parseInt(document.getElementById('a-likes').value)    || 0,
            comments: parseInt(document.getElementById('a-comments').value) || 0,
            reach:    parseInt(document.getElementById('a-reach').value)    || 0,
            saves:    parseInt(document.getElementById('a-saves').value)    || 0,
            shares:   parseInt(document.getElementById('a-shares').value)   || 0,
        };
        state.posts[idx].postedDate = state.posts[idx].postedDate || toDateStr(new Date());
        state.posts[idx].status = 'posted';
        sb.from('gramhub_posts').upsert(postToDb(state.posts[idx])).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        closeModal();
        renderView(currentView);
        showToast('Stats saved 📊 Nice work!');
    }, 'Save Stats');
}

window.adjustStat = function(id, delta) {
    const el = document.getElementById(id);
    if (el) el.value = Math.max(0, (parseInt(el.value) || 0) + delta);
};

window.bumpStat = function(id, amount) {
    const el = document.getElementById(id);
    if (el) el.value = (parseInt(el.value) || 0) + amount;
};

function openHashtagModal(id = null) {
    const set = id ? state.hashtagSets.find(s => s.id === id) : null;
    const body = `
        <div class="form-group">
            <label class="form-label">Set Name</label>
            <input class="form-input" id="h-name" placeholder="e.g. Car Meet Tags" value="${esc(set?.name || '')}">
        </div>
        <div class="form-group">
            <label class="form-label">Hashtags</label>
            <textarea class="form-textarea" id="h-tags" placeholder="#hashtag1 #hashtag2 #hashtag3" style="min-height:100px">${esc(set?.hashtags || '')}</textarea>
        </div>
    `;
    openModal(set ? 'Edit Hashtag Set' : 'New Hashtag Set', body, function() {
        const name = document.getElementById('h-name').value.trim();
        const tags = document.getElementById('h-tags').value.trim();
        if (!name) { showToast('Name required'); return; }
        if (set) {
            const s = state.hashtagSets.find(s => s.id === id);
            s.name = name; s.hashtags = tags;
            sb.from('gramhub_hashtag_sets').upsert({ id: s.id, name, hashtags: tags }).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        } else {
            const newSet = { id: genId(), name, hashtags: tags };
            state.hashtagSets.push(newSet);
            sb.from('gramhub_hashtag_sets').insert(newSet).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        }
        closeModal();
        renderView('library');
        showToast('Saved #️⃣');
    });
}

function openCaptionModal(id = null) {
    const tmpl = id ? state.captionTemplates.find(t => t.id === id) : null;
    const body = `
        <div class="form-group">
            <label class="form-label">Template Name</label>
            <input class="form-input" id="c-name" placeholder="e.g. Event Recap Caption" value="${esc(tmpl?.name || '')}">
        </div>
        <div class="form-group">
            <label class="form-label">Caption Template</label>
            <textarea class="form-textarea" id="c-content" placeholder="Write your template here..." style="min-height:140px">${esc(tmpl?.content || '')}</textarea>
        </div>
    `;
    openModal(tmpl ? 'Edit Caption' : 'New Caption Template', body, function() {
        const name = document.getElementById('c-name').value.trim();
        const content = document.getElementById('c-content').value.trim();
        if (!name) { showToast('Name required'); return; }
        if (tmpl) {
            const t = state.captionTemplates.find(t => t.id === id);
            t.name = name; t.content = content;
            sb.from('gramhub_caption_templates').upsert({ id: t.id, name, content }).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        } else {
            const newTmpl = { id: genId(), name, content };
            state.captionTemplates.push(newTmpl);
            sb.from('gramhub_caption_templates').insert(newTmpl).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        }
        closeModal();
        renderView('library');
        showToast('Saved 📝');
    });
}

function openReminderModal(id = null) {
    const r = id ? state.reminders.find(r => r.id === id) : null;
    const allDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const body = `
        <div class="form-group">
            <label class="form-label">Label</label>
            <input class="form-input" id="r-label" placeholder="e.g. Time to post!" value="${esc(r?.label || '')}">
        </div>
        <div class="form-group">
            <label class="form-label">Time</label>
            <input class="form-input" type="time" id="r-time" value="${r?.time || '18:00'}">
        </div>
        <div class="form-group">
            <label class="form-label">Days</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
                ${allDays.map(d => `
                    <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:13px">
                        <input type="checkbox" id="r-day-${d}" ${(!r || r.days.includes(d)) ? 'checked' : ''} style="accent-color:var(--purple)">
                        ${d}
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    openModal(r ? 'Edit Reminder' : 'New Reminder', body, function() {
        const label = document.getElementById('r-label').value.trim();
        const time = document.getElementById('r-time').value;
        if (!label || !time) { showToast('Label and time required'); return; }
        const days = allDays.filter(d => document.getElementById(`r-day-${d}`)?.checked);
        if (!days.length) { showToast('Pick at least one day'); return; }
        if (r) {
            const rem = state.reminders.find(rem => rem.id === id);
            rem.label = label; rem.time = time; rem.days = days;
            sb.from('gramhub_reminders').upsert({ id: rem.id, label, time, days, active: rem.active }).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        } else {
            const newRem = { id: genId(), label, time, days, active: true };
            state.reminders.push(newRem);
            sb.from('gramhub_reminders').insert(newRem).then(({error}) => { if(error) showToast('Save failed — check connection'); });
        }
        closeModal();
        renderView('reminders');
        showToast('Reminder set 🔔');
    });
}

// ============ STUDIO ============
let studioSlides = [];
let studioCurrentSlide = 0;
let studioProductImg = '';
let studioProductDesc = '';
let studioEditingPostId = null;

function renderStudio(el) {
    const editPost = studioEditingPostId ? state.posts.find(p => p.id === studioEditingPostId) : null;
    studioSlides = editPost ? [...(editPost.slides || [])] : [];
    studioCurrentSlide = 0;
    studioProductImg = '';
    studioProductDesc = '';
    el.innerHTML = `
        <div class="view-header">
            <div>
                <div class="view-title">Studio</div>
                <div class="view-sub">${editPost ? `Editing: ${esc(editPost.title)}` : 'Build your post — mock it up, then save to the board'}</div>
            </div>
            ${editPost ? `<button class="btn btn-ghost" onclick="studioEditingPostId=null;navigate('board')">← Back to Board</button>` : ''}
        </div>
        <div class="studio-layout">
            <div class="studio-panel">
                <div class="form-group">
                    <label class="form-label">Product Search <span style="color:var(--text3);font-weight:400">(optional — auto-fills image &amp; description)</span></label>
                    <input class="form-input" id="st-product-search" placeholder="Search by SKU or product name..." autocomplete="off"
                        oninput="studioSearchCatalog(this.value)" onfocus="initCatalogSearch()">
                    <div id="st-catalog-results" style="display:none;background:var(--card);border:1px solid var(--border);border-radius:8px;max-height:200px;overflow-y:auto;margin-top:4px;font-size:13px;position:relative;z-index:10"></div>
                    <div id="st-product-desc" style="display:none;margin-top:8px;padding:10px;background:rgba(131,58,180,0.07);border-radius:8px;font-size:12px;color:var(--text2);line-height:1.5"></div>
                    <div id="st-product-images" style="display:none;margin-top:8px"></div>
                </div>

                <div class="form-group">
                    <label class="form-label">Images</label>
                    <div class="studio-upload-zone" id="st-drop-zone" onclick="document.getElementById('st-file-input').click()"
                        ondragover="event.preventDefault();this.classList.add('drag-over')"
                        ondragleave="this.classList.remove('drag-over')"
                        ondrop="event.preventDefault();this.classList.remove('drag-over');studioHandleDrop(event)">
                        <div style="font-size:28px;margin-bottom:6px">📷</div>
                        <div style="font-size:13px;color:var(--text2)">Drag &amp; drop photos here, or <strong style="color:var(--purple)">click to browse</strong></div>
                        <div style="font-size:11px;color:var(--text3);margin-top:4px">JPG, PNG, WebP — multiple OK for carousel</div>
                        <input type="file" id="st-file-input" accept="image/*" multiple style="display:none" onchange="studioHandleFiles(this.files)">
                    </div>
                    <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
                        <input class="form-input" id="st-url-input" placeholder="Or paste an image URL..." style="flex:1">
                        <button class="btn btn-ghost" onclick="studioAddUrl()">Add URL</button>
                    </div>
                    <div id="st-slide-strip" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"></div>
                </div>

                <div class="form-group">
                    <label class="form-label">Caption</label>
                    <textarea class="form-textarea" id="st-caption" placeholder="Write your caption here..." oninput="studioUpdatePreview()" style="min-height:100px"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Hashtags</label>
                    <textarea class="form-textarea" id="st-hashtags" placeholder="#yourhashtags #here" oninput="studioUpdatePreview()" style="min-height:60px"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex:1">
                        <label class="form-label">Save as</label>
                        <select class="form-select" id="st-status">
                            <option value="idea">💡 Idea</option>
                            <option value="drafting">✏️ Drafting</option>
                            <option value="ready" selected>✅ Ready</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex:1">
                        <label class="form-label">Schedule Date</label>
                        <input class="form-input" type="date" id="st-date">
                    </div>
                </div>
                <button class="btn btn-primary" style="width:100%;margin-top:4px" onclick="studioSave()">${editPost ? '💾 Update Post' : '💾 Save to Board'}</button>
            </div>

            <div class="studio-preview-panel">
                <div style="text-align:center;margin-bottom:12px;font-size:13px;color:var(--text3)">Live Preview</div>
                <div class="ig-phone">
                    <div class="ig-mockup" id="ig-mockup">
                        <div class="ig-header">
                            <div class="ig-avatar">E</div>
                            <span class="ig-username">enjukuracing</span>
                            <span class="ig-more">•••</span>
                        </div>
                        <div class="ig-image-wrap" id="ig-image-wrap">
                            <div class="ig-placeholder">Add images to see preview</div>
                        </div>
                        <div class="ig-actions">
                            <span class="ig-action-left">
                                <span class="ig-btn">♡</span>
                                <span class="ig-btn">💬</span>
                                <span class="ig-btn">➤</span>
                            </span>
                            <span class="ig-btn">🔖</span>
                        </div>
                        <div class="ig-likes">Be the first to like this</div>
                        <div class="ig-caption-preview" id="ig-caption-preview">
                            <strong>enjukuracing</strong> <span id="ig-caption-text" style="color:var(--text3)">Your caption will appear here...</span>
                        </div>
                        <div class="ig-hashtags-preview" id="ig-hashtags-preview"></div>
                        <div class="ig-time">Just now · <span style="color:var(--purple)">See translation</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    if (editPost) {
        const capEl = document.getElementById('st-caption');
        const tagEl = document.getElementById('st-hashtags');
        const dateEl = document.getElementById('st-date');
        const statusEl = document.getElementById('st-status');
        const searchEl = document.getElementById('st-product-search');
        if (capEl) capEl.value = editPost.caption || '';
        if (tagEl) tagEl.value = editPost.hashtags || '';
        if (dateEl && editPost.scheduledDate) dateEl.value = editPost.scheduledDate;
        if (statusEl) statusEl.value = editPost.status || 'drafting';
        if (searchEl && editPost.taggedProduct?.name) searchEl.value = editPost.taggedProduct.name;
    }
    if (studioSlides.length) {
        studioRenderSlipStrip();
        studioUpdatePreview();
    } else if (editPost) {
        studioUpdatePreview();
    }
}

let _studioMatches = [];

window.studioSearchCatalog = function(query) {
    const results = document.getElementById('st-catalog-results');
    if (!results) return;
    const q = query.trim().toLowerCase();
    if (!q || !catalog || q.length < 2) { results.style.display = 'none'; return; }
    _studioMatches = [];
    for (const item of catalog) {
        if (_studioMatches.length >= 8) break;
        if (item.s.toLowerCase().includes(q) || item.n.toLowerCase().includes(q)) _studioMatches.push(item);
    }
    if (!_studioMatches.length) { results.style.display = 'none'; return; }
    results.style.display = 'block';
    results.innerHTML = _studioMatches.map((item, i) => `
        <div onclick="studioSelectProductByIndex(${i})"
            style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border)"
            onmouseover="this.style.background='rgba(131,58,180,0.1)'" onmouseout="this.style.background=''">
            <span style="color:var(--purple);font-weight:600">${esc(item.s)}</span>
            <span style="color:var(--text2);margin-left:8px">${esc(item.n)}</span>
        </div>
    `).join('');
};

window.studioSelectProductByIndex = function(i) {
    const item = _studioMatches[i];
    if (item) studioSelectProduct(item.s, item.n, item.u);
};

window.studioSelectProduct = async function(sku, name, url) {
    const searchEl = document.getElementById('st-product-search');
    const resultsEl = document.getElementById('st-catalog-results');
    const descEl = document.getElementById('st-product-desc');
    if (searchEl) searchEl.value = name;
    if (resultsEl) resultsEl.style.display = 'none';

    const { data } = await sb.from('gramhub_catalog').select('img,description,images').eq('sku', sku).maybeSingle();
    if (data) {
        studioProductImg = data.img || '';
        studioProductDesc = data.description || '';
        if (descEl && studioProductDesc) {
            descEl.style.display = 'block';
            descEl.textContent = studioProductDesc;
        }
        const allImages = (data.images && data.images.length) ? data.images : (studioProductImg ? [studioProductImg] : []);
        const imagesEl = document.getElementById('st-product-images');
        if (allImages.length > 1 && imagesEl) {
            imagesEl.style.display = 'block';
            imagesEl.innerHTML = `
                <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Click images to add to post:</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                    ${allImages.map(img => `<img src="${esc(img)}" onclick="studioAddProductImage('${esc(img)}')"
                        style="width:60px;height:60px;object-fit:cover;border-radius:6px;cursor:pointer;border:2px solid transparent"
                        onmouseover="this.style.borderColor='var(--purple)'" onmouseout="this.style.borderColor='transparent'"
                        title="Click to add to post">`).join('')}
                </div>`;
        } else if (allImages.length === 1 && studioSlides.length === 0) {
            studioSlides.push(allImages[0]);
            studioCurrentSlide = 0;
            studioRenderSlipStrip();
            studioUpdatePreview();
        }
    } else {
        showToast('No catalog details yet — run update_catalog.py to populate');
    }
};

window.studioAddProductImage = function(url) {
    if (!studioSlides.includes(url)) {
        studioSlides.push(url);
        studioRenderSlipStrip();
        studioUpdatePreview();
        showToast('Image added 📷');
    }
};

window.editInStudio = function(id) {
    studioEditingPostId = id;
    navigate('studio');
};

window.studioHandleDrop = function(event) {
    studioHandleFiles(event.dataTransfer.files);
};

window.studioHandleFiles = async function(files) {
    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        showToast('Uploading...');
        const url = await studioUploadImage(file);
        if (url) {
            studioSlides.push(url);
            studioRenderSlipStrip();
            studioUpdatePreview();
            showToast('Image added 📷');
        }
    }
};

window.studioAddUrl = function() {
    const el = document.getElementById('st-url-input');
    const url = el ? el.value.trim() : '';
    if (!url) { showToast('Enter an image URL first'); return; }
    studioSlides.push(url);
    el.value = '';
    studioRenderSlipStrip();
    studioUpdatePreview();
};

window.studioRemoveSlide = function(idx) {
    studioSlides.splice(idx, 1);
    if (studioCurrentSlide >= studioSlides.length) studioCurrentSlide = Math.max(0, studioSlides.length - 1);
    studioRenderSlipStrip();
    studioUpdatePreview();
};

window.studioSetSlide = function(idx) {
    studioCurrentSlide = idx;
    studioRenderSlipStrip();
    studioUpdatePreview();
};

function studioRenderSlipStrip() {
    const strip = document.getElementById('st-slide-strip');
    if (!strip) return;
    if (!studioSlides.length) { strip.innerHTML = ''; return; }
    strip.innerHTML = studioSlides.map((url, i) => `
        <div style="position:relative;width:72px;height:72px;border-radius:8px;overflow:hidden;border:2px solid ${i === studioCurrentSlide ? 'var(--purple)' : 'var(--border)'};cursor:pointer" onclick="studioSetSlide(${i})">
            <img src="${esc(url)}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.background='var(--border)'">
            <button onclick="event.stopPropagation();studioRemoveSlide(${i})" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">✕</button>
        </div>
    `).join('');
}

function studioUpdatePreview() {
    const captionEl = document.getElementById('ig-caption-text');
    const hashEl = document.getElementById('ig-hashtags-preview');
    const imageWrap = document.getElementById('ig-image-wrap');

    const caption = (document.getElementById('st-caption')?.value || '').trim();
    const hashtags = (document.getElementById('st-hashtags')?.value || '').trim();

    if (captionEl) captionEl.textContent = caption || 'Your caption will appear here...';
    if (hashEl) {
        hashEl.innerHTML = hashtags
            ? hashtags.split(/\s+/).map(t => `<span style="color:#00b4d8">${esc(t)}</span>`).join(' ')
            : '';
    }

    if (imageWrap) {
        if (studioSlides.length) {
            const isCarousel = studioSlides.length > 1;
            imageWrap.innerHTML = `
                <img src="${esc(studioSlides[studioCurrentSlide])}" class="ig-image" onerror="this.style.background='var(--border)'">
                ${isCarousel ? `
                <div class="ig-carousel-dots">
                    ${studioSlides.map((_, i) => `<span class="ig-dot ${i === studioCurrentSlide ? 'active' : ''}" onclick="studioSetSlide(${i})"></span>`).join('')}
                </div>
                <button class="ig-carousel-btn ig-carousel-prev" onclick="studioSetSlide(Math.max(0,studioCurrentSlide-1))" ${studioCurrentSlide === 0 ? 'disabled' : ''}>‹</button>
                <button class="ig-carousel-btn ig-carousel-next" onclick="studioSetSlide(Math.min(studioSlides.length-1,studioCurrentSlide+1))" ${studioCurrentSlide === studioSlides.length-1 ? 'disabled' : ''}>›</button>
                ` : ''}
            `;
        } else {
            imageWrap.innerHTML = '<div class="ig-placeholder">Add images to see preview</div>';
        }
    }
}

async function studioUploadImage(file) {
    const path = `studio/${Date.now()}_${file.name.replace(/[^a-z0-9._-]/gi, '_')}`;
    const { error } = await sb.storage.from('gramhub-uploads').upload(path, file, { upsert: true });
    if (error) { showToast('Upload failed — ' + error.message); return null; }
    const { data: { publicUrl } } = sb.storage.from('gramhub-uploads').getPublicUrl(path);
    return publicUrl;
}

window.studioSave = function() {
    const caption = (document.getElementById('st-caption')?.value || '').trim();
    const hashtags = (document.getElementById('st-hashtags')?.value || '').trim();
    const status = document.getElementById('st-status')?.value || 'ready';
    const date = document.getElementById('st-date')?.value || '';
    const search = (document.getElementById('st-product-search')?.value || '').trim();
    if (!caption && !studioSlides.length) { showToast('Add an image or caption first'); return; }
    const type = studioSlides.length > 1 ? 'carousel' : 'photo';
    const title = search || caption.slice(0, 60) || 'Studio post';
    if (studioEditingPostId) {
        const idx = state.posts.findIndex(p => p.id === studioEditingPostId);
        if (idx >= 0) {
            const existing = state.posts[idx];
            existing.title = title;
            existing.type = type;
            existing.status = status;
            existing.caption = caption;
            existing.hashtags = hashtags;
            existing.scheduledDate = date;
            existing.slides = [...studioSlides];
            existing.taggedProduct = studioProductImg
                ? { name: search, url: '' }
                : (search ? existing.taggedProduct : null);
            sb.from('gramhub_posts').upsert(postToDb(existing)).then(({error}) => { if(error) showToast('Save failed — check connection'); });
            studioEditingPostId = null;
            showToast('Post updated ✅');
            navigate('board');
            return;
        }
    }
    const newPost = {
        id: genId(), title, type, status, caption, hashtags,
        notes: '', scheduledDate: date, scheduledTime: '',
        slides: [...studioSlides],
        taggedProduct: studioProductImg ? { name: search, url: '' } : null,
        analytics: null, postedDate: null,
        createdAt: new Date().toISOString(),
    };
    state.posts.unshift(newPost);
    sb.from('gramhub_posts').upsert(postToDb(newPost)).then(({error}) => { if(error) showToast('Save failed — check connection'); });
    showToast('Saved to board ✅');
    navigate('board');
};

// ============ PLANNER ============
function renderPlanner(el) {
    const today = new Date(); today.setHours(0,0,0,0);
    const days = [];
    for (let i = 0; i < 60; i++) {
        const d = new Date(today); d.setDate(today.getDate() + i);
        days.push(d);
    }
    const covered = days.filter(d => {
        const ds = toDateStr(d);
        return state.posts.some(p => p.scheduledDate === ds && p.status !== 'idea');
    }).length;

    const startDow = days[0].getDay();
    const blanks = Array(startDow).fill(null);
    const allCells = [...blanks, ...days];

    el.innerHTML = `
        <div class="view-header">
            <div>
                <div class="view-title">60-Day Planner</div>
                <div class="view-sub">${covered} of 60 days covered — <span style="color:${covered >= 40 ? '#34c759' : covered >= 20 ? '#ff9f0a' : 'var(--danger)'}">
                    ${covered >= 40 ? 'Great coverage' : covered >= 20 ? 'Getting there' : 'Needs filling'}</span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="openPostModal()">+ New Post</button>
        </div>
        <div class="planner-day-headers">
            ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="planner-header-cell">${d}</div>`).join('')}
        </div>
        <div class="planner-grid">
            ${allCells.map(d => {
                if (!d) return '<div class="planner-day planner-blank"></div>';
                const ds = toDateStr(d);
                const posts = state.posts.filter(p => p.scheduledDate === ds);
                const isToday = ds === toDateStr(today);
                const hasCovered = posts.some(p => p.status !== 'idea');
                const statusClass = posts.length === 0 ? 'empty' : hasCovered ? 'covered' : 'idea-only';
                return `
                    <div class="planner-day planner-day-${statusClass} ${isToday ? 'planner-today' : ''}" onclick="openPostModal(null,null,'${ds}')">
                        <div class="planner-day-num">${d.getDate()}<span class="planner-month-hint">${d.getDate() === 1 ? ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] : ''}</span></div>
                        ${posts.slice(0, 3).map(p => `<div class="planner-dot planner-dot-${p.status}" title="${esc(p.title)}">${TYPE_ICONS[p.type] || '📝'}</div>`).join('')}
                        ${posts.length > 3 ? `<div style="font-size:9px;color:var(--text3)">+${posts.length-3}</div>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
        <div style="margin-top:16px;display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--text2)">
            <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--border);margin-right:4px"></span>Empty</span>
            <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#7c3aed33;margin-right:4px"></span>Idea only</span>
            <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#7c3aed;margin-right:4px"></span>Scheduled/Ready</span>
            <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#34c759;margin-right:4px"></span>Posted</span>
        </div>
    `;
}

// ============ HELP ============
function renderHelp(el) {
    const section = (emoji, title, steps) => `
        <div class="help-section">
            <div class="help-section-title">${emoji} ${title}</div>
            <div class="help-steps">
                ${steps.map((s, i) => `
                    <div class="help-step">
                        <div class="help-step-num">${i + 1}</div>
                        <div class="help-step-text">${s}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    el.innerHTML = `
        <div class="view-header">
            <div>
                <div class="view-title">How To Use This Thing, Ron</div>
                <div class="view-sub">Yes, someone built you an entire app. You're welcome. Now use it.</div>
            </div>
        </div>

        <div class="help-intro">
            <div class="help-intro-icon">🤦</div>
            <div>
                <div style="font-size:16px;font-weight:700;margin-bottom:6px">Okay Ron. Let's go over this one time.</div>
                <div style="color:var(--text2);line-height:1.6">This app has <strong>9 tabs</strong>. Nine. And it keeps getting better. It has been updated since the last time you read this, so yes, you actually need to read it again. Read it once, close it, go post something. If you come back here more than twice we need to have a different conversation.</div>
            </div>
        </div>

        <div class="help-grid">
            ${section('⚡', 'Dashboard — Open This Every Morning', [
                'Wake up. Make coffee. Open this page. That\'s your new routine. Write it on your hand if you have to.',
                'See something under "Today\'s Schedule"? <strong>That means post it today.</strong> Not tomorrow. Not when you feel inspired. Today.',
                'See an orange "🔴 Log Your Stats" section? That means you posted something and then just... walked away without logging the numbers. Go fix that. It takes 30 seconds and it\'s the only way you\'ll ever know if your content is actually working or if you\'re just shouting into the void.',
                'There\'s a Pro Tip at the bottom. Read it. It\'s free knowledge and you\'re already here.',
            ])}

            ${section('📋', 'Content Board — Your Brain, Organized', [
                'This is where ideas go so they don\'t die in your camera roll or a notes app you\'ll never open again. Every post lives here as a card.',
                '<strong>💡 Ideas</strong> — dump everything here. Shower thought at 2am? Add it. You saw something cool? Add it. Stop letting good ideas evaporate because you thought you\'d "remember it later." You won\'t. You never do.',
                '<strong>✏️ Drafting</strong> — you\'re actually working on it. Caption, photo, hashtags. This is where posts go to become real.',
                '<strong>✅ Ready</strong> — locked, loaded, scheduled. This card is ready to post and you have no excuse not to.',
                '<strong>📤 Posted</strong> — drag it here the second it goes live. The app will immediately ask you for the stats. Don\'t close the window. Don\'t say "I\'ll do it later." Later never comes. Take 30 seconds right now.',
                'Drag cards between columns. Click ✏️ to edit. Click 🗑️ to delete. It\'s drag and drop, Ron, not rocket surgery.',
            ])}

            ${section('📅', 'Calendar — Proof You Have a Plan', [
                'This shows every scheduled post on a calendar. Take a good long look at it right now. Is it mostly empty? Then you already know what the problem is.',
                '<strong>3 to 4 posts a week.</strong> That is the minimum. Not 3-4 a month. A week. If your calendar doesn\'t reflect that, you\'re not posting enough and the algorithm will forget you exist. Like that.',
                'Click any day to add a post to it. Plan ahead. Future Ron will thank present Ron. Future Ron always thanks present Ron when present Ron actually does the work.',
                'Blank calendar = no plan. No plan = no growth. No growth = the people doubting you were right. Don\'t let them be right.',
            ])}

            ${section('📊', 'Analytics — The Scoreboard', [
                'This shows you whether what you\'re doing is working or not. Lines going up = good job. Lines going down = something needs to change. It\'s not complicated.',
                'Here\'s the catch: <strong>you have to log your stats for any of this to work.</strong> The app can\'t magically know your numbers. Every time you post, you open Instagram, you check the numbers, you type them in. That\'s the deal.',
                '<strong>Reach</strong> = how many people saw it. <strong>Engagement</strong> = how many people cared. Big reach, no engagement means your content isn\'t landing. Small reach means not enough people are seeing it. Both are fixable once you know which one it is.',
                'Check the bar chart by post type. If Reels are crushing photos — and they probably are — post more Reels. The data doesn\'t lie, even when your gut does.',
            ])}

            ${section('📚', 'Library — Work Smarter, Not Harder', [
                'You are not going to type your hashtags from scratch every single post. That\'s insane. Save your hashtag sets here once, copy them in one click, done.',
                'Build 3-4 sets: one for general content, one for track/event stuff, one for product posts. Mix and match. Stop reinventing the wheel every Tuesday night.',
                'Caption Templates work the same way. Found a caption structure that got good engagement? <strong>Save it here immediately.</strong> Tweak it for each post. Don\'t lose it. Don\'t start from scratch. You\'re not a monk hand-copying manuscripts.',
                'This tab will save you probably 20 minutes a week. Over a year that\'s like 17 hours. You\'re welcome.',
            ])}

            ${section('🔔', 'Reminders — Since Apparently You Need Them', [
                'Set a reminder for each day you\'re supposed to post. The app will send a browser notification that says "hey, go post something." This is the app doing your job for you. All you have to do is not ignore it.',
                '<strong>First and only setup step:</strong> click "Enable Notifications" at the top of this page. If you don\'t do this, reminders don\'t work. If you come back to us confused about why your reminders aren\'t working, the first question will be "did you enable notifications?" Don\'t be that person.',
                'Suggested starting schedule: <strong>Tuesday, Thursday, Saturday.</strong> Pick times you\'re not busy. Stick to them. Consistency is literally more important than quality when you\'re starting out. A decent post on schedule beats a perfect post whenever you feel like it.',
                'Keep your browser open. The notification fires through the browser. This is not a hard requirement. You probably already have 47 tabs open anyway.',
            ])}

            ${section('🎨', 'Studio — Stop Copying and Pasting Like It\'s 2009', [
                'You no longer need a spreadsheet, a Google Doc, a Gemini tab, a separate notes app, and a prayer just to put together one post. Everything you need is right here. You\'re welcome.',
                '<strong>Step one: search for the product.</strong> Type the name or SKU in the Product Search box. Click it. The image and description pull in automatically. That\'s it. No copy-pasting from the website. No opening seventeen tabs. One search. Done.',
                '<strong>Step two: add your images.</strong> Drag photos straight from your phone or computer into the upload box. Or click it to browse. Or paste a URL if you already have one. You can add multiple — the app will automatically treat it as a carousel. The preview on the right updates in real time so you can see exactly how it\'ll look before you commit to anything.',
                '<strong>Step three: write the caption.</strong> Watch the preview on the right as you type. That\'s what it\'s going to look like when someone opens Instagram. If it looks bad on the preview, it\'s going to look bad on Instagram. Fix it before you post it, not after.',
                'Add your hashtags in the Hashtags field. Use your saved sets from the Library tab. That\'s what they\'re there for. Stop typing them from scratch every time.',
                'When it looks good, hit <strong>Save to Board.</strong> Pick a date if you know when you\'re posting it. Pick "Ready" if it\'s done. Pick "Drafting" if you\'re still working on it. Then go find the post on the Content Board and move it through the pipeline like a normal person.',
                'The Studio is where ideas become real posts. Use it every time. Not just when you feel like it — every time. The goal is to never post something you haven\'t previewed here first.',
            ])}

            ${section('🗓️', '60-Day Planner — The Mirror You\'ve Been Avoiding', [
                'Open this tab. Look at it. Really look at it. That\'s your posting plan — or more accurately, that\'s the gaping void where your posting plan should be. Every gray square is a day you\'ve left empty. Every gray square is a missed opportunity. Count them. It\'s fine, we\'ll wait.',
                '<strong>Color guide:</strong> Gray = nothing scheduled, which is bad. Purple outline = you have an idea for that day, which is a start but an idea isn\'t a post. Solid purple = something is scheduled and ready to go, which is what we\'re aiming for. Green = posted. Green is good. More green.',
                'Your goal is <strong>3 to 4 covered days per week</strong> for the next 60 days. Look at the coverage number at the top. If it\'s under 25 you need to spend the next hour in Studio building posts. Not later. Now. Seriously, stop reading this and go.',
                'Click any empty day to immediately create a post for that date. The date pre-fills automatically. Pick a product, add an image, write a caption, save. Repeat until your calendar doesn\'t look like a parking lot at 6am.',
                'The point of planning 60 days out isn\'t perfection — you\'ll swap things around, life happens, whatever. The point is that you always have something ready to post so you never open Instagram and think "ugh I don\'t have anything today" and then just... don\'t post. That thought has cost you more followers than bad content ever has.',
                '<strong>One non-negotiable:</strong> before you close this app for the day, make sure the next 7 days have something in them. Just 7 days. That\'s all. Do that every day and you will never miss a post again.',
            ])}

            ${section('🔔', 'Reminders — They Come to You Now. No More Excuses.', [
                'The reminders got an upgrade. They used to require you to have the browser tab open, which apparently was too much to ask. So now they send you an email. At the exact time you set. On the days you set. Even if you\'re asleep. Even if your laptop is closed. Even if you\'ve completely forgotten this app exists.',
                '<strong>Setup is already done.</strong> Your email is in the system. The server checks every single minute whether you have a reminder due. If you do, it sends the email. You don\'t have to do anything except not ignore it when it arrives.',
                'Go to the <strong>Reminders tab</strong> and create your posting schedule. Set a reminder for each day you\'re supposed to post — Tuesday at 10am, Thursday at 6pm, Saturday at noon, whatever your schedule is. Give each one a label so the email tells you what to do: "Time to post your product post" or "Reel day — no excuses."',
                'When the email shows up in your inbox, that\'s your cue. Open Instagram. Post. Log the stats. Done. The entire workflow is: receive email → post → log stats → go back to your life. It takes 10 minutes. You have 10 minutes.',
                '<strong>If you\'re ignoring the reminder emails, that\'s a you problem, not a tech problem.</strong> The system is working. You\'re the variable. Fix the variable.',
            ])}

            ${section('📋', 'Ready to Post — Everything You Need, One Click Away', [
                'Every post card now has three buttons at the bottom. They are not decorative. Use them.',
                '<strong>📋 Caption</strong> — copies your entire caption to the clipboard. Open Instagram. Paste. Done. You don\'t have to type it again, you don\'t have to find the note you wrote it in, you don\'t have to remember it. It\'s right there. One click.',
                '<strong>🏷️ Tags</strong> — copies all your hashtags in one shot. Paste them at the end of your caption or drop them in the first comment. Either works. Just stop typing them from scratch every time like you\'re being punished.',
                '<strong>⬇️ Image</strong> — downloads the image you saved to this post. If it opens in a new tab instead of downloading, right-click and save it. Two seconds. Now you have the exact image ready to upload to Instagram without hunting through your camera roll.',
                'The workflow is now: open GramHub → find the post that\'s scheduled for today → click Caption, click Tags, click Image → open Instagram → paste caption, paste tags, upload image → post. That\'s it. That is the entire process. If you can do that consistently, you will not miss a post.',
                'For Reels, there\'s no image to download because you\'re shooting the video yourself. But your caption and hashtags are still one click each. Shoot the video, open GramHub, copy the text, post. Simple.',
            ])}

            ${section('🎬', 'Reels — The Shot Planner Is Your New Best Friend', [
                'Reels get three times the reach of photos. Read that again. <strong>Three times.</strong> If you\'re not making Reels, you\'re choosing to reach fewer people. That\'s a choice you can make, but now you know you\'re making it.',
                'When you create a post and set the type to <strong>Reel</strong>, the notes section transforms into a full shot planner. Four fields. Fill them out before you ever pick up a camera.',
                '<strong>Shot List</strong> — every single shot you need. Wide angle of the engine bay. Close-up of the part being installed. Someone\'s reaction. The finished car. Write it all down before you start filming. If it\'s not on the list, you\'ll forget to shoot it and you\'ll be standing there mid-edit realizing you don\'t have the shot you needed.',
                '<strong>Audio / Sound</strong> — what are you using? A trending sound you found on Instagram? Original audio from the shop? A voiceover you\'re going to record? Decide now and write it here. "I\'ll figure it out during editing" is how you spend two hours scrolling audio instead of posting.',
                '<strong>Editing Notes</strong> — how do you want it to feel? Fast cuts? Slow and satisfying? Text overlays? A hook in the first two seconds that stops people from scrolling? Write your vision down before you sit down to edit. Your future self will thank you.',
                '<strong>B-Roll / Extra Shots</strong> — the supporting footage that makes a Reel feel real and not just a product photo with music. Shop environment. Tools on the bench. Team working. Atmosphere. These shots are the difference between a Reel that looks professional and one that looks like a slideshow.',
                'All of this saves to the post automatically. Open it a week later and everything you planned is still there. No more "what was I thinking when I wrote this" — you wrote it down.',
            ])}

            ${section('🛍️', 'Shop Posts — The Whole Point of This Exercise', [
                'The store is now connected to Instagram. That means when you post a product, people can tap it and buy it <em>right there</em>. This is literally free money sitting on the table and all you have to do is not screw it up.',
                'When you create or edit a post, scroll down and you\'ll see a <strong>Tagged Product</strong> field. Type the product name and paste the URL from the store. That\'s it. That\'s the whole thing. You\'re done.',
                'Go to the <strong>Library tab first</strong> and add the products you plan to feature regularly. Name, URL, SKU if you know it. Save them there <em>once</em>. Then when you\'re creating a post, there\'s a dropdown — pick the product in two seconds instead of hunting down the URL every single time like an animal.',
                'Every post with a product tagged shows a green 🛍️ badge on the card. If you\'re looking at the board and none of your cards have that badge, you\'re leaving sales on the table. Fix that.',
                'Check the <strong>Analytics tab</strong> — there\'s a "Shop Post Performance" table at the bottom. It ranks your product posts by engagement. The one at the top? Post more content like that. The one at the bottom? Figure out why it flopped or stop featuring that product. The data tells you what to do. Read the data.',
                'This is the part where most people just... keep posting pretty pictures and wondering why Instagram isn\'t making them money. You now have a tool that tracks exactly which products people respond to. Use it or don\'t, but don\'t come back saying Instagram doesn\'t work.',
            ])}
        </div>

        <div class="help-footer">
            <div class="help-footer-title">The One Thing That Separates People Who Grow From People Who Don't</div>
            <div class="help-footer-text">They post. Consistently. Even when it's not perfect. Even when they're not feeling it. Even when nobody's watching yet — <em>especially</em> when nobody's watching yet. That's when the habit gets built. The people who are doubting you right now? They're counting on you to quit. <strong>Don't quit. Post the damn thing.</strong></div>
        </div>
    `;
}

// ============ REMINDERS ENGINE ============
function requestNotifPermission() {
    if (!('Notification' in window)) { showToast("Browser doesn't support notifications"); return; }
    Notification.requestPermission().then(p => {
        showToast(p === 'granted' ? 'Notifications enabled 🔔' : 'Notifications blocked. Enable in browser settings.');
    });
}

function checkReminders() {
    const now = new Date();
    const dayName = DAYS[now.getDay()];
    const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    state.reminders.filter(r => r.active && r.days.includes(dayName) && r.time === hhmm).forEach(r => {
        if (Notification.permission === 'granted') {
            new Notification('Gram Hub 📸', { body: r.label, icon: '' });
        } else {
            showToast(`🔔 ${r.label}`);
        }
    });
}

// ============ QUOTES ============
function showQuote() {
    const q = QUOTES[quoteIndex % QUOTES.length];
    document.getElementById('quote-text').textContent = q.text;
    document.getElementById('quote-author').textContent = `— ${q.author}`;
}

function nextQuote() {
    quoteIndex = (quoteIndex + 1) % QUOTES.length;
    showQuote();
}

// ============ UTILS ============
function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function toDateStr(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function formatDateLabel(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
    const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
    if (+d === +today) return 'Today';
    if (+d === +tomorrow) return 'Tomorrow';
    if (+d === +yesterday) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2,'0')} ${ampm}`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! 📋'));
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading
    document.getElementById('main').innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px;color:var(--text2)">
            <div style="font-size:36px">📸</div>
            <div style="font-size:14px">Loading Ron's data...</div>
        </div>`;

    // Nav
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => navigate(btn.dataset.view));
    });

    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', e => {
        if (e.target === document.getElementById('modal-backdrop')) closeModal();
    });

    // Quotes
    showQuote();
    document.getElementById('quote-refresh').addEventListener('click', nextQuote);

    // Reminder check every minute
    setInterval(checkReminders, 60000);

    // Load from Supabase then render
    try {
        await loadState();
    } catch(e) {
        showToast('⚠️ Could not connect to cloud — check internet');
    }
    navigate('dashboard');
});
