<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 14.12.2017
 * Time: 22:05
 */

namespace Andevis\ReactBundle\UI\Components\Form\Fields\AutoComplete;

use Andevis\ReactBundle\UI\Components\Form\Fields\Text\Text;


class AutoComplete extends Text
{
    function eventList(){
        return array_merge(parent::eventList(), ['fetchData', 'select']);
    }

    /**
     * Fetch data
     * @param string $input
     * @return mixed
     * @throws \Exception
     */
    function fetchData(string $input) {
        $items = $this->fireEvent('fetchData', $input);
        if(!is_array($items)) {
            throw new \Exception('fetchDate event must return array of items!');
        }
        return $items;
    }


    /**
     * Select item
     * @param array|null $item
     * @return mixed
     * @throws \Exception
     */
    function select(?array $item){
        return $this->fireEvent('select', $item);
    }

    /**
     * Get selected item
     */
    function getSelectedItem(){
        return $this->getAttributeValue('selectedItem', '');
    }

    /**
     * Set selected item
     * @param string $value
     */
    function setSelectedItem(string $value){
        $this->setAttributeValue('selectedItem', $value);
    }


}
