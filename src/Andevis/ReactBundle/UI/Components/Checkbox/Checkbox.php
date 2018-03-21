<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 25.01.2018
 * Time: 16:43
 */

namespace Andevis\ReactBundle\UI\Components\Checkbox;


use Andevis\ReactBundle\UI\Components\Form\FormInputBase;

class Checkbox extends FormInputBase
{
    /**
     * Checked attribute getter
     */
    function getChecked(){
        return $this->getValue();
    }

    /**
     * Checked attribute setter
     * @param string $value
     */
    function setChecked(string $value){
        $this->setValue($value);
    }
}