/*
  Anonymous Chat Admin Dashboard - Main JavaScript
  Combines all functionality: navigation, theme switching, table operations, real-time simulation, charts, modals & notifications.
*/
(() => {
  /* ------------------------------------------------------------------ */
  /*  Application Data (static sample for simulation)                    */
  /* ------------------------------------------------------------------ */
  const appData = {
    activeUsers: [
      { sessionId: "sess_001", username: "FriendlyStranger", gender: "male", lookingFor: "female", status: "chatting", joinTime: "2025-01-17T11:30:00Z", lastActivity: "2025-01-17T12:05:00Z" },
      { sessionId: "sess_002", username: "BookwormAnnie", gender: "female", lookingFor: "male", status: "chatting", joinTime: "2025-01-17T11:35:00Z", lastActivity: "2025-01-17T12:04:00Z" },
      { sessionId: "sess_003", username: "TechGuru", gender: "male", lookingFor: "anyone", status: "waiting", joinTime: "2025-01-17T11:45:00Z", lastActivity: "2025-01-17T12:03:00Z" },
      { sessionId: "sess_004", username: "ArtisticSoul", gender: "female", lookingFor: "female", status: "chatting", joinTime: "2025-01-17T11:50:00Z", lastActivity: "2025-01-17T12:02:00Z" },
      { sessionId: "sess_005", username: "MusicLover", gender: "male", lookingFor: "anyone", status: "waiting", joinTime: "2025-01-17T11:55:00Z", lastActivity: "2025-01-17T12:01:00Z" }
    ],
    chatRooms: [
      { roomId: "room_001", participants: ["FriendlyStranger", "BookwormAnnie"], messageCount: 23, duration: "35m", status: "active" },
      { roomId: "room_002", participants: ["ArtisticSoul", "Silent_Whisper"], messageCount: 18, duration: "22m", status: "active" },
      { roomId: "room_003", participants: ["Ocean_Breeze", "Star_Gazer"], messageCount: 31, duration: "48m", status: "active" }
    ],
    recentMessages: [
      { roomId: "room_001", from: "FriendlyStranger", message: "That sounds amazing! I love photography too", timestamp: "2025-01-17T12:05:00Z" },
      { roomId: "room_001", from: "BookwormAnnie", message: "Do you have any favorite photography spots?", timestamp: "2025-01-17T12:04:30Z" },
      { roomId: "room_002", from: "ArtisticSoul", message: "I mostly work with watercolors", timestamp: "2025-01-17T12:03:45Z" },
      { roomId: "room_002", from: "Silent_Whisper", message: "That's so cool! I'd love to see some of your work", timestamp: "2025-01-17T12:02:15Z" }
    ],
    systemStats: {
      totalUsers: 1247,
      activeUsers: 23,
      totalMessages: 8934,
      activeRooms: 12,
      messagesPerHour: [5, 8, 12, 15, 23, 31, 18, 25, 19, 14, 11, 8],
      genderDistribution: { male: 52, female: 48 },
      securityAlerts: 2,
      systemUptime: "99.8%"
    },
    securityAlerts: [
      { type: "rate_limit", message: "Rate limit exceeded from IP 192.168.1.100", timestamp: "2025-01-17T11:58:00Z", severity: "warning" },
      { type: "suspicious_activity", message: "Multiple failed connection attempts", timestamp: "2025-01-17T11:45:00Z", severity: "medium" }
    ]
  };

  /* ------------------------------------------------------------------ */
  /*  Cached DOM Elements                                               */
  /* ------------------------------------------------------------------ */
  const dom = {};
  document.addEventListener('DOMContentLoaded', () => {
    // Basic caches
    dom.root           = document.documentElement;
    dom.navTabs        = document.querySelectorAll('.nav-tab');
    dom.navTabsParent  = document.querySelector('.nav-tabs');
    dom.tabContents    = document.querySelectorAll('.tab-content');
    dom.themeToggle    = document.getElementById('theme-toggle');
    dom.datetime       = document.getElementById('datetime');
    dom.modal          = document.getElementById('user-modal');
    dom.activityFeed   = document.getElementById('activity-feed');

    // Populate dashboard and bind UI
    initializeDashboard();
    bindEvents();
    updateDateTime();
    startSimulation();
  });

  /* ------------------------------------------------------------------ */
  /*  Initialization                                                    */
  /* ------------------------------------------------------------------ */
  function initializeDashboard() {
    // Respect system preference unless user has already toggled
    if (!dom.root.getAttribute('data-color-scheme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dom.root.setAttribute('data-color-scheme', prefersDark ? 'dark' : 'light');
    }
    updateThemeToggleIcon();

    populateUsersTable();
    populateRoomsTable();
    populateMessagesTable();
    populateSecurityAlerts();
    updateCounters();
    drawCharts();
  }

  /* ------------------------------------------------------------------ */
  /*  Event Bindings                                                    */
  /* ------------------------------------------------------------------ */
  function bindEvents() {
    // Navigation via delegation
    dom.navTabsParent.addEventListener('click', e => {
      const tab = e.target.closest('.nav-tab');
      if (tab) {
        switchTab(tab.dataset.tab);
      }
    });

    // Theme toggle
    dom.themeToggle.addEventListener('click', () => {
      const newMode = dom.root.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
      dom.root.setAttribute('data-color-scheme', newMode);
      updateThemeToggleIcon();
    });

    // Search inputs
    document.querySelectorAll('.search-input').forEach(input => {
      input.addEventListener('input', () => {
        const tableId = input.id.replace('-search', '-table');
        filterTable(tableId, input.value);
      });
    });

    // Message filter dropdown
    const messageFilter = document.getElementById('message-filter');
    if (messageFilter) messageFilter.addEventListener('change', () => filterMessages(messageFilter.value));

    // Modal backdrop
    dom.modal.addEventListener('click', ev => {
      if (ev.target === dom.modal) closeModal();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Navigation + Theme Helpers                                        */
  /* ------------------------------------------------------------------ */
  function switchTab(tabId) {
    dom.tabContents.forEach(section => section.classList.toggle('active', section.id === tabId));
    dom.navTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabId));
  }

  function updateThemeToggleIcon() {
    dom.themeToggle.textContent = dom.root.getAttribute('data-color-scheme') === 'dark' ? '☀️' : '🌙';
  }

  /* ------------------------------------------------------------------ */
  /*  Populate Tables & Lists                                           */
  /* ------------------------------------------------------------------ */
  function populateUsersTable() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    appData.activeUsers.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Session ID">${user.sessionId}</td>
        <td data-label="Username">${user.username}</td>
        <td data-label="Gender">${user.gender}</td>
        <td data-label="Looking For">${user.lookingFor}</td>
        <td data-label="Status"><span class="status status--${user.status === 'chatting' ? 'success' : 'warning'}">${user.status}</span></td>
        <td data-label="Join Time">${formatDateTime(user.joinTime)}</td>
        <td data-label="Last Activity">${formatDateTime(user.lastActivity)}</td>
        <td data-label="Actions">
          <button class="btn btn--sm btn--outline" data-action="view" data-sid="${user.sessionId}">View</button>
          <button class="btn btn--sm btn--secondary" data-action="kick" data-sid="${user.sessionId}">Kick</button>
        </td>`;
      tbody.appendChild(tr);
    });
    // Row-level actions delegation
    tbody.onclick = e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const sid = btn.dataset.sid;
      if (btn.dataset.action === 'view') viewUserDetails(sid);
      else if (btn.dataset.action === 'kick') kickUser(sid);
    };
  }

  function populateRoomsTable() {
    const tbody = document.getElementById('rooms-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    appData.chatRooms.forEach(room => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Room ID">${room.roomId}</td>
        <td data-label="Participants">${room.participants.join(', ')}</td>
        <td data-label="Messages Count">${room.messageCount}</td>
        <td data-label="Duration">${room.duration}</td>
        <td data-label="Status"><span class="status status--success">${room.status}</span></td>
        <td data-label="Actions">
          <button class="btn btn--sm btn--outline" data-action="monitor" data-rid="${room.roomId}">Monitor</button>
          <button class="btn btn--sm btn--secondary" data-action="close" data-rid="${room.roomId}">Close</button>
        </td>`;
      tbody.appendChild(tr);
    });
    tbody.onclick = e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const rid = btn.dataset.rid;
      if (btn.dataset.action === 'monitor') viewRoomDetails(rid);
      else if (btn.dataset.action === 'close') closeRoom(rid);
    };
  }

  function populateMessagesTable() {
    const tbody = document.getElementById('messages-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    appData.recentMessages.forEach(msg => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Room ID">${msg.roomId}</td>
        <td data-label="From">${msg.from}</td>
        <td data-label="Message">${msg.message}</td>
        <td data-label="Timestamp">${formatDateTime(msg.timestamp)}</td>
        <td data-label="Actions">
          <button class="btn btn--sm btn--outline" data-action="flag" data-room="${msg.roomId}" data-from="${msg.from}">Flag</button>
          <button class="btn btn--sm btn--secondary" data-action="delete" data-room="${msg.roomId}" data-from="${msg.from}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
    tbody.onclick = e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const room = btn.dataset.room;
      const from = btn.dataset.from;
      if (btn.dataset.action === 'flag') flagMessage(room, from);
      else if (btn.dataset.action === 'delete') deleteMessage(room, from);
    };
  }

  function populateSecurityAlerts() {
    const list = document.getElementById('alerts-list');
    if (!list) return;
    list.innerHTML = '';
    appData.securityAlerts.forEach(alert => {
      const div = document.createElement('div');
      div.className = `alert-item ${alert.severity}`;
      div.innerHTML = `
        <div class="alert-header">
          <span class="alert-type">${alert.type.replace('_', ' ')}</span>
          <span class="alert-time">${formatDateTime(alert.timestamp)}</span>
        </div>
        <div class="alert-message">${alert.message}</div>`;
      list.appendChild(div);
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Charts (Canvas)                                                   */
  /* ------------------------------------------------------------------ */
  function drawCharts() {
    drawMessagesChart();
    drawGenderChart();
  }

  function drawMessagesChart() {
    const canvas = document.getElementById('messages-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const data = appData.systemStats.messagesPerHour;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const P = 40; // padding
    const w = canvas.width - P * 2;
    const h = canvas.height - P * 2;
    const max = Math.max(...data);
    const bw = w / data.length;

    ctx.fillStyle = '#1FB8CD';
    data.forEach((v, i) => {
      const bh = (v / max) * h;
      ctx.fillRect(P + i * bw + 5, P + h - bh, bw - 10, bh);
    });

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#626C71';
    ctx.textAlign = 'center';
    data.forEach((_, i) => {
      ctx.fillText(`${i}h`, P + i * bw + bw / 2, canvas.height - 10);
    });
  }

  function drawGenderChart() {
    const canvas = document.getElementById('gender-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { male, female } = appData.systemStats.genderDistribution;
    const total = male + female;
    const maleAngle = (male / total) * Math.PI * 2;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r  = Math.min(cx, cy) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Male slice
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, 0, maleAngle);
    ctx.closePath();
    ctx.fillStyle = '#1FB8CD';
    ctx.fill();

    // Female slice
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, maleAngle, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#FFC185';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#13343B';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Male ${male}%`, cx + (r/2)*Math.cos(maleAngle/2), cy + (r/2)*Math.sin(maleAngle/2));
    ctx.fillText(`Female ${female}%`, cx + (r/2)*Math.cos(maleAngle + (Math.PI*2 - maleAngle)/2), cy + (r/2)*Math.sin(maleAngle + (Math.PI*2 - maleAngle)/2));
  }

  /* ------------------------------------------------------------------ */
  /*  General Helpers                                                   */
  /* ------------------------------------------------------------------ */
  function formatDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function updateCounters() {
    document.getElementById('active-users-counter').textContent   = appData.activeUsers.length;
    document.getElementById('total-messages-counter').textContent = appData.systemStats.totalMessages;
    document.getElementById('active-rooms-counter').textContent   = appData.chatRooms.length;
  }

  function filterTable(tableId, term) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach(r => {
      const match = r.textContent.toLowerCase().includes(term.toLowerCase());
      r.style.display = match ? '' : 'none';
    });
  }

  function filterMessages(roomId) {
    document.querySelectorAll('#messages-tbody tr').forEach(row => {
      row.style.display = roomId === 'all' || row.firstElementChild.textContent === roomId ? '' : 'none';
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Modal & Actions                                                   */
  /* ------------------------------------------------------------------ */
  function openModal(html) {
    document.getElementById('user-modal-body').innerHTML = html;
    dom.modal.classList.add('active');
  }
  function closeModal() { dom.modal.classList.remove('active'); }

  function viewUserDetails(sessionId) {
    const u = appData.activeUsers.find(x => x.sessionId === sessionId);
    if (!u) return;
    openModal(`
      <div class="modal-field"><label>Session ID:</label><span>${u.sessionId}</span></div>
      <div class="modal-field"><label>Username:</label><span>${u.username}</span></div>
      <div class="modal-field"><label>Gender:</label><span>${u.gender}</span></div>
      <div class="modal-field"><label>Looking For:</label><span>${u.lookingFor}</span></div>
      <div class="modal-field"><label>Status:</label><span class="status status--${u.status === 'chatting' ? 'success' : 'warning'}">${u.status}</span></div>
      <div class="modal-field"><label>Join Time:</label><span>${formatDateTime(u.joinTime)}</span></div>
      <div class="modal-field"><label>Last Activity:</label><span>${formatDateTime(u.lastActivity)}</span></div>`);
  }

  function kickUser(sessionId) {
    if (!confirm('Kick this user?')) return;
    appData.activeUsers = appData.activeUsers.filter(u => u.sessionId !== sessionId);
    populateUsersTable();
    updateCounters();
    notify('User kicked');
  }

  function viewRoomDetails(roomId) {
    const r = appData.chatRooms.find(x => x.roomId === roomId);
    if (!r) return;
    const recentMsgs = appData.recentMessages.filter(m => m.roomId === roomId).map(m => `<div style="margin-bottom:8px"><strong>${m.from}:</strong> ${m.message}<br><small>${formatDateTime(m.timestamp)}</small></div>`).join('');
    openModal(`
      <div class="modal-field"><label>Room ID:</label><span>${r.roomId}</span></div>
      <div class="modal-field"><label>Participants:</label><span>${r.participants.join(', ')}</span></div>
      <div class="modal-field"><label>Messages:</label><span>${r.messageCount}</span></div>
      <div class="modal-field"><label>Duration:</label><span>${r.duration}</span></div>
      <div class="modal-field"><label>Status:</label><span class="status status--success">${r.status}</span></div>
      <hr>
      <h4>Recent Messages</h4>
      <div style="max-height:200px;overflow-y:auto;">${recentMsgs || 'No messages'}</div>`);
  }

  function closeRoom(roomId) {
    if (!confirm('Close this room?')) return;
    appData.chatRooms = appData.chatRooms.filter(r => r.roomId !== roomId);
    populateRoomsTable();
    updateCounters();
    notify('Room closed');
  }

  function flagMessage(roomId, from) { notify('Message flagged'); }

  function deleteMessage(roomId, from) {
    if (!confirm('Delete this message?')) return;
    appData.recentMessages = appData.recentMessages.filter(m => !(m.roomId === roomId && m.from === from));
    populateMessagesTable();
    notify('Message deleted');
  }

  function clearAlerts() {
    appData.securityAlerts = [];
    populateSecurityAlerts();
    notify('Alerts cleared');
  }

  function saveSettings() {
    const settings = {
      rateLimitMessages: +document.getElementById('rate-limit-messages').value,
      rateLimitConnections: +document.getElementById('rate-limit-connections').value,
      maxWaitTime: +document.getElementById('max-wait-time').value,
      genderPreference: document.getElementById('gender-preference').value === 'true'
    };
    console.log('Settings saved', settings);
    notify('Settings saved');
  }

  function exportData(type) {
    let data, file;
    if (type === 'users') { data = appData.activeUsers; file = 'users.json'; }
    else if (type === 'rooms') { data = appData.chatRooms; file = 'rooms.json'; }
    else if (type === 'messages') { data = appData.recentMessages; file = 'messages.json'; }
    else return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = file; a.click();
    URL.revokeObjectURL(url);
    notify('Data exported');
  }

  /* ------------------------------------------------------------------ */
  /*  Real-time Simulation                                              */
  /* ------------------------------------------------------------------ */
  function startSimulation() {
    // Update datetime every minute
    setInterval(updateDateTime, 60000);

    // Simulate traffic every 5s
    setInterval(() => {
      // Increase message counts & total messages
      appData.chatRooms.forEach(r => { if (Math.random() < 0.5) r.messageCount += Math.ceil(Math.random() * 3); });
      appData.systemStats.totalMessages += Math.ceil(Math.random() * 10);

      // Update last activity for random users
      appData.activeUsers.forEach(u => { if (Math.random() < 0.3) u.lastActivity = new Date().toISOString(); });

      // Refresh currently visible tables for live feel
      const activeId = document.querySelector('.tab-content.active')?.id;
      if (activeId === 'users') populateUsersTable();
      else if (activeId === 'chat-rooms') populateRoomsTable();
      else if (activeId === 'messages') populateMessagesTable();

      updateCounters();
    }, 5000);

    // Activity feed
    setInterval(() => {
      if (!dom.activityFeed) return;
      const actions = ['New user joined', 'Chat room created', 'Message sent', 'Room closed', 'User disconnected'];
      const text = actions[Math.floor(Math.random()*actions.length)];
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.innerHTML = `<span class="activity-time">${new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}</span><span class="activity-text">${text}</span>`;
      dom.activityFeed.prepend(item);
      while (dom.activityFeed.children.length > 10) dom.activityFeed.lastChild.remove();
    }, 8000);
  }

  function updateDateTime() {
    if (dom.datetime) dom.datetime.textContent = new Date().toLocaleString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  /* ------------------------------------------------------------------ */
  /*  Notifications                                                     */
  /* ------------------------------------------------------------------ */
  function notify(msg) {
    const n = document.createElement('div');
    n.textContent = msg;
    n.style.cssText = 'position:fixed;top:20px;right:20px;background:var(--color-success);color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;z-index:1001;opacity:0;transform:translateY(-10px);transition:opacity .3s ease,transform .3s ease';
    document.body.appendChild(n);
    requestAnimationFrame(() => { n.style.opacity = 1; n.style.transform = 'translateY(0)'; });
    setTimeout(() => { n.style.opacity = 0; n.style.transform = 'translateY(-10px)'; setTimeout(() => n.remove(), 300); }, 3000);
  }

  /* ------------------------------------------------------------------ */
  /*  Expose functions for inline onclick attributes (Settings, etc.)    */
  /* ------------------------------------------------------------------ */
  Object.assign(window, { viewUserDetails, kickUser, viewRoomDetails, closeRoom, flagMessage, deleteMessage, clearAlerts, saveSettings, exportData, closeModal });
})();