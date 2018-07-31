<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 13.12.2017
 * Time: 11:10
 */

namespace Andevis\ReactBundle\UI\ComponentBase;


use Andevis\HelperBundle\Helper\SymfonyHelper;

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
        if(sizeof($parts) < 3 || sizeof($parts) > 4)
            throw new \Exception(sprintf('Bad componentId `%s` format!', $componentId));

        $idParts = explode(":", $componentId);
        return [
            'viewClass' => $idParts[0],
            'componentClass' => $idParts[1],
            'componentName' => $idParts[2],
            'componentIndex' => isset($idParts[3]) ? intval($idParts[3]) : null
        ];
    }


    /**
     * Get bundle name
     * @param $className
     * @return string
     * @throws \Exception
     */
    static function getBundleName($className){
        $bundleName = SymfonyHelper::getBundleName($className);
        if(!$bundleName){
            throw new \Exception('Can`t detect view bundle name');
        }
        return $bundleName;
    }

//    // TODO: rename it to getAccessPermission
//    /**
//     * Get component permission name
//     * @param $className
//     * @return string
//     * @throws \Exception
//     */
//    static function getComponentPermissionName($className){
//        return self::getBundleName($className).":".self::getShortClassName($className);
//    }

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
     * Get component global name
     * @param $viewClassName
     * @param $componentClassName
     * @param $componentName
     * @return string
     */
    static function getComponentGlobalName($viewClassName, $componentClassName, $componentName){
        $viewClass = self::getComponentClassName($viewClassName);
        $componentClass = self::getComponentClassName($componentClassName);
        return $viewClass.":".$componentClass.":".$componentName;
    }

    /**
     * Get view id
     * @param $viewClassName
     * @param $componentClassName
     * @param $componentName
     * @param int|null $componentIndex
     * @return string
     */
    static function getComponentId($viewClassName, $componentClassName, $componentName, ?int $componentIndex){
        return (is_numeric($componentIndex)) ?
            self::getComponentGlobalName($viewClassName, $componentClassName, $componentName).":".$componentIndex :
            self::getComponentGlobalName($viewClassName, $componentClassName, $componentName);
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