<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 14.12.2017
 * Time: 14:12
 */

namespace Andevis\ReactBundle\UI\Components\Select;


use Andevis\ReactBundle\UI\Components\Form\FormInputBase;

class Select extends FormInputBase
{
    /**
     * Options attribute getter
     */
    function getOptions(){
        return $this->getAttributeValue('options', []);
    }

    /**
     * Options attribute setter
     * @param array $options
     */
    function setOptions(array $options){
        $this->setAttributeValue('options', $options);
    }

    /**
     * Add option
     * @param $value
     * @param $text
     * @param null $data
     * @internal param array $extraData
     */
    function addOption($value, $text, $data = null)
    {
        $options = $this->getOptions();
        array_push($options, [
            'value' => $value,
            'text' => $text,
            'data' => $data
        ]);
        $this->setOptions($options);
    }

    /**
     * @param $value
     * @internal param $key
     */
    function removeOptionByKey($value){
        $options = $this->getState('options');
        if(isset($options[$value]))
            unset($options[$value]);
        $this->setState([
            'options' => $options
        ]);
    }

    /**
     * Selected option
     */
    function getSelectedOption(){
        foreach ($this->getOptions() as $opt)
        {
            if($opt['value'] == $this->getValue()){
                return $opt;
            }
        }
    }

}