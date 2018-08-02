<?php
namespace Andevis\ReactBundle\UI\Components\DataTable;

use Andevis\ReactBundle\UI\ComponentBase\Component;

/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 14.03.2018
 * Time: 19:01
 */

class DataTable extends Component
{
    /**
     * event List
     * @return array
     */
    function eventList()
    {
        $events = parent::eventList();
        return array_merge($events, ['fetchData']);
    }

    /**
     * Set pages
     * @param $pages
     */
    function setPages($pages){
        $this->setAttributeValue('pages', $pages);
    }

    /**
     * Get pages
     * @return null
     */
    function getPages(){
        return $this->getAttributeValue('pages', 0);
    }

    /**
     * Fetch data
     * @param null $pageSize
     * @param null $pageIndex
     * @param null $sorted
     * @param null $filtered
     * @return mixed
     * @throws \Exception
     */
    function fetchData($pageSize = null, $pageIndex = null, $sorted = null, $filtered = null){
        $result = $this->fireEvent('fetchData', $pageSize, $pageIndex, $sorted, $filtered);
        if(!is_array($result)){
            throw new \Exception('fetchData event must return array!');
        }
        return $result;
    }

}