<?php
namespace Andevis\ReactBundle\UI\Components\ExampleComponent;

use Andevis\ReactBundle\UI\ComponentBase\Component;

/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 18.01.2018
 * Time: 14:26
 */

class ExampleComponent extends Component
{
    function eventList(){
        return array_merge(parent::eventList(), ['loadDate', 'longTask']);
    }

    function loadDate(){
        return date('Y-m-d H:i:s');
    }

    function longTask(){
        $data = [
            'start' => date('Y-m-d H:i:s')
        ];
        sleep(3);
        $data['complete'] = date('Y-m-d H:i:s');
        return $data;
    }
}