let referenceManifest: { url: string; text: string } | null = null;

document.addEventListener('DOMContentLoaded', async function() {
  const params = new URLSearchParams(window.location.search);
  const iiifContent = params.get('iiif-content');

  if (iiifContent) {
    if (iiifContent.startsWith('data:')) {
      const manifestTextarea = document.getElementById('manifest') as HTMLTextAreaElement;
      const decoded = decodeURIComponent(iiifContent.slice('data:application/json,'.length));
      manifestTextarea.value = JSON.stringify(JSON.parse(decoded), null, 2);
      viewManifest();
    } else {
      const manifestUrl = document.getElementById('manifest-from-url') as HTMLInputElement;
      manifestUrl.value = iiifContent;
      const manifestSelect = document.getElementById('manifest-select') as HTMLSelectElement;
      const matchingOption = Array.from(manifestSelect.options).find(opt => opt.value === iiifContent);
      if (matchingOption) {
        manifestSelect.value = iiifContent;
      }
      await loadAndViewManifest();
    }
  } else {
    const manifestSelect = document.getElementById('manifest-select') as HTMLSelectElement;
    const firstOption = Array.from(manifestSelect.options).find(opt => opt.value !== '');
    if (firstOption) {
      manifestSelect.value = firstOption.value;
      const manifestUrl = document.getElementById('manifest-from-url') as HTMLInputElement;
      manifestUrl.value = firstOption.value;
      await loadAndViewManifest();
    }
  }
});

document.getElementById('load-manifest')?.addEventListener('click', function() {
  viewManifest();
});

document.getElementById('copy-share-url')?.addEventListener('click', function() {
  const manifestTextarea = document.getElementById('manifest') as HTMLTextAreaElement;
  if (!manifestTextarea?.value || !validateJson(manifestTextarea)) return;

  const manifestParam = resolveManifestParam(manifestTextarea.value);
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set('iiif-content', manifestParam);

  const button = document.getElementById('copy-share-url') as HTMLButtonElement;
  navigator.clipboard.writeText(shareUrl.toString()).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => { button.textContent = 'Copy URL to Share View'; }, 2000);
  });
});

document.getElementById('viewer-select')?.addEventListener('change', function() {
  viewManifest();
});

document.getElementById('manifest-select')?.addEventListener('change', function() {
  const manifestSelect = document.getElementById('manifest-select') as HTMLSelectElement;
  if (manifestSelect.value) {
    const manifestUrl = document.getElementById('manifest-from-url') as HTMLInputElement;
    manifestUrl.value = manifestSelect.value;
    loadAndViewManifest();
  }
});

document.getElementById('load-manifest-from-url')?.addEventListener('click', function() {
  const manifestUrl = document.getElementById('manifest-from-url') as HTMLInputElement;
  if (manifestUrl.value) {
    loadAndViewManifest();
  }
});

async function loadAndViewManifest(): Promise<void> {
  await loadManifestFromUrl();
  viewManifest();
}

async function loadManifestFromUrl(): Promise<void> {
  const manifestUrl = document.getElementById('manifest-from-url') as HTMLInputElement;
  const manifestTextarea = document.getElementById('manifest') as HTMLTextAreaElement;
  if (manifestUrl.value) {
    try {
      const response = await fetch(manifestUrl.value);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const manifestData = await response.text();
      manifestTextarea.value = manifestData;
      referenceManifest = { url: manifestUrl.value, text: manifestData };
    } catch (error) {
      console.error('Error fetching manifest:', error);
      manifestTextarea.value = '';
      alert('Failed to load manifest from URL. Please check the URL and try again.');
    }
  }
}

function resolveManifestParam(text: string): string {
  if (referenceManifest && text === referenceManifest.text) {
    return referenceManifest.url;
  }
  return 'data:application/json,' + encodeURIComponent(JSON.stringify(JSON.parse(text)));
}

function viewManifest(): void {
  const manifestTextarea = document.getElementById('manifest') as HTMLTextAreaElement;
  const viewer = document.getElementById('viewer') as HTMLIFrameElement;
  const viewerSelect = document.getElementById('viewer-select') as HTMLSelectElement;

  if (manifestTextarea?.value && validateJson(manifestTextarea)) {
    const manifestParam = resolveManifestParam(manifestTextarea.value);
    viewer.src = "";
    setTimeout(() => {
      viewer.src = viewerSelect.value + encodeURIComponent(manifestParam);
    }, 100);
  }
}

function validateJson(element: HTMLTextAreaElement): boolean {
  if (element.value) {
    try {
      JSON.parse(element.value);
      element.setCustomValidity('');
      return true;
    } catch (e) {
      element.setCustomValidity('This does not seem to be valid JSON');
      element.reportValidity();
      return false;
    }
  } else {
    element.setCustomValidity('');
    return true;
  }
}