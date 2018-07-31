<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 08.12.2017
 * Time: 3:25
 */

namespace Andevis\ReactBundle\GraphQL\InputType;


//use Andevis\ReactBundle\GraphQL\Type\ComponentStatusType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Scalar\IdType;


class ComponentInputType extends AbstractInputObjectType
{
    public function build($config)
    {
        $config
            ->addField('id', new IdType())
//            ->addField('status', new ComponentStatusType())
            ->addField('props', new ListType( new NameValueInputType()))
            ->addField('state', new ListType( new NameValueInputType()))
        ;
    }
}
