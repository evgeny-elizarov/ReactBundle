<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 19.01.2018
 * Time: 10:40
 */
namespace Andevis\ReactBundle\UI\Components\Grid;

use Andevis\ReactBundle\UI\ComponentBase\Component;

class Grid extends Component
{
    /**
     * @return array
     */
    function eventList()
    {
        $events = parent::eventList();
        return array_merge($events, ['loadData']);
    }

    /**
     * Render rows event
     */
    function loadData(){
        return $this->fireEvent('loadData');
    }

    /**
     * @param array $records
     * @param int $recordsTotal
     */
    function setRecords(array $records, int $recordsTotal){
        $this->setState([
            'records' => $records,
            'recordstotal' => $recordsTotal
        ]);
    }

    /**
     * Get records
     * @return null
     */
    function getRecords(){
        return $this->getState('records');
    }

    function getPageNum(){
        return $this->getState('pagenum');
    }

    function getPageSize(){
        return $this->getState('pagesize');
    }

    function getRecordEndIndex(){
        return $this->getState('recordendindex');
    }

    function getRecordStartIndex(){
        return $this->getState('recordstartindex');
    }

    function getRecordsTotal(){
        return $this->getState('recordstotal');
    }

    function getSortDataField(){
        return $this->getState('sortdatafield');
    }

    function getSortOrder(){
        return $this->getState('sortorder');
    }

    function getOffset(){
        return $this->getRecordStartIndex();
    }

    function getLimit()
    {
        return $this->getRecordEndIndex() - $this->getRecordStartIndex();
    }
}