<?php
namespace Andevis\ReactBundle\UI\Views\ExampleTabs;

use Andevis\ReactBundle\UI\Components\View\View;

/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 15.03.2018
 * Time: 3:09
 */

class ExampleTabs extends View
{
    /**
     * Example how catch selected tab on backed
     * @param $tabs
     * @param $index
     */
    function tabSet2_onSelectTab($tabs, $index){
        $this->setState([
            'selectedIndex' => $index
        ]);
    }
}