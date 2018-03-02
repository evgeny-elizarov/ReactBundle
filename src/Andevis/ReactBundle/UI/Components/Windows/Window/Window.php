<?php

namespace Andevis\ReactBundle\UI\Components\Windows\Window;

use Andevis\ReactBundle\UI\ComponentBase\Component;

/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 01.03.2018
 * Time: 9:55
 */

class Window extends Component
{
    /**
     * @return array
     */
    function eventList()
    {
        $events = parent::eventList();
        return array_merge($events, ['close']);
    }
}