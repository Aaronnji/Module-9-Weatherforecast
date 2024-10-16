import { Router, Request, Response} from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }
  try {
  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherForCity(city);
  // TODO: save city to search history
  const cityId = Math.random().toString();
  await HistoryService.addCity({ id: cityId, name: city });
  return res.json(weatherData);
} catch (error) {
  return res.status(500).json({ error: 'Failed to return weather data' });
}
});
// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch search history' });
  }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: `City with ID ${id} has been removed from search history` });
  } catch (error) {
    return res.status(500).json({ error: `Failed to remove city with ID ${id}` });
  }
});

export default router;
