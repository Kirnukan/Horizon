// CheckResponseMessage.ts
import * as Networker from "monorepo-networker";
import { NetworkSide } from "@common/network/sides";

export interface CheckResponsePayload {
  success: boolean;
  storedUuid: string,
  storedIpAddress: string,
}

export class CheckResponseMessage extends Networker.MessageType<CheckResponsePayload> {
  public receivingSide(): Networker.Side {
    return NetworkSide.UI;
  }

  public handle(payload: CheckResponsePayload, from: Networker.Side): void {
    // Handle the response from PLUGIN
    console.log('Response from PLUGIN:', payload);

    // If the request was successful, send a message to UI
    if (payload.success) {
      this.sendSuccessMessageToUI(payload);
    }
  }

  private sendSuccessMessageToUI(payload: CheckResponsePayload): void {
    // Send a message to UI
    // const storedUuid = figma.clientStorage.getAsync('uuid');
    // const storedIpAddress = figma.clientStorage.getAsync('ipAddress');
    parent.postMessage({ pluginMessage: { payload } }, '*');
  }
}
