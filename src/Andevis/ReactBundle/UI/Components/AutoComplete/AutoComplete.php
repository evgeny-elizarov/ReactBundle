<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 14.12.2017
 * Time: 22:05
 */

namespace Andevis\ReactBundle\UI\Components\AutoComplete;

use Andevis\ReactBundle\UI\Components\Select\Select;


class AutoComplete extends Select
{

    function eventList(){
        return array_merge(parent::eventList(), ['search', 'selectOption']);
    }

    /**
     * Text attribute getter
     */
    function getText(){
        return $this->getAttributeValue('text', '');
    }

    /**
     * Text attribute setter
     * @param string $value
     */
    function setText(string $value){
        $this->setAttributeValue('text', $value);
    }

    /**
     * Search event
     * @param $text
     * @return mixed
     * @throws \Exception
     * @internal param $value
     */
    function search($text){
        return $this->fireEvent('search', $text);
    }

    /**
     * Change event
     * @param array $option
     * @return mixed
     * @throws \Exception
     */
    function selectOption(array $option){
        return $this->fireEvent('selectOption', $option);
    }

}