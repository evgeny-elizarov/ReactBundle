<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.12.2017
 * Time: 10:07
 */

namespace Andevis\ReactBundle\UI\ComponentBase;

use Andevis\ReactBundle\UI\Components\View\View;

class ViewSet
{
    private $views;

    public function __construct()
    {
        $this->views = array();
    }

    public function addView(View $view)
    {
        $this->views[$view->getId()] = $view;
    }

    public function getViews()
    {
        return $this->views;
    }

    public function getViewById(string $id){
        if(!isset($this->views[$id])){
            throw new \Exception(sprintf('View with id `%s` not found!', $id));
        }
        return $this->views[$id];
    }
}