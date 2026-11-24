import type { Locale } from './messages';
import it from './journal-it.json';
import de from './journal-de.json';
import en from './journal-en.json';

export const journalText = { it, de, en } satisfies Record<Locale, typeof it>;
