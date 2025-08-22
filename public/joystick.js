class Joystick {
    constructor(containerId, knobId, options = {}) {
        this.container = document.getElementById(containerId);
        this.knob = document.getElementById(knobId);
        this.maxDistance = options.maxDistance || 50;
        this.onMove = options.onMove || (() => {});
        this.onEnd = options.onEnd || (() => {});
        
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.rect = null;
        
        this.init();
    }
    
    init() {
        this.rect = this.container.getBoundingClientRect();
        
        // Touch events
        this.container.addEventListener('touchstart', this.handleStart.bind(this));
        document.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleEnd.bind(this));
        
        // Mouse events
        this.container.addEventListener('mousedown', this.handleStart.bind(this));
        document.addEventListener('mousemove', this.handleMove.bind(this));
        document.addEventListener('mouseup', this.handleEnd.bind(this));
        
        // Prevent context menu on joystick
        this.container.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    handleStart(e) {
        e.preventDefault();
        this.active = true;
        this.rect = this.container.getBoundingClientRect();
        this.updatePosition(e);
    }
    
    handleMove(e) {
        if (!this.active) return;
        e.preventDefault();
        this.updatePosition(e);
        
        // Calculate distance from center
        const distance = Math.min(Math.sqrt(this.x * this.x + this.y * this.y), this.maxDistance);
        const angle = Math.atan2(this.y, this.x);
        
        // Normalize to 0-1 range
        const normalizedX = (distance / this.maxDistance) * Math.cos(angle);
        const normalizedY = (distance / this.maxDistance) * Math.sin(angle);
        
        // Move the knob
        const knobX = this.x;
        const knobY = this.y;
        this.knob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
        
        // Call the move callback
        this.onMove({
            x: normalizedX,
            y: normalizedY,
            angle: angle,
            distance: distance / this.maxDistance
        });
    }
    
    handleEnd() {
        if (!this.active) return;
        this.active = false;
        
        // Reset knob position
        this.knob.style.transform = 'translate(-50%, -50%)';
        this.x = 0;
        this.y = 0;
        
        // Call the end callback
        this.onEnd();
    }
    
    updatePosition(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Calculate position relative to the center of the joystick
        const centerX = this.rect.left + this.rect.width / 2;
        const centerY = this.rect.top + this.rect.height / 2;
        
        this.x = clientX - centerX;
        this.y = clientY - centerY;
        
        // Limit to max distance
        const distance = Math.sqrt(this.x * this.x + this.y * this.y);
        if (distance > this.maxDistance) {
            const ratio = this.maxDistance / distance;
            this.x *= ratio;
            this.y *= ratio;
        }
    }
}

// Initialize joysticks when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile devices
    if (!/Mobi|Android/i.test(navigator.userAgent)) {
        document.getElementById('joystick-container').style.display = 'none';
        return;
    }
    
    // Left joystick for movement (forward/backward and strafe)
    const leftJoystick = new Joystick('left-joystick', 'left-knob', {
        maxDistance: 50,
        onMove: (data) => {
            // Forward/backward movement (negative Y is forward)
            mobileForward = data.y < -0.1;
            mobileBackward = data.y > 0.1;
            
            // Strafe left/right
            mobileLeft = data.x < -0.3;
            mobileRight = data.x > 0.3;
        },
        onEnd: () => {
            mobileForward = false;
            mobileBackward = false;
            mobileLeft = false;
            mobileRight = false;
        }
    });
    
    // Right joystick for camera rotation
    const rightJoystick = new Joystick('right-joystick', 'right-knob', {
        maxDistance: 50,
        onMove: (data) => {
            // Rotate camera based on X movement
            if (data.x < -0.3) {
                mobileLeft = true;
                mobileRight = false;
            } else if (data.x > 0.3) {
                mobileRight = true;
                mobileLeft = false;
            } else {
                mobileLeft = false;
                mobileRight = false;
            }
        },
        onEnd: () => {
            mobileLeft = false;
            mobileRight = false;
        }
    });
    
    // Hide joysticks when chat is open
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatPanel = document.getElementById('chat-panel');
    const joystickContainer = document.getElementById('joystick-container');
    
    const updateJoystickVisibility = () => {
        if (chatPanel.style.display === 'flex') {
            joystickContainer.style.display = 'none';
        } else if (window.innerWidth <= 768) {
            joystickContainer.style.display = 'flex';
        }
    };
    
    // Initial check
    updateJoystickVisibility();
    
    // Update on chat toggle
    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => {
            // Small delay to ensure the chat panel state is updated
            setTimeout(updateJoystickVisibility, 50);
        });
    }
    
    // Update on window resize
    window.addEventListener('resize', updateJoystickVisibility);
});
