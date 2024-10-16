import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;

  constructor(temperature: number, humidity: number, windSpeed: number, description: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.description = description;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(city: string): Promise<any> {
    const geocodeURL = `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(geocodeURL);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('City not found');
    }
    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: any): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error('No location data found');
    }
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherURL = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherURL);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const weatherData = await response.json();
    return weatherData;
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const currentWeather = response.list[0]; 
    const parseWeather = {
      temperature: currentWeather.main.temp,
      humidity: currentWeather.main.humidity,
      windSpeed: currentWeather.wind.speed,
      description: currentWeather.weather[0].description,
    };
    return parseWeather
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];
    for (let i = 0; i < weatherData.length; i += 8) {
      const forecast = weatherData[i];
      const forecastWeather = new Weather(
        forecast.main.temp,
        forecast.main.humidity,
        forecast.wind.speed,
        forecast.weather[0].description
      );
      forecastArray.push(forecastWeather);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  public async getWeatherForCity(city: string): Promise<{ currentWeather: Weather, forecast: Weather[] }> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData.list);
    console.log(`Fetching weather data for ${this.cityName}`);
    return {
      currentWeather: currentWeather,
      forecast: forecast
    };
  }
}
export default new WeatherService();
