import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
    image: ArrayBuffer;
    color: string;
}

export class AddTextureToFigmaMessage extends Networker.MessageType<Payload> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(payload: Payload, from: Networker.Side): void {
        const imageHash = figma.createImage(new Uint8Array(payload.image)).hash;
        const nodes = figma.currentPage.selection;
        const color = payload.color;

        console.log('Handling payload with color:', color);

        if (nodes.length === 0) {
            console.error('No selected nodes');
            return;
        }

        nodes.forEach(node => {
            if (node.type !== "FRAME") {
                console.error('Node is not a frame');
                return;
            }

            const topFrame = node.findOne(n => n.type === "FRAME") as FrameNode;

            if (!topFrame) {
                console.error('Top frame not found');
                return;
            }

            const clipPathGroup = topFrame.findOne(n => n.type === "GROUP" && n.name === "Clip path group") as GroupNode;

            if (!clipPathGroup) {
                console.error('Clip path group not found');
                return;
            }

            const vectorsGroup = clipPathGroup.findOne(n => n.type === "GROUP" && !n.name.toLowerCase().startsWith('clip')) as GroupNode;

            if (!vectorsGroup || vectorsGroup.children.length === 0) {
                console.error('Vectors group not found or empty');
                return;
            }

            const firstVector = vectorsGroup.children[0] as VectorNode;
            const textureSize = Math.max(firstVector.width, firstVector.height);
            const rectangle = createTextureRectangle(textureSize, imageHash, color);

            vectorsGroup.children.forEach((vectorNode, idx) => {
                if (vectorNode.type === "VECTOR" && isMatchingColor(vectorNode, color)) {
                    const existingMaskRemoved = removeExistingMaskGroup(vectorNode, idx + 1);

                    if (existingMaskRemoved) return;

                    if (vectorNode.parent) {
                        const maskGroup = createMaskGroup(vectorNode, rectangle, idx + 1);
                        if (maskGroup) {
                            // ensureMaskOrder(vectorNode.parent as GroupNode | FrameNode);
                            const clonedRectangle = rectangle.clone();
                            maskGroup.appendChild(clonedRectangle);
                            const vectorInMaskGroup = maskGroup.findOne(n => n.type === "VECTOR");
                            if (vectorInMaskGroup) {
                                maskGroup.insertChild(0, vectorInMaskGroup);
                            }
                            renumberChildren(vectorNode.parent as GroupNode | FrameNode);
                        } else {
                            console.error('Failed to create mask group');
                        }
                    } else {
                        console.error('Vector node has no parent');
                    }
                }
            });
        });
    }
}

function isMatchingColor(vectorNode: VectorNode, color: string): boolean {
    const fills = vectorNode.fills as SolidPaint[];
    const targetColor = hexToRgb(color);
    const delta = 0.01;

    return fills.some(fill => 
        Math.abs(fill.color.r - targetColor.r) < delta &&
        Math.abs(fill.color.g - targetColor.g) < delta &&
        Math.abs(fill.color.b - targetColor.b) < delta
    );
}

function hexToRgb(hex: string): RGB {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: ((bigint >> 16) & 255) / 255,
        g: ((bigint >> 8) & 255) / 255,
        b: (bigint & 255) / 255
    };
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

function createMaskGroup(vectorNode: VectorNode, rectangle: RectangleNode, groupNumber: number): GroupNode | null {
    const maskName = `Mask ${groupNumber}`;
    const originalPosition = { x: vectorNode.x, y: vectorNode.y };

    if (vectorNode.parent && vectorNode.parent.name === `Mask group ${groupNumber}`) {
        const parent = vectorNode.parent as GroupNode;
        vectorNode.name = `Vector ${groupNumber}`;
        vectorNode.x = originalPosition.x;
        vectorNode.y = originalPosition.y;
        parent.remove();

        reorderChildrenByMaskAndVector(vectorNode.parent as GroupNode | FrameNode);
        return null;
    }

    const maskVector = vectorNode.clone();
    maskVector.name = maskName;
    maskVector.isMask = true;

    vectorNode.name = `Original Vector ${groupNumber}`;

    if (vectorNode.parent && (vectorNode.parent.type === 'GROUP' || vectorNode.parent.type === 'FRAME')) {
        const parent = vectorNode.parent as (GroupNode | FrameNode);
        const maskGroup = figma.group([maskVector, vectorNode], parent);
        maskGroup.name = `Mask group ${groupNumber}`;
        maskGroup.x = 0;
        maskGroup.y = 0;
        maskVector.x = originalPosition.x;
        maskVector.y = originalPosition.y;
        vectorNode.x = originalPosition.x;
        vectorNode.y = originalPosition.y;

        if (renameVectorsOutsideMasks(parent)) {
            renumberChildren(parent);
        }
    
        reorderChildrenByMaskAndVector(parent);

        return maskGroup;
    } else {
        console.error("No valid parent found for the vector node. Cannot create a mask group.");
        return null;
    }
}
function reorderChildrenByMaskAndVector(parent: GroupNode | FrameNode): void {
    const children = parent.children.slice();

    // Сортировка дочерних элементов родителя
    children.sort((a: SceneNode, b: SceneNode) => {
        const aNumber = extractNumberFromName(a.name);
        const bNumber = extractNumberFromName(b.name);

        if (a.name.includes("Mask group") && b.name.includes("Mask group")) {
            return aNumber - bNumber; // Сортируем маски в порядке возрастания
        }
        
        if (a.name.includes("Vector") && b.name.includes("Vector")) {
            return aNumber - bNumber; // Сортируем векторы в порядке возрастания
        }

        if (a.name.includes("Mask group")) return -1; // Mask groups должны быть выше
        if (b.name.includes("Mask group")) return 1; // Mask groups должны быть выше

        return 0; // Для всех остальных случаев
    });

    children.forEach((child, index) => {
        parent.insertChild(index, child);
    });

    // Упорядочивание элементов внутри каждой Mask group
    parent.children.forEach(child => {
        if (child.type === "GROUP" && child.name.startsWith('Mask group')) {
            const maskGroup = child as GroupNode;
            const maskGroupChildren = maskGroup.children.slice();

            maskGroupChildren.sort((a: SceneNode, b: SceneNode) => {
                if (a.name.includes("Mask") && b.name.includes("Vector")) return -1;
                if (a.name.includes("Vector") && b.name.includes("Mask")) return 1;
                return 0;
            });

            maskGroupChildren.forEach((maskChild, index) => {
                maskGroup.insertChild(index, maskChild);
            });
        }
    });
}







