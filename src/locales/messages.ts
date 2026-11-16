import de from './de.json';
import en from './en.json';
import it from './it.json';

export type Locale = 'it' | 'de' | 'en';

export const messages = { it, de, en } satisfies Record<Locale, typeof it>;
