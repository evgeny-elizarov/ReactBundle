<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 07.12.2017
 * Time: 22:47
 */

namespace Andevis\ReactBundle\GraphQL\Type;


use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ViewInitStatusType extends AbstractObjectType
{
    function build($config)
    {
        $config
            ->addField('componentsUpdateState', new ListType(new ComponentUpdateType()));
    }

}