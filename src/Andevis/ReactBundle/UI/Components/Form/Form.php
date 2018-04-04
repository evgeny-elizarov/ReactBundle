<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.12.2017
 * Time: 14:16
 */

namespace Andevis\ReactBundle\UI\Components\Form;

use Andevis\ReactBundle\UI\ComponentBase\Component;
use Andevis\ReactBundle\UI\Exceptions\ValidationError;


class Form extends Component
{

    function eventList(){
        return array_merge(parent::eventList(), ['change', 'submit', 'clean', 'reset']);
    }

    /**
     * Change event
     * @param $formState
     * @return mixed
     * @throws \Exception
     */
    function change(array $formState){
        return $this->fireEvent('change', $formState);
    }


    /**
     * Submit method
     * @param array $values
     * @return mixed|null
     * @throws \Exception
     */
    function submit($values){
        try{
            // Reset errors before submit
            $this->clearErrors();
            $return = $this->fireEvent('submit', $values);
            if($this->hasErrors()) {
                throw new ValidationError($this->i18n('errorFixFormErrors'));
            }
            return $return;
        } catch (ValidationError $e ){
            $this->setError(null, $e->getMessage());
            return false;
        }
    }

    /**
     * Values attribute getter
     */
    function getValues(){
        return $this->getAttributeValue('values', $this->getProperty('defaultValues'));
    }

    /**
     * Values attribute setter
     * @param array $value
     */
    function setValues(array $value){
        $this->setAttributeValue('values', $value);
    }

    /**
     * Errors attribute getter
     */
    function getErrors(){
        return $this->getAttributeValue('errors', []);
    }

    /**
     * Errors attribute setter
     * @param array $value
     */
    function setErrors(array $value){
        $this->setAttributeValue('errors', $value);
    }

    /**
     * Warnings attribute getter
     */
    function getWarnings(){
        return $this->getAttributeValue('warnings', []);
    }

    /**
     * Warnings attribute setter
     * @param array $value
     */
    function setWarnings(array $value){
        $this->setAttributeValue('warnings', $value);
    }

    /**
     * Successes attribute getter
     */
    function getSuccesses(){
        return $this->getAttributeValue('successes', []);
    }

    /**
     * Successes attribute setter
     * @param array $value
     */
    function setSuccesses(array $value){
        $this->setAttributeValue('successes', $value);
    }

//    /**
//     * Clear form data
//     */
//    function clean()
//    {
//        $fields = array_keys($this->getValues());
//        $values = $this->getValues();
//
//        // Reset validation errors
//        $this->clearErrors();
//
////        try
////        {
//        $cleanedData = [];
//        foreach ($fields as $fieldName)
//        {
//            $fieldCleanMethod = 'clean'.ucfirst($fieldName);
//            if(method_exists($this, $fieldCleanMethod)){
//                $cleanedData[$fieldName] = call_user_func([$this, $fieldCleanMethod], $values[$fieldName]);
//            } else {
//                $cleanedData[$fieldName] = $values[$fieldName];
//            }
//        }
//
////        } catch (ValidationError $e) {
////            $this->setError(null, $e->getMessage());
////        }
//
//        return $cleanedData;
//    }

    /**
     * Add error message
     * @param null $field
     * @param $errorMessage
     */
    function setError($field = null, $errorMessage)
    {
        $errors = $this->getErrors();
        $errors[$field] = $errorMessage;
        $this->setErrors($errors);
    }

    /**
     * Add warning message
     * @param null $field
     * @param $warningMessage
     */
    function setWarning($field = null, $warningMessage)
    {
        $warnings = $this->getWarnings();
        $warnings[$field] = $warningMessage;
        $this->setWarnings($warnings);
    }

    /**
     * Add success message
     * @param null $field
     * @param $successMessage
     */
    function setSuccess($field = null, $successMessage)
    {
        $successes = $this->getSuccesses();
        $successes[$field] = $successMessage;
        $this->setSuccesses($successes);
    }

    /**
     * Return true if form has errors
     * @return bool
     */
    function hasErrors(){
        return (sizeof($this->getErrors()) > 0);
    }

    /**
     * Clear validation errors
     */
    function clearErrors(){
        $this->setErrors([]);
    }


}
