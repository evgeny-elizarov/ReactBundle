<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 18.12.2017
 * Time: 0:00
 */

namespace Andevis\ReactBundle\GraphQL\Query;


use Andevis\GraphQLBundle\GraphQL\AbstractBundleField;
use Andevis\ReactBundle\GraphQL\Type\ViewUserHandlers;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Type\ListType\ListType;

class ViewsUserHandlersField extends AbstractBundleField
{
    public function resolve($value, array $args, ResolveInfo $info)
    {
        return date('H:i:s');
    }

    /**
     * @return ListType
     */
    public function getType()
    {
        return new ListType(new ViewUserHandlers());
    }
}