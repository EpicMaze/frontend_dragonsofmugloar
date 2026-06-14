import { http, HttpResponse } from 'msw'

const BASE = import.meta.env.VITE_API_BASE_URL

export const handlers = [
  http.post(`${BASE}/game/start`, () =>
    HttpResponse.json({
      gameId: 'test-game-id',
      lives: 3,
      gold: 0,
      level: 1,
      score: 0,
      highScore: 0,
      turn: 0,
    }),
  ),

  http.post(`${BASE}/:gameId/investigate/reputation`, () =>
    HttpResponse.json({
      people: 1,
      state: 2,
      underworld: 3,
    }),
  ),

  http.get(`${BASE}/:gameId/messages`, () =>
    HttpResponse.json([
      {
        adId: 'msg-1',
        message: 'Test message',
        reward: 100,
        expiresIn: 5,
        probability: 'Sure thing',
      },
    ]),
  ),

  http.post(`${BASE}/:gameId/solve/:adId`, () =>
    HttpResponse.json({
      success: true,
      lives: 3,
      gold: 100,
      score: 100,
      highScore: 100,
      turn: 2,
      message: 'Solved',
    }),
  ),

  http.get(`${BASE}/:gameId/shop`, () =>
    HttpResponse.json([{ id: 'item-1', name: 'Test Item', cost: 50 }]),
  ),

  http.post(`${BASE}/:gameId/shop/buy/:itemId`, () =>
    HttpResponse.json({
      shoppingSuccess: true,
      lives: 3,
      gold: 50,
      level: 1,
      turn: 1,
    }),
  ),
]
