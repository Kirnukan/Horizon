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

        if (topFrame) {
            console.log('Found top frame:', topFrame);

            const clipPathGroup = topFrame.findOne(n => n.type === "GROUP" && n.name === "Clip path group") as GroupNode;

            if (clipPathGroup) {
                console.log('Found clip path group:', clipPathGroup);

                const vectorsGroup = clipPathGroup.findOne(n => n.type === "GROUP" && !n.name.toLowerCase().startsWith('clip')) as GroupNode;


                if (vectorsGroup && vectorsGroup.children.length > 0) {
                  console.log('Found vectors group:', vectorsGroup);

                // Инициализация rectangle перед созданием масок
                const firstVector = vectorsGroup.children[0] as VectorNode;
                const textureSize = Math.max(firstVector.width, firstVector.height);
                const rectangle = createTextureRectangle(textureSize, imageHash, color);


                    // 1. Создание масок
                    const maskGroups: GroupNode[] = [];
                    vectorsGroup.children.forEach(vectorNode => {
                        console.log('Checking vector node:', vectorNode);
                        
                        if (vectorNode.type === "VECTOR" && isMatchingColor(vectorNode as VectorNode, color)) {
                            console.log('Found matching vector node:', vectorNode);
                            
                            const existingTexture = vectorsGroup.findOne(n => n.name === 'Texture' && n.type === 'RECTANGLE') as RectangleNode;
                            if (existingTexture) {
                                console.log('Removing existing texture');
                                existingTexture.remove();
                            }
                            
                            if (vectorNode.parent) {
                              const maskGroup = createMaskGroup(vectorNode as VectorNode, rectangle);
                              if (maskGroup) {
                                    maskGroups.push(maskGroup);
                                } else {
                                    console.error('Failed to create mask group');
                                }
                            } else {
                                console.error('Vector node has no parent');
                            }
                        }
                    });

                // 2. Создание текстур для каждой маски
                  maskGroups.forEach(maskGroup => {
                    const clonedRectangle = rectangle.clone();
                    maskGroup.insertChild(0, clonedRectangle); // Добавляем на первое место
                });
            } else {
                console.error('Vectors group not found or empty');
            }
            } else {
                console.error('Clip path group not found');
            }
        } else {
            console.error('Top frame not found');
        }
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

function createMaskGroup(vectorNode: VectorNode, rectangle: RectangleNode): GroupNode | null {
  const maskVector = vectorNode.clone();
  maskVector.name = 'Vector';
  maskVector.isMask = true;

  let maskGroup: GroupNode | null = null;

  if (vectorNode.parent) {
      const index = vectorNode.parent.children.indexOf(vectorNode);
      maskGroup = figma.group([rectangle], vectorNode.parent);
      maskGroup.appendChild(maskVector);

      maskGroup.name = 'Mask group';
      maskGroup.x = 0;
      maskGroup.y = 0;
      rectangle.x = 0;
      rectangle.y = 0;
      maskVector.x = vectorNode.x;
      maskVector.y = vectorNode.y;
      maskGroup.insertChild(0, maskVector);  // Добавляем вектор на первое место в группе

      

      vectorNode.parent.insertChild(index, maskGroup);
      // После добавления маски в родительскую группу
      vectorNode.parent.insertChild(index + 1, vectorNode);

  } else {
      console.error("No parent found for the vector node. Cannot create a mask group.");
  }

  return maskGroup;
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
  rectangle.name = 'Texture';
  rectangle.resize(size, size);  // Квадратная текстура
  rectangle.fills = [imageFill];

  // Установите координаты текстуры на 0,0
  rectangle.x = 0;
  rectangle.y = 0;

  console.log('Texture rectangle created:', rectangle);
  console.log('Image fill:', rectangle.fills);  // Для проверки, корректно ли установлена текстура

  return rectangle;
}
