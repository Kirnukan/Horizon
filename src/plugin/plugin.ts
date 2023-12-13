// plugin.ts

import * as Networker from "monorepo-networker";
import { initializeNetwork } from "@common/network/init";
import { NetworkSide } from "@common/network/sides";
import { NetworkMessages } from "@common/network/messages";
import { serverCheck } from "@common/network/api";
import { v4 as uuidv4 } from 'uuid';

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
  // const getIpAddress = async (): Promise<string> => {
  //   try {
  //     const response = await fetch('https://api.ipify.org?format=json');
  //     const data = await response.json();
  //     return data.ip; // Возвращаем строку
  //   } catch (error) {
  //     console.error('Ошибка при получении IP-адреса:', error);
  //     throw error;
  //   }
  // };
  
  // const generateUUID = (): string => {
  //   return uuidv4(); // Возвращаем строку
  // };
  

// Inside the message handler in plugin.ts
// figma.ui.on('message', async (msg) => {
//   // Check if the message is from the UI
//   if (msg.pluginMessage && msg.pluginMessage.type === 'check-request') {
//     try {
//       const uuid = msg.pluginMessage.uuid;

//       // Retrieve or generate IP address
//       let ipAddressPromise = figma.clientStorage.getAsync('ip') as Promise<string>;
//       let ipAddress = await ipAddressPromise;

//       // If IP address is not present, generate and store it
//       if (!ipAddress) {
//         ipAddress = await getIpAddress();

//         // Save IP address to figma.clientStorage
//         await figma.clientStorage.setAsync('ip', ipAddress);
//       }

//       // Send the response to the UI with the stored UUID and IP address
//       figma.ui.postMessage({ type: 'check-response', data: { uuid, ipAddress } });
//     } catch (error) {
//       console.error('Error handling check-request:', error);
//     }
//   }
//   // Other message handlers...
// });





  figma.on("selectionchange", () => {
    const selectedNodes = figma.currentPage.selection;
    let hasSquareFrames = false;
    let hasHorizontalFrames = false;
    let hasVerticalFrames = false;
    let isAnyFrameSelected = false;

    for (let node of selectedNodes) {
      if (node.type === "FRAME") {
        isAnyFrameSelected = true;
        if (node.width === node.height) {
          hasSquareFrames = true;
        } else if (node.width > node.height) {
          hasHorizontalFrames = true;
        } else {
          hasVerticalFrames = true;
        }
      }
    }

    console.log('Sending SELECTION_CHANGE message');
    figma.ui.postMessage({
      type: 'SELECTION_CHANGE',
      data: { hasSquareFrames, hasHorizontalFrames, hasVerticalFrames }
    });

  });

  NetworkMessages.HELLO_UI.send({ text: "Hey there, UI!" });
}

bootstrap();
