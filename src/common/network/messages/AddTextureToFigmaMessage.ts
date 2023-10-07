import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
    image: ArrayBuffer;
    color: string;
    opacity: number;
}

export class AddTextureToFigmaMessage extends Networker.MessageType<Payload> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(payload: Payload, from: Networker.Side): void {
        try {
            console.log('Starting payload handling...');
            const imageHash = figma.createImage(new Uint8Array(payload.image)).hash;
            console.log('Image hash created:', imageHash);
    
            const nodes = figma.currentPage.selection;
            const color = payload.color;
    
            console.log('Selected nodes count:', nodes.length);
    
            if (nodes.length === 0) {
                console.error('No selected nodes');
                return;
            }
    
            nodes.forEach((node, idx) => {
                try {
                    console.log('Processing node', idx);
                    
                    if (node.type !== "FRAME") {
                        console.error('Node is not a frame');
                        return;
                    }
    
                    const topFrame = node.findOne((n: BaseNode) => n.type === "FRAME") as FrameNode;
                    if (!topFrame) {
                        console.error('Top frame not found');
                        return;
                    }
    
                    const clipPathGroup = topFrame.findOne((n: BaseNode) => n.type === "GROUP" && n.name === "Clip path group") as GroupNode;
                    if (!clipPathGroup) {
                        console.error('Clip path group not found');
                        return;
                    }
    
                    const vectorsGroup = clipPathGroup.findOne((n: BaseNode) => n.type === "GROUP" && !n.name.toLowerCase().startsWith('clip')) as GroupNode;
                    if (!vectorsGroup || vectorsGroup.children.length === 0) {
                        console.error('Vectors group not found or empty');
                        return;
                    }
    
                    const firstVector = vectorsGroup.children[0] as VectorNode;
                    const textureSize = Math.max(firstVector.width, firstVector.height);
                    const opacity = payload.opacity / 100;
                    const rectangle = createTextureRectangle(textureSize, imageHash, color, opacity);
    
                    console.log('Vectors group children count:', vectorsGroup.children.length);
    
                    const vectorsToMask: { vectorNode: VectorNode; vectorIdx: number; }[] = [];
    
                    vectorsGroup.children.forEach((vectorNode, vectorIdx) => {
                        try {
                            console.log('Processing vector node', vectorIdx);
                            console.log('vectorNode.type', vectorNode.type, '\n', vectorNode, color);
                    
                            console.log(vectorNode.type === 'VECTOR' && isMatchingColor(vectorNode, color));
                    
                            // If the vector node has the matching color, add it to the vectorsToMask array
                            if (vectorNode.type === "VECTOR" && isMatchingColor(vectorNode, color)) {
                                console.log(`Matching color on vector node ${vectorIdx}`);
                                vectorsToMask.push({ vectorNode, vectorIdx });
                            } 
                    
                        } catch (vectorNodeError) {
                            console.error('Error processing vector node', vectorIdx, vectorNodeError);
                        }
                    });
                    
                    // Now, iterate over vectorsToMask and create the mask groups
                    vectorsToMask.forEach(({ vectorNode, vectorIdx }) => {
                        // Check for an existing mask group and remove it
                        const existingMaskGroup = vectorNode.parent?.children.find((n: BaseNode) => n.name === `Mask group ${vectorIdx + 1}`) as GroupNode;
                        if (existingMaskGroup) {
                            existingMaskGroup.remove();
                            console.log('Existing mask removed');
                        }
                    
                        // Call createMaskGroup to create a new mask group
                        const maskGroup = createMaskGroup(vectorNode, rectangle, vectorIdx + 1);
                    
                        if (maskGroup) {
                            console.log('Mask group created');
                    
                            const clonedRectangle = rectangle.clone();
                            maskGroup.appendChild(clonedRectangle);
                            const vectorInMaskGroup = maskGroup.findOne((n: BaseNode) => n.type === "VECTOR");
                            if (vectorInMaskGroup) {
                                maskGroup.insertChild(0, vectorInMaskGroup);
                            }
                            renumberChildren(vectorNode.parent as GroupNode | FrameNode);
                            console.log('After creation Children names:', vectorNode.parent?.children.map((child: BaseNode) => child.name));
                            
                        } else {
                            console.error('Failed to create mask group');
                        }
                    });
                    handleToggleTexture(vectorsGroup, color, imageHash);
                } catch (nodeError) {
                    console.error('Error processing node', idx, nodeError);
                }
                
            });
        } catch (generalError) {
            console.error('Error handling payload:', generalError);
        }
    }
    
}

