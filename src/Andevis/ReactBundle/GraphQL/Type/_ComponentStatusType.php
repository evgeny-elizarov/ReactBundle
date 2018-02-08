<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 19.01.2018
 * Time: 16:48
 */

namespace Andevis\ReactBundle\GraphQL\Type;
use Youshido\GraphQL\Type\Enum\AbstractEnumType;


class ComponentStatusType extends AbstractEnumType
{

    /**
     * @return array
     */
    public function getValues()
    {
        return [
            [
                'name'  => 'MOUNTED',
                'value' => 1,
            ],
            [
                'name'  => 'UNMOUNTED',
                'value' => -1,
            ]
        ];
    }
}
