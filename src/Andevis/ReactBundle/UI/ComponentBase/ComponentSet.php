<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 05.12.2017
 * Time: 9:40
 */

namespace Andevis\ReactBundle\UI\ComponentBase;

use Andevis\ReactBundle\UI\Components\View\View;
use ReflectionClass;
use ReflectionMethod;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;


class ComponentSet
{
    use ContainerAwareTrait;
    use ComponentIdTrait;

    private $componentClasses = [];
    private $viewUserHandlers = [];
    private $viewsInitialState = [];

    function __construct($container)
    {
        $this->setContainer($container);
    }

    /**
     * @param $className
     */
    function addComponentClass($className)
    {
        $componentClass = self::getComponentClassName($className);
        $this->componentClasses[$componentClass] = $className;
    }

    /**
     * @return array
     */
    public function getBundleComponentClasses()
    {
        return $this->componentClasses;
    }

    /**
     * @param string $componentClassName
     * @return mixed
     * @throws \Exception
     */
    public function getComponentClass(string $componentClassName)
    {
        if (!isset($this->componentClasses[$componentClassName])) {
            throw new \Exception(sprintf('Component class not found by `%s` name', $componentClassName));
        }
        return $this->componentClasses[$componentClassName];
    }

    public function onKernelController(){
        $this->loadViewsUserHandlers();

        /** @var Component $component */
        foreach ($this->getBundleComponentClasses() as $componentClass) {
            if (is_subclass_of($componentClass, View::class)) {

                // Get view ID
                $viewId = View::getViewId($componentClass);
                $state = call_user_func([$componentClass, 'getInitialState'], $viewId, $this->container);
                if($state){
                    $this->viewsInitialState[$viewId] = $state;
                }
            }
        }
    }

    public function getViewsInitialState(){
        return $this->viewsInitialState;
    }

    public function getViewsUserHandlers(){
        return $this->viewUserHandlers;
    }

    // TODO: cache this result for production
    public function loadViewsUserHandlers(){
        $viewsUserHandlers = [];
        /** @var Component $component */
        foreach ($this->getBundleComponentClasses() as $componentClass) {
            if (is_subclass_of($componentClass, View::class)) {

                // Get view global name
                $viewGlobalName = View::getComponentGlobalName(
                    $componentClass,
                    $componentClass,
                    View::getShortClassName($componentClass));

                if (!isset($viewsUserHandlers[$viewGlobalName]))
                    $viewsUserHandlers[$viewGlobalName] = [];

                // Get all user handlers
                $class = new ReflectionClass($componentClass);
                $methods = $class->getMethods(ReflectionMethod::IS_PUBLIC);
                foreach ($methods as $method) {
                    $parts = explode("_", $method->getName());
                    if (sizeof($parts) == 2) {
                        $viewsUserHandlers[$viewGlobalName][] = $method->getName();
                    }
                }
            }
        }
        $this->viewUserHandlers = $viewsUserHandlers;
    }

}