// AddEffectToFigmaMessage.ts

import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
    image: ArrayBuffer;
}

export class AddEffectToFigmaMessage extends Networker.MessageType<Payload> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(payload: Payload, from: Networker.Side): void {
        const imageHash = figma.createImage(new Uint8Array(payload.image)).hash;
        const nodes = figma.currentPage.selection;

        nodes.forEach(node => {
            if (node.type === "FRAME") {
                const imageFill: Paint = {
                    type: "IMAGE",
                    scaleMode: "FIT",
                    imageHash: imageHash,
                    blendMode: "SCREEN", // Setting blend mode to SCREEN
                };

                const rectangle = figma.createRectangle();
                rectangle.resize(node.width, node.height);
                rectangle.fills = [imageFill];

                rectangle.x = (node.width - rectangle.width) / 2;
                rectangle.y = (node.height - rectangle.height) / 2;

                node.appendChild(rectangle);
            }
        });
    }
}
