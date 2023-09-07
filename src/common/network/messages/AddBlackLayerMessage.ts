import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";


interface Payload {
    svg: string;
}


export class AddBlackLayerMessage extends Networker.MessageType<Payload> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(payload: Payload, from: Networker.Side): void {
        const nodes = figma.currentPage.selection;
        let svgString = payload.svg
    

        for (const node of nodes) {
            if ("children" in node && node.type === "FRAME") {

                // Create SVG node from raw SVG string
                const svgNode = figma.createNodeFromSvg(svgString);

                // Get the original dimensions of the SVG
                const originalWidth = svgNode.width;
                const originalHeight = svgNode.height;
                

                // Determine the aspect ratio of the SVG
                const aspectRatio = originalWidth / originalHeight;

                // Determine the new dimensions based on the frame shape
                let newWidth, newHeight;
                if (node.width === node.height) {  // Square frame
                    newWidth = newHeight = Math.min(node.width, node.height);
                } else if (node.height > node.width) {  // Vertical frame
                    newWidth = node.width;
                    newHeight = newWidth / aspectRatio;
                } else {  // Horizontal frame
                    newHeight = node.height;
                    newWidth = newHeight * aspectRatio;
                }

                // Calculate the center position
                const centerX = (node.width - newWidth) / 2;
                const centerY = (node.height - newHeight) / 2;

                svgNode.x = centerX;
                svgNode.y = centerY;
                svgNode.resize(newWidth, newHeight);
                svgNode.fills = []; // Set to empty array for full transparency
                node.appendChild(svgNode);

            }
        }
    }
}
