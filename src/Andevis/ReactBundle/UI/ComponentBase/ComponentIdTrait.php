<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 13.12.2017
 * Time: 11:10
 */

namespace Andevis\ReactBundle\UI\ComponentBase;


trait ComponentIdTrait
{
    /**
     * Parse component Id
     * @param $componentId
     * @return array
     * @throws \Exception
     */
    static function parseComponentId($componentId){
        $parts = explode(":", $componentId);
        if(sizeof($parts) !== 3)
            throw new \Exception(sprintf('Bad componentId `%s` format!', $componentId));

        list($viewClass, $componentClass, $componentName) = explode(":", $componentId);
        return [
            'viewClass' => $viewClass,
            'componentClass' => $componentClass,
            'componentName' => $componentName,
        ];
    }


    /**
     * Get bundle name
     * @param $className
     * @return string
     * @throws \Exception
     */
    static function getBundleName($className){
        $parts = explode("\\", $className);
        $bundleName = "";
        for($i = 0; $i < sizeof($parts); $i++)
        {
            $name = $parts[$i];

            // Remove postfix
            if(substr($name, -6) == "Bundle"){
                $bundleName = substr($name, 0, -6);
                break;
            }
        }
        if(!$bundleName){
            throw new \Exception('Can`t detect view bundle name');
        }
        return $bundleName;
    }

    /**
     * Component short class name
     * @param $className
     * @return string
     */
    static function getShortClassName($className){
        // Remove namespace
        if ($prevPos = strrpos($className, '\\')) {
            $className = substr($className, $prevPos + 1);
        }
        return $className;
    }

    /**
     * Component name
     * @param $className
     * @return string
     */
    static function getComponentClassName($className){
        return self::getBundleName($className).self::getShortClassName($className);
    }


    /**
     * Get schema name
     * @param $className
     * @return string
     */
    static function getSchemaName($className){
        return "ui".self::getComponentClassName($className);
    }

    /**
     * Get view id
     * @param $viewClassName
     * @param $componentClassName
     * @param $componentName
     * @return string
     */
    static function getComponentId($viewClassName, $componentClassName, $componentName){
        $viewClass = self::getComponentClassName($viewClassName);
        $componentClass = self::getComponentClassName($componentClassName);
        return $viewClass.":".$componentClass.":".$componentName;
    }

    /**
     * Get view id
     * @param $viewClassName
     * @return string
     */
    static function getViewId($viewClassName){
        $viewClass = self::getComponentClassName($viewClassName);
        $componentClass = self::getComponentClassName($viewClassName);
        $viewName = self::getShortClassName($viewClassName);
        return $viewClass.":".$componentClass.":".$viewName;
    }
}