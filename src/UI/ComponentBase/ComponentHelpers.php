<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 17.04.2018
 * Time: 17:07
 */

namespace Andevis\ReactBundle\UI\ComponentBase;


use Andevis\HelperBundle\Service\NormalizedEntityManager;
use ReflectionClass;
use ReflectionMethod;
use Symfony\Component\DependencyInjection\Container;

trait ComponentHelpers
{
    /** @var Container */
    private $container;


    /**
     * Return true if class has defined method
     * @param $class
     * @param $methodName
     * @return bool
     * @throws \ReflectionException
     */
    static function hasRedefinedMethod($class, $methodName){
        $refClass = new ReflectionClass($class);
        $calledClass = get_called_class();
        foreach ($refClass->getMethods(ReflectionMethod::IS_PUBLIC) as $method)
        {
            if($method->name == $methodName){
                if(!is_a($calledClass, $method->class, true)) {
                    return true;
                }
            }
        }
        return false;
    }


    /**
     * Get container
     * @return Container
     */
    function getContainer(){
        return $this->container;
    }


    /**
     * Returns true if the service id is defined.
     *
     * @param string $id The service id
     *
     * @return bool true if the service id is defined, false otherwise
     *
     * @final since version 3.4
     */
    protected function has($id)
    {
        return $this->container->has($id);
    }

    /**
     * Gets a container service by its id.
     *
     * @param string $id The service id
     *
     * @return object The service
     *
     * @final since version 3.4
     * @throws \Exception
     */
    protected function get($id)
    {
        return $this->container->get($id);
    }


    /**
     * Shortcut function to get Doctrine entity manager
     * @return \Doctrine\ORM\EntityManager|object
     * @throws \Exception
     */
    function getEntityManager(){
        return $this->get('doctrine.orm.entity_manager');
    }

    /**
     * Shortcut function to get normalized entity manager
     * @return \Andevis\HelperBundle\Service\NormalizedEntityManager|object
     * @throws \Exception
     */
    function getNormalizedEntityManager(){
        return $this->get('andevis.helper.normalized_entity_manager');
    }

}