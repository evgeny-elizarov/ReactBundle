<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 04.12.2017
 * Time: 3:38
 */

namespace Andevis\ReactBundle\UI\ComponentBase;

use Andevis\HelperBundle\Service\NormalizedEntityManager;
use Andevis\ReactBundle\GraphQL\InputType\EventInputType;
use Andevis\ReactBundle\GraphQL\Type\EventResponseType;
use Andevis\ReactBundle\GraphQL\MutationResolveConfig;
use Andevis\ReactBundle\UI\Exceptions\UserException;
use Andevis\ReactBundle\UI\Translation\TranslationTrait;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;


define('COMPONENT_MOUNTED', 1);
define('COMPONENT_UNMOUNTED', -1);

abstract class Component implements ComponentInterface
{

//    use ContainerAwareTrait;
    use ComponentIdTrait;
    use ComponentHelpers;
    use TranslationTrait;

    /** @var string */
    protected $name;

    /** @var integer */
    protected $index;

    /** @var ExecutionContext */
    protected $context;

    protected $translationMessages;
    protected $translationPrefixKey;
    protected $translationMessageFile;

    private $container;

    /**
     * Component constructor.
     * @param $name
     * @param $index
     * @param $context
     * @param $container
     */
    function __construct($name, ?int $index, $context, $container)
    {
        $this->name = $name;
        $this->index = $index;
        $this->context = $context;
        $this->container = $container;
    }

    /**
     * Access method. Can be redefined by user. Return boolean TRUE if access allowed or FALSE is forbidden.
     * @return boolean
     */
    function access(){
        // By default always allow access to component
        return true;
    }

    /**
     * Return access permission
     * @return string
     */
    static function getAccessPermission(){
        return get_called_class();
    }

    /**
     * Get id
     * @return string
     */
    function getId(){
        // TODO: shorter ID base64_encode(pack('H*', md5('ReactExampleComponents:ReactExampleComponents:ExampleComponents')))

        return self::getComponentId(
            get_class($this->context->getView()),
            get_class($this),
            $this->getName(),
            $this->getIndex()
        );
    }

    /**
     * Get auto name
     * @return bool|string
     */
    protected function getAutoName(){
        $className = get_called_class();

        // Remove namespace
        if ($prevPos = strrpos($className, '\\')) {
            $className = substr($className, $prevPos + 1);
        }

        // Remove Component from class name
        if (substr($className, -9) == 'Component') {
            $className = substr($className, 0, -9);
        }
        return $className;
    }

    /**
     * Get index
     * @return int|null
     */
    function getIndex(){
        return $this->index;
    }

    /**
     * Get name
     * @return string
     */
    function getName(){
        return $this->name;
    }

    /**
     * @return ExecutionContext
     */
    function getContext(){
        return $this->context;
    }

    /**
     * Set method context
     * @param ExecutionContext $context
     */
    function setContext(ExecutionContext $context){
        $this->context = $context;
    }

    /**
     * Get container
     * @return Container
     */
    function getContainer(){
        return $this->container;
    }


    /**
     * Attribute getter
     * @param $attribute
     * @return mixed
     * @throws \Exception
     */
    public function __get($attribute) {
        $getter = 'get'.ucfirst($attribute);
        if(!is_callable([$this, $getter]))
            throw new \Exception(
                sprintf('Attribute `%s` not exists. Check if attribute getter `%s` exists for component `%s`', $attribute, $getter, get_class($this)));

        return call_user_func([$this, $getter]);
    }

    /**
     * Attribute setter
     * @param $attribute
     * @param $value
     * @return $this
     * @throws \Exception
     */
    public function __set($attribute, $value) {
        $setter = 'set'.ucfirst($attribute);
        if(!is_callable([$this, $setter]))
            throw new \Exception(
                sprintf('Attribute `%s` not exists. Check if attribute setter `%s` exists for component `%s`', $attribute, $setter, get_class($this)));
        return call_user_func([$this, $setter]);
    }


