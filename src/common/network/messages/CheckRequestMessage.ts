// CheckRequestMessage.ts
import * as Networker from "monorepo-networker";
import { NetworkSide } from "@common/network/sides";
import { CheckResponseMessage, CheckResponsePayload } from "./CheckResponseMessage";
import { NetworkMessages } from "../messages";

interface CheckRequestPayload {
  ipAddress: string;
  uuid: string;
}

export class CheckRequestMessage extends Networker.MessageType<CheckRequestPayload, Promise<void>> {
  public receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  public async handle(payload: CheckRequestPayload, from: Networker.Side): Promise<void> {
    try {
      // Ensure figma is defined
      if (typeof figma !== 'undefined') {
        // Try to get values from figma.clientStorage
        // await figma.clientStorage.deleteAsync('ipAddress');
        const storedUuid = await figma.clientStorage.getAsync('uuid');
        // const payloadIpAddress = await payload.ipAddress
        console.log('ip Stored - ', payload.ipAddress)
        await figma.clientStorage.setAsync('ipAddress', payload.ipAddress);
        const storedIpAddress = await figma.clientStorage.getAsync('ipAddress');
        const allIps = await figma.clientStorage.keysAsync()
        console.log('ip - ', storedIpAddress)
        console.log('ips - ', allIps)
        // If values are not present, save the received values
        // if (storedIpAddress !== payloadIpAddress) {

        // }
        // console.log('ip 2 - ', figma.clientStorage.getAsync('ipAddress'))
        if (!storedUuid) {
          await figma.clientStorage.setAsync('uuid', payload.uuid);
          console.log('uuid - ', figma.clientStorage.getAsync('uuid'))
        }

        const all = await figma.clientStorage.keysAsync()
        console.log('all - ', storedIpAddress, ' ' ,storedUuid)
        // Respond with success payload
        const successPayload: CheckResponsePayload = {
          success: true,
          storedIpAddress,
          storedUuid,
        };

        // Respond with success payload
        this.sendResponse(successPayload);
      } else {
        console.error('figma is not defined. Ensure that this code is running within the Figma environment.');
      }
    } catch (error) {
      console.error('Error handling CheckRequest:', error);
      // Respond with failure payload
      const failurePayload: CheckResponsePayload = {
        success: false,
        storedIpAddress: '',
        storedUuid: '',
      };

      // Respond with failure payload
      this.sendResponse(failurePayload);
    }
  }

  private sendResponse(payload: CheckResponsePayload): void {
    // Ensure figma is defined
    if (typeof figma !== 'undefined') {
      // Respond with CheckResponseMessage
      // const responseMessage = new CheckResponseMessage("check-response");
      // responseMessage.send(payload);
      NetworkMessages.CHECK_RESPONSE.send(payload)
    } else {
      console.error('ffigma is not defined. Ensure that this code is running within the Figma environment.');
    }
  }
}
