<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 07.12.2017
 * Time: 14:22
 */

namespace Andevis\ReactBundle\GraphQL\Type;

use Andevis\GraphQLBundle\GraphQL\Type\JsonStringType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\StringType;

class NameValueType extends AbstractObjectType
{
    public function build($config)
    {
        $config
            ->addField('name', new StringType())
            ->addField('value', new JsonStringType())
        ;
    }
}