function ensureMaskOrder(parent: GroupNode | FrameNode): void {
    const maskGroups: GroupNode[] = [];

    parent.children.forEach(child => {
        if (child.type === "GROUP" && child.name.startsWith('Mask group')) {
            maskGroups.push(child as GroupNode);
        }
    });

    // Сортируем в прямом порядке
    maskGroups.sort((a, b) => parseInt(a.name.split(' ')[2]) - parseInt(b.name.split(' ')[2]));

    maskGroups.forEach((group, idx) => {
        parent.insertChild(parent.children.length - 1 - idx, group);
    });
}




function extractNumberFromName(name: string): number {
    return parseInt(name.match(/(\d+)/)?.[0] || "0", 10);
}



function removeExistingMaskGroup(vectorNode: VectorNode, index: number): boolean {
    if (vectorNode.parent) {
        const existingMaskGroup = vectorNode.parent.findOne(n => n.name === `Mask group ${index}`) as GroupNode;
        if (existingMaskGroup) {
            existingMaskGroup.remove();
            renumberChildren(vectorNode.parent as GroupNode | FrameNode);  // добавьте этот вызов
            return true;
        }
    }
    return false;
}

function renameVectorsOutsideMasks(parent: GroupNode | FrameNode): boolean {
    let counter = 1;  // Начнем нумерацию с 1
    let renamed = false;  // флаг для отслеживания переименований

    // Получим номера всех существующих масок
    const existingMaskNumbers = parent.children
        .filter(child => child.type === "GROUP" && child.name.startsWith("Mask group"))
        .map(maskGroup => extractNumberFromName(maskGroup.name));

    parent.children.forEach(child => {
        if (child.type === "VECTOR" && !child.name.startsWith("Original") && !child.name.startsWith("Mask")) {
            // Если номер уже существует как номер маски, пропустим его
            while (existingMaskNumbers.includes(counter)) {
                counter++;
            }
            child.name = `Vector ${counter}`;
            counter++;
            renamed = true;
        }
    });

    if (renamed) {
        renumberChildren(parent);
    }
    
    return renamed;
}




function renumberChildren(parent: GroupNode | FrameNode): void {
    let vectorCounter = 1;
    
    // Проверяем, есть ли хотя бы один вектор без номера
    const hasUnnumberedVectors = parent.children.some(child => child.type === "VECTOR" && child.name === "Vector");
    
    console.log('Has unnumbered vectors:', hasUnnumberedVectors);

    parent.children.forEach(child => {
        console.log('Processing child:', child.name);
        
        if (hasUnnumberedVectors && child.type === "VECTOR" && child.name === "Vector") {
            child.name = `Vector ${vectorCounter}`;
            console.log('Renamed to:', child.name);
            vectorCounter++;
        } else if (child.type === "GROUP" && child.name.startsWith("Mask group")) {
            const vectorInsideMask = (child as GroupNode).children.find(n => n.type === "VECTOR" && !n.name.startsWith("Original"));
            if (vectorInsideMask && vectorInsideMask.name.startsWith("Vector ")) {
                const vectorNumber = extractNumberFromName(vectorInsideMask.name);
                child.name = `Mask group ${vectorNumber}`;
                console.log('Renamed mask group to:', child.name);
            }
        }
    });
}




function createTextureRectangle(size: number, imageHash: string, color: string): RectangleNode {
    const rect = figma.createRectangle();
    rect.resize(size, size);
    rect.fills = [{
        type: "IMAGE",
        scaleMode: "FILL",
        imageHash: imageHash,
        blendMode: (color.toLowerCase() !== "#ffffff" && color.toLowerCase() !== "#000000") ? "OVERLAY" : "NORMAL" // Задаем режим наложения для цветных текстур
    }];
    rect.strokes = [{
        type: "SOLID",
        color: hexToRgb(color)
    }];
    return rect;
}