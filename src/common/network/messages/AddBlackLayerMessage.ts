import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

// import MyImage from "@ui/assets/vite.svg?raw";

interface Payload {
    color: { r: 0, g: 0, b: 0 };
    svg: string;
}

export class AddBlackLayerMessage extends Networker.MessageType<Payload> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(payload: Payload, from: Networker.Side): void {
        const nodes = figma.currentPage.selection;

        for (const node of nodes) {
            if ("children" in node && node.type === "FRAME") {
                const blackLayer = figma.createRectangle();
                blackLayer.x = 0;
                blackLayer.y = 0;
                blackLayer.resize(node.width, node.height);
                blackLayer.fills = [{ type: "SOLID", color: payload.color }];
                node.appendChild(blackLayer);

                const imageLayer = figma.createRectangle();
                imageLayer.x = 0;
                imageLayer.y = 0;
                imageLayer.resize(node.width, node.height);
                imageLayer.fills = []; // Set to empty array for full transparency
                node.appendChild(imageLayer);

                // Create SVG node from raw SVG string
                const svgNode = figma.createNodeFromSvg(payload.svg);
                svgNode.x = 0;
                svgNode.y = 0;
                svgNode.resize(node.width, node.height);
                svgNode.fills = []; // Set to empty array for full transparency
                node.appendChild(svgNode);
            }
        }

        figma.closePlugin();
    }
}
