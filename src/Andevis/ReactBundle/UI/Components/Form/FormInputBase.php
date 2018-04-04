<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 05.02.2018
 * Time: 20:19
 */

namespace Andevis\ReactBundle\UI\Components\Form;


use Andevis\ReactBundle\UI\ComponentBase\Component;

class FormInputBase extends Component
{
    function eventList(){
        return array_merge(parent::eventList(), ['change', 'click']);
    }

    /**
     * Click event
     */
    function click(){
        return $this->fireEvent('click');
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
     * Value attribute getter
     */
    function getValue(){
        return $this->getAttributeValue('value', $this->getProperty('value'));
    }

    /**
     * Value attribute setter
     * @param string $value
     */
    function setValue(string $value){
        $this->setAttributeValue('value', $value);
    }
}