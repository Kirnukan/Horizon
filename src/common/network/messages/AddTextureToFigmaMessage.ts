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
  
          // Инициализация rectangle перед созданием масок
          const firstVector = vectorsGroup.children[0] as VectorNode;
          const textureSize = Math.max(firstVector.width, firstVector.height);
          const rectangle = createTextureRectangle(textureSize, imageHash, color);
  
          vectorsGroup.children.forEach((vectorNode, idx) => {
              if (vectorNode.type === "VECTOR" && isMatchingColor(vectorNode, color)) {
                  const existingMaskRemoved = removeExistingMaskGroup(vectorNode, idx + 1);
  
                  // Если существующая маска была найдена и удалена, просто переходим к следующему узлу
                  if (existingMaskRemoved) return;
  
                  // Если не было существующей маски, создаем новую
                  if (vectorNode.parent) {
                      const maskGroup = createMaskGroup(vectorNode, rectangle, idx + 1);
                      if (maskGroup) {
                          const clonedRectangle = rectangle.clone();
                          maskGroup.appendChild(clonedRectangle);
                          const vectorInMaskGroup = maskGroup.findOne(n => n.type === "VECTOR");
                          if (vectorInMaskGroup) {
                              maskGroup.insertChild(0, vectorInMaskGroup);
                          }
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

    return fills.some(fill => fill.color.r === hexToRgb(color).r &&
        fill.color.g === hexToRgb(color).g &&
        fill.color.b === hexToRgb(color).b);
}

function hexToRgb(hex: string): RGB {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

function createMaskGroup(vectorNode: VectorNode, rectangle: RectangleNode, groupNumber: number): GroupNode | null {
  const maskVector = vectorNode.clone();
  maskVector.name = `Vector ${groupNumber}`;
  maskVector.isMask = true;

  let maskGroup: GroupNode | null = null;

  if (vectorNode.parent) {
      const index = vectorNode.parent.children.indexOf(vectorNode);
      maskGroup = figma.group([maskVector], vectorNode.parent);
      maskGroup.name = `Mask group ${groupNumber}`;
      maskGroup.x = 0;
      maskGroup.y = 0;
      maskVector.x = vectorNode.x;
      maskVector.y = vectorNode.y;

      // Переупорядочивание дочерних элементов в родительском GroupNode
      if (vectorNode.parent && vectorNode.parent.type === "GROUP") {
          reorderChildrenByNumber(vectorNode.parent as GroupNode);
      }
      
      // Перемещаем Vector на верхний уровень внутри Mask group
      // maskGroup.insertChild(0, maskVector);
  } else {
      console.error("No parent found for the vector node. Cannot create a mask group.");
  }

  return maskGroup;
}


// Функция для переупорядочивания дочерних элементов в GroupNode на основе их номеров
function reorderChildrenByNumber(group: GroupNode): void {
  // Сортировка дочерних элементов по их имени (номеру)
  const sortedChildren = group.children.slice().sort((a, b) => {
      const aNumber = parseInt(a.name.split(' ').pop() || '0', 10);
      const bNumber = parseInt(b.name.split(' ').pop() || '0', 10);
      return aNumber - bNumber;
  });

  sortedChildren.forEach((child, index) => {
      group.insertChild(index, child);
  });
}

function removeExistingMaskGroup(vectorNode: VectorNode, index: number): boolean {
  if (vectorNode.parent) {
      const existingMaskGroup = vectorNode.parent.findOne(n => n.name === `Mask group ${index}`) as GroupNode;
      if (existingMaskGroup) {
          existingMaskGroup.remove();
          return true;  // Возвращаем true, если группа была найдена и удалена
      }
  }
  return false;  // Возвращаем false, если группа не была найдена
}


function hasMask(vectorNode: VectorNode): boolean {
  const maskGroup = vectorNode.parent;
  if (maskGroup && maskGroup.type === "GROUP" && maskGroup.name.startsWith("Mask group")) {
      return true;
  }
  return false;
}

function hasMaskGroupForVector(vectorNode: VectorNode): boolean {
  return !!(vectorNode.parent && vectorNode.parent.type === "GROUP" && vectorNode.parent.name.startsWith("Mask group"));
}



function createTextureRectangle(size: number, imageHash: string, color: string): RectangleNode {
    console.log('Creating texture rectangle with color:', color);

    const imageFill: Paint = {
        type: "IMAGE",
        scaleMode: "FIT",
        imageHash: imageHash,
        blendMode: color !== '#000000' && color !== '#ffffff' ? "OVERLAY" : "NORMAL"
    };

    const rectangle = figma.createRectangle();
    rectangle.resize(size, size);
    rectangle.fills = [imageFill];

    rectangle.x = 0;
    rectangle.y = 0;

    console.log('Texture rectangle created:', rectangle);
    console.log('Image fill:', rectangle.fills);

    return rectangle;
}
