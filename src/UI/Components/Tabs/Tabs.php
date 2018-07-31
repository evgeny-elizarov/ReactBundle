<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 15.03.2018
 * Time: 2:14
 */

namespace Andevis\ReactBundle\UI\Components\Tabs;

use Andevis\ReactBundle\UI\ComponentBase\Component;

class Tabs extends Component
{
    /**
     * event List
     * @return array
     */
    function eventList()
    {
        $events = parent::eventList();
        return array_merge($events, ['selectTab']);
    }

    /**
     * Select tab
     * @param $index
     * @return mixed
     * @throws \Exception
     */
    function selectTab($index)
    {
        return $this->fireEvent('selectTab', $index);
    }
}