    /**
     * Get state
     * @return null
     */
    protected function getState(){
        $state = $this->getContext()->getComponentState($this);
        // TODO: move it functionality to separate function
        if(func_num_args() == 1){
            $key = func_get_arg(0);
            return (isset($state[$key])) ? $state[$key] : null;
        }
        return $state;
    }

    /**
     * Set state
     * @param array $newState
     */
    protected function setState(array $newState){
        $this->getContext()->setComponentState($this, $newState);
    }

    /**
     * Props getter
     */
    private function getProps(){
        return (object) $this->getContext()->getComponentProps($this);
    }

    /**
     * Props setter
     * @throws \Exception
     */
    private function setProps(){
        throw new Exception('Properties can not be changed!');
    }


    /**
     * Get component frontend property
     * @param string $name
     * @return mixed
     */
    public function getProperty(string $name){
        $props = $this->getProps();
        return isset($props->{$name}) ? $props->{$name} : null;
    }


    /**
     * Get attribute state name
     * @param string $attributeName
     * @return string
     */
    private function getAttributeStateName(string $attributeName){
        return '_attribute'.ucfirst($attributeName);
    }

    /**
     * Get attribute value
     * @param string $attributeName
     * @param null $default
     * @return null
     * @internal param string $name
     */
    protected function getAttributeValue(string $attributeName, $default = null){
        $value = $this->getState($this->getAttributeStateName($attributeName));
        return $value === null ? $default : $value;
    }

    /**
     * Set attribute value
     * @param string $attributeName
     * @param $value
     */
    protected function setAttributeValue(string $attributeName, $value){
        $attributeStateName = $this->getAttributeStateName($attributeName);
        return $this->setState([
            $attributeStateName => $value
        ]);
    }

    /**
     * Enabled attribute getter
     */
    function getEnabled(){
        return $this->getAttributeValue('enabled', true);
    }

    /**
     * Enabled attribute setter
     * @param bool $value
     */
    function setEnabled(bool $value){
        $this->setAttributeValue('enabled', $value);
    }

//    /**
//     * Mounted attribute getter
//     */
//    function getMounted(){
//        return $this->getAttributeValue('mounted', true);
//    }
//
//    /**
//     * Mounted attribute setter
//     * @param bool $value
//     */
//    function setMounted(bool $value){
//        $this->setAttributeValue('mounted', $value);
//    }

    /**
     * Has focused attribute getter
     */
    function getHasFocused(){
        return $this->getAttributeValue('hasFocused', true);
    }

    /**
     * Has focused attribute setter
     * @param bool $value
     */
    function setHasFocused(bool $value){
        $this->setAttributeValue('hasFocused', $value);
    }

    /**
     * Build GraphQL resolve config
     * @return array
     */
    static function resolveConfig()
    {
        $config = [
            new MutationResolveConfig(
                'resolveEvent',
                'event',
                [
                    'event' => new EventInputType()
                ],
                new EventResponseType()
            ),
        ];
        return $config;
    }

    /**
     * Event list
     * @return array
     */
    function eventList(){
        return [
            'willReceiveProps',
            'willUpdate',
            'didMount',
            'didUpdate',
            'focus',
            'blur'
        ];
    }

//    /**
//     * Init event handler
//     */
//    function init(){
//        $this->fireEvent('init');
//    }

    /**
     * Component did update event handler
     */
    function didUpdate(){
        $this->fireEvent('didUpdate');
    }

    /**
     * Component did mount event handler
     */
    function didMount(){
        $this->fireEvent('didMount');
    }

    /**
     * Component willReceiveProps event handler
     * @param array $nextProps
     * @throws \Exception
     */
    function willReceiveProps(array $nextProps){
        $this->fireEvent('willReceiveProps', $nextProps);
    }

    /**
     * Component willUpdate event handler
     * @param array $nextProps
     * @param array $nextState
     * @throws \Exception
     */
    function willUpdate(array $nextProps, array $nextState){
        $this->fireEvent('willUpdate', $nextProps, $nextState);
    }

