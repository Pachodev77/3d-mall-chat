// Sistema de persistencia robusta de muebles para habitación personal
// Guarda y restaura el catálogo completo de muebles (solo GLB)

/**
 * Estructura de persistencia:
 * [
 *   {
 *     id: string,          // único, generado en la creación
 *     name: string,        // nombre descriptivo
 *     file: string,        // archivo del modelo GLB
 *     category: string,    // categoría del mueble
 *     position: { x, y, z },
 *     rotation: { y },
 *     scale: { x, y, z }
 *   }, ...
 * ]
 */

const FURNITURE_PERSIST_KEY = 'furnitureInventory';

// Exponer funciones globalmente
window.loadFurnitureInventory = loadFurnitureInventory;
window.getAvailableFurniture = getAvailableFurniture;

async function getAvailableFurniture() {
    try {
        const response = await fetch('./public/availableFurniture.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar los muebles disponibles:', error);
        return [];
    }
}


/**
 * Guarda el estado actual de todos los muebles (objetos GLB) en el localStorage.
 */
function saveFurnitureInventory() {
    if (!furnitureObjects) {
        console.error('[persistencia] No hay array de muebles para guardar.');
        return;
    }
    const inventory = furnitureObjects.map(f => ({
        id: f.id,
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
        scale: { x: f.mesh.scale.x, y: f.mesh.scale.y, z: f.mesh.scale.z },
    }));
    localStorage.setItem(FURNITURE_PERSIST_KEY, JSON.stringify(inventory));
    console.log(`[persistencia] Inventario de ${inventory.length} muebles guardado.`);
}

/**
 * Carga los muebles desde el localStorage, limpiando la escena primero.
 * Todos los muebles se cargan como modelos GLB.
 */
async function loadFurnitureInventory() {
    const saved = localStorage.getItem(FURNITURE_PERSIST_KEY);
    if (!saved) {
        console.log('[persistencia] No se encontró inventario guardado.');
        return null;
    }

    try {
        const inventory = JSON.parse(saved);
        
        // Limpiar completamente los muebles actuales de la escena y del array
        while(furnitureObjects.length > 0) {
            const f = furnitureObjects.pop();
            if (f.mesh && personalRoomScene) {
                personalRoomScene.remove(f.mesh);
            }
        }

        console.log(`[persistencia] Restaurando ${inventory.length} muebles...`);

        // Cargar cada mueble del inventario como un GLB
        for (const entry of inventory) {
            if (entry.file) {
                // La función loadFurnitureGLB (antes loadFurnitureFBX) se encargará de todo
                await loadFurnitureGLB(entry, entry.position, entry.rotation.y, entry.scale);
            } else {
                console.warn(`[persistencia] Se omitió un mueble sin propiedad 'file':`, entry);
            }
        }

        console.log('[persistencia] Inventario de muebles restaurado exitosamente.');
        updateFurnitureList(); // Actualizar la lista en la UI
        return inventory;
    } catch (e) {
        console.error('[persistencia] Error crítico al cargar el inventario de muebles. El localStorage podría estar corrupto.', e);
        // Considerar limpiar el item dañado para evitar errores futuros
        // localStorage.removeItem(FURNITURE_PERSIST_KEY);
        return null;
    }
}
