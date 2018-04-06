<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.04.2018
 * Time: 13:35
 */

namespace Andevis\ReactBundle\UI\Views\ExampleServerMethod;

use Andevis\ReactBundle\UI\Components\View\View;

class ExampleServerMethod extends View
{


    /***
     * Custom server method
     * @param $arg1
     * @param $arg2
     * @return mixed
     */
    function serverMethod($arg1, $arg2){
        return $arg1 + $arg2;
    }

}