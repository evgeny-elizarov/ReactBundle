<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 13.04.2018
 * Time: 16:22
 */

namespace Andevis\ReactBundle\UI\Views;

use Andevis\ReactBundle\UI\Components\View\View;

class ExampleBaseView extends View
{
    function hasAccess()
    {
        return true;
    }
}