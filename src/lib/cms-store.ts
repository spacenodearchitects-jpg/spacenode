import { supabase } from '@/lib/supabase';

const memoryCache: Record<string, any> = {};

export function readStore<T>(filename: string, fallback: T): T {
  if (typeof window !== 'undefined') {
    return fallback;
  }
  if (memoryCache[filename]) {
    return memoryCache[filename] as T;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');

    // 1. Try reading from /tmp
    try {
      const tmpPath = path.join('/tmp', filename);
      if (fs.existsSync(tmpPath)) {
        const raw = fs.readFileSync(tmpPath, 'utf-8');
        const parsed = JSON.parse(raw) as T;
        memoryCache[filename] = parsed;
        return parsed;
      }
    } catch (e) {
      // Ignore /tmp read error
    }

    // 2. Try reading from src/data/store
    const storeDir = path.join(process.cwd(), 'src', 'data', 'store');
    const filePath = path.join(storeDir, filename);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as T;
      memoryCache[filename] = parsed;
      return parsed;
    }

    return fallback;
  } catch (error) {
    console.error(`Error reading store file ${filename}:`, error);
    return fallback;
  }
}

export async function readStoreAsync<T>(filename: string, fallback: T): Promise<T> {
  if (typeof window !== 'undefined') {
    return fallback;
  }

  if (memoryCache[filename]) {
    return memoryCache[filename] as T;
  }

  // 1. Try reading cloud-persisted store from Supabase Storage
  try {
    const supabaseKey = `store_${filename}`;
    const { data: fileData, error } = await supabase.storage
      .from('media')
      .download(supabaseKey);

    if (!error && fileData) {
      const text = await fileData.text();
      const parsed = JSON.parse(text) as T;
      memoryCache[filename] = parsed;

      // Sync to /tmp for fast synchronous reads in same lambda
      try {
        const fs = require('fs');
        const path = require('path');
        fs.writeFileSync(path.join('/tmp', filename), JSON.stringify(parsed, null, 2), 'utf-8');
      } catch (e) {}

      return parsed;
    }
  } catch (e) {
    // Supabase download fallback
  }

  // 2. Fallback to synchronous file read
  return readStore<T>(filename, fallback);
}

export function writeStore<T>(filename: string, data: T): boolean {
  if (typeof window !== 'undefined') {
    return false;
  }

  // Update in-memory cache immediately
  memoryCache[filename] = data;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');

    // 1. Try writing to src/data/store (local dev)
    try {
      const storeDir = path.join(process.cwd(), 'src', 'data', 'store');
      if (!fs.existsSync(storeDir)) {
        fs.mkdirSync(storeDir, { recursive: true });
      }
      const filePath = path.join(storeDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // Ignore EROFS error on Vercel
    }

    // 2. Write to /tmp for Vercel serverless environment
    try {
      const tmpPath = path.join('/tmp', filename);
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // Ignore /tmp write error
    }

    // 3. Fire-and-forget background upload to Supabase Cloud Storage
    const supabaseKey = `store_${filename}`;
    const jsonBuffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
    supabase.storage
      .from('media')
      .upload(supabaseKey, jsonBuffer, {
        contentType: 'application/json',
        upsert: true,
      })
      .catch((err) => console.warn(`Supabase cloud store sync warning for ${filename}:`, err));

    return true;
  } catch (error) {
    console.error(`Error writing store file ${filename}:`, error);
    return false;
  }
}

export async function writeStoreAsync<T>(filename: string, data: T): Promise<boolean> {
  writeStore(filename, data);

  // Await cloud sync for serverless API routes
  try {
    const supabaseKey = `store_${filename}`;
    const jsonBuffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
    const { error } = await supabase.storage
      .from('media')
      .upload(supabaseKey, jsonBuffer, {
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      console.warn(`Supabase cloud store upload warning for ${filename}:`, error.message);
    }
  } catch (e) {
    console.warn(`Supabase store upload failed for ${filename}:`, e);
  }

  return true;
}
