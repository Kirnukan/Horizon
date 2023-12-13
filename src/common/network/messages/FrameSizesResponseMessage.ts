import * as Networker from "monorepo-networker";
import { NetworkSide } from "../sides";

interface Payload {
    sizes: { width: number, height: number }[];
}

export class FrameSizesResponseMessage extends Networker.MessageType<Payload> {
    public receivingSide(): Networker.Side {
        return NetworkSide.UI;
    }

    public handle(payload: Payload, from: Networker.Side): void {
      console.log(payload.sizes);
  }  
}
