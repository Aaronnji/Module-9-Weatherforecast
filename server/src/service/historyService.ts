import fs from 'fs';
// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = './searchHistory.json'
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read(): Promise<City[]> {
    if(!fs.existsSync(this.filePath)) {
      return [];
  }
  const data = fs.readFileSync(this.filePath, 'utf-8');
  return JSON.parse(data);
}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]): Promise<void> {
    fs.writeFileSync(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  public async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  public async addCity(city: City): Promise<void> {
    const cities = await this.read();
    cities.push(city);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  public async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
