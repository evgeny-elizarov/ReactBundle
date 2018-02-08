<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.12.2017
 * Time: 13:55
 */

namespace Andevis\ReactBundle\UI\ComponentBase;


use Andevis\ReactBundle\UI\ComponentBase\ComponentSet;
use Andevis\ReactBundle\GraphQL\AbstractResolveConfig;
use Andevis\ReactBundle\UI\Components\View\View;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ExecutionContext
{

    use ComponentIdTrait;


    /** @var View */
    private $view;

    private $componentSet;

    private $container;

    private $componentsProps = [];

    private $componentsState = [];

    private $componentMountStack = [];

    /** @var array  */
    private $componentsIdByName = [];

    private $componentsById = [];

    private $updatedComponentState = [];

    /**
     * ExecutionContext constructor.
     * @param ComponentSet $componentSet
     * @param ContainerInterface $container
     */
    function __construct(ComponentSet $componentSet, ContainerInterface $container)
    {
        $this->componentSet = $componentSet;
        $this->container = $container;
    }

    function getView(){
        return $this->view;
    }

    function getComponentSet(){
        return $this->componentSet;
    }

    function getAllComponentsState(){
        return $this->componentsState;
    }

    /**
     * Execute component method
     * @param string $componentId
     * @param string $methodName
     * @param $args
     * @return mixed
     * @throws \Exception
     */
    function executeComponentMethod(string $componentId, string $methodName, $args = [])
    {
        $id = self::parseComponentId($componentId);

        // Get view by class
        /** @var View $view */
        $viewClass = $this->componentSet->getComponentClass($id['viewClass']);
        $viewName = self::getShortClassName($viewClass);

        // Init view
        $this->view = $this->getComponentByName($viewName);

        if($id['viewClass'] == $id['componentClass'])
        {
            $methodComponent = $this->view;
        } else {
            $methodComponent = $this->getComponentByName($id['componentName']);
//            // Init component
//            /** @var Component $component */
//            $componentClass = $this->componentSet->getComponentClass($id['componentClass']);
//            $component = new $componentClass($id['componentName'], $this, $this->container);
        }

        $callbackMethod = [$methodComponent, $methodName];

        // Remove ID argument
        if(is_callable($callbackMethod)){
            return call_user_func_array($callbackMethod, $args);
        }
        else {
            throw new \Exception(
                sprintf('Method `%s` not implemented in component `%s`',
                    $methodName,
                    get_class($methodComponent)
                )
            );
        }
    }

    /**
     * Execute component resolver
     * @param string $componentFullClassName
     * @param string $componentId
     * @param AbstractResolveConfig $resolveConfig
     * @param $args
     * @return mixed
     * @throws \Exception
     */
    function executeComponentResolver(string $componentFullClassName, string $componentId, AbstractResolveConfig $resolveConfig,  $args){

        $componentClassName = self::getComponentClassName($componentFullClassName);
        $id = self::parseComponentId($componentId);

        // Validate id by component class name
        if($componentClassName !== $id['componentClass'])
        {
            throw new \Exception(sprintf('Bad id `%s`', $componentId));
        }

        // Get view by class
        /** @var View $view */
        $viewClass = $this->componentSet->getComponentClass($id['viewClass']);
        $viewName = self::getShortClassName($viewClass);

        // Register component
        //$viewId = $id['viewClass'].":".$id['viewClass'].":".$viewName;
        // Mount components
        if(is_array($args['event']['components'])) {
            foreach ($args['event']['components'] as $componentData) {
                // Mount component
                $this->mountComponent($componentData['id']);
            }
        }

        // Init view
        $this->view = $this->getComponentByName($viewName);

        //
        // 1. Before calls event set component state and props from frontend
        //
        if(is_array($args['event']['components'])) {
            foreach ($args['event']['components'] as $componentData){
                $componentParsedId = ExecutionContext::parseComponentId($componentData['id']);

                $component = $this->getComponentByName($componentParsedId['componentName']);

                // Set component props
                if(isset($componentData['props']))
                {
                    $componentNewProps = [];
                    foreach ($componentData['props'] as $propInput)
                    {
                        $componentNewProps[$propInput['name']] = isset($propInput['value']) ? $propInput['value'] : null;
                    }
                    $this->setComponentProps($component, $componentNewProps);
                }

                // Update state
                if(isset($componentData['state']))
                {
                    $componentNewState = [];
                    foreach ($componentData['state'] as $stateInput)
                    {
                        $componentNewState[$stateInput['name']] = isset($stateInput['value']) ? $stateInput['value'] : null;
                    }
                    $this->setComponentState($component, $componentNewState, true);
                }

                // Unmount component
//                if(isset($componentUpdate['status']) && $componentUpdate['status'] == COMPONENT_UNMOUNTED)
//                {
//                    $this->getContext()->unmountComponent($componentUpdate['id']);
//                }
            }
        }

//        $this->loadViewState($viewId);


//
//        if($id['viewClass'] == $id['componentClass'])
//        {
//            $eventComponent = $this->view;
//        } else {
//            $eventComponent = $this->getComponentByName($id['componentName']);
////            // Init component
////            /** @var Component $component */
////            $componentClass = $this->componentSet->getComponentClass($id['componentClass']);
////            $component = new $componentClass($id['componentName'], $this, $this->container);
//        }
//
//        $eventComponentCallbackMethod = [$eventComponent, $resolveConfig->getMethodName()];
//
//        // Remove ID argument
//        unset($args['id']);
//        if(is_callable($eventComponentCallbackMethod)){
//            $return = call_user_func($eventComponentCallbackMethod, $args);
//            //$this->saveState();
//            return $return;
//        }
//        else {
//            throw new \Exception(
//                sprintf('Method `%s` not implemented in component `%s`',
//                    $resolveConfig->getMethodName(),
//                    get_class($eventComponent)
//                )
//            );
//        }
        return $this->executeComponentMethod($componentId, $resolveConfig->getMethodName(), [$args]);
    }

    /**
     * TODO: remove
     * Execute component
     * @param string $componentId
     * @param string $handlerName
     * @param array $args
     * @param array $componentsUpdateState
     * @param bool $required
     * @return mixed
     * @throws \Exception
     */
    function _executeComponentUserHandler(string $componentId, string $handlerName, array $args = [], array $componentsUpdateState = [], $required = true)
    {
        $prevComponentId = $this->getComponentId();
        $this->componentId = $componentId;
        //$this->setComponentId($componentId);

        // Remove ID argument
        if(isset($args['id'])) unset($args['id']);

        $id = self::parseComponentId($componentId);
        /** @var Component $component */
        $component = $this->componentSet->getComponentByClass($id['componentClass']);
        //$component->setId($componentId);
        $component->setContext($this);
        $component->setContainer($this->container);

        // Update component state from frontend
        if(is_array($componentsUpdateState)){
            $componentNewState = [];
            foreach ($componentsUpdateState as $stateParameter){
                $componentNewState[$stateParameter['name']] = $stateParameter['value'];
            }
            $this->setComponentState($component, $componentNewState);
        }

        // If we need reaction on state update, need update state troght comonent
        //$component->updateStateAttributes($componentsUpdateState);

        // Initialize component
        $userHandlerName = $component->getName()."_".$handlerName;

        $userHandlerCallback = [$this->getView(), $userHandlerName];
        $argsWithComponent = array_merge([$component], $args);

        $return = null;
        if(is_callable($userHandlerCallback)){
            $return = call_user_func_array($userHandlerCallback, $argsWithComponent);
        } else {
            if($required){
                throw new \Exception(
                    sprintf('Method `%s` not implemented in view `%s`',
                        $userHandlerName,
                        get_class($this->view)
                    )
                );
            }
        }
        $this->componentId = $prevComponentId;
        return $return;
    }

    /**
     * Execute component TODO: remove it. Use executeComponentUserHandler
     * @param Component $component
     * @param string $handlerName
     * @param array $args
     * @param bool $required
     * @return mixed
     * @throws \Exception
     */
    function callComponentUserHandler(Component $component, string $handlerName, array $args = [], $required = true)
    {
        $userHandlerName = $component->getName()."_".$handlerName;
        $userHandlerCallback = [$this->getView(), $userHandlerName];
        $argsWithComponent = array_merge([$component], $args);

        if(is_callable($userHandlerCallback)){
            return call_user_func_array($userHandlerCallback, $argsWithComponent);
        } else {
            if($required){
                throw new \Exception(
                    sprintf('Method `%s` not implemented in view `%s`',
                        $userHandlerName,
                        get_class($this->view)
                    )
                );
            }
        }
    }

    // TODO: Remove it. Store state only on frontend

    /**
     * Load execution context state
     * @param string $viewId
     */
    function loadViewState(string $viewId){
        $session = $this->container->get('session');

        $this->componentsIdByName = [];

        // Load props
        $storeKey = 'componentsProps:'.$viewId;
        $componentsProps = $session->get($storeKey);
        if($componentsProps) {
            $this->componentsProps = $componentsProps;
            foreach ($this->componentsProps as $id => $state){
                $parsedId = self::parseComponentId($id);
                $this->componentsIdByName[$parsedId['componentName']] = $id;
                $this->componentsById[$id] = $this->getComponentByName($parsedId['componentName']);
            }
        }

        // Load state
        $storeKey = 'componentsState:'.$viewId;
        $state = $session->get($storeKey);
        if($state) {
            $this->componentsState = $state;
            foreach ($this->componentsState as $id => $state){
                $parsedId = self::parseComponentId($id);
                $this->componentsIdByName[$parsedId['componentName']] = $id;
                $this->componentsById[$id] = $this->getComponentByName($parsedId['componentName']);
            }
        }
    }

    /**
     * Reset execution context state
     */
    function resetState(){
        $this->componentsState = [];
        $this->componentsIdByName = [];
    }

    /**
     * Save execution context state
     */
    function saveState()
    {
        $session = $this->container->get('session');
        $storeKey = 'componentsState:'.$this->view->getId();
        $session->set($storeKey, $this->componentsState);
    }

    /**
     * Mount component
     * @param $componentId
     * @return bool
     * @throws \Exception
     */
    function mountComponent($componentId)
    {
        $id = self::parseComponentId($componentId);
        if(isset($this->componentsIdByName[$id['componentName']])){
            throw new \Exception('Component with name `'. $id['componentName'] . '` already mounted in view `'.$this->getView()->getName().'`!');
        }
        // Fill mount stack
        array_push($this->componentMountStack, $componentId);

        // Register new component
        $this->componentsIdByName[$id['componentName']] = $componentId;

//        if(
//            !isset($this->componentsIdByName[$id['componentName']]) ||
//            $this->componentsIdByName[$id['componentName']] !== $componentId
//        ) {
//            // Register new component
//            $this->componentsIdByName[$id['componentName']] = $componentId;
//
//            // Reset state
//            $this->componentsState[$componentId] = [];
//        }
    }

    /**
     * Unmount component
     * @param $componentId
     * @return bool
     */
    function unmountComponent($componentId)
    {
        $id = self::parseComponentId($componentId);
        if(isset($this->componentsIdByName[$id['componentName']])) {
            unset($this->componentsIdByName[$id['componentName']]);
            unset($this->componentsState[$id['componentName']]);
        }
        $i = array_search($id['componentName'], $this->componentMountStack);
        array_slice($this->componentMountStack, $i, 1);
    }

    /**
     * Get mounted components
     */
    function getMountedComponents()
    {
        $components = [];
        foreach ($this->componentMountStack as $id)
        {
            array_push($components, $this->componentsById[$id]);
        }
        return $components;
    }

//    function loadComponentsState(){
//        $session = $this->container->get('session');
//        $storeKey = 'componentsState:'.$this->view->getId();
//        $state = $session->get($storeKey);
//        if($state) {
//            $this->componentsState = $state;
//            $this->componentsIdByName = [];
//            foreach ($this->componentsState as $id => $state){
//                $parsedId = self::parseComponentId($id);
//                $this->componentsIdByName[$parsedId['componentName']] = $id;
//            }
//        }
//    }

    /**
     * Component by name
     * @param $componentName
     * @return Component
     */
    function getComponentByName($componentName){

        if(!isset($this->componentsIdByName[$componentName])){
            throw new Exception(sprintf('Component with name `%s` not found!', $componentName));
        }

        $componentId = $this->componentsIdByName[$componentName];

        if(!isset($this->componentsById[$componentId])){
            // Construct component
            $id = self::parseComponentId($componentId);
            $componentSet = $this->container->get("andevis_react.component_set");
            $class = $componentSet->getComponentClass($id['componentClass']);
            $this->componentsById[$componentId] = new $class($id['componentName'], $this, $this->container);
        }

        return $this->componentsById[$componentId];
    }

    /**
     * Get component by id
     * @param string $componentId
     * @return Component
     */
    function getComponentById(string $componentId)
    {
        $id = self::parseComponentId($componentId);
        return $this->getComponentByName($id['componentName']);
    }

    /**
     * Get component state
     * @param $component
     * @return array
     */
    function getComponentState(Component $component)
    {
        if(isset($this->componentsState[$component->getId()]))
            return $this->componentsState[$component->getId()];
        return [];
    }

    /**
     * Save component state
     * @param Component $component
     * @param $newState
     * @param bool $noFrontendUpdate
     */
    function setComponentState(Component $component, $newState, $noFrontendUpdate = false) {

        // Update if got any changes
        if(!$newState || sizeof($newState) == 0)
            return;

        // Save temporary new state for frontend
        if(!$noFrontendUpdate)
        {
            if(!isset($this->updatedComponentState[$component->getId()])) {
                $this->updatedComponentState[$component->getId()] = [];
            }
            $this->updatedComponentState[$component->getId()] = array_merge($this->updatedComponentState[$component->getId()], $newState);
        }

        // Save component state
        if(!isset($this->componentsState[$component->getId()])) {
            $this->componentsState[$component->getId()] = [];
        }
        $this->componentsState[$component->getId()] = array_merge($this->componentsState[$component->getId()], $newState);
    }

    function getUpdatedComponentState(){
        return $this->updatedComponentState;
    }


    /**
     * @param Component $component
     * @param $newProps
     * @internal param $props
     */
    function setComponentProps(Component $component, $newProps) {
        // Update if got any changes
        if(!$newProps || sizeof($newProps) == 0)
            return;

        // Save props state
        if(!isset($this->componentsProps[$component->getId()])) {
            $this->componentsProps[$component->getId()] = [];
        }
        $this->componentsProps[$component->getId()] = $newProps;
    }

    /**
     * Get component props
     * @param Component $component
     * @return array|mixed
     */
    function getComponentProps(Component $component)
    {
        if(isset($this->componentsProps[$component->getId()]))
            return $this->componentsProps[$component->getId()];
        return [];
    }

}