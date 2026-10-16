import { describe, it, expect } from 'vitest'
import {
  SeatingError,
  TABLE_CAPACITY,
  allMembers,
  assignAll,
  moveParticipant,
  removeParticipant,
  rebalance,
} from './matching.js'
import { fakePeople } from './fakePeople.js'
import { buildParticipantsCsv, csvCell } from './csv.js'
import { validateRegistration } from './validate.js'
import { QUESTIONS, localizeQuestion } from './questions.js'
import { STRINGS, translateApiMessage, translateIceBreaker, translateTheme } from './i18n.jsx'

const sizes = (s) => s.tables.map((t) => t.members.length)

describe('moveParticipant', () => {
  const base = assignAll(fakePeople(12)) // 2 masa x 6 (ikisi de dolu)

  it('kapasite doluysa TABLE_FULL fırlatır', () => {
    const who = base.tables[0].members[0].id
    expect(() => moveParticipant(base, who, 2)).toThrow(SeatingError)
    try {
      moveParticipant(base, who, 2)
    } catch (e) {
      expect(e.code).toBe('TABLE_FULL')
    }
  })

  it('yer varsa taşır, toplam kişi değişmez, state mutasyona uğramaz', () => {
    const s = assignAll(fakePeople(10)) // 5 + 5
    const who = s.tables[0].members[0].id
    const before = JSON.stringify(s)
    const next = moveParticipant(s, who, 2)
    expect(JSON.stringify(s)).toBe(before)
    expect(sizes(next)).toEqual([4, 6])
    expect(next.tables[1].members.some((m) => m.id === who)).toBe(true)
    expect(allMembers(next)).toHaveLength(10)
  })

  it('bekleme listesindeki kişiyi masaya alır', () => {
    const s = assignAll(fakePeople(10))
    const w = { id: 'w1', name: 'Bekleyen', vec: s.tables[0].members[0].vec }
    const next = moveParticipant({ ...s, waitlist: [w] }, 'w1', 1)
    expect(next.waitlist).toHaveLength(0)
    expect(next.tables[0].members.some((m) => m.id === 'w1')).toBe(true)
  })

  it('olmayan kişi/masa için hata kodları', () => {
    expect(() => moveParticipant(base, 'yok', 1)).toThrow(/bulunamadı/)
    const who = base.tables[0].members[0].id
    expect(() => moveParticipant(base, who, 99)).toThrow(SeatingError)
  })

  it('aynı masaya taşıma etkisizdir', () => {
    const who = base.tables[0].members[0].id
    expect(moveParticipant(base, who, 1)).toBe(base)
  })
})

describe('removeParticipant', () => {
  it('masadaki kişiyi çıkarır, diğerleri kalır', () => {
    const s = assignAll(fakePeople(6))
    const who = s.tables[0].members[0].id
    const next = removeParticipant(s, who)
    expect(next.tables[0].members).toHaveLength(5)
    expect(next.tables[0].members.some((m) => m.id === who)).toBe(false)
  })

  it('bekleme listesindeki kişiyi çıkarır', () => {
    const s = { tables: [], waitlist: [{ id: 'w1', name: 'W1' }] }
    const next = removeParticipant(s, 'w1')
    expect(next.waitlist).toHaveLength(0)
  })

  it('olmayan kişi için hata fırlatır', () => {
    const s = assignAll(fakePeople(4))
    expect(() => removeParticipant(s, 'olmayan-id')).toThrow(SeatingError)
  })
})

describe('rebalance', () => {
  it('herkesi korur ve kapasiteyi aşmaz; bekleme listesi eritilir', () => {
    const s = assignAll(fakePeople(30))
    const messy = { tables: s.tables.map((t, i) => ({ ...t, members: i === 0 ? [] : t.members })), waitlist: s.tables[0].members }
    const next = rebalance(messy)
    expect(allMembers(next)).toHaveLength(30)
    expect(next.waitlist).toHaveLength(0)
    expect(Math.max(...sizes(next))).toBeLessThanOrEqual(TABLE_CAPACITY)
  })

  it('order fonksiyonu uygulanır (72+ kişide bekleme sırası)', () => {
    const people = assignAll(fakePeople(75))
    const all = allMembers(people)
    const next = rebalance(people, { order: (a, b) => (a.id < b.id ? 1 : -1) })
    expect(next.waitlist).toHaveLength(3)
    expect(allMembers(next)).toHaveLength(all.length)
  })
})

describe('csv', () => {
  it('formül enjeksiyonunu ve tırnakları kaçırır', () => {
    expect(csvCell('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`)
    expect(csvCell('a,b')).toBe('"a,b"')
    expect(csvCell('Ayşe')).toBe('Ayşe')
    expect(csvCell(null)).toBe('')
  })

  it('katılımcı satırları: masa + bekleme listesi', () => {
    const s = assignAll(fakePeople(8))
    const csv = buildParticipantsCsv({ ...s, waitlist: [{ id: 'w', name: 'Bek' }] }, {})
    const lines = csv.trim().split('\r\n')
    expect(lines[0].startsWith('id,name,status,table_number')).toBe(true)
    expect(lines).toHaveLength(1 + 8 + 1)
    expect(lines.at(-1)).toContain('waitlist')
  })
})

describe('validateRegistration', () => {
  const ok = fakePeople(1)[0].answers
  const answers = { ...ok, dept: 'other' }
  it('geçerli kayıt', () => {
    expect(validateRegistration({ name: '  Ali   Veli ', answers }).fields).toEqual([])
    expect(validateRegistration({ name: 'Ali', answers }).name).toBe('Ali')
  })
  it('geçersiz alanları listeler', () => {
    expect(validateRegistration({ name: '', answers }).fields).toContain('name')
    expect(validateRegistration({ name: 'Ali', answers: { ...answers, crowd: 9 } }).fields).toContain('answers.crowd')
    expect(validateRegistration({ name: 'Ali' }).fields).toContain('answers')
  })
})

describe('i18n (TR / EN)', () => {
  it('tüm dil anahtarları tr ve en sözlüklerinde birebir eşleşir', () => {
    expect(Object.keys(STRINGS.en).sort()).toEqual(Object.keys(STRINGS.tr).sort())
  })

  it('8 sorunun tamamı İngilizceye eksiksiz çevrilir', () => {
    for (const q of QUESTIONS) {
      const en = localizeQuestion(q, 'en')
      expect(en.text).toBeTruthy()
      expect(en.text).not.toBe(q.text)
      if (q.options) {
        for (let i = 0; i < q.options.length; i++) {
          expect(en.options[i].label).toBeTruthy()
          expect(en.options[i].label).not.toBe(q.options[i].label)
        }
      }
    }
  })

  it('masa temaları, buz kırıcı sorular ve API mesajları İngilizceye çevrilir', () => {
    expect(translateTheme('Teknoloji meraklıları', 'en')).toBe('Tech enthusiasts')
    expect(translateTheme('Karma masa', 'en')).toBe('Mixed table')
    expect(
      translateIceBreaker('Üç kelimeyle kendini anlat, masa tahmin etsin!', 'en'),
    ).toContain('Describe yourself in three words')
    expect(translateApiMessage('Masa 4 dolu', 'en')).toBe('Table 4 is full')
    expect(translateApiMessage('Parola hatalı', 'en')).toBe('Incorrect password')
  })
})
