<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 04.12.2017
 * Time: 4:17
 */

namespace Andevis\ReactBundle\GraphQL\Type;


use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\IdType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ListOptionType extends AbstractObjectType
{
    public function build($config)
    {
        $config
            ->addField('key', new IdType())
            ->addField('value', new StringType())
        ;
    }

}