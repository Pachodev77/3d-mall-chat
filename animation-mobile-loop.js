// Loop dedicado para animaciones de mixers en móvil
(function(){
    if (!window.IS_MOBILE) return;
    // Esperar a que THREE y userAvatars estén definidos
    function startMobileAnimationLoop() {
        if (typeof THREE === 'undefined' || typeof userAvatars === 'undefined' || typeof clock === 'undefined') {
            setTimeout(startMobileAnimationLoop, 200);
            return;
        }
        let lastUpdate = performance.now();
        setInterval(function() {
            const now = performance.now();
            let deltaTime = (now - lastUpdate) / 1000;
            lastUpdate = now;
            // Clamp deltaTime para evitar saltos grandes si el tab estuvo inactivo
            if (deltaTime > 0.1) deltaTime = 0.016;
            userAvatars.forEach((avatar) => {
                if (avatar.mixer) {
                    avatar.mixer.update(deltaTime);
                }
            });
        }, 1000/60);
    }
    startMobileAnimationLoop();
})();
