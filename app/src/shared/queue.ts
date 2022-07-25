import axios from 'axios';
import { QUEUES } from '../constants';
import { IQueueType } from '../types/IQueueType';

export const sendToQueue = async <T>(name: IQueueType, data: T) => {
  console.log(`[queue]: Sending message to endpoint for ${name}`);

  try {
    console.log(`[queue]: Sending to ${QUEUES[name].development}${QUEUES[name].endpoint}`);
    axios
      .post(
        `${QUEUES[name].development}${QUEUES[name].endpoint}`,
        { message: data },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        console.log(`[queue]: Task done for ${name} on ${QUEUES[name].development}${QUEUES[name].endpoint}`);
        console.log(`[queue]: Response for ${name} on ${QUEUES[name].development} is ${JSON.stringify(response.data)}`);
      })
      .catch(() => {
        console.error(`[queue]: Task error on ${QUEUES[name].development}${QUEUES[name].endpoint}`);
      });
  } catch (err: any) {
    console.log(`[queue]: Error sending message to endpoint for ${name}`);
    if (err.message) {
      console.error(err.message);
    } else {
      console.error(err);
    }
  }

  return false;
};
