<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 08.12.2017
 * Time: 6:37
 */

namespace Andevis\ReactBundle\GraphQL\InputType;


use Andevis\GraphQLBundle\GraphQL\Type\JsonStringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Scalar\StringType;

class EventInputType extends AbstractInputObjectType
{
    function build($config)
    {
        $config
            ->addField('eventName', new StringType())
            ->addField('arguments', new JsonStringType())
            ->addField('components', new ListType(new ComponentInputType()))
        ;
    }

}
