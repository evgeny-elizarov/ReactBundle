<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 14.02.2018
 * Time: 22:53
 */

namespace Andevis\ReactBundle\UI\Components\EntityEditor;


interface EntityEditorInterface
{
    /**
     * @return string
     */
    function getEntityClass();

    /**
     * @return array
     */
    function getListFields();
}