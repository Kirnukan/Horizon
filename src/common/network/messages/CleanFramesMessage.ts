import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

export class CleanFramesMessage extends Networker.MessageType<{}> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }
  
    public handle(_: {}, from: Networker.Side): void {
        const nodes = figma.currentPage.selection;
  
        for (const node of nodes) {
            if ("children" in node && node.type === "FRAME") {
                const childNodes = node.children;
                if (childNodes.length > 0) {
                    childNodes[childNodes.length - 1].remove();
                }
            }
        }
    }
  }
  