<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 26.01.2018
 * Time: 14:34
 */

namespace Andevis\ReactBundle\UI\Components\Menu;

use Andevis\ReactBundle\UI\ComponentBase\Component;

class Menu extends Component
{
    /**
     * @return array
     */
    function eventList()
    {
        $events = parent::eventList();
        return array_merge($events, ['itemClick']);
    }

    /**
     * itemClick event
     * @param $item
     * @return mixed
     * @throws \Exception
     */
    function itemClick($item){
        return $this->fireEvent('itemClick', $item);
    }

    function setItems($items){
        $this->setState([
            'items' => $items
        ]);
    }

    function getItems(){
        return $this->getState('items');
    }
}