<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 12.12.2017
 * Time: 2:33
 */

namespace Andevis\ReactBundle\UI\ComponentBase;

// TODO: not used
class Event
{
    /** @var string */
    private $eventName;
    /** @var Component */
    private $component;

    function __construct($eventName, $component)
    {
        $this->eventName = $eventName;
        $this->component = $component;
    }

    function getEventName(){
        return $this->eventName;
    }

    function getComponent(){
        return $this->component;
    }
}