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

// ============ STATE ============
let state = { posts: [], hashtagSets: [], captionTemplates: [], reminders: [] };
let currentView = 'dashboard';
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();
let analyticsCharts = {};
let quoteIndex = Math.floor(Math.random() * QUOTES.length);
let reminderInterval = null;

function loadState() {
    try {
        const saved = localStorage.getItem('gramhub_state');
        if (saved) state = { ...state, ...JSON.parse(saved) };
    } catch(e) {}
}

function saveState() {
    localStorage.setItem('gramhub_state', JSON.stringify(state));
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
        </div>

        <div class="dash-cols">
            <div>
                <div class="dash-section-title">📅 Today's Schedule</div>
                ${todayPosts.length
                    ? todayPosts.map(p => dashPostItem(p)).join('')
                    : `<div class="empty-state"><span class="empty-state-icon">😴</span>Nothing scheduled for today.<br><a href="#" onclick="openPostModal()" style="color: var(--purple);">Add a post idea</a></div>`
                }

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

function postCard(p) {
    const icon = TYPE_ICONS[p.type] || '📝';
    const dateStr = p.scheduledDate ? `<span class="post-date">${formatDateLabel(p.scheduledDate)}</span>` : '';
    return `
        <div class="post-card" draggable="true" data-id="${p.id}">
            <div class="post-card-top">
                <div class="post-card-title">${esc(p.title)}</div>
                <div class="post-card-actions">
                    <button class="post-card-btn" onclick="event.stopPropagation();openPostModal('${p.id}')" title="Edit">✏️</button>
                    <button class="post-card-btn" onclick="event.stopPropagation();deletePost('${p.id}')" title="Delete">🗑️</button>
                </div>
            </div>
            ${p.caption ? `<div class="post-card-caption">${esc(p.caption)}</div>` : ''}
            <div class="post-card-footer">
                <span class="badge badge-${p.type}">${icon} ${p.type}</span>
                ${p.status === 'posted' ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openAnalyticsModal('${p.id}')">📊 Log stats</button>` : dateStr}
            </div>
        </div>
    `;
}

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
                saveState();
                renderView('board');
                showToast(`Moved to ${STATUS_LABELS[newStatus]}`);
            }
            dragId = null;
        });
    });
}

function deletePost(id) {
    state.posts = state.posts.filter(p => p.id !== id);
    saveState();
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
    saveState();
    renderView('library');
    showToast('Deleted');
}

function deleteCaption(id) {
    state.captionTemplates = state.captionTemplates.filter(t => t.id !== id);
    saveState();
    renderView('library');
    showToast('Deleted');
}

// ============ REMINDERS ============
function renderReminders(el) {
    el.innerHTML = `
        <div class="view-header">
            <div>
                <div class="view-title">Reminders</div>
                <div class="view-sub">Browser notifications to keep you on schedule</div>
            </div>
            <div style="display:flex;gap:8px">
                <button class="btn btn-ghost" onclick="requestNotifPermission()">🔔 Enable Notifications</button>
                <button class="btn btn-primary" onclick="openReminderModal()">+ New Reminder</button>
            </div>
        </div>
        <div class="reminder-list" id="reminder-list">
            ${state.reminders.length
                ? state.reminders.map(reminderItem).join('')
                : `<div class="empty-state"><span class="empty-state-icon">🔔</span>No reminders yet.<br>Set one so you never forget to post.</div>`
            }
        </div>
    `;
}

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
    if (r) { r.active = !r.active; saveState(); renderView('reminders'); }
}

function deleteReminder(id) {
    state.reminders = state.reminders.filter(r => r.id !== id);
    saveState();
    renderView('reminders');
    showToast('Reminder deleted');
}

// ============ MODALS ============
function openModal(title, bodyHtml, onSave, saveLabel = 'Save') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-footer').innerHTML = `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="(${onSave.toString()})()">💾 ${saveLabel}</button>
    `;
    document.getElementById('modal-backdrop').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.add('hidden');
}

function openPostModal(id = null, defaultStatus = 'idea', defaultDate = null) {
    const post = id ? state.posts.find(p => p.id === id) : null;
    const title = post ? 'Edit Post' : 'New Post Idea';
    const types = ['photo','reel','story','carousel'];
    const statuses = ['idea','drafting','ready','posted'];

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
                <select class="form-select" id="f-type">
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
        <div class="form-group">
            <label class="form-label">Image / Video Notes</label>
            <input class="form-input" id="f-notes" placeholder="e.g. Use the photo from Sat morning track day, front angle" value="${esc(post?.notes || '')}">
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

        const newPost = {
            id: post?.id || genId(),
            title: titleVal,
            type: document.getElementById('f-type').value,
            status: document.getElementById('f-status').value,
            caption: document.getElementById('f-caption').value.trim(),
            hashtags: document.getElementById('f-hashtags').value.trim(),
            notes: document.getElementById('f-notes').value.trim(),
            scheduledDate: document.getElementById('f-date').value,
            scheduledTime: document.getElementById('f-time').value,
            analytics: post?.analytics || null,
            postedDate: post?.postedDate || (document.getElementById('f-status').value === 'posted' ? toDateStr(new Date()) : null),
            createdAt: post?.createdAt || new Date().toISOString(),
        };

        if (post) {
            const idx = state.posts.findIndex(p => p.id === post.id);
            state.posts[idx] = newPost;
        } else {
            state.posts.unshift(newPost);
        }

        saveState();
        closeModal();
        renderView(currentView);
        showToast(post ? 'Post updated' : 'Idea saved! 💡');
    });
}

window.insertHashtags = function(tags) {
    const el = document.getElementById('f-hashtags');
    if (el) el.value = el.value ? el.value + ' ' + tags : tags;
};

function openAnalyticsModal(id) {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;
    const a = post.analytics || {};

    const body = `
        <div style="margin-bottom:14px;font-weight:600;color:var(--text2)">${esc(post.title)}</div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">❤️ Likes</label>
                <input class="form-input" type="number" id="a-likes" min="0" value="${a.likes ?? ''}">
            </div>
            <div class="form-group">
                <label class="form-label">💬 Comments</label>
                <input class="form-input" type="number" id="a-comments" min="0" value="${a.comments ?? ''}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">👁️ Reach</label>
                <input class="form-input" type="number" id="a-reach" min="0" value="${a.reach ?? ''}">
            </div>
            <div class="form-group">
                <label class="form-label">🔖 Saves</label>
                <input class="form-input" type="number" id="a-saves" min="0" value="${a.saves ?? ''}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">↗️ Shares</label>
                <input class="form-input" type="number" id="a-shares" min="0" value="${a.shares ?? ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Posted Date</label>
                <input class="form-input" type="date" id="a-date" value="${post.postedDate || toDateStr(new Date())}">
            </div>
        </div>
    `;

    openModal('Log Analytics', body, function() {
        const idx = state.posts.findIndex(p => p.id === id);
        state.posts[idx].analytics = {
            likes: parseInt(document.getElementById('a-likes').value) || 0,
            comments: parseInt(document.getElementById('a-comments').value) || 0,
            reach: parseInt(document.getElementById('a-reach').value) || 0,
            saves: parseInt(document.getElementById('a-saves').value) || 0,
            shares: parseInt(document.getElementById('a-shares').value) || 0,
        };
        state.posts[idx].postedDate = document.getElementById('a-date').value;
        state.posts[idx].status = 'posted';
        saveState();
        closeModal();
        renderView(currentView);
        showToast('Analytics saved 📊');
    }, 'Save Stats');
}

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
        } else {
            state.hashtagSets.push({ id: genId(), name, hashtags: tags });
        }
        saveState();
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
        } else {
            state.captionTemplates.push({ id: genId(), name, content });
        }
        saveState();
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
        } else {
            state.reminders.push({ id: genId(), label, time, days, active: true });
        }
        saveState();
        closeModal();
        renderView('reminders');
        showToast('Reminder set 🔔');
    });
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
document.addEventListener('DOMContentLoaded', () => {
    loadState();

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

    // Initial render
    navigate('dashboard');
});
