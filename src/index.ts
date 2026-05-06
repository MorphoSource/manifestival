let referenceManifest: { url: string; text: string } | null = null;

document.addEventListener('DOMContentLoaded', async function() {
  const manifestSelect = document.getElementById('manifest-select') as HTMLSelectElement;
  const firstOption = Array.from(manifestSelect.options).find(opt => opt.value !== '');
  if (firstOption) {
    manifestSelect.value = firstOption.value;
    const manifestUrl = document.getElementById('manifest-from-url') as HTMLInputElement;
    manifestUrl.value = firstOption.value;
    await loadAndViewManifest();
  }
});

document.getElementById('load-manifest')?.addEventListener('click', function() {
  viewManifest();
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

function viewManifest(): void {
  const manifestTextarea = document.getElementById('manifest') as HTMLTextAreaElement;
  const viewer = document.getElementById('viewer') as HTMLIFrameElement;
  const viewerSelect = document.getElementById('viewer-select') as HTMLSelectElement;

  if (manifestTextarea?.value && validateJson(manifestTextarea)) {
    let manifestParam: string;
    if (referenceManifest && manifestTextarea.value === referenceManifest.text) {
      manifestParam = referenceManifest.url;
    } else {
      manifestParam = 'data:application/json,' + encodeURIComponent(JSON.stringify(JSON.parse(manifestTextarea.value)));
    }

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