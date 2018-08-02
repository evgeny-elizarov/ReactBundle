<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.12.2017
 * Time: 14:58
 */

namespace Andevis\ReactBundle\UI\Components\Button;

use Andevis\ReactBundle\UI\ComponentBase\Component;


class Button extends Component
{

    function eventList(){
        return array_merge(parent::eventList(), ['click', 'doubleClick']);
    }

    /**
     * Click event
     */
    function click(){
        return $this->fireEvent('click');
    }

    /**
     * Double click event
     */
    function doubleClick(){
        return $this->fireEvent('doubleClick');
    }
}
