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
        return array_merge(parent::eventList(), ['fetchOptions', 'selectOption']);
    }

    /**
     * Fetch options
     * @param string $input
     * @return mixed
     * @throws \Exception
     */
    function fetchOptions(string $input) {
        $options = $this->fireEvent('fetchOptions', $input);
        if(!is_array($options)) {
            throw new \Exception('fetchOptions event must return array of options!');
        }
        return $options;
    }


    /**
     * Select option
     * @param array|null $option
     * @return mixed
     * @throws \Exception
     */
    function selectOption(?array $option){
        return $this->fireEvent('selectOption', $option);
    }
}


