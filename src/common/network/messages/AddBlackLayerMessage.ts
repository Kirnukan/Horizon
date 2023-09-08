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

                if (node.width === node.height) {  // Square frame
                    svgToUse = payload.svgStandard;
                } else {  // Both Vertical and Horizontal frame use Wide
                    svgToUse = payload.svgWide;
                }

                const svgNode = figma.createNodeFromSvg(svgToUse);

                if (node.height > node.width) {  // Vertical frame
                    svgNode.rotation = -90;

                    // Fit the SVG to the frame size
                    svgNode.resize(node.height, node.width);

                    // Centering the SVG node inside the frame
                    svgNode.x = node.width;
                    svgNode.y = 0;
                    
                } else {
                    // Resize SVG to fit the frame for non-vertical frames
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

                // Add the node after positioning and resizing to make positioning relative to frame
                node.appendChild(svgNode);
                svgNode.fills = []; // Set to empty array for full transparency
            }
        });
    }
}