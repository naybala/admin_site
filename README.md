# For new feature

## Requirements

- vue 3 + type script
- node version is 18.x ++

#### first step

##### language / types / routes

- create "newType.ts" in "src/types/newType.ts" and import in "src/types/index.ts"
- new languages config in "src/locales/en/sidebar.js"
- create "newLang.ts" in "src/locales/en/newLang.js" and import in "src/locales/en/index.js" (if you have extra language add new files)
- create "newRoutes.ts" in "src/router/newRoute.ts" and import in "src/router/index.ts"

#### second step

##### composables

- create new folder for new feature name under "src/composables/newFeatures"
- create "apiPaths.ts" in "src/composables/newFeatures/"
- create "useNewFeatureForm.ts" in "src/composables/newFeatures/"
- create "useNewFeatureTable.ts" in "src/composables/newFeatures/"
- create "validateNewFeatureForm.ts" in "src/composables/newFeatures/"

#### third step

##### Ui and Rendering

- create new folder for new feature name under "src/views/newFeatures"
- create "newFeatureFormView.vue" in "src/views/newFeatures/"
- create "newFeatureListView.vue" in "src/views/newFeatures/"

## Folder directory

```bash
templates/
├── types/
│   └── newType.ts
├── locales/
│   └── en/
│       └── newLang.js
├── router/
│   └── newRoutes.ts
├── composables/
│   ├── apiPaths.ts
│   ├── useForm.ts
│   ├── useTable.ts
│   └── validateForm.ts
└── views/
    ├── FormView.vue
    └── ListView.vue

```

# You can use package "npm run make-core-feature"
