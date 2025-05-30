/**
 * Pixel Messenger - 8-bit Emotional Messenger App
 * Handles emotion selection, message templates, and email submission
 */

class PixelMessenger {
    constructor() {
        this.selectedEmotion = null;
        this.currentScreen = 'intro';
        this.correctPassword = 'magiclobster';
        this.messageTemplates = {
            angry: [
                "I'm really frustrated right now! 😠",
                "This situation is making me so angry!",
                "I need to vent about what happened today.",
                "I'm upset and need someone to talk to."
            ],
            sad: [
                "I'm feeling really down today... 😢",
                "Everything feels overwhelming right now.",
                "I could use some comfort and support.",
                "Having a tough time and feeling sad."
            ],
            miss: [
                "I miss you so much right now 🥺",
                "Thinking about you and wishing you were here.",
                "Can't stop thinking about you today.",
                "Missing our time together so much."
            ],
            bored: [
                "I'm so bored right now... 😐",
                "Nothing exciting is happening today.",
                "Wish there was something fun to do!",
                "Just sitting here, bored out of my mind."
            ],
            happy: [
                "Feeling super happy today! 😊",
                "Everything just feels right!",
                "Sending you positive vibes and smiles!",
                "Life is good and I'm smiling."
            ],
            excited: [
                "I'm so excited, I can't wait! 🤩",
                "Something awesome is coming up!",
                "My energy is through the roof right now!",
                "Feeling pumped and ready for anything!"
            ],
            frisky: [
                "Feeling a little frisky today... 😏",
                "Got that playful mood going on!",
                "Someone stop me before I flirt too much!",
                "My mind is in the gutter, oops!"
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startIntroSequence();
    }

    startIntroSequence() {
        // Hide all screens initially
        const mainApp = document.getElementById('main-app');
        const loginScreen = document.getElementById('login-screen');
        const passwordScreen = document.getElementById('password-screen');
        
        mainApp.style.display = 'none';
        loginScreen.style.display = 'none';
        passwordScreen.style.display = 'none';
        
        // After intro animation completes, show login screen
        setTimeout(() => {
            const introOverlay = document.getElementById('intro-overlay');
            if (introOverlay) {
                introOverlay.style.display = 'none';
            }
            this.showLoginScreen();
        }, 3500);
    }

    setupEventListeners() {
        // Login screen listeners
        const loginSubmit = document.getElementById('login-submit');
        if (loginSubmit) {
            loginSubmit.addEventListener('click', () => this.handleLoginSubmit());
        }

        // Password screen listeners
        const passwordSubmit = document.getElementById('password-submit');
        if (passwordSubmit) {
            passwordSubmit.addEventListener('click', () => this.handlePasswordSubmit());
        }

        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showLoginScreen());
        }

        const passwordInput = document.getElementById('password-input');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handlePasswordSubmit();
                }
            });
        }

        // Emotion button listeners
        const emotionButtons = document.querySelectorAll('.emotion-btn');
        emotionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectEmotion(e));
        });

        // Form submission
        const messageForm = document.getElementById('message-form');
        if (messageForm) {
            messageForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Character counter
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.addEventListener('input', (e) => this.updateCharacterCount(e));
        }

        // Template button listeners (will be added dynamically)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('template-btn')) {
                this.selectTemplate(e.target.textContent);
            }
        });
    }

    showLoginScreen() {
        this.currentScreen = 'login';
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('password-screen').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
        
        // Reset form state
        const radioButtons = document.querySelectorAll('input[name="loginChoice"]');
        radioButtons.forEach(radio => radio.checked = false);
    }

    showPasswordScreen() {
        this.currentScreen = 'password';
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('password-screen').style.display = 'flex';
        
        // Reset password form
        document.getElementById('password-input').value = '';
        document.getElementById('password-error').style.display = 'none';
        
        // Focus on password input
        setTimeout(() => {
            document.getElementById('password-input').focus();
        }, 100);
    }

    showMainApp() {
        this.currentScreen = 'main';
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('password-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }

    handleLoginSubmit() {
        const selectedChoice = document.querySelector('input[name="loginChoice"]:checked');
        
        if (!selectedChoice) {
            // Add visual feedback for no selection
            const loginOptions = document.querySelector('.login-options');
            loginOptions.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                loginOptions.style.animation = '';
            }, 500);
            return;
        }

        const isLoveOfLife = selectedChoice.value === 'true';
        
        if (isLoveOfLife) {
            // Proceed to main app for Sanya
            this.createPixelEffect(selectedChoice.closest('.pixel-checkbox'));
            setTimeout(() => {
                this.showMainApp();
            }, 800);
        } else {
            // Show password screen for others
            this.showPasswordScreen();
        }
    }

    handlePasswordSubmit() {
        const passwordInput = document.getElementById('password-input');
        const password = passwordInput.value.trim();
        const errorDiv = document.getElementById('password-error');
        
        if (password === this.correctPassword) {
            // Correct password - redirect to admin panel
            this.createPixelEffect(passwordInput);
            setTimeout(() => {
                window.location.href = '/admin';
            }, 800);
        } else {
            // Incorrect password - show error and redirect back
            errorDiv.style.display = 'block';
            passwordInput.style.borderColor = 'hsl(0 60% 50%)';
            passwordInput.style.background = 'hsl(0 60% 95%)';
            
            // Shake animation for input
            passwordInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                passwordInput.style.animation = '';
            }, 500);
            
            // After delay, redirect back to login
            setTimeout(() => {
                this.showLoginScreen();
            }, 3000);
        }
    }

    selectEmotion(event) {
        const button = event.currentTarget;
        const emotion = button.dataset.emotion;
        const emoji = button.dataset.emoji;
        const label = button.querySelector('.emotion-label').textContent;

        // Remove previous selection
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Mark current selection
        button.classList.add('selected');
        this.selectedEmotion = emotion;

        // Update selected emotion display
        const selectedEmoji = document.querySelector('.selected-emoji');
        const selectedLabel = document.querySelector('.selected-label');
        selectedEmoji.textContent = emoji;
        selectedLabel.textContent = `Feeling ${label}`;

        // Show message card with animation
        const messageCard = document.getElementById('message-card');
        messageCard.style.display = 'block';
        setTimeout(() => {
            messageCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Populate templates
        this.populateTemplates(emotion);

        // Add some pixel effects
        this.createPixelEffect(button);
    }

    populateTemplates(emotion) {
        const templateContainer = document.querySelector('.template-buttons');
        templateContainer.innerHTML = '';

        const templates = this.messageTemplates[emotion] || [];
        templates.forEach(template => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'template-btn';
            btn.textContent = template;
            templateContainer.appendChild(btn);
        });
    }

    selectTemplate(template) {
        const messageTextarea = document.getElementById('message');
        messageTextarea.value = template;
        this.updateCharacterCount({ target: messageTextarea });
        
        // Add visual feedback
        messageTextarea.focus();
        messageTextarea.style.background = 'hsl(162 70% 85% / 0.3)';
        setTimeout(() => {
            messageTextarea.style.background = '';
        }, 500);
    }

    updateCharacterCount(event) {
        const textarea = event.target;
        const charCount = document.getElementById('char-count');
        const currentLength = textarea.value.length;
        const maxLength = 300;

        charCount.textContent = currentLength;
        
        // Change color when approaching limit
        if (currentLength > maxLength * 0.8) {
            charCount.style.color = 'hsl(0 60% 50%)';
        } else {
            charCount.style.color = '';
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const sendBtn = document.getElementById('send-btn');
        const btnText = sendBtn.querySelector('.btn-text');
        
        // Validate required fields
        if (!this.selectedEmotion) {
            this.showStatus('error', 'Please select an emotion first!');
            return;
        }

        // Prepare data for database
        const messageData = {
            emotion: this.selectedEmotion,
            emoji: document.querySelector('.selected-emoji').textContent,
            message: formData.get('message') || ''
        };

        // Show loading state
        sendBtn.classList.add('loading');
        btnText.textContent = 'SAVING...';
        this.createSendAnimation();

        try {
            // Save to database
            const response = await fetch('/save-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showStatus('success', 'Message saved successfully! 🎉');
                form.reset();
                this.resetForm();
            } else {
                throw new Error(result.message || 'Failed to save message');
            }
        } catch (error) {
            console.error('Error saving message:', error);
            this.showStatus('error', 'Failed to save message. Please try again.');
        } finally {
            // Reset button state
            sendBtn.classList.remove('loading');
            btnText.textContent = 'SAVE MESSAGE';
        }
    }

    showStatus(type, message) {
        const statusCard = document.getElementById('message-status');
        const statusContent = statusCard.querySelector('.status-content');
        
        const icon = type === 'success' ? '✅' : '❌';
        const className = type === 'success' ? 'status-success' : 'status-error';
        
        // Clear existing content
        statusContent.innerHTML = '';
        
        // Create and append status icon safely
        const iconDiv = document.createElement('div');
        iconDiv.className = 'status-icon';
        iconDiv.textContent = icon;
        statusContent.appendChild(iconDiv);
        
        // Create and append message paragraph safely
        const messageP = document.createElement('p');
        messageP.className = className;
        messageP.textContent = message; // Use textContent to prevent XSS
        statusContent.appendChild(messageP);
        
        statusCard.style.display = 'block';
        setTimeout(() => {
            statusCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Hide status after 5 seconds
        setTimeout(() => {
            statusCard.style.display = 'none';
        }, 5000);
    }

    resetForm() {
        // Reset emotion selection
        this.selectedEmotion = null;
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Hide message card
        const messageCard = document.getElementById('message-card');
        messageCard.style.display = 'none';

        // Reset character count
        document.getElementById('char-count').textContent = '0';
    }

    createPixelEffect(element) {
        // Create animated pixel particles around the selected emotion
        const rect = element.getBoundingClientRect();
        const colors = ['#FFB3B3', '#B3FFEC', '#FFE4B3', '#B3B3FF'];
        
        for (let i = 0; i < 8; i++) {
            const pixel = document.createElement('div');
            pixel.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: ${colors[i % colors.length]};
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            
            document.body.appendChild(pixel);
            
            // Animate pixel
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50;
            const targetX = rect.left + rect.width / 2 + Math.cos(angle) * distance;
            const targetY = rect.top + rect.height / 2 + Math.sin(angle) * distance;
            
            pixel.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${targetX - rect.left - rect.width / 2}px, ${targetY - rect.top - rect.height / 2}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => pixel.remove();
        }
    }

    createSendAnimation() {
        // Create mail flying animation
        const mailIcon = document.querySelector('.btn-icon').cloneNode(true);
        mailIcon.style.cssText = `
            position: fixed;
            width: 24px;
            height: 24px;
            z-index: 1000;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            filter: brightness(0) invert(1);
            pointer-events: none;
        `;
        
        document.body.appendChild(mailIcon);
        
        // Animate mail flying away
        mailIcon.animate([
            { 
                transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
                opacity: 1 
            },
            { 
                transform: 'translate(200px, -200px) scale(0.5) rotate(45deg)',
                opacity: 0 
            }
        ], {
            duration: 1500,
            easing: 'ease-in'
        }).onfinish = () => mailIcon.remove();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PixelMessenger();
});

// Add some retro console styling
console.log(`
    ██████╗ ██╗██╗  ██╗███████╗██╗         
    ██╔══██╗██║╚██╗██╔╝██╔════╝██║         
    ██████╔╝██║ ╚███╔╝ █████╗  ██║         
    ██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║         
    ██║     ██║██╔╝ ██╗███████╗███████╗    
    ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝    
                                           
    ███╗   ███╗███████╗███████╗███████╗███████╗███╗   ██╗ ██████╗ ███████╗██████╗ 
    ████╗ ████║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝ ██╔════╝██╔══██╗
    ██╔████╔██║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║██║  ███╗█████╗  ██████╔╝
    ██║╚██╔╝██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║██║   ██║██╔══╝  ██╔══██╗
    ██║ ╚═╝ ██║███████╗███████║███████║███████╗██║ ╚████║╚██████╔╝███████╗██║  ██║
    ╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
    
    Welcome to Pixel Messenger! 🎮
    Express your emotions in 8-bit style.
`);
