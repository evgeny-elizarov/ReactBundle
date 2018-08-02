<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 08.12.2017
 * Time: 6:34
 */

namespace Andevis\ReactBundle\GraphQL\Type;

use Andevis\GraphQLBundle\GraphQL\Type\JsonStringType;
use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\StringType;


class EventResponseType extends AbstractObjectType
{
    function build($config)
    {
        $config
            ->addField('result', new JsonStringType())
            ->addField('userError', new StringType())
            ->addField('componentsUpdate', new ListType(new ComponentUpdateType()))
        ;
    }
}