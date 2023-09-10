import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

export class RotateFrameMessage extends Networker.MessageType<{}> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(_payload: {}, from: Networker.Side): void {
        const nodes = figma.currentPage.selection;
    
        nodes.forEach(node => {
            if (node.type === "FRAME" && node.width === node.height) {
                const lastChild = node.children[node.children.length - 1];
                if (lastChild && "rotation" in lastChild) {
                    // Поворачиваем изображение против часовой стрелки
                    lastChild.rotation = (lastChild.rotation - 90) % 360;
                    const roundedRotation = Math.round(lastChild.rotation);
                    console.log(roundedRotation)
                    if (roundedRotation === 0 || roundedRotation === 360) {
                        lastChild.x = 0;
                        lastChild.y = 0;
                    } else if (roundedRotation === -90 || roundedRotation === 270) {
                        lastChild.x = +node.width;
                        lastChild.y = 0;
                    } else if (roundedRotation === -180 || roundedRotation === 180) {
                        lastChild.x = +node.width;
                        lastChild.y = +node.height;
                    } else if (roundedRotation === -270 || roundedRotation === 90) {
                        lastChild.x = 0;
                        lastChild.y = +node.height;
                    }
                }
            }
        });
    }
    
}
