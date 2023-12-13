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
                let lastFrameChild = null;

                for (const child of node.children) {
                    if (child.type === "FRAME") {
                        lastFrameChild = child;
                    }
                }

                if (lastFrameChild && "rotation" in lastFrameChild) {
                    lastFrameChild.rotation = (lastFrameChild.rotation - 90) % 360;
                    const roundedRotation = Math.round(lastFrameChild.rotation);
                    console.log(roundedRotation)
                    if (roundedRotation === 0 || roundedRotation === 360) {
                        lastFrameChild.x = 0;
                        lastFrameChild.y = 0;
                    } else if (roundedRotation === -90 || roundedRotation === 270) {
                        lastFrameChild.x = +node.width;
                        lastFrameChild.y = 0;
                    } else if (roundedRotation === -180 || roundedRotation === 180) {
                        lastFrameChild.x = +node.width;
                        lastFrameChild.y = +node.height;
                    } else if (roundedRotation === -270 || roundedRotation === 90) {
                        lastFrameChild.x = 0;
                        lastFrameChild.y = +node.height;
                    }
                }
            }
        });
    }
}
