<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.12.2017
 * Time: 10:08
 */

namespace Andevis\ReactBundle\UI\Components\View;


use Andevis\ReactBundle\UI\ComponentBase\Component;
use Andevis\ReactBundle\UI\ComponentBase\ExecutionContext;
use Andevis\ReactBundle\GraphQL\InputType\ComponentInputType;
use Andevis\ReactBundle\GraphQL\InputType\EventInputType;
use Andevis\ReactBundle\GraphQL\MutationResolveConfig;
use Andevis\ReactBundle\GraphQL\QueryResolveConfig;
use Andevis\ReactBundle\GraphQL\Type\ViewInitStatusType;
use ReflectionClass;
use ReflectionMethod;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\StringType;


class View extends Component implements ViewInterface
{
    /**
     * Component constructor.
     * @param $name
     * @param $index
     * @param $context
     * @param $container
     * @throws \Exception
     */
    function __construct($name, ?int $index, $context, $container)
    {
        if(!is_null($index)){
            throw new \Exception('View can not have an index');
        }
        parent::__construct($name, $index, $context, $container);
    }

//    static function resolveConfig()
//    {
//        $config = parent::resolveConfig();
//        $config[] = new MutationResolveConfig(
//            'reactOnInit',
//            'init',
//            [
//                'components' => new ListType(new ComponentInputType())
//            ],
//            new ViewInitStatusType()
//        );
//        return $config;
//    }

    static public function getInitialState(string $viewId, ContainerInterface $container){}
    static public function getInitialGlobalState(string $viewId, ContainerInterface $container){}


    function eventList()
    {
        return array_merge(parent::eventList(), ['callServerMethod']);
    }

    /**
     * Server method caller handler
     * @return mixed
     * @throws \Exception
     * @throws \ReflectionException
     */
    function callServerMethod()
    {
        $args = func_get_args();
        $methodName = array_shift($args);
        $refClass = new ReflectionClass(get_class($this));
        $methods = $refClass->getMethods(ReflectionMethod::IS_PUBLIC);
        $methodDefined = false;
        foreach ($refClass->getMethods(ReflectionMethod::IS_PUBLIC) as $method){
            // $method->class == $refClass->getName() &&
            if ($method->name == $methodName){
                $methodDefined = true;
                break;
            }
        }

        if($methodDefined){
            return call_user_func_array([$this, $methodName], $args);
        } else {
            throw new \Exception(sprintf('Server method `%s` not defined in  view `%s`', $methodName, $this->getName()));
        }
    }


    // TODO: rename it to getServiceById
    /**
     * Get symfony service
     * @param $id
     * @return object
     */
    public function get($id){
        return $this->container->get($id);
    }

    /**
     * Load event handler
     */
//    function load(){
////        foreach ($this->getContext()->getMountedComponents() as $component){
////            if($this !== $component){
////                $component->load();
////            }
////        }
//    }

    /**
     * @param $args
     * @return array
     * @throws \Exception
     */
    function reactOnInit($args){

        // Reset old components state when init view
        $this->getContext()->resetState();

        //
        // Update component state from frontend
        //
        // TODO: put it code to ExecutionContext
        if(is_array($args['components'])) {
            foreach ($args['components'] as $componentData){

                // Construct view components
                $id = self::parseComponentId($componentData['componentId']);

                // Register component
                $this->getContext()->registerComponent($componentData['componentId']);

                // Get component
                $component = $this->getContext()->getComponentByName($id['componentName']);

                $componentNewState = [];
                foreach ($componentData['updateState'] as $updateState)
                {
                    $componentNewState[$updateState['name']] = isset($updateState['value']) ? $updateState['value'] : null;
                }
                $this->getContext()->setComponentState($component, $componentNewState, true);
            }
        }

        //
        // Init components
        //
        foreach ($args['components'] as $componentData) {
            $id = ExecutionContext::parseComponentId($componentData['componentId']);
            $component = $this->getContext()->getComponentByName($id['componentName']);
            $componentUserHandler = $id['componentName'] . "_init";
            $userHandlerCallback = [$this, $componentUserHandler];

            $return = null;
            if (is_callable($userHandlerCallback)) {

                $argsWithComponent = array_merge([$component], $args);

                call_user_func_array($userHandlerCallback, $argsWithComponent);
            }
        }

        //
        // Prepare component update state to update on frontend
        //
        $componentUpdateState = [];
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

                $componentUpdateState[] = [
                    'componentId' => $componentId,
                    'updateState' => $updateState
                ];
            }
        }

        return [
            'componentsUpdateState' => $componentUpdateState
        ];
    }


    /**
     * Get component by name
     * @param $componentName
     * @return Component
     * @throws \Exception
     */
    function getComponentByName($componentName){
        return $this->getContext()->getComponentByName($componentName);
    }


}
