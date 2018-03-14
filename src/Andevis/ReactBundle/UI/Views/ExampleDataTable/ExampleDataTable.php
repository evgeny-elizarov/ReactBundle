<?php

namespace Andevis\ReactBundle\UI\Views\ExampleDataTable;

use Andevis\ReactBundle\UI\Components\DataTable\DataTable;
use Andevis\ReactBundle\UI\Components\View\View;

/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 14.03.2018
 * Time: 19:09
 */
class ExampleDataTable extends View
{

    function generateData($dataCount)
    {
        $data = [];
        for ($i = 0; $i < $dataCount; $i++) {
            $id = $i + 1;
            $data[] = [
                'id' => $id,
                'name' => 'Tanner Linsley ' . $id,
                'age' => $dataCount - $id,
                'friend' => [
                    'name' => 'Jason Maurer',
                    'age' => 23,
                ]
            ];
        }
        return $data;
    }

    /**
     * Fetch data
     * @param $table DataTable
     * @param $pageSize
     * @param $page
     * @param $sorted
     * @param $filtered
     * @return array
     */
    function tableTest_onFetchData($table, $pageSize, $page, $sorted, $filtered)
    {
        $dataCount = 1000;
        $data = $this->generateData($dataCount);

        // Sort
        if($sorted)
        {
            foreach ($sorted as $sort)
            {
                usort(
                    $data,
                    function($a, $b) use ($sort) {
                        if(isset($a[$sort['id']])){
                            if($sort['desc']){
                                return strnatcasecmp($b[$sort['id']], $a[$sort['id']]);
                            } else {
                                return strnatcasecmp($a[$sort['id']], $b[$sort['id']]);
                            }
                        }
                    }
                );
            }
        }

        // Pagination
        $pagedData = array_slice($data, $page * $pageSize, $pageSize);
        $table->setPages(floor($dataCount / $pageSize));

        return $pagedData;
    }
}