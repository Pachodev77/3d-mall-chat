// Sistema de persistencia robusta de muebles para habitación personal
// Guarda y restaura el catálogo completo de muebles (por defecto y agregados)

/**
 * Estructura de persistencia:
 * [
 *   {
 *     id: string | number, // único
 *     type: string,        // 'bed', 'nightstand', 'custom', etc
 *     name: string,        // nombre descriptivo
 *     file?: string,       // para modelos GLB
 *     category?: string,   // opcional
 *     position: { x, y, z },
 *     rotation: { y },
 *     scale?: { x, y, z }  // opcional
 *   }, ...
 * ]
 */

const FURNITURE_PERSIST_KEY = 'furnitureInventory';

function saveFurnitureInventory() {
    const inventory = furnitureObjects.map(f => ({
        id: f.id,
        type: f.type,
        name: f.name,
        file: f.file,
        category: f.category,
        position: {
            x: f.mesh.position.x,
            y: f.mesh.position.y,
            z: f.mesh.position.z,
        },
        rotation: {
            y: f.mesh.rotation.y,
        },
        scale: f.mesh.scale ? { x: f.mesh.scale.x, y: f.mesh.scale.y, z: f.mesh.scale.z } : undefined,
    }));
    localStorage.setItem(FURNITURE_PERSIST_KEY, JSON.stringify(inventory));
    console.log('[persistencia] Inventario de muebles guardado:', inventory);
}

async function loadFurnitureInventory() {
    const saved = localStorage.getItem(FURNITURE_PERSIST_KEY);
    if (!saved) return null;
    try {
        const inventory = JSON.parse(saved);
        // Limpiar muebles actuales
        furnitureObjects.forEach(f => {
            if (f.mesh && personalRoomScene) personalRoomScene.remove(f.mesh);
        });
        furnitureObjects = [];
        // Cargar cada mueble
        for (const entry of inventory) {
            if (entry.type === 'custom' && entry.file) {
                // Mueble personalizado, cargar GLB
                await loadFurnitureFBX(entry, entry.position, entry.rotation.y);
            } else {
                // Mueble por defecto, recrear por tipo
                createDefaultFurniture(entry);
            }
        }
        console.log('[persistencia] Inventario de muebles restaurado:', inventory);
        return inventory;
    } catch (e) {
        console.error('[persistencia] Error al cargar inventario de muebles:', e);
        return null;
    }
}

