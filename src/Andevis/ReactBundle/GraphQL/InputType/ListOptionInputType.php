<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.12.2017
 * Time: 5:07
 */

namespace Andevis\ReactBundle\GraphQL\InputType;


use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\Scalar\IdType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ListOptionInputType extends AbstractInputObjectType
{
    public function build($config)
    {
        $config
            ->addField('key', new IdType())
            ->addField('value', new StringType())
        ;
    }
}