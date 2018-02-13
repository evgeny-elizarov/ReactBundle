<?php

namespace Andevis\ReactBundle\UI\Views\ExampleComponentsArray;

use Andevis\ReactBundle\UI\Components\Button\Button;
use Andevis\ReactBundle\UI\Components\View\View;

/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 13.02.2018
 * Time: 16:17
 */

class ExampleComponentsArray extends View
{

    function btnEdit_onClick(Button $btn){
        $this->setState(['clickBackendData' => $this->getState('items')[$btn->getIndex()]]);
    }
}