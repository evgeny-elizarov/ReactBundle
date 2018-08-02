<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 05.02.2018
 * Time: 14:56
 */

namespace Andevis\ReactBundle\UI\Components\Form\Fields\DateTime;


use Andevis\ReactBundle\UI\Components\Form\Fields\Text\Text;

class DateTime extends Text
{
    function eventList(){
        return array_merge(parent::eventList(), ['change', 'click']);
    }

    /**
     * Click event
     * @throws \Exception
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
        return $this->getAttributeValue('value', '');
    }

    /**
     * Value attribute setter
     * @param string $value
     */
    function setValue(string $value){
        $this->setAttributeValue('value', $value);
    }
}