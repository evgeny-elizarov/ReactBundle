<?php

namespace Andevis\ReactBundle\UI\Views\ExampleContainer;


use Andevis\ReactBundle\UI\Components\Container\Container;
use Andevis\ReactBundle\UI\Components\View\View;

/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 29.03.2018
 * Time: 13:42
 */

class ExampleContainer extends View
{

    /**
     * @throws \Exception
     */
    function btnTest_onClick(){
        /** @var Container $container */
        $container = $this->getComponentByName('sampleContainer');
        $container->setState([
            'count' => $container->getState('count') === null ? 0 : $container->getState('count') + 1
        ]);
    }
}