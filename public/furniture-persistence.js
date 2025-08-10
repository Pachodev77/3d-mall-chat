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

// Variables globales que serán inyectadas desde index.html
let furnitureObjects = [];
let personalRoomScene = null;

/**
 * Elimina un mueble de la escena y del array de muebles
 * @param {string} furnitureId - ID del mueble a eliminar
 * @returns {boolean} - true si se eliminó correctamente, false en caso contrario
 */
function removeFurniture(furnitureId) {
    if (!furnitureId) {
        console.error('[persistencia] Se intentó eliminar un mueble sin ID');
        return false;
    }

    // Encontrar el índice del mueble en el array
    const index = furnitureObjects.findIndex(f => f.id === furnitureId);
    if (index === -1) {
        console.error(`[persistencia] No se encontró el mueble con ID: ${furnitureId}`);
        return false;
    }

    const furniture = furnitureObjects[index];
    
    try {
        // Remover de la escena
        if (furniture.mesh && personalRoomScene) {
            personalRoomScene.remove(furniture.mesh);
            
            // Limpiar recursos
            if (furniture.mesh.traverse) {
                furniture.mesh.traverse(child => {
                    if (child.isMesh) {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(m => m.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    }
                });
            }
        }

        // Eliminar del array
        furnitureObjects.splice(index, 1);
        
        console.log(`[persistencia] Mueble eliminado: ${furniture.name} (ID: ${furnitureId})`);
        
        // Guardar cambios
        saveFurnitureInventory();
        
        return true;
    } catch (error) {
        console.error(`[persistencia] Error al eliminar el mueble ${furnitureId}:`, error);
        return false;
    }
}

// Exponer funciones globalmente
window.loadFurnitureInventory = loadFurnitureInventory;
window.getAvailableFurniture = getAvailableFurniture;
window.saveFurnitureInventory = saveFurnitureInventory;
window.removeFurniture = removeFurniture;
window.initFurniturePersistence = initFurniturePersistence;

// Función para inicializar las referencias necesarias
function initFurniturePersistence(scene, furnitureArray) {
    personalRoomScene = scene;
    furnitureObjects = furnitureArray;
}

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
    if (!furnitureObjects || !Array.isArray(furnitureObjects)) {
        console.error('[persistencia] No hay array de muebles para guardar o no es un array válido.');
        return;
    }
    
    try {
        const inventory = furnitureObjects.map(f => {
            if (!f || !f.mesh) {
                console.warn('[persistencia] Se encontró un mueble inválido al guardar:', f);
                return null;
            }
            
            return {
                id: f.id || `furniture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: f.name || 'Mueble sin nombre',
                file: f.file || '',
                category: f.category || 'general',
                // Guardar la posición base (Y=0) para evitar acumulación de altura
                // La posición Y se ajustará al cargar el mueble basado en su altura
                position: {
                    x: f.mesh.position.x || 0,
                    y: 0, // Siempre guardamos Y=0 como base
                    z: f.mesh.position.z || 0,
                },
                // Guardar la altura del modelo para posicionamiento correcto
                modelHeight: f.modelHeight || 0,
                rotation: {
                    y: f.mesh.rotation.y || 0,
                },
                scale: { 
                    x: f.mesh.scale ? f.mesh.scale.x : 1, 
                    y: f.mesh.scale ? f.mesh.scale.y : 1, 
                    z: f.mesh.scale ? f.mesh.scale.z : 1 
                },
            };
        }).filter(Boolean); // Filtrar elementos nulos
        
        console.log('[persistencia] Guardando inventario:', inventory);
        localStorage.setItem(FURNITURE_PERSIST_KEY, JSON.stringify(inventory));
        console.log(`[persistencia] Inventario de ${inventory.length} muebles guardado correctamente.`);
        
        // Verificar que se guardó correctamente
        const savedData = localStorage.getItem(FURNITURE_PERSIST_KEY);
        if (!savedData) {
            throw new Error('No se pudo guardar el inventario en localStorage');
        }
        
        return true;
    } catch (error) {
        console.error('[persistencia] Error al guardar el inventario:', error);
        return false;
    }
}

/**
 * Carga los muebles desde el localStorage, limpiando la escena primero.
 * Todos los muebles se cargan como modelos GLB.
 */
async function loadFurnitureInventory() {
    console.log('[DEBUG] loadFurnitureInventory called.'); // Add this
    console.log('[DEBUG] personalRoomScene inside loadFurnitureInventory:', personalRoomScene); // Add this
    if (!personalRoomScene) {
        console.error('[persistencia] La escena de la habitación personal no está inicializada');
        return null;
    }

    const saved = localStorage.getItem(FURNITURE_PERSIST_KEY);
    let inventory = [];

    if (!saved) {
        console.log('[persistencia] No se encontró inventario guardado. Cargando diseño por defecto...');
        inventory = await loadDefaultFurnitureLayout(); // Load default layout
        // Save default layout to localStorage immediately so it's not reloaded on subsequent visits
        saveFurnitureInventory(); // This will save the newly loaded default furniture
    } else {
        try {
            inventory = JSON.parse(saved);
            console.log(`[persistencia] Restaurando ${inventory.length} muebles desde el inventario guardado...`);
        } catch (e) {
            console.error('[persistencia] Error crítico al cargar el inventario de muebles. El localStorage podría estar corrupto. Cargando diseño por defecto...', e);
            localStorage.removeItem(FURNITURE_PERSIST_KEY); // Clear corrupted data
            inventory = await loadDefaultFurnitureLayout(); // Load default layout
            saveFurnitureInventory(); // Save the newly loaded default furniture
        }
    }

    // Limpiar completamente los muebles actuales de la escena y del array
    while(furnitureObjects.length > 0) {
        const f = furnitureObjects.pop();
        if (f && f.mesh) {
            try {
                if (personalRoomScene) {
                    personalRoomScene.remove(f.mesh);
                }
                // Limpiar materiales y geometrías
                if (f.mesh.traverse) {
                    f.mesh.traverse(child => {
                        if (child.isMesh) {
                            if (child.geometry) child.geometry.dispose();
                            if (child.material) {
                                if (Array.isArray(child.material)) {
                                    child.material.forEach(m => m.dispose());
                                } else {
                                    child.material.dispose();
                                }
                            }
                        }
                    });
                }
            } catch (e) {
                console.error('Error al limpiar mueble:', e);
            }
        }
    }

    // Cargar cada mueble del inventario como un GLB
    for (const entry of inventory) {
        if (entry.file) {
            try {
                console.log(`[persistencia] Cargando mueble:`, entry);
                // Asegurarnos de que todos los campos necesarios estén presentes
                const furnitureData = {
                    id: entry.id || `furniture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure ID for default items
                    name: entry.name || 'Mueble sin nombre',
                    file: entry.file,
                    category: entry.category || 'general',
                    position: entry.position || { x: 0, y: 0, z: 0 },
                    rotation: entry.rotation || { y: 0 },
                    scale: entry.scale || { x: 1, y: 1, z: 1 }
                };
                
                await loadFurnitureGLB(furnitureData, furnitureData.position, furnitureData.rotation.y, furnitureData.scale);
                console.log(`[persistencia] Mueble cargado: ${furnitureData.name}`);
            } catch (error) {
                console.error(`[persistencia] Error al cargar mueble:`, error);
            }
        } // Closing brace for if (entry.file)
        else { // Correctly matched else
            console.warn(`[persistencia] Se omitió un mueble sin propiedad 'file':`, entry);
        }
    } // Closing brace for for (const entry of inventory)

    console.log('[persistencia] Inventario de muebles restaurado exitosamente.');
    updateFurnitureList(); // Actualizar la lista en la UI
    return inventory;
}

// New function to load default furniture layout
async function loadDefaultFurnitureLayout() {
    const defaultLayout = window.DEFAULT_FURNITURE_LAYOUT; // Access the global variable
    const loadedDefaultFurniture = [];

    for (const furnitureData of defaultLayout) {
        try {
            // Generate a unique ID for default furniture items
            const uniqueId = `default_furniture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const furnitureWithId = { ...furnitureData, id: uniqueId };

            await loadFurnitureGLB(furnitureWithId, furnitureWithId.position, furnitureWithId.rotation.y, furnitureWithId.scale);
            loadedDefaultFurniture.push(furnitureWithId);
            console.log(`[persistencia] Mueble por defecto cargado: ${furnitureWithId.name}`);
        } catch (error) {
            console.error(`[persistencia] Error al cargar mueble por defecto ${furnitureData.name}:`, error);
        }
    }
    return loadedDefaultFurniture;
}


