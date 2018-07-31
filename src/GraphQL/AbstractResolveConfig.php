<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 05.12.2017
 * Time: 19:56
 */

namespace Andevis\ReactBundle\GraphQL;


use Youshido\GraphQL\Type\AbstractType;

class AbstractResolveConfig
{

    private $schemaName;

    private $methodName;

    private $type;

    private $arguments;

    /**
     * AbstractComponentMethodConfig constructor.
     * @param string $methodName
     * @param string $schemaName
     * @param array|null $arguments
     * @param AbstractType $type
     */
    function __construct(string $methodName, string $schemaName, $arguments = null, AbstractType $type)
    {
        $this->methodName = $methodName;
        $this->schemaName = $schemaName;
        $this->type = $type;
        $this->arguments = $arguments;
    }

    function getMethodName(){
        return $this->methodName;
    }

    function getSchemaName(){
        return $this->schemaName;
    }

    function getType(){
        return $this->type;
    }

    function getArguments(){
        return $this->arguments;
    }
}