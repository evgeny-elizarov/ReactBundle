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

    /**
     * Генерируем данные на сервере
     * @param $dataCount
     * @return array
     */
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
     * Сортирует данные
     * @param $data
     * @param $sorted
     * @return mixed
     */
    function sortData(&$data, $sorted){
        foreach ($sorted as $sort) {
            usort(
                $data,
                function ($a, $b) use ($sort) {
                    if (isset($a[$sort['id']])) {
                        if ($sort['desc']) {
                            return strnatcasecmp($b[$sort['id']], $a[$sort['id']]);
                        } else {
                            return strnatcasecmp($a[$sort['id']], $b[$sort['id']]);
                        }
                    }
                    return 0;
                }
            );
        }
    }

    /**
     * Данные для клиента
     * @param $dataTable

     * @return array
     */
    function loadServerData()
    {
        return $this->generateData(1000);
    }


    /**
     * Fetch data
     * @param $dataTable DataTable
     * @param $pageSize
     * @param $pageIndex
     * @param $sorted
     * @param $filtered
     * @return array
     */
    function dataServer_onFetchData($dataTable, $pageSize, $pageIndex, $sorted, $filtered)
    {
        $dataCount = 1000;
        $data = $this->generateData($dataCount);

        $this->sortData($data, $sorted);

        // Pagination
        $pagedData = array_slice($data, $pageIndex * $pageSize, $pageSize);
        $dataTable->setPages(floor($dataCount / $pageSize));

        return $pagedData;
    }
}