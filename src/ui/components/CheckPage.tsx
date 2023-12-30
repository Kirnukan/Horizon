import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NetworkMessages } from '@common/network/messages';
import { CheckRequestMessage } from '@common/network/messages/CheckRequestMessage';
import { NetworkSide } from '@common/network/sides';
import * as Networker from 'monorepo-networker';
import { CheckResponseMessage, CheckResponsePayload } from '@common/network/messages/CheckResponseMessage';
import { serverCheck } from '@common/network/api';
import { useState } from 'react';
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

// export let checkServer = ''

const CheckPage: React.FC<CheckPageProps> = ({ onClose }) => {
  const [isSuccess, setIsSuccess] = React.useState<boolean | null>(null);
  const [checkServer, setCheckServer] = useState({ message: 'Доступ закрыт!' });

  const handleCheck = async () => {
    try {
      const uuidToUse = generateUUID();

      NetworkMessages.CHECK_REQUEST.send({
        ipAddress: await getIpAddress(),
        uuid: uuidToUse,
      });

      const handleMessage = async (event: MessageEvent) => {
        const msg = event.data.pluginMessage;

        if (msg.type === 'check-response') {
          const response: CheckResponsePayload = await msg.payload;
          const data = { ipAddress: response.storedIpAddress, uuid: response.storedUuid };

          if (data.ipAddress && data.uuid) {
            try {
              const serverCheckResult = await serverCheck(data);
              setCheckServer(serverCheckResult);
              console.log('Server Check 1- ', serverCheckResult);
            } catch (error) {
              console.error('Error during server check:', error);
              setCheckServer({ message: 'Доступ закрыт: ошибка на сервере' });
            }
          } else {
            console.log('Server Check - ', data);
          }

          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Error during Check operation:', error);
      setCheckServer({ message: 'Доступ закрыт: ошибка на клиенте' });
    }
  };

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;

      if (msg.type === 'check-success') {
        console.log('Received check-success message:', msg);
        setIsSuccess(true);
        onClose();
      } else {
        console.log('Received unknown message:', msg);
        console.log(checkServer);
        setIsSuccess(false);
      }
    };

    window.addEventListener('message', handleMessage);
    handleCheck();
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleClick = () => {
    if (checkServer.message === 'Доступ открыт!') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClick}>
      <div className="check-page">
        {checkServer.message === 'Доступ открыт!' && <h1>Доступ открыт!</h1>}
        {/* {checkServer.message === 'Доступ закрыт!' && <h1>Доступ закрыт!</h1>} */}
        {checkServer.message !== 'Доступ открыт!' && checkServer.message !== 'Доступ закрыт!' && (
          <h1>{'Доступ закрыт!'}</h1>
        )}
      </div>
    </div>
  );
};

export default CheckPage;
