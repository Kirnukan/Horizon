import * as Networker from "monorepo-networker";
import { initializeNetwork } from "@common/network/init";
import { NetworkSide } from "@common/network/sides";
import { NetworkMessages } from "@common/network/messages";

async function bootstrap() {
  initializeNetwork(NetworkSide.PLUGIN);

  if (figma.editorType === "figma") {
    figma.showUI(__html__, {
      width: 401,
      height: 631,
      title: "Horizon",
      visible: true,
    });
  } else if (figma.editorType === "figjam") {
    figma.showUI(__html__, {
      width: 800,
      height: 650,
      title: "My FigJam Plugin!",
    });
  }

  console.log("Bootstrapped @", Networker.Side.current.getName());


  figma.on("selectionchange", () => {
    const selectedNodes = figma.currentPage.selection;
    let hasSquareFrames = false;
    let hasHorizontalFrames = false;
    let hasVerticalFrames = false;
    let isAnyFrameSelected = false;

    for(let node of selectedNodes) {
        if(node.type === "FRAME") {
            isAnyFrameSelected = true;
            if(node.width === node.height) {
                hasSquareFrames = true;
            } else if(node.width > node.height) {
                hasHorizontalFrames = true;
            } else {
                hasVerticalFrames = true;
            }
        }
    }

    // Пересылка данных в пользовательский интерфейс
      console.log('Sending SELECTION_CHANGE message');  // <-- Add this line
      figma.ui.postMessage({
          type: 'SELECTION_CHANGE',
          data: { hasSquareFrames, hasHorizontalFrames, hasVerticalFrames }
      });

});


  NetworkMessages.HELLO_UI.send({ text: "Hey there, UI!" });
}

bootstrap();