    /**
     * Fire event
     * @param $eventName
     * @return mixed
     * @throws \Exception
     */
    protected function fireEvent($eventName){
        $arguments = func_get_args();
//        $event = new Event($eventName, $this);

//        $foundBackendEventHandler = false;

        // Call component handler
//        $componentHandlerCallback = [$this, $eventUserHandlerName];
//        if(is_callable($componentHandlerCallback)){
////            $foundBackendEventHandler = true;
//            call_user_func($componentHandlerCallback, $this, $event);
//        }
        /*
        else {
            throw new \Exception(
                sprintf('Event method handler `%s` not implemented in view `%s`',
                    $userHandlerName,
                    get_class($this->getContext()->getView())
                )
            );
        }*/

        // Call user handler in view
        $eventUserHandlerName = 'on'.ucfirst($eventName);
        $userHandlerName = $this->getName()."_".$eventUserHandlerName;
        $userHandlerCallback = [$this->getContext()->getView(), $userHandlerName];
        if(is_callable($userHandlerCallback)){
//            $foundBackendEventHandler = true;
            $arguments[0] = $this; // First argument always current component
            return call_user_func_array($userHandlerCallback, $arguments);
        }
//        if(!$foundBackendEventHandler) {
//            throw new \Exception(
//                sprintf('Event method handler `%s` not implemented in view `%s` ',
//                    $userHandlerName,
//                    get_class($this->getContext()->getView())
//                )
//            );
//        }
    }

    /**
     * Call component user handler
     * @param string $handlerName
     * @param array $args
     * @return mixed
     * @throws \Exception
     */
    function callUserHandler(string $handlerName, array $args = []){
        return $this->context->callComponentUserHandler($this, $handlerName, $args);
    }

    /**
     * Reaction to an event caused by a frontend
     * @param $args
     * @return array
     * @throws \Exception
     */
    function resolveEvent($args){
        if(!in_array($args['event']['eventName'], $this->eventList()))
            throw new \Exception(sprintf('Bad event name `%s` for this component `%s` !', $args['event']['eventName'], get_class($this)));

        //
        // 1. Call event handler
        //
        $eventHandler = array($this, $args['event']['eventName']);
        $result = null;
        $userError = null;
        if(is_callable($eventHandler)){
            try{
                $result = call_user_func_array($eventHandler, $args['event']['arguments']);
            } catch ( UserException $e){
                $userError = $e->getMessage();
            }

        } else {
            throw new \Exception(
                sprintf('Event handler `%s` not implemented in component `%s`',
                    $args['event']['eventName'],
                    get_class($this)
                )
            );
        }

//        if($result !== null && !is_bool($result)){
//            throw new \Exception('Event must return `null` or boolean value!');
//        }

        //
        // 2. Prepare components changed state for update frontend
        //
        $componentsUpdate = [];
        $updateStateData = $this->getContext()->getUpdatedComponentState();
        if(is_array($updateStateData))
        {
            foreach ($updateStateData as $componentId => $state)
            {
                $updateState = [];
                foreach ($state as $name => $value){
                    $updateState[] = [
                        'name' => $name,
                        'value' => $value
                    ];
                }

                $componentsUpdate[] = [
                    'id' => $componentId,
                    'state' => $updateState
                ];
            }
        }

        return [
            'result' => $result, // Fix Json converions error php null converts to false
            'userError' => $userError,
            'componentsUpdate' => $componentsUpdate
        ];
    }

    /**
     * Shortcut function to get Doctrine entity manager
     * @return \Doctrine\ORM\EntityManager|object
     */
    function getEntityManager(){
        return $this->container->get('doctrine.orm.entity_manager');
    }

    /**
     * Shortcut function to get normalized entity manager
     * @return NormalizedEntityManager
     */
    function getNormalizedEntityManager(){
        return $this->container->get('andevis.helper.normalized_entity_manager');
    }



}
