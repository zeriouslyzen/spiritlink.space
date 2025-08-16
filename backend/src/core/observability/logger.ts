import { TelemetryEvent } from './types';

export function emit(event: TelemetryEvent) {
  try {
    // Minimal: log to stdout for now
    // In future: write to file/DB and export to dashboard
    // eslint-disable-next-line no-console
    console.log('[TEL]', JSON.stringify(event));
  } catch {}
}


