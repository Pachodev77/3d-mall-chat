// Script para listar todos los huesos de un modelo FBX en Three.js
export function printAllBones(avatar) {
    if (!avatar || !avatar.group) return;
    console.log('--- Huesos del avatar:', avatar.group.name, '---');
    avatar.group.traverse(child => {
        if (child.isBone) {
            console.log('Bone:', child.name);
        }
    });
}
