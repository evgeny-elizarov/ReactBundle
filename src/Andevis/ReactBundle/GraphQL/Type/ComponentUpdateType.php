<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 08.12.2017
 * Time: 3:13
 */

namespace Andevis\ReactBundle\GraphQL\Type;


use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\IdType;

class ComponentUpdateType extends AbstractObjectType
{
    public function build($config)
    {
        $config
            ->addField('id', new IdType())
            ->addField('state', new ListType( new NameValueType()))
        ;
    }
}