// Crea un mueble por defecto (cama, escritorio, etc) en la posición/rotación indicada
function createDefaultFurniture(entry) {
    if (!personalRoomScene) return;
    let mesh = null;
    let obj = null;
    switch (entry.type) {
        case 'bed': {
            const bedGroup = new THREE.Group();
            bedGroup.position.set(entry.position.x, entry.position.y, entry.position.z);
            bedGroup.rotation.y = entry.rotation.y;
            // Marco
            const bedFrameGeometry = new THREE.BoxGeometry(2.2, 0.4, 3.2);
            const bedFrameMaterial = getCachedMaterial(0x8B4513, 0.7, 0.1);
            const bedFrame = new THREE.Mesh(bedFrameGeometry, bedFrameMaterial);
            bedFrame.position.set(0, 0.2, 0);
            bedGroup.add(bedFrame);
            // Colchón
            const mattressGeometry = new THREE.BoxGeometry(2, 0.3, 3);
            const mattressMaterial = getCachedMaterial(0x4A90E2, 0.8, 0.1);
            const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
            mattress.position.set(0, 0.5, 0);
            bedGroup.add(mattress);
            // Almohadas
            const pillowGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.8);
            const pillowMaterial = getCachedMaterial(0xFFFFFF, 0.9, 0.1);
            const pillow1 = new THREE.Mesh(pillowGeometry, pillowMaterial);
            pillow1.position.set(-0.3, 0.65, -1.2);
            bedGroup.add(pillow1);
            const pillow2 = new THREE.Mesh(pillowGeometry, pillowMaterial);
            pillow2.position.set(0.3, 0.65, -1.2);
            bedGroup.add(pillow2);
            mesh = bedGroup;
            obj = { id: entry.id, name: entry.name, mesh, type: entry.type };
            break;
        }
        case 'nightstand': {
            const nightstandGeometry = new THREE.BoxGeometry(0.8, 0.7, 0.8);
            const nightstandMaterial = getCachedMaterial(0x8B4513, 0.7, 0.1);
            mesh = new THREE.Mesh(nightstandGeometry, nightstandMaterial);
            mesh.position.set(entry.position.x, entry.position.y, entry.position.z);
            mesh.rotation.y = entry.rotation.y;
            obj = { id: entry.id, name: entry.name, mesh, type: entry.type };
            break;
        }
        case 'lamp': {
            const lampGroup = new THREE.Group();
            lampGroup.position.set(entry.position.x, entry.position.y, entry.position.z);
            lampGroup.rotation.y = entry.rotation.y;
            const lampBaseGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.1, 8);
            const lampBaseMaterial = getCachedMaterial(0x2C3E50, 0.8, 0.2);
            const lampBase = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
            lampBase.position.set(0, 0.75, 0);
            lampGroup.add(lampBase);
            const lampPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6);
            const lampPoleMaterial = getCachedMaterial(0x2C3E50, 0.8, 0.2);
            const lampPole = new THREE.Mesh(lampPoleGeometry, lampPoleMaterial);
            lampPole.position.set(0, 1, 0);
            lampGroup.add(lampPole);
            const lampShadeGeometry = new THREE.ConeGeometry(0.3, 0.2, 8);
            const lampShadeMaterial = getCachedMaterial(0xECF0F1, 0.9, 0.1);
            const lampShade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial);
            lampShade.position.set(0, 1.25, 0);
            lampShade.rotation.x = Math.PI;
            lampGroup.add(lampShade);
            mesh = lampGroup;
            obj = { id: entry.id, name: entry.name, mesh, type: entry.type };
            break;
        }
        case 'desk': {
            const deskGroup = new THREE.Group();
            deskGroup.position.set(entry.position.x, entry.position.y, entry.position.z);
            deskGroup.rotation.y = entry.rotation.y;
            const deskGeometry = new THREE.BoxGeometry(2.5, 0.1, 1.2);
            const deskMaterial = getCachedMaterial(0x8B4513, 0.7, 0.1);
            const desk = new THREE.Mesh(deskGeometry, deskMaterial);
            desk.position.set(0, 0.7, 0);
            deskGroup.add(desk);
            for (let i = 0; i < 4; i++) {
                const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 6);
                const legMaterial = getCachedMaterial(0x8B4513, 0.7, 0.1);
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                const x = (i % 2 === 0 ? -1 : 1) * 1.2;
                const z = (i < 2 ? -1 : 1) * 0.5;
                leg.position.set(x, 0.35, z);
                deskGroup.add(leg);
            }
            mesh = deskGroup;
            obj = { id: entry.id, name: entry.name, mesh, type: entry.type };
            break;
        }
        case 'chair': {
            const chairGroup = new THREE.Group();
            chairGroup.position.set(entry.position.x, entry.position.y, entry.position.z);
            chairGroup.rotation.y = entry.rotation.y;
            const chairSeatGeometry = new THREE.BoxGeometry(0.7, 0.1, 0.7);
            const chairSeatMaterial = getCachedMaterial(0x2C3E50, 0.8, 0.1);
            const chairSeat = new THREE.Mesh(chairSeatGeometry, chairSeatMaterial);
            chairSeat.position.set(0, 0.45, 0);
            chairGroup.add(chairSeat);
            const chairBackGeometry = new THREE.BoxGeometry(0.7, 0.8, 0.1);
            const chairBackMaterial = getCachedMaterial(0x2C3E50, 0.8, 0.1);
            const chairBack = new THREE.Mesh(chairBackGeometry, chairBackMaterial);
            chairBack.position.set(0, 0.85, -0.4);
            chairGroup.add(chairBack);
            for (let i = 0; i < 4; i++) {
                const chairLegGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 6);
                const chairLegMaterial = getCachedMaterial(0x2C3E50, 0.8, 0.1);
                const chairLeg = new THREE.Mesh(chairLegGeometry, chairLegMaterial);
                const x = (i % 2 === 0 ? -1 : 1) * 0.3;
                const z = (i < 2 ? -1 : 1) * 0.3;
                chairLeg.position.set(x, 0.225, z);
                chairGroup.add(chairLeg);
            }
            mesh = chairGroup;
            obj = { id: entry.id, name: entry.name, mesh, type: entry.type };
            break;
        }
        case 'computer': {
            const computerGroup = new THREE.Group();
            computerGroup.position.set(entry.position.x, entry.position.y, entry.position.z);
            computerGroup.rotation.y = entry.rotation.y;
            const monitorGeometry = new THREE.BoxGeometry(1.4, 0.9, 0.1);
            const monitorMaterial = getCachedMaterial(0x000000, 0.8, 0.2);
            const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
            monitor.position.set(0, 1.3, 0);
            computerGroup.add(monitor);
            const monitorBaseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8);
            const monitorBaseMaterial = getCachedMaterial(0x2C3E50, 0.8, 0.2);
            const monitorBase = new THREE.Mesh(monitorBaseGeometry, monitorBaseMaterial);
            monitorBase.position.set(0, 0.8, 0);
            computerGroup.add(monitorBase);
            const cpuGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.2);
            const cpuMaterial = getCachedMaterial(0x2C3E50, 0.8, 0.2);
            const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
            cpu.position.set(1.5, 0.7, 0);
            computerGroup.add(cpu);
            const keyboardGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.4);
            const keyboardMaterial = getCachedMaterial(0x34495E, 0.8, 0.1);
            const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
            keyboard.position.set(0, 0.75, 0.5);
            computerGroup.add(keyboard);
            const mouseGeometry = new THREE.BoxGeometry(0.12, 0.05, 0.2);
            const mouseMaterial = getCachedMaterial(0x34495E, 0.8, 0.1);
            const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
            mouse.position.set(1.2, 0.75, 0.5);
            computerGroup.add(mouse);
            mesh = computerGroup;
            obj = { id: entry.id, name: entry.name, mesh, type: entry.type };
            break;
        }
        default:
            return;
    }
    if (mesh && personalRoomScene) {
        personalRoomScene.add(mesh);
        furnitureObjects.push(obj);
    }
}

// Utiliza saveFurnitureInventory y loadFurnitureInventory en lugar de los métodos antiguos
