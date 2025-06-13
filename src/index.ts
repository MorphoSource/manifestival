document.addEventListener('DOMContentLoaded', function() {
  viewManifest();
});

document.getElementById('load-manifest')?.addEventListener('click', function() {
  viewManifest();
});

document.getElementById('viewer-select')?.addEventListener('change', function() {
  viewManifest();
});

function viewManifest(): void {
  const manifestTextarea = document.getElementById('manifest') as HTMLTextAreaElement;
  const viewer = document.getElementById('viewer') as HTMLIFrameElement;
  const viewerSelect = document.getElementById('viewer-select') as HTMLSelectElement;

  if (manifestTextarea?.value && validateJson(manifestTextarea)) {
    // Create a data URL
    const dataUrl = 'data:application/json,' + encodeURIComponent(JSON.stringify(JSON.parse(manifestTextarea.value)));
    console.log(dataUrl);
    // Set the iframe src dynamically

    viewer.src = "";
    viewer.src = viewerSelect.value + dataUrl;
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