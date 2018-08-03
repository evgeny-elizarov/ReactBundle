# React bundle

This bundle integrate ability build user interface based on React components.

# Installation


Add AndevisReactBundle to config/bundles.php
```
...
Andevis\ReactBundle\AndevisReactBundle::class => ['all' => true]
...

```

Add bundle in config/packages/maba_webpack.yaml file. Same way enable another React UI bundles. 

```
    ...
    enabled_bundles:
        - AndevisReactBundle
    ...
```

Install AndevisReactBundle node libraries.
```
cd vendor/andevis/react-bundle/
yarn install
```

# TODO
- Refactor GrahpQL schema
- Chanage this bundles to stable versions
```
    "andeivs/helper-bundle": "v2.x-dev",
    "andevis/auth-bundle": "v2x-dev",
    "andevis/auth-react-bundle": "v2.x-dev",
```
- Check backend React component initialization
```
function __construct($name, ?int $index, $context, $container)
```