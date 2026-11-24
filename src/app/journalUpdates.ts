export const journalChannel = 'trainingapp.local-sample-log';

export function notifyJournal(sender?: BroadcastChannel | null): void {
  if (sender === undefined) window.dispatchEvent(new Event(journalChannel));
  try {
    if (sender !== undefined) {
      sender?.postMessage('refresh');
      return;
    }
    const channel = new BroadcastChannel(journalChannel);
    try {
      channel.postMessage('refresh');
    } finally {
      channel.close();
    }
  } catch {
    // Other tabs can still refresh the journal when they regain focus.
  }
}
