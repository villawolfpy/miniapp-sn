export function ready() {
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage({ type: 'miniapp:ready' }, '*');
  }
}

export function signin() {
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage({ type: 'miniapp:signin' }, '*');
  } else {
    window.open('https://warpcast.com', '_blank');
  }
}

export function composeCast(text: string) {
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage(
      {
        type: 'miniapp:composeCast',
        data: { text },
      },
      '*'
    );
  } else {
    const url = `https://warpcast.com/compose?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}

export function openUrl(url: string) {
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage(
      {
        type: 'miniapp:openUrl',
        data: { url },
      },
      '*'
    );
  } else {
    window.open(url, '_blank');
  }
}
