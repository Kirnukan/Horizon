import { CreateRectMessage } from "@common/network/messages/CreateRectMessage";
import { HelloMessage } from "@common/network/messages/HelloMessage";
import { PingMessage } from "@common/network/messages/PingMessage";
import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";
import {AddBlackLayerMessage} from "@common/network/messages/AddBlackLayerMessage";
import {CleanFramesMessage} from "@common/network/messages/CleanFramesMessage";
import { RequestFrameSizesMessage } from "@common/network/messages/RequestFrameSizesMessage";
import { FrameSizesResponseMessage } from "@common/network/messages/FrameSizesResponseMessage";


export namespace NetworkMessages {
  export const registry = new Networker.MessageTypeRegistry();

  export const PING = registry.register(new PingMessage("ping"));

  export const HELLO_PLUGIN = registry.register(
    new HelloMessage(NetworkSide.PLUGIN)
  );

  export const HELLO_UI = registry.register(new HelloMessage(NetworkSide.UI));

  export const CREATE_RECT = registry.register(
    new CreateRectMessage("create-rect")
  );

  export const ADD_BLACK_LAYER = registry.register(
      new AddBlackLayerMessage("add-black-layer")
  )

  export const CLEAN_FRAMES = registry.register(
    new CleanFramesMessage("clean-frames")
  )

  export const REQUEST_FRAME_SIZES = registry.register(
    new RequestFrameSizesMessage("request-frame-sizes")
  );
  export const FRAME_SIZES_RESPONSE = registry.register(
    new FrameSizesResponseMessage("frame-sizes-response")
  );

}
