import { useCallback, useEffect, useRef, useState } from 'react';
import { listSets, type JournalSet } from '../storage/localJournal';

const journalChannel = 'trainingapp.local-sample-log';

export function useLocalJournal() {
  const [sets, setSets] = useState<JournalSet[] | null>(null);
  const [readFailure, setReadFailure] = useState<'readError' | 'newerFormat' | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const readVersion = useRef(0);

  const refresh = useCallback(async () => {
    const version = ++readVersion.current;
    try {
      const rows = await listSets();
      if (readVersion.current === version) {
        setSets(rows);
        setReadFailure(null);
      }
    } catch (error) {
      if (readVersion.current === version) {
        setReadFailure(error instanceof DOMException && error.name === 'VersionError' ? 'newerFormat' : 'readError');
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const reload = () => { if (active) void refresh(); };
    queueMicrotask(reload);
    window.addEventListener('focus', reload);
    window.addEventListener('pageshow', reload);
    try {
      const connection = new BroadcastChannel(journalChannel);
      connection.onmessage = reload;
      channel.current = connection;
    } catch {
      // Browsers without a channel still reload the journal on focus.
    }
    return () => {
      active = false;
      window.removeEventListener('focus', reload);
      window.removeEventListener('pageshow', reload);
      channel.current?.close();
      channel.current = null;
    };
  }, [refresh]);

  async function announceWrite() {
    try {
      channel.current?.postMessage('refresh');
    } catch {
      // Other tabs also refresh on focus.
    }
    await refresh();
  }

  return { sets, readFailure, refresh, announceWrite };
}

export type LocalJournalState = ReturnType<typeof useLocalJournal>;
