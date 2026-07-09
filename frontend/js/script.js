document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesArea = document.getElementById('messages');

    function createMessage(text, type = 'outgoing') {
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${type}`;

        const sender = type === 'outgoing' ? 'You' : 'Lina';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        bubble.innerHTML = `
            <p style="font-weight: 600; font-size: 0.8rem; margin-bottom: 0.25rem; ${type === 'incoming' ? 'color: var(--accent-emerald);' : ''}">${sender}</p>
            ${text}
            <p style="font-size: 0.7rem; opacity: 0.6; margin-top: 0.5rem; text-align: right;">${time}</p>
        `;

        return bubble;
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            const msg = createMessage(text, 'outgoing');
            messagesArea.appendChild(msg);
            chatInput.value = '';
            chatInput.style.height = 'auto';
            messagesArea.scrollTop = messagesArea.scrollHeight;

            // Simulated response
            setTimeout(() => {
                const response = createMessage("Got it! I've updated the tracking for that item.", 'incoming');
                messagesArea.appendChild(response);
                messagesArea.scrollTop = messagesArea.scrollHeight;

                // Refresh Lucide icons if any new ones were added (not in this case but good practice)
                if (window.lucide) lucide.createIcons();
            }, 1000);
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-expand textarea
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight) + 'px';
        });
    }

    // Initialize Sidebar active states
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    sidebarIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            sidebarIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });
});
