import * as Networker from "monorepo-networker";
import { NetworkSide } from "../sides";
import { FrameSizesResponseMessage } from "./FrameSizesResponseMessage";

export class RequestFrameSizesMessage extends Networker.MessageType<null> {
    public receivingSide(): Networker.Side {
        return NetworkSide.PLUGIN;
    }

    public handle(_: null, from: Networker.Side): void {
      const nodes = figma.currentPage.selection;
      const sizes = nodes.map(node => ({ width: node.width, height: node.height }));
      // Отправка ответа в UI
      new FrameSizesResponseMessage("frame-sizes-response").send({sizes});
    }
}
