<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 10.04.2018
 * Time: 22:01
 */

namespace Andevis\ReactBundle\UI\Views\ExampleForm;

use Andevis\ReactBundle\UI\Components\Form\Form;
use Andevis\ReactBundle\UI\Views\ExampleBaseView;

class ExampleForm extends ExampleBaseView
{
    function formExample_onSubmit(Form $form, array $values){
        $this->setState([
           'testBuffer' => $values
        ]);
    }
}