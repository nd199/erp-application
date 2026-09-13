import { isDevMode } from './devMode'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

export async function mockResponse(data) {
  if (!isDevMode()) throw new Error('mockResponse called outside dev mode')
  await delay()
  return { data }
}

export function mockList(items, params) {
  let result = [...items]

  if (params?.keyword) {
    const kw = params.keyword.toLowerCase()
    result = result.filter((item) =>
      Object.values(item).some((v) =>
        String(v).toLowerCase().includes(kw)
      )
    )
  }

  return { data: result }
}

let nextId = 100

export function mockCreate(items, payload) {
  const newItem = { ...payload, id: nextId++ }
  items.push(newItem)
  return { data: newItem }
}

export function mockUpdate(items, id, payload) {
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) throw new Error('Not found')
  items[idx] = { ...items[idx], ...payload }
  return { data: items[idx] }
}

export function mockDelete(items, id) {
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) throw new Error('Not found')
  const [removed] = items.splice(idx, 1)
  return { data: removed }
}
