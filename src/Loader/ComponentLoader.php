<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 12.12.2017
 * Time: 23:54
 */

namespace Andevis\ReactBundle\Loader;


use Symfony\Component\Config\Exception\FileLocatorFileNotFoundException;
use Symfony\Component\Config\Resource\GlobResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\FileLoader;
use Symfony\Component\DependencyInjection\Exception\InvalidArgumentException;

class ComponentLoader extends FileLoader
{
    protected $container;

    private $currentDir;


    public function load($resource, $type = null)
    {

        $this->findClasses("AppBundle\\UI\\Views", "*.php", "");
//        $this->findClasses($bundleName."/UI/Components", "*.php", "");

    }

//    /**
//     * {@inheritdoc}
//     */
//    public function loadComponents()
//    {
//
////        $content = $this->loadFile($path);
////
////        $this->container->fileExists($path);
////
////        // empty file
////        if (null === $content) {
////            return;
////        }
////
////        // imports
////        $this->parseImports($content, $path);
////
////        // parameters
////        if (isset($content['parameters'])) {
////            if (!is_array($content['parameters'])) {
////                throw new InvalidArgumentException(sprintf('The "parameters" key should contain an array in %s. Check your YAML syntax.', $path));
////            }
////
////            foreach ($content['parameters'] as $key => $value) {
////                $this->container->setParameter($key, $this->resolveServices($value, $path, true));
////            }
////        }
////
////        // extensions
////        $this->loadFromExtensions($content);
////
////        // services
////        $this->anonymousServicesCount = 0;
////        $this->anonymousServicesSuffix = ContainerBuilder::hash($path);
////        $this->setCurrentDir(dirname($path));
////        try {
////            $this->parseDefinitions($content, $path);
////        } finally {
////            $this->instanceof = array();
////        }
//    }

    /**
     * {@inheritdoc}
     */
    public function supports($resource, $type = null)
    {
        if (!is_string($resource)) {
            return false;
        }

        if (null === $type && in_array(pathinfo($resource, PATHINFO_EXTENSION), array('php'), true)) {
            return true;
        }

        return in_array($type, array('php'), true);
    }

    private function findClasses($namespace, $pattern, $excludePattern)
    {
        $parameterBag = $this->container->getParameterBag();

        $excludePaths = array();
        $excludePrefix = null;
        if ($excludePattern) {
            $excludePattern = $parameterBag->unescapeValue($parameterBag->resolveValue($excludePattern));
            foreach ($this->glob($excludePattern, true, $resource) as $path => $info) {
                if (null === $excludePrefix) {
                    $excludePrefix = $resource->getPrefix();
                }

                // normalize Windows slashes
                $excludePaths[str_replace('\\', '/', $path)] = true;
            }
        }

        $pattern = $parameterBag->unescapeValue($parameterBag->resolveValue($pattern));
        $classes = array();
        $extRegexp = defined('HHVM_VERSION') ? '/\\.(?:php|hh)$/' : '/\\.php$/';
        $prefixLen = null;
        foreach ($this->glob($pattern, true, $resource) as $path => $info) {
            if (null === $prefixLen) {
                $prefixLen = strlen($resource->getPrefix());

                if ($excludePrefix && 0 !== strpos($excludePrefix, $resource->getPrefix())) {
                    throw new InvalidArgumentException(sprintf('Invalid "exclude" pattern when importing classes for "%s": make sure your "exclude" pattern (%s) is a subset of the "resource" pattern (%s)', $namespace, $excludePattern, $pattern));
                }
            }

            if (isset($excludePaths[str_replace('\\', '/', $path)])) {
                continue;
            }

            if (!preg_match($extRegexp, $path, $m) || !$info->isReadable()) {
                continue;
            }
            $class = $namespace.ltrim(str_replace('/', '\\', substr($path, $prefixLen, -strlen($m[0]))), '\\');

            if (!preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*+(?:\\\\[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*+)*+$/', $class)) {
                continue;
            }
            // check to make sure the expected class exists
            if (!$r = $this->container->getReflectionClass($class)) {
                throw new InvalidArgumentException(sprintf('Expected to find class "%s" in file "%s" while importing services from resource "%s", but it was not found! Check the namespace prefix used with the resource.', $class, $path, $pattern));
            }

            if ($r->isInstantiable() || $r->isInterface()) {
                $classes[] = $class;
            }
        }

        // track only for new & removed files
        if ($resource instanceof GlobResource) {
            $this->container->addResource($resource);
        } else {
            foreach ($resource as $path) {
                $this->container->fileExists($path, false);
            }
        }

        return $classes;
    }


}