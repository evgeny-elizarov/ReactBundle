<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 18.12.2017
 * Time: 0:04
 */

namespace Andevis\ReactBundle\GraphQL\Type;


use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\IdType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ViewUserHandlers extends AbstractObjectType
{
    function build($config)
    {
        $config
            ->addField('viewId', new IdType())
            ->addField('userHandlers', new ListType(new StringType()));
    }
}