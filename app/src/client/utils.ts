import _formatNumber from 'format-number';
import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../shared/appRouter';

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const copyText = (text: string) => {
  if (!text) {
    text = ' ';
  }

  const el: HTMLTextAreaElement = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const formatNumber = _formatNumber({
  prefix: '',
});

export const trpc = createReactQueryHooks<AppRouter>();
