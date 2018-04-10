<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.12.2017
 * Time: 10:19
 */

namespace Andevis\ReactBundle\UI\Views\ExampleFormComponents;

use Andevis\ReactBundle\UI\Components\Container\Container;
use Andevis\ReactBundle\UI\Components\Form\Form;
use Andevis\ReactBundle\UI\Components\View\View;
use Andevis\ReactBundle\UI\Components\Form\Field;
use Andevis\ReactBundle\UI\Components\Form\Fields\AutoComplete\AutoComplete;
use Andevis\ReactBundle\UI\Components\Form\Fields\Checkbox\Checkbox;
use Andevis\ReactBundle\UI\Components\Form\Fields\DateTime\DateTime;
use Andevis\ReactBundle\UI\Components\Form\Fields\Select\Select;
use Andevis\ReactBundle\UI\Components\Form\Fields\TextArea\TextArea;


class ExampleFormComponents extends View
{
    /**
     * Logger to view debug info
     * @param $message
     * @throws \Exception
     */
    function log($message)
    {
        /** @var Container $debugLog */
        $debugLog = $this->getComponentByName('debugLog');
        $messages = $debugLog->getState('messages');
        $messages = array_slice($messages, 0, 10);
        array_unshift($messages, "Backend:\t" . $message);
        $debugLog->setState(['messages' => $messages]);
    }


    /**
     * Backend submit example
     * @param Form $form
     * @param $values
     * @throws \Exception
     */
    function frmExample_onSubmit(Form $form, $values)
    {
        $this->log("frmExample_onSubmit " . json_encode($values));
//
//        $form->setError("name", "Validation error");
//        $form->setWarning("email", "Validation warning");
//        $form->setSuccess("password", "Validation success");
    }

    /**
     * Load values from server
     * @throws \Exception
     */
    function btnLoadValuesFromServer_onClick()
    {
        foreach ($this->getComponentByName('formCtrl') as $ctrl) {
            $this->setControlNewValue($ctrl);

        }

        foreach ($this->getComponentByName('outCtrl') as $ctrl) {
            $this->setControlNewValue($ctrl);
        }
    }

    /**
     * Set control new value
     * @param $ctrl
     */
    function setControlNewValue($ctrl)
    {
        switch (get_class($ctrl))
        {
            case DateTime::class:
                $ctrl->setValue(date('Y-m-d H:i:s'));
                break;

            case Select::class:
                $ctrl->setValue('a');
                break;

            case AutoComplete::class:
                $ctrl->setValue('A');
                break;

            default:
                $ctrl->setValue('server value');
        }
    }

    /**
     * Get autoComplete data
     * @param $filter
     * @return array
     */
    function getAutoCompleteData($filter){
        $data = [
            ["abbr" => 'AL', "name" => 'Alabama'], ["abbr" => 'AK', "name" => 'Alaska'], ["abbr" => 'AZ', "name" => 'Arizona'], ["abbr" => 'AR', "name" => 'Arkansas'], ["abbr" => 'CA', "name" => 'California'], ["abbr" => 'CO', "name" => 'Colorado'], ["abbr" => 'CT', "name" => 'Connecticut'], ["abbr" => 'DE', "name" => 'Delaware'], ["abbr" => 'FL', "name" => 'Florida'], ["abbr" => 'GA', "name" => 'Georgia'], ["abbr" => 'HI', "name" => 'Hawaii'], ["abbr" => 'ID', "name" => 'Idaho'], ["abbr" => 'IL', "name" => 'Illinois'], ["abbr" => 'IN', "name" => 'Indiana'], ["abbr" => 'IA', "name" => 'Iowa'], ["abbr" => 'KS', "name" => 'Kansas'], ["abbr" => 'KY', "name" => 'Kentucky'], ["abbr" => 'LA', "name" => 'Louisiana'], ["abbr" => 'ME', "name" => 'Maine'], ["abbr" => 'MD', "name" => 'Maryland'], ["abbr" => 'MA', "name" => 'Massachusetts'], ["abbr" => 'MI', "name" => 'Michigan'], ["abbr" => 'MN', "name" => 'Minnesota'], ["abbr" => 'MS', "name" => 'Mississippi'], ["abbr" => 'MO', "name" => 'Missouri'], ["abbr" => 'MT', "name" => 'Montana'], ["abbr" => 'NE', "name" => 'Nebraska'], ["abbr" => 'NV', "name" => 'Nevada'], ["abbr" => 'NH', "name" => 'New Hampshire'], ["abbr" => 'NJ', "name" => 'New Jersey'], ["abbr" => 'NM', "name" => 'New Mexico'], ["abbr" => 'NY', "name" => 'New York'], ["abbr" => 'NC', "name" => 'North Carolina'], ["abbr" => 'ND', "name" => 'North Dakota'], ["abbr" => 'OH', "name" => 'Ohio'], ["abbr" => 'OK', "name" => 'Oklahoma'], ["abbr" => 'OR', "name" => 'Oregon'], ["abbr" => 'PA', "name" => 'Pennsylvania'], ["abbr" => 'RI', "name" => 'Rhode Island'], ["abbr" => 'SC', "name" => 'South Carolina'], ["abbr" => 'SD', "name" => 'South Dakota'], ["abbr" => 'TN', "name" => 'Tennessee'], ["abbr" => 'TX', "name" => 'Texas'], ["abbr" => 'UT', "name" => 'Utah'], ["abbr" => 'VT', "name" => 'Vermont'], ["abbr" => 'VA', "name" => 'Virginia'], ["abbr" => 'WA', "name" => 'Washington'], ["abbr" => 'WV', "name" => 'West Virginia'], ["abbr" => 'WI', "name" => 'Wisconsin'], ["abbr" => 'WY', "name" => 'Wyoming']
        ];
        $result = [];
        if ($filter) {
            foreach ($data as $item) {
                if (strpos($item['name'], $filter) !== false) {
                    $result[] = $item;
                }
            }
        } else {
            $result = $data;
        }
        return $data;
    }

    /**
     * AutoComplete fetch data
     */
    function formCtrl_onFetchData($ctrl, $input)
    {
        if(get_class($ctrl) == AutoComplete::class){
            if($ctrl->getProperty('field') == 'backendAutocomplete')
            {
                return $this->getAutoCompleteData($input);
            }
        }
    }

    /**
     * AutoComplete fetch data
     */
    function outCtrl_onFetchData($ctrl, $input)
    {
        if(get_class($ctrl) == AutoComplete::class){
            if($ctrl->getProperty('field') == 'backendAutocomplete')
            {
                return $this->getAutoCompleteData($input);
            }
        }
    }

    function btnSetValidationErrorsOnServer_onClick(){
        $this->getComponentByName('frmExample')->setError('email', 'test');
    }
}
