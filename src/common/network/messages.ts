import { CreateRectMessage } from "@common/network/messages/CreateRectMessage";
import { HelloMessage } from "@common/network/messages/HelloMessage";
import { PingMessage } from "@common/network/messages/PingMessage";
import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";
import {AddBlackLayerMessage} from "@common/network/messages/AddBlackLayerMessage";
import {CleanFramesMessage} from "@common/network/messages/CleanFramesMessage";
import { RequestFrameSizesMessage } from "@common/network/messages/RequestFrameSizesMessage";
import { FrameSizesResponseMessage } from "@common/network/messages/FrameSizesResponseMessage";
import { RotateFrameMessage } from "@common/network/messages/RotateFrameMessage";
import { HorizontalMirrorMessage } from "@common/network/messages/HorizontalMirrorMessage";
import { VerticalMirrorMessage } from "@common/network/messages/VerticalMirrorMessage";
import { AddImageToFigmaMessage } from "./messages/AddImageToFigmaMessage";
import { AddTextureToFigmaMessage } from "./messages/AddTextureToFigmaMessage";
import { AddEffectToFigmaMessage } from "./messages/AddEffectToFigmaMessage";
import { CheckRequestMessage } from "./messages/CheckRequestMessage";
import { CheckResponseMessage } from "./messages/CheckResponseMessage";


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
  export const ADD_IMAGE_TO_FIGMA = registry.register(
    new AddImageToFigmaMessage("add-image-to-figma")
  )
  export const ADD_TEXTURE_TO_FIGMA = registry.register(
    new AddTextureToFigmaMessage("add-texture-to-figma")
  )
  export const ADD_EFFECT_TO_FIGMA = registry.register(
    new AddEffectToFigmaMessage("add-effect-to-figma")
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

  export const ROTATE_FRAME = registry.register(
    new RotateFrameMessage("rotate-frame")
  );

  export const HORIZONTAL_MIRROR = registry.register(
    new HorizontalMirrorMessage("horizontal-mirror")
  );

  export const VERTICAL_MIRROR = registry.register(
      new VerticalMirrorMessage("vertical-mirror")
  );

  export const CHECK_REQUEST = registry.register(
    new CheckRequestMessage("check-request")
  );
  
  export const CHECK_RESPONSE = registry.register(
    new CheckResponseMessage("check-response")
  );

  
  


}
