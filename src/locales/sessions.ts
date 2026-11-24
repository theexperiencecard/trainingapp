import type { Locale } from './messages';
import demoDe from './demo-de.json';
import demoEn from './demo-en.json';
import demoIt from './demo-it.json';
import weekDe from './week-de.json';
import weekEn from './week-en.json';
import weekIt from './week-it.json';

export const demoText = { it: demoIt, de: demoDe, en: demoEn } satisfies Record<Locale, typeof demoIt>;
export const weekText = { it: weekIt, de: weekDe, en: weekEn } satisfies Record<Locale, typeof weekIt>;
