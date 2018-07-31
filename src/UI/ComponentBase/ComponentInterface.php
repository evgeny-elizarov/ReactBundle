<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 05.12.2017
 * Time: 9:41
 */

namespace Andevis\ReactBundle\UI\ComponentBase;


interface ComponentInterface
{
    /**
     * Method configuration to build GraphQL schema
     * @return array
     */
    static function resolveConfig();

}