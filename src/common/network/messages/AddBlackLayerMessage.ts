import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
    svgStandard: string;
    svgWide: string;
}

export class AddBlackLayerMessage extends Networker.MessageType<Payload> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(payload: Payload, from: Networker.Side): void {
        const nodes = figma.currentPage.selection;

        nodes.forEach(node => {
            if (node.type === "FRAME") {
                let svgToUse;

                if (node.width === node.height) {
                    svgToUse = payload.svgStandard;
                } else {
                    svgToUse = payload.svgWide;
                }

                const svgNode = figma.createNodeFromSvg(svgToUse);

                if (node.height > node.width) {
                    svgNode.rotation = -90;

                    svgNode.resize(node.height, node.width);

                    svgNode.x = node.width;
                    svgNode.y = 0;
                    
                } else {
                    const aspectRatioSvg = svgNode.width / svgNode.height;
                    let newWidth, newHeight;
                    if (node.width / node.height > aspectRatioSvg) {
                        newWidth = node.width;
                        newHeight = newWidth / aspectRatioSvg;
                    } else {
                        newHeight = node.height;
                        newWidth = newHeight * aspectRatioSvg;
                    }

                    svgNode.resize(newWidth, newHeight);
                    svgNode.x = (node.width - newWidth) / 2;
                    svgNode.y = (node.height - newHeight) / 2;
                }

                node.appendChild(svgNode);
                svgNode.fills = [];
            }
        });
    }
}