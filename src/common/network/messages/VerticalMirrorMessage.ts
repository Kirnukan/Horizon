import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

export class VerticalMirrorMessage extends Networker.MessageType<{}> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(_payload: {}, from: Networker.Side): void {
        const nodes = figma.currentPage.selection;

        nodes.forEach(node => {
            if (node.type === "FRAME" && node.height > node.width) {  
                const lastChild = node.children[node.children.length - 1];
                if (lastChild && "rotation" in lastChild) {
                    lastChild.rotation = (lastChild.rotation + 180) % 360;
                    const roundedRotation = Math.round(lastChild.rotation);
                    console.log(roundedRotation)
                    if (roundedRotation === 0 || roundedRotation === 360) {
                        lastChild.x = 0;
                        lastChild.y = 0;
                    } else if (roundedRotation === 180) {
                        lastChild.y = +node.height;
                        lastChild.x = +node.width;
                    }
                }
            }
        });
    }
}
