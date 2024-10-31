import { Handler } from 'aws-lambda';

export const handler: Handler = async () => {
  const endpointUrl = process.env.ENDPOINT_URL;
  if (!endpointUrl) {
    console.error('Environment variable ENDPOINT_URL is not defined');
    return;
  }

  try {
    const response = await fetch(endpointUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    console.log('Data retrieved:', data);
  } catch (error) {
    console.error('Error fetching data from the endpoint:', error);
  }
};