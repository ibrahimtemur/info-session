/**
 * MOCK SUNUCU (localStorage tabanlı)
 * ---------------------------------------------------------------------------
 * Gerçek backend gelene kadar sunucu davranışını taklit eder. Not: localStorage
 * cihazlar arası paylaşılmaz; yani bu mock'ta sadece bu tarayıcıdaki
 * katılımcılar görünür. Gerçek etkinlik için client.js içinde USE_MOCK=false.
 */
import { assignAll, createState, describeTable, placeLatecomer } from '../lib/matching.js'
import { fakePeople } from '../lib/fakePeople.js'

const DB_KEY = 'infosession:db'
const ME_KEY = 'infosession:me'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

function loadDb() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) ?? createState()
  } catch {
    return createState()
  }
}
const saveDb = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db))
const loadMe = () => {
  try {
    return JSON.parse(localStorage.getItem(ME_KEY))
  } catch {
    return null
  }
}

/** Kayıtlı kişinin güncel sonucunu hesaplar. */
function resultFor(me) {
  const db = loadDb()
  const table = db.tables.find((t) => t.members.some((m) => m.id === me.id))
  if (table) {
    return { status: 'seated', name: me.name, meId: me.id, tableId: table.id, table: describeTable(table), totalTables: db.tables.length }
  }
  const idx = db.waitlist.findIndex((m) => m.id === me.id)
  if (idx >= 0) return { status: 'waitlist', name: me.name, position: idx + 1 }
  return null
}

export async function join({ name, answers }) {
  await delay()
  const existing = loadMe()
  if (existing) {
    const res = resultFor(existing)
    if (res) return { ...res, alreadyJoined: true }
  }
  const me = { id: `u${Date.now()}${Math.floor(Math.random() * 1000)}`, name }
  const { state } = placeLatecomer(loadDb(), { id: me.id, name, answers })
  saveDb(state)
  localStorage.setItem(ME_KEY, JSON.stringify(me))
  return { ...resultFor(me), alreadyJoined: false }
}

export async function getResult() {
  await delay(250)
  const me = loadMe()
  return me ? resultFor(me) : null
}

// --- Geliştirme araçları (sadece mock) ---------------------------------------

/** n sahte katılımcı ekler ve herkesi yeniden dengeler (assignAll). */
export async function devSeed(n = 30) {
  const db = loadDb()
  const current = [...db.tables.flatMap((t) => t.members), ...db.waitlist]
  const offset = current.filter((m) => m.id.startsWith('fake')).length
  const people = [...current, ...fakePeople(n, offset)]
  saveDb(assignAll(people))
  const me = loadMe()
  return me ? resultFor(me) : null
}

export function devReset() {
  localStorage.removeItem(DB_KEY)
  localStorage.removeItem(ME_KEY)
}
