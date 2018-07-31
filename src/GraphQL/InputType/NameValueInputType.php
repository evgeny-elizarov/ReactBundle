<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 07.12.2017
 * Time: 14:30
 */

namespace Andevis\ReactBundle\GraphQL\InputType;


use Andevis\GraphQLBundle\GraphQL\Type\JsonStringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\Scalar\StringType;

class NameValueInputType extends AbstractInputObjectType
{
    public function build($config)
    {
        $config
            ->addField('name', new StringType())
            ->addField('value', new JsonStringType())
        ;
    }
}