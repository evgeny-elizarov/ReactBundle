<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 17.04.2018
 * Time: 17:07
 */

namespace Andevis\ReactBundle\UI\ComponentBase;

use ReflectionClass;
use ReflectionMethod;

trait ComponentHelpers
{
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
}