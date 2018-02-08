<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 06.12.2017
 * Time: 10:19
 */

namespace Andevis\ReactBundle\UI\Views\ExampleForm;

use Andevis\ReactBundle\UI\Components\AutoComplete\AutoComplete;
use Andevis\ReactBundle\UI\Components\Form\Form;
use Andevis\ReactBundle\UI\Components\Select\Select;
use Andevis\ReactBundle\UI\Components\TextArea\TextArea;
use Andevis\ReactBundle\UI\Components\View\View;


// Sample constant with text for autocomplete
const AUTO_COMPLETE_TEXT = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";


class ExampleForm extends View
{
    /**
     * Logger to view debug info
     * @param $message
     */
    function log($message){
        //$view = $this->getComponentByName('Example');
        $state = $this->getState();
        $eventLog = isset($state['eventLog']) ? $state['eventLog'] : '';
        $this->setState([
            'eventLog' => $eventLog . "Backend:\t".$message . "\r\n"
        ]);
    }

    /**
     * User event handler for current view triggered when component mount on page
     */
    function ExampleForm_onDidMount()
    {
        $this->log('ExampleForm_onDidMount');

        /** @var TextArea $text */
        $this->setState([
            'autoCompleteText' => AUTO_COMPLETE_TEXT
        ]);

        /** @var Select $select */
        $select = $this->getComponentByName('selManual');
        $select->addOption('a', 'AAA');
        $select->addOption('b', 'BBB');
    }

    /**
     * Click event handler for Text:txtName component triggered when clicked
     */
    function txtName_onClick(){
        $this->log('txtName_onClick');
    }

    /**
     * Change event on backend
     * @param $value
     */
    function txtName_onChange($txt, $value){
        $this->log('txtName_onChange'.json_encode($value));
    }

    /**
     * Backend submit example
     * @param Form $form
     * @param $values
     */
    function frmExample_onSubmit(Form $form, $values){
        $this->log("frmExample_onSubmit ".json_encode($values));

        $this->setState([
            'backendFormValues' => $values
        ]);
        $form->setError("name", "Validation error");
        $form->setWarning("email", "Validation warning");
        $form->setSuccess("password", "Validation success");

    }


    function lstManual_init(Select $select){
        $select->addOption('','-- Select --');
        $select->addOption('a','AAA');
        $select->addOption('b','BBB');
    }

    function lstManual_onChange(Select $select) {
        $this->setState([
            'backedn_lstManualSelectedOptionOnChange' => $select->getSelectedOption()
        ]);
    }

    /**
     * Helper backend function to generate sample options from text
     */
    function generateOptionsFromText(){
        $fullText = AUTO_COMPLETE_TEXT;
        $options = [];
        $words = explode(" ", $fullText);
        foreach ($words as $index => $word)
        {
            $options[] = [
                'value' => $index,
                'text' => $word
            ];
        }
        return $options;
    }

    /**
     * Auto-complete filter example on backend
     * @param AutoComplete $autoComplete
     * @param $value
     */
    function lstAuto_onChange(AutoComplete $autoComplete, $value){
        $options = $this->generateOptionsFromText();
        $maxOptionCount = 10;
        $filteredOptions = [];
        // Filter options if got any input
        if(strlen($autoComplete->getText()) > 1)
        {
            $filteredOptions = [];
            foreach ($options as $opt){
                // Filter options by input
                if(strpos(strtolower($opt['text']), strtolower($autoComplete->getText())) !== false)
                {
                    $filteredOptions[] = $opt;
                }
                // Max. return options
                if(sizeof($filteredOptions) == $maxOptionCount) break;
            }
        } else {
            // ... put first ten
            foreach ($options as $opt){
                $filteredOptions[] = $opt;
                if(sizeof($filteredOptions) == $maxOptionCount) break;
            }
        }
        $autoComplete->setOptions($filteredOptions);
    }

}
