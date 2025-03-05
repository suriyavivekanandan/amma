// src/lib/esp8266.ts
export const ESP8266_CONFIG = {
    baseUrl: 'http://192.168.38.56', 
    endpoints: {
      weight: '/weight'
    }
  };
  
  export const fetchWeightFromESP = async (): Promise<number> => {
    try {
      const response = await fetch(`${ESP8266_CONFIG.baseUrl}${ESP8266_CONFIG.endpoints.weight}`);
      if (!response.ok) throw new Error('Failed to fetch weight');
      
      const data = await response.json();
      return data.weight; // Assuming ESP8266 returns { weight: number }
    } catch (error) {
      throw new Error('Failed to fetch weight from sensor');
    }
  };