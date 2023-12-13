import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NetworkMessages } from '@common/network/messages';
import { CheckRequestMessage } from '@common/network/messages/CheckRequestMessage';
import { NetworkSide } from '@common/network/sides';
import * as Networker from 'monorepo-networker';
import { CheckResponseMessage, CheckResponsePayload } from '@common/network/messages/CheckResponseMessage';
import { serverCheck } from '@common/network/api';

interface CheckPageProps {
  onClose: () => void;
}

const getIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    throw error;
  }
};

const generateUUID = (): string => {
  return uuidv4();
};

const CheckPage: React.FC<CheckPageProps> = ({ onClose }) => {
  const handleCheck = async () => {
    try {
      // Generate UUID
      const uuidToUse = generateUUID();

      // Send a CHECK_REQUEST to PLUGIN
      NetworkMessages.CHECK_REQUEST.send({
        uuid: uuidToUse,
        ipAddress: await getIpAddress(),
      });

      // Handle the PLUGIN response via postMessage event
      const handleMessage = async (event: MessageEvent) => {
        const msg = event.data.pluginMessage;

        if (msg.type === 'check-response') {
          // Handle the PLUGIN response
          const response: CheckResponsePayload = await msg.payload;
          console.log('Response from PLUGIN:', response.storedUuid, ' ', response.storedIpAddress);
          const data = {uuid: response.storedUuid, ipAddress: response.storedIpAddress}
          // If the response indicates success, close the UI component
          // if (response.success) {
            if (data.uuid && data.ipAddress) {
              const checkServer = serverCheck(data)
              console.log('Server Check - ', checkServer)
            } else {
              console.log('Server Check - ', data)
            }
            onClose();
          // } else {
          //   console.error('CHECK_REQUEST to PLUGIN was not successful.');
          //   // Handle the error condition as needed
          // }

          // Remove the listener after handling the response
          window.removeEventListener('message', handleMessage);
        }
      };

      // Add a listener for the PLUGIN response
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Error during Check operation:', error);
    }
  };

  // Add a listener for messages from the PLUGIN
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      // console.log(msg)
      if (msg.type === 'check-success') {
        // Handle the check-success message from PLUGIN
        console.log('Received check-success message:', msg);
      } else {
        // Handle other message types if needed
        console.log('Received unknown message:', msg);
        
      }
    };

    // Add a listener for messages
    window.addEventListener('message', handleMessage);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); // Ensure that this effect runs only once

  return (
    <div className="modal-overlay">
      <div className="check-page">
        <h1>Check Page</h1>
        <button onClick={handleCheck}>Check</button>
      </div>
    </div>
  );
};

export default CheckPage;
