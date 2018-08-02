<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 29.03.2018
 * Time: 17:54
 */

namespace Andevis\ReactBundle\UI\Components\Form;


use Andevis\ReactBundle\UI\ComponentBase\Component;

class Field extends Component
{
    function eventList(){
        return array_merge(parent::eventList(), ['input', 'change', 'click', 'doubleClick']);
    }

    /**
     * Input event
     * @param $value
     * @return mixed
     * @throws \Exception
     */
    function input($value){
        return $this->fireEvent('input', $value);
    }

    /**
     * Change event
     * @param $value
     * @return mixed
     * @throws \Exception
     */
    function change($value){
        return $this->fireEvent('change', $value);
    }

    /**
     * Click event
     * @throws \Exception
     */
    function click(){
        return $this->fireEvent('click');
    }

    /**
     * Double click event
     * @throws \Exception
     */
    function doubleClick(){
        return $this->fireEvent('doubleClick');
    }

    /**
     * Value attribute getter
     */
    function getValue(){
        return $this->getAttributeValue('value', $this->getProperty('defaultValue'));
    }

    /**
     * Value attribute setter
     * @param string $value
     */
    function setValue(string $value){
        $this->setAttributeValue('value', $value);
    }
}