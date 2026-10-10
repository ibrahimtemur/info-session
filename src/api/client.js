/**
 * API İSTEMCİSİ — uygulamanın backend ile konuştuğu TEK nokta.
 * Gerçek API'ye geçmek için sadece USE_MOCK'u false yapın.
 *
 * Sözleşme (gerçek API):
 *   POST /api/join    {deviceId, name, answers} -> sonuç nesnesi
 *   GET  /api/result?deviceId=...               -> sonuç nesnesi | 404 (kayıt yok)
 * Sonuç nesnesi:
 *   {status:'seated', name, tableId, table:{id,members:[{id,name}],theme,iceBreaker}, alreadyJoined}
 *   {status:'waitlist', name, position, alreadyJoined}
 */
import * as mock from './mockServer.js'

export const USE_MOCK = true

export class NetworkError extends Error {}

const DEVICE_KEY = 'infosession:device'
function deviceId() {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

function assertOnline() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new NetworkError('offline')
  }
}

async function request(path, options) {
  let res
  try {
    res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options })
  } catch {
    throw new NetworkError('network')
  }
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** Anketi gönderir, masa sonucunu döner. Cihaz daha önce katıldıysa mevcut sonucu verir. */
export async function join(name, answers) {
  assertOnline()
  if (USE_MOCK) return mock.join({ name, answers })
  return request('/api/join', { method: 'POST', body: JSON.stringify({ deviceId: deviceId(), name, answers }) })
}

/** Bu cihazın kayıtlı sonucu (yoksa null). */
export async function getResult() {
  if (USE_MOCK) return mock.getResult()
  assertOnline()
  return request(`/api/result?deviceId=${encodeURIComponent(deviceId())}`)
}

/** Geliştirme araçları: sadece mock modunda var. */
export const dev = USE_MOCK ? { seed: mock.devSeed, reset: mock.devReset } : null
