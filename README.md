# Manifestival

Manifestival is an interactive sandbox for loading, editing, and previewing [IIIF Presentation API 4.0](https://preview.iiif.io/api/prezi-4/presentation/4.0/) manifests across multiple 3D viewers. It is intended as a development and testing tool for implementers working with the emerging IIIF 3D specification.

## What It Does

You can load any manifest by URL or by pasting raw JSON, edit it directly in the browser, and render it in any of the supported viewers. Switching viewers re-renders the current manifest immediately, making it straightforward to compare rendering behavior across implementations.

Supported viewers:

- Aleph + Universal Viewer (MorphoSource)
- Kompakkt
- Voyager (Smithsonian)
- X3DOM Viewer

## Sharing

The "Copy URL to Share View" button produces a URL with an `iiif-content` query parameter pointing to the original manifest URL, when the manifest has not been locally edited. If you have modified the JSON in the text area, the full manifest content is embedded in the URL directly so recipients see exactly what you see.

## Example Manifests

Manifestival includes a curated set of example manifests organized by feature category, drawn from the [IIIF 3D task group repository](https://github.com/IIIF/3d) and the [IIIF Prezi-4 specification examples](https://preview.iiif.io/api/prezi-4/presentation/4.0/). Categories include basic model placement, cameras, lights, transforms, commenting annotations, content state, and more.

## Running Locally

Install dependencies and start the development server:

```sh
npm install
npm start
```

To build a production bundle:

```sh
npm run build
```

The output goes to `dist/`. Viewers and example manifests are configured in `config/viewers.yml` and `config/example_manifests.yml`.

## Tech Stack

- TypeScript, bundled with webpack
- EJS for HTML templating at build time
- YAML config files for viewers, example manifests, and FAQ content

## Contributing

Contributions are welcome. If you find a bug, have a feature request, or want to add a viewer or example manifest, please open an issue or pull request on [GitHub](https://github.com/MorphoSource/manifestival).

## License

Apache 2.0
