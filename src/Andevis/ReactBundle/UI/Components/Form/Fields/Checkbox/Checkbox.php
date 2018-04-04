<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 25.01.2018
 * Time: 16:43
 */

namespace Andevis\ReactBundle\UI\Components\Form\Fields\Checkbox;


use Andevis\ReactBundle\UI\Components\Form\FormInputBase;

class Checkbox extends FormInputBase
{
    /**
     * Is checked attribute getter
     */
    function isChecked(){
        $args = func_get_args();
        if(sizeof($args) > 0){
            $this->setValue(boolval($args[0]));
        }
        return boolval($this->getValue());
    }

}