function toggleTexture(maskGroup: GroupNode): void {
    const originalVector = maskGroup.findOne(node => node.name === "Original Vector") as VectorNode;
    const rectangle = maskGroup.findOne(node => node.name === "Rectangle") as RectangleNode;

    if (!originalVector || !rectangle) {
        console.error('Original Vector or Rectangle not found in mask group', maskGroup);
        return;
    }

    // Если Original Vector выше Rectangle, мы переносим Rectangle выше, чтобы показать текстуру.
    // В противном случае, мы переносим Original Vector выше, чтобы скрыть текстуру.
    if (originalVector.parent && rectangle.parent) {
        const isTextureVisible = originalVector.parent.children.indexOf(originalVector) < originalVector.parent.children.indexOf(rectangle);
        if (isTextureVisible) {
            originalVector.parent.insertChild(originalVector.parent.children.indexOf(rectangle), originalVector);
        } else {
            rectangle.parent.insertChild(rectangle.parent.children.indexOf(originalVector), rectangle);
        }
    }
}

function handleToggleTexture(group: GroupNode, targetColor: string, newImageHash: string): void {
    console.log("handleToggleTexture called with target color:", targetColor);

    group.children.forEach((child, childIdx) => {
        console.log(`Processing child ${childIdx}: ${child.name}`);

        if (child.type === "GROUP" && child.name.startsWith("Mask group")) {
            console.log("Found a Mask group");

            const maskGroup = child as GroupNode;
            const rectangle = maskGroup.findOne(n => n.name.startsWith("Rectangle")) as RectangleNode;
            const vector = maskGroup.findOne(n => n.name.startsWith("Original Vector")) as VectorNode;

            if (rectangle && vector) {
                console.log("Found Rectangle and Original Vector");

                if (isMatchingColor(vector, targetColor)) {
                    console.log("Color matches target");

                    // Заменяем текстуру в Rectangle
                    replaceTextureInRectangle(maskGroup, newImageHash);

                    // Check if shouldToggle is not defined, then define it as true
                    if (vector.getPluginData("shouldToggle") === "") {
                        vector.setPluginData("shouldToggle", "true");
                    }

                    const shouldToggle = vector.getPluginData("shouldToggle") === "true";
                    console.log("Should toggle:", shouldToggle);

                    const rectIndex = maskGroup.children.indexOf(rectangle);
                    const vectorIndex = maskGroup.children.indexOf(vector);

                    console.log("Current indexes - Rectangle:", rectIndex, "Original Vector:", vectorIndex);

                    // If shouldToggle is true, toggle them
                    if (shouldToggle) {
                        console.log("Moving Original Vector above Rectangle");
                        maskGroup.insertChild(rectIndex, vector);
                        // Toggle shouldToggle value
                        vector.setPluginData("shouldToggle", "false");
                    } else {
                        console.log("Moving Rectangle above Original Vector");
                        maskGroup.insertChild(vectorIndex, rectangle);
                        // Toggle shouldToggle value
                        vector.setPluginData("shouldToggle", "true");
                    }

                    // Log the new order
                    console.log("New order:", maskGroup.children.map(ch => ch.name).join(", "));
                } else {
                    console.log("Color does NOT match target");
                }
            } else {
                console.log("Rectangle or Original Vector not found");
            }
        }
    });
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
    const maskName = `Mask group ${groupNumber}`;
    const originalPosition = { x: vectorNode.x, y: vectorNode.y };
    console.log('maskName', maskName);

    // Ищем существующую группу масок с таким же именем
    const existingMaskGroup = vectorNode.parent && vectorNode.parent.findOne(n => n.name === maskName) as GroupNode;

    if (existingMaskGroup) {
        // Логи для ветви, где существует группа масок
        console.log('Existing mask group found');
        
        // Найдена существующая группа масок, удаляем её и извлекаем вектор
        const originalVector = existingMaskGroup.findOne(n => n.name === `Original Vector ${groupNumber}`) as VectorNode;
        console.log('Original Vector:', originalVector); // Добавьте эту строку для отображения originalVector
        if (originalVector) {
            // Переименовываем оригинальный вектор
            originalVector.name = "Vector";
            // Вытащить вектор из масковой группы и поместить его в родительскую группу
            if (vectorNode.parent) {
                vectorNode.parent.appendChild(originalVector);
            }
        }
        // Удалить группу масок
        existingMaskGroup.remove();
        // Пересортировываем детей, если это необходимо
        renumberChildren(vectorNode.parent as GroupNode | FrameNode);
        return null;
    } else {
        // Логи для ветви, где нет существующей группы масок
        console.log('No existing mask group found');
        
        // Группы масок с таким именем нет, создаем новую группу масок
        const maskVector = vectorNode.clone();
        maskVector.name = maskName;
        maskVector.isMask = true;
        
        console.log('Mask Vector:', maskVector); // Добавьте эту строку для отображения maskVector
        vectorNode.name = `Original Vector ${groupNumber}`;

        if (vectorNode.parent && (vectorNode.parent.type === 'GROUP' || vectorNode.parent.type === 'FRAME')) {
            const parent = vectorNode.parent as (GroupNode | FrameNode);
            const maskGroup = figma.group([maskVector, vectorNode], parent);
            
            maskGroup.name = maskName;
            maskGroup.x = 0;
            maskGroup.y = 0;
            maskVector.x = originalPosition.x;
            maskVector.y = originalPosition.y;

            vectorNode.x = originalPosition.x;
            vectorNode.y = originalPosition.y;

            console.log(`Creating mask group ${maskName}...`);
            maskGroup.children.forEach((vec, idx) => {
                if (vec.type === "VECTOR" && vec.parent?.type === "GROUP") {
                    
                    // Если маска вертикальная, применяем трансформации
                    if (vec.parent.parent?.parent?.parent?.parent?.type === 'FRAME' && 
                    vec.parent.parent.parent.parent.parent.height > vec.parent.parent.parent.parent.parent.width) { 
                        vec.rotation = vectorNode.rotation;
                        vec.y = vectorNode.y;
                        vec.x = vectorNode.x;
                    } else {
                        console.log(`- Not modified (mask is not vertical)`);
                    }
                }
            });
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
}



function reorderChildrenByMaskAndVector(parent: GroupNode | FrameNode): void {
    const children = parent.children.slice();

    // Сортировка дочерних элементов родителя
    children.sort((a: SceneNode, b: SceneNode) => {
        const aNumber = extractNumberFromName(a.name);
        const bNumber = extractNumberFromName(b.name);

        if (a.name.includes("Mask group") && b.name.includes("Mask group")) {
            return aNumber - bNumber;
        }
        
        if (a.name.includes("Vector") && b.name.includes("Vector")) {
            return aNumber - bNumber;
        }

        if (a.name.includes("Mask group") && b.name.includes("Vector")) {
            if (aNumber < bNumber) return -1;
            if (aNumber > bNumber) return 1;
            return 0;
        }
        
        if (a.name.includes("Vector") && b.name.includes("Mask group")) {
            if (aNumber < bNumber) return -1;
            if (aNumber > bNumber) return 1;
            return 0;
        }

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


function extractNumberFromName(name: string): number {
    return parseInt(name.match(/(\d+)/)?.[0] || "0", 10);
}



function removeExistingMaskGroup(vectorNode: VectorNode, index: number): boolean {
    if (vectorNode.parent) {
        console.log('Looking for:', `Mask group ${index}`);
        console.log('Children names:', vectorNode.parent.children.map(child => child.name));

        // Найти существующую масковую группу
        const existingMaskGroup = vectorNode.parent.findOne(n => n.name === `Mask group ${index}`) as GroupNode;

        console.log('Found mask:', existingMaskGroup);

        if (existingMaskGroup) {
            // Найти оригинальный вектор внутри масковой группы
            const originalVector = existingMaskGroup.findOne(n => n.name === `Original Vector ${index}`) as VectorNode;

            if (originalVector) {
                // Переименовать оригинальный вектор
                originalVector.name = "Vector";

                // Вытащить вектор из масковой группы и поместить его в родительскую группу
                if (vectorNode.parent) {
                    vectorNode.parent.appendChild(originalVector);
                }
            }

            // Удалить масковую группу
            existingMaskGroup.remove();

            // Перенумеровать детей, если это необходимо
            renumberChildren(vectorNode.parent as GroupNode | FrameNode);

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
    
    // console.log('Has unnumbered vectors:', hasUnnumberedVectors);

    parent.children.forEach(child => {
        // console.log('Processing child:', child.name);
        
        if (hasUnnumberedVectors && child.type === "VECTOR" && child.name === "Vector") {
            child.name = `Vector ${vectorCounter}`;
            // console.log('Renamed to:', child.name);
            vectorCounter++;
        } else if (child.type === "GROUP" && child.name.startsWith("Mask group")) {
            const vectorInsideMask = (child as GroupNode).children.find(n => n.type === "VECTOR" && !n.name.startsWith("Original"));
            if (vectorInsideMask && vectorInsideMask.name.startsWith("Vector ")) {
                const vectorNumber = extractNumberFromName(vectorInsideMask.name);
                child.name = `Mask group ${vectorNumber}`;
                // console.log('Renamed mask group to:', child.name);
            }
        }
    });
}

function replaceTextureInRectangle(maskGroup: GroupNode, newImageHash: string): void {
    // Ищем объект Rectangle в группе масок
    const rectangle = maskGroup.findOne(node => node.name === "Rectangle" && node.type === "RECTANGLE") as RectangleNode;

    if (!rectangle) {
        console.error('Rectangle not found in mask group', maskGroup);
        return;
    }

    // Заменяем fill Rectangle новым изображением
    rectangle.fills = [{
        type: "IMAGE",
        scaleMode: "FILL",
        imageHash: newImageHash,
    }];
}


function createTextureRectangle(size: number, imageHash: string, color: string, opacity: number): RectangleNode {
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
    rect.opacity = opacity;
    return rect;
}