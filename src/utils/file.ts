import { promises as fs } from 'fs'

export const readFile = async (path: string) => {
  const file = await fs.readFile(path, 'utf8')
  return JSON.parse(file)
}
