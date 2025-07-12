// Animación simple para avatares tipo Roblox en Three.js
// - Brazos abajo cuando está quieto
// - Brazos y piernas se mueven al caminar

export function animateRobloxAvatar(avatar, alias) {
    if (!avatar || !avatar.group) return;
    // Detectar si el avatar está en movimiento
    const moving = avatar.group.position.distanceTo(avatar.targetPosition) > 0.02;
    // Buscar huesos relevantes (solo la primera vez)
    if (!avatar.armLeft || !avatar.armRight || !avatar.legLeft || !avatar.legRight) {
        avatar.group.traverse(child => {
            if (child.isBone) {
                if (/arm_L/i.test(child.name)) avatar.armLeft = child;
                if (/arm_R/i.test(child.name)) avatar.armRight = child;
                if (/leg_L/i.test(child.name)) avatar.legLeft = child;
                if (/leg_R/i.test(child.name)) avatar.legRight = child;
            }
        });
    }
    // Parámetros de animación
    const t = performance.now() * 0.002 + (alias.hashCode?.() || 0);
    if (moving) {
        // Animación de caminar: balanceo de brazos y piernas
        const armSwing = Math.sin(t) * 0.6;
        const legSwing = Math.cos(t) * 0.6;
        if (avatar.armLeft) avatar.armLeft.rotation.x = armSwing;
        if (avatar.armRight) avatar.armRight.rotation.x = -armSwing;
        if (avatar.legLeft) avatar.legLeft.rotation.x = legSwing;
        if (avatar.legRight) avatar.legRight.rotation.x = -legSwing;
    } else {
        // Quieto: brazos rectos hacia abajo
        if (avatar.armLeft) avatar.armLeft.rotation.x = 0;
        if (avatar.armRight) avatar.armRight.rotation.x = 0;
        if (avatar.legLeft) avatar.legLeft.rotation.x = 0;
        if (avatar.legRight) avatar.legRight.rotation.x = 0;
    }
}

// Utilidad opcional para hashCode de string (alias)
if (!String.prototype.hashCode) {
    String.prototype.hashCode = function() {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
}
