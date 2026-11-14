// "The Cosmic *Relay* Race" → [{ w: 'The' }, { w: 'Cosmic' }, { w: 'Relay', em: true }, { w: 'Race' }]
export function splitEm(text) {
  const out = [];
  text.split(/(\*[^*]+\*)/).forEach((seg) => {
    if (!seg) return;
    const em = seg.startsWith('*') && seg.endsWith('*');
    seg
      .replace(/\*/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({ w, em }));
  });
  return out;
}

export const plain = (text) => text.replace(/\*/g, '');
export const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
